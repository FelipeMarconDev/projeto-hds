/********************************* 
 * Definição de Elementos do DOM *
 ********************************/

const btnCriar     = document.querySelector("#btn_criar");
const btnDashboard = document.querySelector("#btn_dashboard");
const btnBuscar    = document.querySelector("#btn_buscar");
const inputBuscar  = document.querySelector("#input_buscar");

const dashboard         = document.querySelector("#dashboard");
const solicitacoes      = document.querySelector("#solicitacoes");
const listaSolicitacoes = document.querySelector("#lista_solicitacoes");
const novaSolicitacao   = document.querySelector("#nova_solicitacao");

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

/************************************
 * Estrutura Inicial de Solicitações *
 ************************************/

// Na falta de Banco de Dados, essa estrutura permite armazenar dados.
// Ela consiste de um array[] que armazena dois (ou mais) dicionários{}, cada um
// desses dicionários possúi uma série de "chaves": "valores".
// As chaves servem como referência para obter seus valores, no seguinte
// formato: dicionario.chave
let listaDefault = [
    {
        "chamado": 1,
        "titulo": "Teste",
        "setorSolicitante": "Financeiro",
        "responsavel": "Maria Joana",
        "setorRequisitado": "Infraestrutura",
        "status": true,
        "prioridade": "Média",
        "descricao": "Velit dignissimos accusamus nesciunt Excepturi minima ut inventore.",
    },
    {
        "chamado": 2,
        "titulo": "Mais Um Teste",
        "setorSolicitante": "Comercial",
        "responsavel": "João Silva",
        "setorRequisitado": "Estoque",
        "status": true,
        "prioridade": "Baixa",
        "descricao": "Consectetur cupiditate velit dignissimos accusamus nesciunt Excepturi minima ut inventore.",
    },
];

/************************
 * Definição de Funções *
 ***********************/

// Cria um elemento <li>, e coloca as informações de um dicionário passado como
// argumento para esta função
function criarItem(dict) {
    const item = document.createElement("li");

    item.innerHTML = `
    <h4>Chamado #${String(dict.chamado).padStart(4, '0')} - ${dict.titulo}</h4>
    <p><b>${dict.setorSolicitante}</b> &mdash;&raquo; <b>${dict.setorRequisitado}</b></p>
    <p><b>Responsável:</b> ${dict.responsavel}</p>
    <p><b>Status:</b> ${(dict.status) ? "Aberto" : "Concluído"}</p>
    <p><b>Prioridade:</b> ${dict.prioridade}</p>
    <p>
        <b>Descrição:</b><br>
        ${dict.descricao}
    </p>
    `;

    return item;
}

// Adiciona o item <li> criado, na <ul> do HTML
function preencherLista(item) {
    listaSolicitacoes.appendChild(item);
}

// Função principal do app.
// Executa um loop pelo array, e para cada elemento (que é um dicionário),
// executa a função de preencherLista, para essa função o loop passa como
// argumento outra função criarItem, e essa função recebe como argumento o
// dicionario que está temporariamente nomeado como elem
function main() {
    for (const elem of listaDefault) {
        preencherLista(criarItem(elem));
    }
}

// Executa a função principal do app
main();
