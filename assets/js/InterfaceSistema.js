/************************
 * Definição de Funções *
 ***********************/

// Cria um elemento <li>, e coloca as informações de um objeto passado como
// argumento para esta função, os campos do objeto são acessados usando a
// sintaxe objeto.campo
export function criarItem(solicitacao) {
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
        <br>
        <p><b>Responsável:</b> ${solicitacao.responsavel}</p>
        <p><b>Descrição:</b> ${solicitacao.descricao}</p>
        <!-- Concluir Chamado #AQUI -->
    </details>
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
