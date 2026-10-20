/********************************* 
 * Definição de Elementos do DOM *
 ********************************/

// Nav
const btnCriar     = document.querySelector("#btn_criar");
const btnDashboard = document.querySelector("#btn_dashboard");
const btnFiltrar   = document.querySelector("#btn_filtrar");
const btnBuscar    = document.querySelector("#btn_buscar");
const inputBuscar  = document.querySelector("#input_buscar");

// Aside
const barraLateralFiltro = document.querySelector("#barra_lateral_filtro");

// Main
const mainArea          = document.querySelector("main");
const dashboard         = document.querySelector("#dashboard");
const listaSolicitacoes = document.querySelector("#lista_solicitacoes");
const novaSolicitacao   = document.querySelector("#nova_solicitacao");
const formulario        = document.querySelector("#form_nova_solicitacao");

// Dashboard
const numEmAberto   = document.querySelector("#num_em_aberto");
const setorSolChart = document.querySelector("#setores_solicitantes_chart");
const setorReqChart = document.querySelector("#setores_requisitados_chart");


/**************************************************************
 * Event Listeners (Detector de Eventos)                      *
 * Aguarda algo acontecer para executar uma função específica *
 *************************************************************/

export function configurarEventos(gerenciador, atualizarInterface) {
    // Cria evento para ativar e desativar o painel de Dashboard quando o
    // usuário clica no botão
    btnDashboard.addEventListener("click", () => {
        dashboard.hidden = !dashboard.hidden;
    });

    btnFiltrar.addEventListener("click", () => {
        barraLateralFiltro.hidden = !barraLateralFiltro.hidden;
        mainArea.classList.toggle("filtro_oculto", barraLateralFiltro.hidden);
    });

    // Cria evento para abrir o painel de Nova Solicitação quando o usuário clica no
    // botão de +, e também fecha a janela se clicar em qualquer lugar fora do painel
    document.addEventListener("click", event => {
        // Se o botão for o alvo clicado
        if (btnCriar.contains(event.target)) {
            novaSolicitacao.hidden = false;
        // Se o painel NÃO for o alvo clicado
        } else if (!novaSolicitacao.contains(event.target)) {
            novaSolicitacao.hidden = true;
        }
    });

    // Cria evento para fechar pop-up de Nova Solicitação quando o usuário aperta Esc
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            novaSolicitacao.hidden = true;
        }
    });

    // Evento que acontece quando o formulário é enviado, previne a execução
    // padrão e coleta os dados para adicionar ao gerenciador
    formulario.addEventListener("submit", (event) => {
        // Previne que o botão envie para servidor, causando erro HTTP
        event.preventDefault();

        // Transforma array de arrays gerado pelo FormData(name, value) em objeto
        // e adiciona como Nova Solicitação ao GerenciadorSolicitacoes
        const dados = Object.fromEntries(new FormData(formulario));
        gerenciador.adicionar(dados);

        // Atualiza a interface após cada nova inserção
        atualizarInterface();
    });
}


/************************
 * Definição de Funções *
 ***********************/

function preencherFiltros(setores, prioridades, estados) {
    for (const setor of setores) {
        const li = document.createElement("li");
        li.textContent = setor;
        barraLateralFiltro.querySelector("#aside_lista_setores").append(li);
    }

    for (const prioridade of prioridades) {
        const li = document.createElement("li");
        li.textContent = prioridade;
        barraLateralFiltro.querySelector("#aside_lista_prioridades").append(li);
    }

    for (const estado of estados) {
        const li = document.createElement("li");
        li.textContent = estado;
        barraLateralFiltro.querySelector("#aside_lista_status").append(li);
    }
}

function preencherFormSelects(setores, prioridades, estados) {

}

export function exibirDadosDinamicos(setores, prioridades, estados) {
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

    new Chart(setorCard, {
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
    desenharGrafico(dados, setorSolChart, "solicitante");
    desenharGrafico(dados, setorReqChart, "requisitado");
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
                <span class="span_prioridade ${spanPrioridadeClass}" title="Prioridade">${solicitacao.prioridade}</span>
                <span class="span_estado ${spanEstadoClass}" title="Status">${solicitacao.estadoAtual}</span>
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
        </div>
        <div class="div_item_buttons">
            <!-- Concluir Chamado #AQUI -->
        </div>
    </details>
    `;

    return item;
}

// Adiciona o item <li> criado, na <ul> do HTML
function preencherLista(item) {
    listaSolicitacoes.appendChild(item);
}

export function exibirSolicitacoes(solicitacoes) {
    // Executa um loop pelo array, e para cada elemento (que é um objeto),
    // executa a função de preencherLista, para essa função o loop passa como
    // argumento outra função criarItem, e essa função recebe como argumento o
    // objeto que está temporariamente nomeado como solicitacao
    for (const solicitacao of solicitacoes) {
        preencherLista(criarItem(solicitacao));
    }
}
