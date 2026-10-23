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

    function atualizarInterface(filtros = {}) {
        const todasSolicitacoes = gerenciador.listar();
        let solicitacoes = todasSolicitacoes;

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
    configurarEventos(gerenciador, atualizarInterface, atualizarDashboard);
    configurarFiltros(atualizarInterface);

    // Executa a função acima (pega solicitações, atualiza número em aberto e
    // dados dos gráficos). Essa função também é executada pelos eventListeners.
    atualizarDashboard();
    atualizarInterface();
}

// Executa a função principal do app
main();
