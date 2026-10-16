import Solicitacao from "./Solicitacao.js"

export default class GerenciadorSolicitacoes {
    solicitacoes = [];

    adicionar(dados) {
        const solicitacao = new Solicitacao(dados);
        this.solicitacoes.push(solicitacao);

        return solicitacao;
    }

    listar() {
        return this.solicitacoes;
    }
}
