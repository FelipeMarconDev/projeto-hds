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

    // Executa um loop pelo array, e para cada elemento (que é um objeto),
    // executa a função de preencherLista, para essa função o loop passa como
    // argumento outra função criarItem, e essa função recebe como argumento o
    // objeto que está temporariamente nomeado como elem
    for (const elem of solicitacoesIniciaisExemplos) {
        const solicitacao = gerenciador.adicionar(elem);
        preencherLista(listaSolicitacoes, criarItem(solicitacao));
    }

    // Faz a contagem de Solicitações que ainda não foram concluídas
    let contadorNumEmAberto = DadosSistema.solicitacoesEmAberto(gerenciador.listar());
    numEmAberto.textContent = String(contadorNumEmAberto);

    // Calcula a quantidade de vezes que cada setor aparece como Solocitante e
    // Requisitado, guarda essas informações em um array que seré utilizado para
    // gerar os gráficos do Dashboard
    const dadosSetores = DadosSistema.totalSetores(gerenciador.listar());

    desenharGrafico(dadosSetores, setorSolChart, "solicitante");
    desenharGrafico(dadosSetores, setorReqChart, "requisitado");
}

// Executa a função principal do app
main();
