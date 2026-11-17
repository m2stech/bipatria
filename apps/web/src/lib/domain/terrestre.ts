// Tipos extraídos de TERRESTRE_PATRIA.SemanticModel/definition/tables/f_Vendas.tmdl.
// Mesma origem de dados do Aéreo, mas a Power Query do Terrestre renomeia colunas para papéis
// DIFERENTES: "cia" (texto, companhia no Aéreo) vira "checkout" (data) e "data_embarque" vira
// "checkin". "mkp" e "nº_tkt" também mudam de tipo (double/int64 no Aéreo -> string no Terrestre).
// Por isso este tipo NÃO estende VendaAereo — são domínios independentes (ver CLAUDE.md).

export type VendaTerrestre = {
  nomeDaOrigem: string;
  vendaid: number;
  clienteCodigo: string; // cliente_003
  fornecedorCodigo: string; // fornecedor_003
  subproduto: string;
  localizador: string;
  tktCodigo: number; // tkt_003
  dataEmissao: string | null; // dataemissao_003, ISO yyyy-MM-dd
  tarifaNet: number;
  tarifa: number; // tarifa_003
  taxaEmbarque: number;
  taxaTurismo: number;
  taxaExtra: number;
  taxaServico: number;
  taxaDu: number;
  taxaCartao: number;
  fee: number;
  descontoCliente: number;
  multaReemissao: number;
  multaReembolso: number;
  valorVenda: number;
  saldoCliente: number;
  saldoFornecedor: number;
  saldoCartao: number;
  rentabilidade: number; // rentabilidade_003
  qtdFornecedor: number;
  filialCodigo: string; // filial_003
  produto: string;
  emissor: string;
  promotorCodigo: string; // promotor_003
  passageiro: string;
  tipoDeViagemCodigo: string; // tipo_de_viagem_003
  numeroVenda: number;
  cliente: string; // cliente_monta
  checkin: string | null; // = data_embarque no Aéreo, aqui é literalmente checkin
  checkout: string | null; // == coluna "cia" na origem, renomeada para data de checkout
  cnpj: number;
  filial: string; // filial_monta
  fornecedor: string; // fornecedor_monta
  markup: string; // mkp — string no Terrestre, double no Aéreo
  pax: string;
  promotor: string; // promotor_monta
  tipo: string;
  sistema: string;
  formaDePagamento: string;
  formaDeRecebimento: string;
  trecho: string;
  viagemGlobal: string;
  origem: string;
  destinoFinal: string;
  redes: string;
  owRt: string;
  chaveUnicidade: string;
  diaSemanaCompra: string;
  rota: string;
};

export type AgenciaTerrestre = {
  agencia: string;
  executivo: string;
  redes: string;
  ultimaCompra: string | null;
  valorVendaUltimaCompra: number | null;
  rentabilidadeUltimaCompra: number | null;
  estado: string | null;
  cidade: string | null;
};

export type MetaPromotorTerrestre = {
  promotor: string;
  mes: string;
  meta: number;
};
