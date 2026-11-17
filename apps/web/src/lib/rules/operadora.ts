// Porta fiel das medidas DAX da Operadora (OPERADORA_PATRIA MEDIDAS.tmdl).
// Rentabilidade aqui usa Total/TotalRecebimento — campos próprios, NÃO rentabilidade_003/tarifa_003
// do Aéreo/Terrestre. Não compartilhar função com rules/aereo.ts ou rules/terrestre.ts (CLAUDE.md).
import { divide } from "./divide";

type VendaParaRentabilidade = { total: number; totalRecebimento: number };

// Measure Rentabilidade = DIVIDE(SUM(Total), SUM(TotalRecebimento))
export function calcularRentabilidadeOperadora(
  vendas: readonly VendaParaRentabilidade[],
): number | null {
  const totalRecebimento = vendas.reduce((acc, v) => acc + v.totalRecebimento, 0);
  const total = vendas.reduce((acc, v) => acc + v.total, 0);
  return divide(total, totalRecebimento);
}

// Measure 'Meta Rentabilidade Mês Corrente' = [Meta Executivo Mês Corrente] * 0.09 (Operadora = 9%,
// igual ao Terrestre, diferente do Aéreo).
export const PERCENTUAL_META_RENTABILIDADE_OPERADORA = 0.09;

export function calcularMetaRentabilidadeOperadora(metaVendas: number | null): number | null {
  return metaVendas == null ? null : metaVendas * PERCENTUAL_META_RENTABILIDADE_OPERADORA;
}

// Measure 'Rentabilidade Executivo Mês Corrente' = SUM(Total) — valor absoluto, não um DIVIDE.
// "Total" faz aqui o papel de rentabilidade bruta; distinto de rentabilidade_003 do Aéreo/Terrestre.
export function calcularRentabilidadeExecutivoOperadora(
  vendas: readonly { total: number }[],
): number {
  return vendas.reduce((acc, v) => acc + v.total, 0);
}
