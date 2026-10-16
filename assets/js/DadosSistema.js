export default class DadosSistema {
    static setores = [
        { nome: "Comercial",       cor: "rgb(196, 76, 91)" },
        { nome: "Administrativo",  cor: "rgb(207, 103, 79)" },
        { nome: "Financeiro",      cor: "rgb(198, 137, 55)" },
        { nome: "Estoque",         cor: "rgb(190, 164, 57)" },
        { nome: "Suporte Técnico", cor: "rgb(75, 145, 111)" },
        { nome: "Infraestrutura",  cor: "rgb(58, 139, 157)" },
        { nome: "Instalação",      cor: "rgb(117, 96, 180)" }
    ];

    static prioridades = [
        "Baixa",
        "Média",
        "Alta"
    ];

    static estados = [
        "Aberto",
        "Em Andamento",
        "Concluído"
    ];

    static solicitacoesEmAberto(solicitacoes) {
        return solicitacoes.filter(s => s.estadoAtual !== "Concluído").length;
    }

    static totalSetores(solicitacoes) {
        return this.setores.map(setor => ({
            ...setor,
            solicitante: solicitacoes.filter(s => s.setorSolicitante === setor.nome).length,
            requisitado: solicitacoes.filter(s => s.setorRequisitado === setor.nome).length
        }));
    }
}
