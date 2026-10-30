/********************************* 
 * Definição de Elementos do DOM *
 ********************************/

// Nav
const btnCriar     = document.querySelector("#btn_criar");
const btnDashboard = document.querySelector("#btn_dashboard");
const btnFiltrar   = document.querySelector("#btn_filtrar");
const formBuscar   = document.querySelector("#form_buscar");

// Main
const dashboard         = document.querySelector("#dashboard");
const listaSolicitacoes = document.querySelector("#lista_solicitacoes");
const novaSolicitacao   = document.querySelector("#nova_solicitacao");
const formulario        = document.querySelector("#form_nova_solicitacao");
const selectSetorSolicitante = document.querySelector("#select_setor_solicitante");
const selectSetorRequisitado = document.querySelector("#select_setor_requisitado");
const selectPrioridade       = document.querySelector("#select_prioridade");
const btnFormCancelar        = document.querySelector("#btn_formulario_cancelar");

// Aside
const barraLateralFiltro = document.querySelector("#barra_lateral_filtro");
const categoriasFiltro = {
    setor:      document.querySelector("#aside_lista_setores"),
    prioridade: document.querySelector("#aside_lista_prioridades"),
    estado:     document.querySelector("#aside_lista_status"),
};
const btnLimparFiltro    = document.querySelector("#btn_limpar_filtro");
const btnAplicarFiltro   = document.querySelector("#btn_aplicar_filtro");

// Dashboard
const numEmAberto   = document.querySelector("#num_em_aberto");
const setorSolChart = document.querySelector("#setores_solicitantes_chart");
const setorReqChart = document.querySelector("#setores_requisitados_chart");
let setorCharts = [];

// CSS
const mediaQuery = window.matchMedia("(max-width: 972px)");


/**************************************************************
 * Event Listeners (Detector de Eventos)                      *
 * Aguarda algo acontecer para executar uma função específica *
 *************************************************************/

