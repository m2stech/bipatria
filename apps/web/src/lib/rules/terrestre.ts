// Porta fiel das medidas DAX do Terrestre (TERRESTRE_PATRIA MEDIDAS.tmdl).
// Mesma fórmula de Rentabilidade/TKT_medio do Aéreo (campos iguais: rentabilidade_003/tarifa_003/
// tkt_003), mas implementação própria do domínio — não importar de rules/aereo.ts (CLAUDE.md).
import { divide } from "./divide";

type VendaParaRentabilidade = { tarifa: number; rentabilidade: number };

// Measure Rentabilidade = DIVIDE(SUM(rentabilidade_003), SUM(tarifa_003))
export function calcularRentabilidadeTerrestre(
  vendas: readonly VendaParaRentabilidade[],
): number | null {
  const tarifa = vendas.reduce((acc, v) => acc + v.tarifa, 0);
  const rentabilidade = vendas.reduce((acc, v) => acc + v.rentabilidade, 0);
  return divide(rentabilidade, tarifa);
}

type VendaParaTktMedio = { tktCodigo: number; tarifa: number };

// Measure TKT_medio = DIVIDE(SUM(tarifa_003), DISTINCTCOUNT(tkt_003))
export function calcularTktMedioTerrestre(vendas: readonly VendaParaTktMedio[]): number | null {
  const tarifaTotal = vendas.reduce((acc, v) => acc + v.tarifa, 0);
  const tktsDistintos = new Set(vendas.map((v) => v.tktCodigo)).size;
  return divide(tarifaTotal, tktsDistintos);
}

// Measure 'Meta Rentabilidade Mês Corrente' = [Meta Executivo Mês Corrente] * 0.09 (Terrestre = 9%)
// Confirmado no arquivo: valor DIFERENTE do Aéreo (6%). Não unificar.
export const PERCENTUAL_META_RENTABILIDADE_TERRESTRE = 0.09;

export function calcularMetaRentabilidadeTerrestre(metaVendas: number | null): number | null {
  return metaVendas == null ? null : metaVendas * PERCENTUAL_META_RENTABILIDADE_TERRESTRE;
}

type VendaParaQtdeDiarias = { checkin: string | null; checkout: string | null };

// Measure 'Qtde Diárias' = SUMX(f_Vendas, DATEDIFF(checkin, checkout, DAY)) — exclusiva do Terrestre.
export function calcularQtdeDiarias(vendas: readonly VendaParaQtdeDiarias[]): number {
  const msPorDia = 24 * 60 * 60 * 1000;
  return vendas.reduce((acc, v) => {
    if (v.checkin == null || v.checkout == null) return acc;
    const checkin = new Date(v.checkin);
    const checkout = new Date(v.checkout);
    const dias = Math.round((checkout.getTime() - checkin.getTime()) / msPorDia);
    return acc + dias;
  }, 0);
}
