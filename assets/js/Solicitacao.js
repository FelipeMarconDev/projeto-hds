import DadosSistema from "./DadosSistema.js"

export default class Solicitacao {
    static totalChamados = 0;

    constructor({
        titulo,
        responsavel,
        setorSolicitante,
        setorRequisitado,
        estadoAtual = DadosSistema.estados[0],
        prioridade = DadosSistema.prioridades[0],
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

    avancarEstado() {
        if (this.estadoAtual === DadosSistema.estados[0])
            this.estadoAtual = DadosSistema.estados[1];
        else if (this.estadoAtual === DadosSistema.estados[1])
            this.estadoAtual = DadosSistema.estados[2];

        return this.estadoAtual;
    }
}
