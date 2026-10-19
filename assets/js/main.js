/********************************* ***
 * Importação de Arquivos Auxiliares *
 ************************************/

import GerenciadorSolicitacoes from "./GerenciadorSolicitacoes.js"
import DadosSistema from "./DadosSistema.js"
import {
    exibirNumSolEmAbertoDashboard,
    exibirGraficosDashboard,
    exibirSolicitacoes,
} from "./interfaceSistema.js"

/**********
 * Main() *
 *********/

// Função principal do app.
async function main() {
    // Arquivo JSON é convertido para uma array associativo
    const resposta = await fetch("./assets/dados/solicitacoesIniciaisExemplos.json");
    const solicitacoesIniciaisExemplos = await resposta.json();

    // Inicia o objeto para Gerenciar as Solicitações
    const gerenciador = new GerenciadorSolicitacoes();

    // Carrega os dados do array associativo para o objeto gerenciador
    for (const elem of solicitacoesIniciaisExemplos) {
        const _ = gerenciador.adicionar(elem);
    }

    // Passa os dados de Solicitações para a interface exibir
    const solicitacoesMain = gerenciador.listar();
    exibirSolicitacoes(solicitacoesMain);

    // Faz a contagem de Solicitações que ainda não foram concluídas e exibe no
    // Dashboard
    const contadorNumEmAberto = DadosSistema.solicitacoesEmAberto(solicitacoesMain);
    exibirNumSolEmAbertoDashboard(contadorNumEmAberto);

    // Calcula a quantidade de vezes que cada setor aparece como Solocitante e
    // Requisitado, guarda essas informações em um array que seré utilizado para
    // gerar os gráficos do Dashboard
    const dadosSetores = DadosSistema.totalSetores(solicitacoesMain);
    exibirGraficosDashboard(dadosSetores);
}

// Executa a função principal do app
main();
