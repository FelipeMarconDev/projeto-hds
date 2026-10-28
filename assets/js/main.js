/********************************* ***
 * Importação de Arquivos Auxiliares *
 ************************************/

import GerenciadorSolicitacoes from "./GerenciadorSolicitacoes.js"
import DadosSistema from "./DadosSistema.js"
import {
    exibirDadosDinamicos,
    configurarEventos,
    configurarFiltros,
    exibirNumSolEmAbertoDashboard,
    exibirGraficosDashboard,
    exibirSolicitacoes,
} from "./interfaceSistema.js"


/**********
 * Main() *
 *********/

// Função principal do app.
async function main() {
    // Carrega o texto dos menus na interface
    exibirDadosDinamicos(
        DadosSistema.setores.map(e => e["nome"]),
        DadosSistema.prioridades,
        DadosSistema.estados
    );

    // Arquivo JSON é convertido para uma array associativo
    const resposta = await fetch("./assets/dados/solicitacoesIniciaisExemplos.json");
    const solicitacoesIniciaisExemplos = await resposta.json();

    // Inicia o objeto para Gerenciar as Solicitações
    const gerenciador = new GerenciadorSolicitacoes();

    // Carrega os dados do array associativo para o objeto gerenciador
    for (const elem of solicitacoesIniciaisExemplos) {
        const _ = gerenciador.adicionar(elem);
    }

    function atualizarSolicitacoes(filtros = {}, busca = "") {
        const todasSolicitacoes = gerenciador.listar();
        let solicitacoes = todasSolicitacoes;

        if (busca) {
            solicitacoes = solicitacoes.filter(s =>
                // Forma uma String com #Chamado + Título + Nome do Responsável + Descrição da Solicitação
                ("#" + String(s.chamado).padStart(4, '0') + s.titulo + s.responsavel + s.descricao)
                    .toLowerCase()
                    .includes(busca)    // E confere se a busca está incluída nesta String temporária
            );
        }

        if (filtros.setor?.length) {
            solicitacoes = solicitacoes.filter(s =>
                filtros.setor.includes(s.setorSolicitante) ||
                filtros.setor.includes(s.setorRequisitado)
            );
        }

        if (filtros.prioridade?.length) {
            solicitacoes = solicitacoes.filter(s =>
                filtros.prioridade.includes(s.prioridade)
            );
        }

        if (filtros.estado?.length) {
            solicitacoes = solicitacoes.filter(s =>
                filtros.estado.includes(s.estadoAtual)
            );
        }

        // Passa os dados de Solicitações para a interface exibir
        exibirSolicitacoes(solicitacoes);
    }

    function atualizarDashboard() {
        const todasSolicitacoes = gerenciador.listar();

        // Faz a contagem de Solicitações que ainda não foram concluídas e exibe no
        // Dashboard
        const contadorNumEmAberto = DadosSistema.solicitacoesEmAberto(todasSolicitacoes);
        exibirNumSolEmAbertoDashboard(contadorNumEmAberto);

        // Calcula a quantidade de vezes que cada setor aparece como Solocitante e
        // Requisitado, guarda essas informações em um array que seré utilizado para
        // gerar os gráficos do Dashboard
        const dadosSetores = DadosSistema.totalSetores(todasSolicitacoes);
        exibirGraficosDashboard(dadosSetores);
    }

    // Carrega todos os eventListeners
    configurarEventos(gerenciador, atualizarSolicitacoes, atualizarDashboard);
    configurarFiltros(atualizarSolicitacoes);

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
    if (solicitacao.estadoAtual !== DadosSistema.estados[0]) {
        return;
    }

    // Altera o status para Em Andamento
    solicitacao.avancarEstado();

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
    if (solicitacao.estadoAtual !== DadosSistema.estados[1]) {
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

    // Atualiza a interface
    atualizarSolicitacoes();
    atualizarDashboard();

});

    // Executa a função acima (pega solicitações, atualiza número em aberto e
    // dados dos gráficos). Essa função também é executada pelos eventListeners.
    atualizarDashboard();
    atualizarSolicitacoes();
}

// Executa a função principal do app
main();

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
