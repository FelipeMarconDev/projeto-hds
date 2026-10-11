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

/*************************************
 * Estrutura Inicial de Solicitações *
 ************************************/

// Na falta de Banco de Dados, essa estrutura permite armazenar dados.
// Ela consiste de um array[] que armazena dois (ou mais) dicionários{}, cada um
// desses dicionários possúi uma série de chaves: "valores".
// As chaves servem como referência para obter seus valores, no seguinte
// formato: dicionario.chave
let listaDefault = [
    {
        chamado: 1,
        titulo: "Teste",
        setorSolicitante: "Financeiro",
        responsavel: "Maria Joana",
        setorRequisitado: "Infraestrutura",
        status: true,
        prioridade: "Média",
        descricao: "Velit dignissimos accusamus nesciunt Excepturi minima ut inventore.",
    },
    {
        chamado: 2,
        titulo: "Mais Um Teste",
        setorSolicitante: "Comercial",
        responsavel: "João Silva",
        setorRequisitado: "Estoque",
        status: true,
        prioridade: "Baixa",
        descricao: "Consectetur cupiditate velit dignissimos accusamus nesciunt Excepturi minima ut inventore.",
    },
    {
        chamado: 3,
        titulo: "Novo Título",
        setorSolicitante: "Instalação",
        responsavel: "Lorena Ipsuna",
        setorRequisitado: "Suporte Técnico",
        status: false,
        prioridade: "Alta",
        descricao: "Adipisicing voluptatem sunt earum ipsam id. Iusto dolorem voluptas iste dolores totam Suscipit animi quisquam quam nihil labore Quam magni.",
    },
    {
        chamado: 4,
        titulo: "Exemplo de Texto Um Pouco Mais Longo",
        setorSolicitante: "Estoque",
        responsavel: "Estoquista Chefe",
        setorRequisitado: "Infraestrutura",
        status: true,
        prioridade: "Média",
        descricao: "Adipisicing illo nobis possimus eum architecto. Obcaecati consequatur quam iure impedit aliquid quisquam. Hic veritatis eius enim aperiam possimus? Quasi ex deleniti ullam repellat quibusdam Perspiciatis error et culpa voluptate aliquam dolore. Repudiandae inventore mollitia expedita unde a Quasi rem adipisci libero eveniet ipsa. Libero mollitia odio necessitatibus magnam vitae. Consectetur cupiditate velit dignissimos accusamus nesciunt Excepturi minima ut inventore.",
    },
    {
        chamado: 5,
        titulo: "Último Teste",
        setorSolicitante: "Administrativo",
        responsavel: "John Doe",
        setorRequisitado: "Comercial",
        status: false,
        prioridade: "Baixa",
        descricao: "Accusamus nesciunt Excepturi minima ut inventore.",
    },
];

const dadosSetores = [
    {
        setor: "Comercial",
        solicitante: 1,
        requisitado: 1,
        cor: "rgb(196, 76, 91)"
    },
    {
        setor: "Administrativo",
        solicitante: 1,
        requisitado: 0,
        cor: "rgb(207, 103, 79)"
    },
    {
        setor: "Financeiro",
        solicitante: 1,
        requisitado: 0,
        cor: "rgb(198, 137, 55)"
    },
    {
        setor: "Estoque",
        solicitante: 1,
        requisitado: 1,
        cor: "rgb(190, 164, 57)"
    },
    {
        setor: "Suporte Técnico",
        solicitante: 0,
        requisitado: 1,
        cor: "rgb(75, 145, 111)"
    },
    {
        setor: "Infraestrutura",
        solicitante: 0,
        requisitado: 2,
        cor: "rgb(58, 139, 157)"
    },
    {
        setor: "Instalação",
        solicitante: 1,
        requisitado: 0,
        cor: "rgb(117, 96, 180)"
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

// Recebe um dos dois cards para criar o gráfico
function desenharGrafico(setorCard) {
    const setorDir = (setorCard === setorSolChart) ?  "solicitante" : "requisitado";
    const dadosFiltrados = dadosSetores.filter(e => e[setorDir] > 0);

    new Chart(setorCard, {
        type: "doughnut",
        data: {
            labels: dadosFiltrados.map(e => e["setor"]),
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

// Função principal do app.
// Executa um loop pelo array, e para cada elemento (que é um dicionário),
// executa a função de preencherLista, para essa função o loop passa como
// argumento outra função criarItem, e essa função recebe como argumento o
// dicionario que está temporariamente nomeado como elem
function main() {
    let contadorNumEmAberto = 0;

    for (const elem of listaDefault) {
        if (elem.status) contadorNumEmAberto++;

        preencherLista(criarItem(elem));
    }

    numEmAberto.textContent = String(contadorNumEmAberto);

    desenharGrafico(setorSolChart);
    desenharGrafico(setorReqChart);
}

// Executa a função principal do app
main();
