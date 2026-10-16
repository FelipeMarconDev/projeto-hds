/************************
 * Definição de Funções *
 ***********************/

// Cria um elemento <li>, e coloca as informações de um dicionário passado como
// argumento para esta função
export function criarItem(solicitacao) {
    const item = document.createElement("li");

    item.innerHTML = `
    <!-- Visualização de Chamado #AQUI -->
    <h4>Chamado #${String(solicitacao.chamado).padStart(4, '0')} - ${solicitacao.titulo}</h4>
    <p><b>${solicitacao.setorSolicitante}</b> &mdash;&raquo; <b>${solicitacao.setorRequisitado}</b></p>
    <p><b>Responsável:</b> ${solicitacao.responsavel}</p>
    <p><b>Status:</b> ${solicitacao.estadoAtual}</p>
    <p><b>Prioridade:</b> ${solicitacao.prioridade}</p>
    <p>
        <b>Descrição:</b><br>
        ${solicitacao.descricao}
    </p>
    <!-- Concluir Chamado #AQUI -->
    `;

    return item;
}

// Adiciona o item <li> criado, na <ul> do HTML
export function preencherLista(lista, item) {
    lista.appendChild(item);
}

// Recebe um dos dois cards para criar o gráfico
export function desenharGrafico(dadosSetores, setorCard, setorDir) {
    const dadosFiltrados = dadosSetores.filter(e => e[setorDir] > 0);

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