export function configurarEventos(gerenciador, atualizarSolicitacoes, atualizarDashboard, estados) {
    // Cria evento para ativar e desativar o painel de Dashboard quando o
    // usuário clica no botão
    btnDashboard.addEventListener("click", () => {
        dashboard.hidden = !dashboard.hidden;
        btnDashboard.classList.toggle("btn_nav_ativo", !dashboard.hidden);
    });

    // Quando clica no botão de filtro, oculta a barra lateral de filtros, e
    // adiciona uma classe ao main para ocupar todo o espaço disponível
    btnFiltrar.addEventListener("click", () => {
        esconderFiltro(!barraLateralFiltro.hidden);
    });

    // Quando a tela fica menor que o mediaQuery, esconde o filtro
    mediaQuery.addEventListener("change", esconderFiltro);

    // Quando o usuário preenche o campo de busca e envia, o sistema coleta o texto,
    // remove espaços em branco, limpa o campo, define o placeholder como o
    // conteúdo e envia para main() selecionar apenas as Solicitações compatíveis
    formBuscar.addEventListener("submit", event => {
        event.preventDefault();

        const input = formBuscar.querySelector("input");
        const busca = input.value.trim();

        input.value = "";
        input.placeholder = (busca) ? busca : "Buscar";
        limparFiltros(categoriasFiltro);

        atualizarSolicitacoes({}, busca.toLowerCase());
    });

    // Cria evento para abrir o painel de Nova Solicitação quando o usuário clica no
    // botão de +, e também fecha a janela se clicar em qualquer lugar fora do painel
    document.addEventListener("click", event => {
        // Se o botão for o alvo clicado e o painel está oculto
        if (btnCriar.contains(event.target) && novaSolicitacao.hidden) {
            mostrarNovaSolicitacao(true);
        // Se o painel NÃO for o alvo clicado
        } else if (!novaSolicitacao.contains(event.target) && !novaSolicitacao.hidden) {
            cancelarNovaSolicitacao();
        }
    });

    // Cria evento para fechar pop-up de Nova Solicitação quando o usuário aperta Esc
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            cancelarNovaSolicitacao();
        }
    });

    btnFormCancelar.addEventListener("click", () => {
        cancelarNovaSolicitacao();
    });

    // Evento que acontece quando o formulário é enviado, previne a execução
    // padrão e coleta os dados para adicionar ao gerenciador
    formulario.addEventListener("submit", event => {
        // Previne que o botão envie para servidor, causando erro HTTP
        event.preventDefault();

        // Transforma array de arrays gerado pelo FormData(name, value) em objeto
        // e adiciona como Nova Solicitação ao GerenciadorSolicitacoes
        const dados = Object.fromEntries(new FormData(formulario));
        const alertaValidacao = validarDadosForm(dados);

        // Se não houve alerta na validação, adiciona ao gerenciador
        if (!alertaValidacao) {
            adicionarItemLocalStorage(dados);
            gerenciador.adicionar(dados);
        } else {
            const alertaTitulo = "Preenchimento incorreto.\n\n"
            alert(alertaTitulo + alertaValidacao);
            return;
        }

        formulario.reset();
        mostrarNovaSolicitacao(false);

        // Atualiza a interface após cada nova inserção
        atualizarDashboard();
        atualizarSolicitacoes();
    });

    // Iniciar atendimento de um chamado
    document.addEventListener("click", function(evento) {

        const botaoIniciar = evento.target.closest(".btn_iniciar_atendimento");

        if (!botaoIniciar) {
            return;
        }

        // Identifica o número do chamado
        const numeroChamado = botaoIniciar.dataset.chamado;

        // Procura o chamado na lista
        const solicitacao = gerenciador.listar().find(
            item => String(item.chamado) === String(numeroChamado)
        );

        if (!solicitacao) {
            alert("Chamado não encontrado.");
            return;
        }

        // Só permite iniciar chamados que estão abertos
        if (solicitacao.estadoAtual !== estados[0]) {
            return;
        }

        // Altera o status para Em Andamento
        solicitacao.avancarEstado();

        // Guarda a solicitação no Armazenamento Persistente
        adicionarItemLocalStorage(solicitacao, solicitacao.chamado - 1);

        // Atualiza a interface
        atualizarSolicitacoes();
        atualizarDashboard();

    });

    // Concluir atendimento de um chamado
    document.addEventListener("click", function(evento) {

        const botaoConcluir = evento.target.closest(".btn_concluir");

        if (!botaoConcluir) {
            return;
        }

        // Identifica o chamado
        const numeroChamado = botaoConcluir.dataset.chamado;

        // Procura a solicitação correspondente
        const solicitacao = gerenciador.listar().find(
            item => String(item.chamado) === String(numeroChamado)
        );

        if (!solicitacao) {
            alert("Chamado não encontrado.");
            return;
        }

        // Verifica se o chamado está em andamento
        if (solicitacao.estadoAtual !== estados[1]) {
            return;
        }

        // Localiza o campo da observação
        const areaConclusao = botaoConcluir.closest(".area_conclusao");
        const campoObservacao = areaConclusao.querySelector(".descricao_conclusao");

        const observacao = campoObservacao.value.trim();

        // Impede a conclusão sem observação
        if (!observacao) {
            alert("Descreva o que foi realizado antes de concluir o chamado.");
            campoObservacao.focus();
            return;
        }

        // Guarda a observação no objeto da solicitação
        solicitacao.observacaoConclusao = observacao;

        // Avança de Em Andamento para Concluído
        solicitacao.avancarEstado();

        // Guarda a solicitação no Armazenamento Persistente
        adicionarItemLocalStorage(solicitacao, solicitacao.chamado - 1);

        // Atualiza a interface
        atualizarSolicitacoes();
        atualizarDashboard();

    });

    // Abrir e fechar a área de conclusão dos chamados
    document.addEventListener("click", function(evento) {
        const botaoAbrir = evento.target.closest(".btn_abrir_conclusao");

        if (botaoAbrir) {
            const chamado = botaoAbrir.closest(".div_item_buttons");
            const area = chamado.querySelector(".area_conclusao");

            area.hidden = false;
            botaoAbrir.hidden = true;
        }

        const botaoCancelar = evento.target.closest(".btn_cancelar_conclusao");

        if (botaoCancelar) {
            const chamado = botaoCancelar.closest(".div_item_buttons");
            const area = chamado.querySelector(".area_conclusao");
            const botaoAbrir = chamado.querySelector(".btn_abrir_conclusao");

            area.hidden = true;
            botaoAbrir.hidden = false;
        }
    });
}

