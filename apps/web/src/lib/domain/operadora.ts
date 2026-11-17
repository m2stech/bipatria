// Tipos extraídos de OPERADORA_PATRIA.SemanticModel/definition/tables/f_Operadora.tmdl e f_Grupos.tmdl.
// Fontes próprias (0021.csv por domínio), sem relação com f_Vendas do Aéreo/Terrestre.
// "Total"/"TotalRecebimento" fazem aqui o papel de rentabilidade/tarifa, mas são campos
// distintos de rentabilidade_003/tarifa_003 — não compartilhar fórmulas por nome igual (CLAUDE.md).

export type VendaOperadora = {
  nomeDaOrigem: string;
  turSubProdutoId: number;
  venda: number; // NÃO é chave de negócio confiável
  numeroFile: string;
  cliente: string;
  fornecedor: string;
  produto: string;
  emissor: string;
  promotor: string; // coluna "Promotor" (não "promotor_003" como em Aéreo/Terrestre)
  loc: string;
  emissao: string | null; // ISO yyyy-MM-dd
  tarifa: number;
  comissao: number;
  taxaAntecipacao: number;
  taxaCc: number;
  total: number; // "Total" — equivalente conceitual de rentabilidade, campo próprio
  totalRecebimento: number; // "TotalRecebimento" — equivalente conceitual de tarifa, campo próprio
  taxa: number;
  checkin: string;
  comissaoRecebida: number;
  tipo: number;
  markup: number;
  fpfr: string;
  situacao: string;
  percRent: number;
  situacaoVenda: number;
  diaDaSemana: string;
};

// f_Grupos: mesmo shape de f_Operadora, mas sem "Dia da Semana" nem "Nome da Origem" na fonte original.
export type VendaGrupo = Omit<VendaOperadora, "nomeDaOrigem" | "diaDaSemana">;

export type RedeOperadora = {
  cliente: string; // d_Redes.Cliente — relaciona com f_Operadora.Cliente (nome diferente do Aéreo/Terrestre)
};

export type PromotorOperadora = {
  promotor: string; // d_Promotor.Promotor (não "promotor_003")
};
