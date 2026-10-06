// DOM Elements
const btnCriar     = document.querySelector("#btn_criar");
const btnDashboard = document.querySelector("#btn_dashboard");
const btnBuscar    = document.querySelector("#btn_buscar");
const inputBuscar  = document.querySelector("#input_buscar");

const dashboard         = document.querySelector("#dashboard");
const listaSolicitacoes = document.querySelector("#lista_solicitacoes");
const novaSolicitacao   = document.querySelector("#nova_solicitacao");

// Event Listeners
btnDashboard.addEventListener("click", () => {
    dashboard.hidden = !dashboard.hidden;
});

btnCriar.addEventListener("click", () => {
    novaSolicitacao.hidden = !novaSolicitacao.hidden;
});