export function configurarFiltros(atualizarSolicitacoes) {
    // Para cada item de cada categoria, cria um eventListener que aguarda o item
    // ser clicado para atribuir a ele a classe de .filtro_ativo
    for (const ul of Object.values(categoriasFiltro)) {
        ul.querySelectorAll("li").forEach(li => {
            li.addEventListener("click", () => {
                li.classList.toggle("filtro_ativo");
            });
        });
    }

    // Quando o botão de Limpar é clicado, remove as classes de .filtro_ativo
    // Carrega a lista de solicitações com todos os items novamente
    btnLimparFiltro.addEventListener("click", () => {
        limparFiltros(categoriasFiltro);

        esconderFiltro();
        atualizarSolicitacoes();
    });

    // Quando o botão de Aplicar é clicado, gera uma lista de filtros, separado
    // por categorias, e em cada categoria adiciona apenas os itens que tem a
    // classe .filtro_ativo
    btnAplicarFiltro.addEventListener("click", () => {
        const filtros = {};

        for (const [categoria, ul] of Object.entries(categoriasFiltro)) {
            filtros[categoria] = [
                ...ul.querySelectorAll("li.filtro_ativo")
            ].map(li => li.dataset.filtro);
        }

        outlineFiltroAtivo(Boolean(filtros));
        esconderFiltro();

        // Recebe uma função do main() atualizarSolicitacoes() como callback
        // function, com as condicionais dos campos de Solicitação, essa função
        // então recebe a lista de filtros separados por categoria para validar
        // se a Solicitação deve ser exibida
        atualizarSolicitacoes(filtros);
    });
}


/************************
 * Definição de Funções *
 ***********************/

function preencherFiltros(setores, prioridades, estados) {
    const filtroSetores     = categoriasFiltro.setor;
    const filtroPrioridades = categoriasFiltro.prioridade;
    const filtroEstados     = categoriasFiltro.estado;

    for (const setor of setores) {
        const li = document.createElement("li");
        li.textContent = setor;
        li.dataset.filtro = setor;
        filtroSetores.append(li);
    }

    for (const prioridade of prioridades) {
        const li = document.createElement("li");
        li.textContent = prioridade;
        li.dataset.filtro = prioridade;
        filtroPrioridades.append(li);
    }

    for (const estado of estados) {
        const li = document.createElement("li");
        li.textContent = estado;
        li.dataset.filtro = estado;
        filtroEstados.append(li);
    }
}

function preencherFormSelects(setores, prioridades) {
    for (const setorSol of setores) {
        const option = document.createElement("option");
        option.textContent = setorSol;
        option.value = setorSol;
        option.dataset.setorSolicitante = setorSol;
        selectSetorSolicitante.append(option);
    }

    for (const setorReq of setores) {
        const option = document.createElement("option");
        option.textContent = setorReq;
        option.value = setorReq;
        option.dataset.setorRequisitado = setorReq;
        selectSetorRequisitado.append(option);
    }

    for (const prioridade of prioridades) {
        const option = document.createElement("option");
        option.textContent = prioridade;
        option.value = prioridade;
        option.dataset.prioridade = prioridade;
        selectPrioridade.append(option);
    }
}

// Primeira função executada pelo main(), carrega os textos do menu de filtros e
// formulário, oculta a barra de filtro caso a tela obedeça ao media-query
export function exibirDadosDinamicos(setores, prioridades, estados) {
    // Imediatamente oculta a barra de filtros caso a tela seja menor
    esconderFiltro();

    preencherFiltros(setores, prioridades, estados);
    preencherFormSelects(setores, prioridades, estados);
}

// Recebe o número de solicitações em aberto e exibe no card do Dashboard
export function exibirNumSolEmAbertoDashboard(contador) {
    numEmAberto.textContent = String(contador);
}

