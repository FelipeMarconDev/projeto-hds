/********************************* ***
 * Importação de Arquivos Auxiliares *
 ************************************/

import GerenciadorSolicitacoes from "./GerenciadorSolicitacoes.js"
import DadosSistema from "./DadosSistema.js"
import {
    criarItem,
    preencherLista,
    desenharGrafico,
} from "./InterfaceSistema.js"

/********************************* 
 * Definição de Elementos do DOM *
 ********************************/

// Nav
const btnCriar     = document.querySelector("#btn_criar");
const btnDashboard = document.querySelector("#btn_dashboard");
const btnBuscar    = document.querySelector("#btn_buscar");
const inputBuscar  = document.querySelector("#input_buscar");

// Main
const dashboard         = document.querySelector("#dashboard");
const solicitacoes      = document.querySelector("#solicitacoes");
const listaSolicitacoes = document.querySelector("#lista_solicitacoes");
const novaSolicitacao   = document.querySelector("#nova_solicitacao");

// Dashboard
const numEmAberto   = document.querySelector("#num_em_aberto");
const setorSolChart = document.querySelector("#setores_solicitantes_chart");
const setorReqChart = document.querySelector("#setores_requisitados_chart");

/**************************************************************
 * Event Listeners (Detector de Eventos)                      *
 * Aguarda algo acontecer para executar uma função específica *
 *************************************************************/

// Cria evento para ativar e desativar o painel de Dashboard quando o
// usuário clica no botão
btnDashboard.addEventListener("click", () => {
    dashboard.hidden = !dashboard.hidden;
});

// Cria evento para abrir o painel de Nova Solicitação quando o usuário clica no
// botão de +, e também fecha a janela se clicar em qualquer lugar fora do painel
document.addEventListener("click", event => {
    // Se o botão for o alvo clicado
    if (btnCriar.contains(event.target)) {
        novaSolicitacao.hidden = false;
    // Se o painel NÃO for o alvo clicado
    } else if(!novaSolicitacao.contains(event.target)) {
        novaSolicitacao.hidden = true;
    }
});

// Cria evento para fechar pop-up de Nova Solicitação quando o usuário aperta Esc
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        novaSolicitacao.hidden = true;
    }
});

/**********
 * Main() *
 *********/

// Função principal do app.
// Executa um loop pelo array, e para cada elemento (que é um dicionário),
// executa a função de preencherLista, para essa função o loop passa como
// argumento outra função criarItem, e essa função recebe como argumento o
// dicionario que está temporariamente nomeado como elem
async function main() {
    const resposta = await fetch("./assets/dados/solicitacoesIniciaisExemplos.json");
    const solicitacoesIniciaisExemplos = await resposta.json();

    const gerenciador = new GerenciadorSolicitacoes();

    for (const elem of solicitacoesIniciaisExemplos) {
        const solicitacao = gerenciador.adicionar(elem);
        preencherLista(listaSolicitacoes, criarItem(solicitacao));
    }

    let contadorNumEmAberto = DadosSistema.solicitacoesEmAberto(gerenciador.listar());
    numEmAberto.textContent = String(contadorNumEmAberto);

    const dadosSetores = DadosSistema.totalSetores(gerenciador.listar());

    desenharGrafico(dadosSetores, setorSolChart, "solicitante");
    desenharGrafico(dadosSetores, setorReqChart, "requisitado");
}

// Executa a função principal do app
main();
