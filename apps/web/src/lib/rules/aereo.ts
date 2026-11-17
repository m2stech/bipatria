// Porta fiel das medidas DAX do Aéreo (AEREO_PATRIA MEDIDAS.tmdl e f_Vendas.tmdl).
// Cada função corresponde a uma medida citada em docs/paridade-dax.md — não alterar a lógica
// sem atualizar aquele registro.
import type { FaixaAdvp } from "../domain/common";
import { divide } from "./divide";

type VendaParaRentabilidade = { tarifa: number; rentabilidade: number };

// Measure Rentabilidade = DIVIDE(SUM(rentabilidade_003), SUM(tarifa_003))
export function calcularRentabilidadeAereo(
  vendas: readonly VendaParaRentabilidade[],
): number | null {
  const tarifa = vendas.reduce((acc, v) => acc + v.tarifa, 0);
  const rentabilidade = vendas.reduce((acc, v) => acc + v.rentabilidade, 0);
  return divide(rentabilidade, tarifa);
}

type VendaParaTktMedio = { tktCodigo: number; tarifa: number };

// Measure TKT_medio = DIVIDE(SUM(tarifa_003), DISTINCTCOUNT(tkt_003))
export function calcularTktMedioAereo(vendas: readonly VendaParaTktMedio[]): number | null {
  const tarifaTotal = vendas.reduce((acc, v) => acc + v.tarifa, 0);
  const tktsDistintos = new Set(vendas.map((v) => v.tktCodigo)).size;
  return divide(tarifaTotal, tktsDistintos);
}

// Measure 'Meta Rentabilidade Mês Corrente' = [Meta Executivo Mês Corrente] * 0.06 (Aéreo = 6%)
export const PERCENTUAL_META_RENTABILIDADE_AEREO = 0.06;

export function calcularMetaRentabilidadeAereo(metaVendas: number | null): number | null {
  return metaVendas == null ? null : metaVendas * PERCENTUAL_META_RENTABILIDADE_AEREO;
}

// Colunas calculadas 'XR ADVP Dias' / 'XR ADVP Faixa' de f_Vendas.tmdl (Aéreo), base das faixas
// ADVP da página xray (PRD): 0–13, 14–20, 21–27, 28–59, 60+, "Sem data", "Data inconsistente".
export function calcularDiasAdvp(
  dataEmissao: string | null,
  dataEmbarque: string | null,
): number | null {
  if (dataEmissao == null || dataEmbarque == null) return null;
  const emissao = new Date(dataEmissao);
  const embarque = new Date(dataEmbarque);
  if (embarque < emissao) return null;
  const msPorDia = 24 * 60 * 60 * 1000;
  return Math.round((embarque.getTime() - emissao.getTime()) / msPorDia);
}

export function classificarFaixaAdvp(
  dataEmissao: string | null,
  dataEmbarque: string | null,
): FaixaAdvp {
  if (dataEmissao == null || dataEmbarque == null) return "6 Sem data";
  const emissao = new Date(dataEmissao);
  const embarque = new Date(dataEmbarque);
  if (embarque < emissao) return "7 Data inconsistente";

  const dias = calcularDiasAdvp(dataEmissao, dataEmbarque);
  if (dias == null) return "6 Sem data";
  if (dias <= 13) return "1 Curto | 0–13 dias";
  if (dias <= 20) return "2 Médio 1 | 14–20 dias";
  if (dias <= 27) return "3 Médio 2 | 21–27 dias";
  if (dias <= 59) return "4 Médio 3 | 28–59 dias";
  return "5 Longo | 60+ dias";
}

// Measure 'XR Compra urgente' = DIVIDE(COALESCE(CALCULATE(emissões, 0<=ADVP<=1), 0), ADVP válidos)
export function isCompraUrgente(advpDias: number | null): boolean {
  return advpDias != null && advpDias >= 0 && advpDias <= 1;
}

// Measure 'XR Margem negativa': participação de vendas com rentabilidade_003 < 0
export function isMargemNegativa(rentabilidade: number): boolean {
  return rentabilidade < 0;
}