// Recebe os dados dos Setores (solicitante e requisitado), o card em que será
// desenhado e a direção do relacionamento (solicitante <> requisitado)
function desenharGrafico(dados, setorCard, setorDir) {
    const dadosFiltrados = dados.filter(e => e[setorDir] > 0);

    return new Chart(setorCard, {
        type: "doughnut",
        data: {
            labels: dadosFiltrados.map(e => e["nome"]),
            datasets: [{
                label: " ",
                data: dadosFiltrados.map(e => e[setorDir]),
                backgroundColor: dadosFiltrados.map(e => e["cor"]),
                hoverOffset: 1,
            }],
        },
        options: {
            cutout: "33%",
            plugins: {
                legend: {
                    position: "bottom",
                },
            },

        },
    });
}

// Interface com o main() para desenhar os gráficos do Dashboard
export function exibirGraficosDashboard(dados) {
    if (setorCharts.length)
        setorCharts.forEach(e => e.destroy());

    setorCharts[0] = desenharGrafico(dados, setorSolChart, "solicitante");
    setorCharts[1] = desenharGrafico(dados, setorReqChart, "requisitado");
}

// Cria um elemento <li>, e coloca as informações de um objeto passado como
// argumento para esta função, os campos do objeto são acessados usando a
// sintaxe objeto.campo
function criarItem(solicitacao) {
    const item = document.createElement("li");
    const spanPrioridadeClass = (solicitacao.prioridade === "Alta") ? "span_prioridade_alta" : "span_prioridade_media";
    const spanEstadoClass = (solicitacao.estadoAtual === "Concluído") ? "span_estado_concluido" : "span_estado_aberto";

    item.innerHTML = `
    <!-- Visualização de Chamado #AQUI -->
    <details name="item_solicitacao_info">
        <summary>
            <div class="div_item_header">
                <h4><span class="span_chamado" title="Chamado">#${String(solicitacao.chamado).padStart(4, '0')}</span> ${solicitacao.titulo}</h4>
                <div class="div_item_header_tags">
                    <span class="span_prioridade ${spanPrioridadeClass}" title="Prioridade">${solicitacao.prioridade}</span>
                    <span class="span_estado ${spanEstadoClass}" title="Status">${solicitacao.estadoAtual}</span>
                </div>
                <div class="div_item_header_setor">
                    <span title="Setor Solicitante">${solicitacao.setorSolicitante}</span>
                    <svg class="svg_arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--!Font Awesome Free v7.3.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M598.6 297.4C611.1 309.9 611.1 330.2 598.6 342.7L470.6 470.7C461.4 479.9 447.7 482.6 435.7 477.6C423.7 472.6 416 460.9 416 448L416 384L80 384C53.5 384 32 362.5 32 336L32 304C32 277.5 53.5 256 80 256L416 256L416 192C416 179.1 423.8 167.4 435.8 162.4C447.8 157.4 461.5 160.2 470.7 169.3L598.7 297.3z"/></svg>
                    <span title="Setor Requisitado">${solicitacao.setorRequisitado}</span>
                </div>
            </div>
        </summary>
        <div class="div_item_info">

    <p><b>Responsável:</b> ${solicitacao.responsavel}</p>

    <p><b>Descrição:</b> ${solicitacao.descricao}</p>

    ${solicitacao.estadoAtual === "Concluído" && solicitacao.observacaoConclusao ? `
        <p>
            <b>Observação da conclusão:</b>
            ${solicitacao.observacaoConclusao}
        </p>
    ` : ""}

    </div>
        <div class="div_item_buttons">

    ${solicitacao.estadoAtual !== "Concluído" ? `

        <div class="div_item_buttons">

    ${solicitacao.estadoAtual === "Aberto" ? `

        <button
            type="button"
            class="btn_iniciar_atendimento"
            data-chamado="${solicitacao.chamado}"
        >
            Iniciar Atendimento
        </button>

    ` : ""}

    ${solicitacao.estadoAtual === "Em Andamento" ? `

        <button type="button" class="btn_abrir_conclusao">
            Concluir Chamado
        </button>

        <div class="area_conclusao" hidden>

            <label>
                Descreva uma observação para concluir o chamado:
            </label>

            <textarea
                class="descricao_conclusao"
                placeholder="Digite aqui o que foi realizado..."
                rows="3"
            ></textarea>

            <button type="button" class="btn_cancelar_conclusao">
                Cancelar
            </button>

            <button
                type="button"
                class="btn_concluir"
                data-chamado="${solicitacao.chamado}"
            >
                Confirmar Conclusão
            </button>

        </div>

    ` : ""}

        </div>

    ` : `
        <p>Este chamado já foi concluído.</p>
    `}

</div>
    </details>
    `;

    return item;
}

