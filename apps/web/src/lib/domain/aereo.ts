// Tipos extraídos de AEREO_PATRIA.SemanticModel/definition/tables/f_Vendas.tmdl e dimensões.
// vendaid, tkt_003 e chave_unicidade NÃO são chaves de negócio confiáveis (ver CLAUDE.md) —
// nenhum campo aqui deve ser tratado como identificador único de linha para upsert.

import type { FaixaAdvp } from "./common";

export type VendaAereo = {
  nomeDaOrigem: string;
  vendaid: number;
  clienteCodigo: string; // cliente_003 — código da agência, não nome de exibição
  fornecedorCodigo: string; // fornecedor_003
  subproduto: string;
  localizador: string;
  tktCodigo: number; // tkt_003
  dataEmissao: string | null; // dataemissao_003, ISO yyyy-MM-dd — pode ser nulo/ausente
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
  promotorCodigo: string; // promotor_003 — executivo/carteira, não inferir carteira a partir deste campo
  passageiro: string;
  tipoDeViagemCodigo: string; // tipo_de_viagem_003
  numeroVenda: number;
  cliente: string; // cliente_monta
  cia: string;
  ciaAjustada: string;
  cnpj: number;
  dataEmbarque: string | null; // pode ser nulo ou anterior à emissão (data inconsistente)
  filial: string; // filial_monta
  fornecedor: string; // fornecedor_monta
  markup: number; // mkp
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
  cabine: string;
  cbn: string;
  ciaSubProduto: string;
};

// Colunas calculadas 'XR ADVP Dias' / 'XR ADVP Faixa' do f_Vendas (xray) — ver rules/aereo.ts para a função pura.
export type VendaAereoComAdvp = VendaAereo & {
  advpDias: number | null;
  advpFaixa: FaixaAdvp;
};

export type AgenciaAereo = {
  agencia: string; // = cliente_003
  executivo: string;
  redes: string;
  ultimaCompra: string | null;
  valorVendaUltimaCompra: number | null;
  rentabilidadeUltimaCompra: number | null;
  estado: string | null;
  cidade: string | null;
};

export type CiaAereo = {
  cia: string;
  icao: string;
  airline: string;
  callSign: string;
  countryRegion: string;
};

export type MetaPromotorAereo = {
  promotor: string;
  mes: string; // ISO yyyy-MM-dd (primeiro dia do mês)
  meta: number;
};
