export default class Solicitacao {
    static totalChamados = 0;

    constructor({
        titulo,
        responsavel,
        setorSolicitante,
        setorRequisitado,
        estadoAtual = "Aberto",
        prioridade = "Baixa",
        descricao = "Não informado.",
    }) {
        this.chamado = ++Solicitacao.totalChamados;
        this.titulo = titulo;
        this.responsavel = responsavel;
        this.setorSolicitante = setorSolicitante;
        this.setorRequisitado = setorRequisitado;
        this.estadoAtual = estadoAtual;
        this.prioridade = prioridade;
        this.descricao = descricao;
    }
}