function listaVazia() {
    const item = document.createElement("li");
    item.classList.add("lista_vazia");
    item.textContent = "Nenhum item para ser exibido.";

    return item;
}

export function exibirSolicitacoes(solicitacoes) {
    // Remove todos os items da lista de solicitações
    listaSolicitacoes.replaceChildren();

    // Executa um loop pelo array de objetos de solicitações, e para cada elemento,
    // criar um novo item que será adicionado a lista de solicitações
    for (const solicitacao of solicitacoes) {
        // Adiciona o item <li> criado, na <ul> do HTML
        listaSolicitacoes.appendChild(criarItem(solicitacao));
    }

    // Se não houver nenhuma Solicitação para ser exibida, mostra lista vazia
    if (!solicitacoes.length) {
        listaSolicitacoes.appendChild(listaVazia());
    }
}

function mostrarNovaSolicitacao(mostrar) {
    novaSolicitacao.hidden = !mostrar;
    btnCriar.classList.toggle("btn_nav_ativo", !novaSolicitacao.hidden);
}

function cancelarNovaSolicitacao() {
    if (confirm("Deseja sair desta Solicitação?")) {
        formulario.reset();
        mostrarNovaSolicitacao(false);
    }
}

// Essa função oculta a barra de filtros por padrão se a largura de tela for
// igual ou menor a 972px (como definido no mediaQuery)
function esconderFiltro(condicao = mediaQuery.matches) {
    barraLateralFiltro.hidden = condicao;
    btnFiltrar.classList.toggle("btn_nav_ativo", !condicao);
}

function outlineFiltroAtivo(condicao = false) {
    btnFiltrar.classList.toggle("btn_filtrar_outline", condicao);
}

// Remove a classe para indicar que o item não está mais ativo
function limparFiltros(categorias) {
    for (const ul of Object.values(categorias)) {
        ul.querySelectorAll("li").forEach(li => {
            li.classList.remove("filtro_ativo");
        });
    }

    outlineFiltroAtivo();
}

// Pega o array do localStorage, converte de JSON para array de objects,
// adiciona o item a ele, devolve ao localStorage formatando como JSON novamente
function adicionarItemLocalStorage(dados, posicao = -1) {
    const arrayLocalStorage = JSON.parse(localStorage.getItem("solicitacoesTemporarias") || "[]");

    if (posicao === -1)
        arrayLocalStorage.push(dados);
    else {
        arrayLocalStorage.splice(posicao, 1, dados);
    }

    localStorage.setItem("solicitacoesTemporarias", JSON.stringify(arrayLocalStorage));
}

function validarDadosForm(dados) {
    let alertaValidacao = "";

    if (dados.titulo.length < 3)
        alertaValidacao = "Título deve conter 3 ou mais caracteres.";
    else if (dados.responsavel.length < 3)
        alertaValidacao = "Responsável deve conter 3 ou mais caracteres.";
    else if (dados.descricao.length < 10)
        alertaValidacao = "Descrição deve conter 10 ou mais caracteres.";
    else if (dados.setorSolicitante === "default")
        alertaValidacao = "Setor Solicitante precisa ser selecionado.";
    else if (dados.setorRequisitado === "default")
        alertaValidacao = "Setor Requisitado precisa ser selecionado.";
    else if (dados.setorSolicitante === dados.setorRequisitado)
        alertaValidacao = "Setor Solicitante e Requisitado não podem ser iguais.";

    return alertaValidacao;
}
