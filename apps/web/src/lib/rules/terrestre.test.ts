import { describe, expect, it } from "vitest";

import {
  calcularMetaRentabilidadeTerrestre,
  calcularQtdeDiarias,
  calcularRentabilidadeTerrestre,
  calcularTktMedioTerrestre,
} from "./terrestre";

describe("calcularRentabilidadeTerrestre", () => {
  it("divide rentabilidade total pela tarifa total", () => {
    const vendas = [{ tarifa: 1000, rentabilidade: 200 }];
    expect(calcularRentabilidadeTerrestre(vendas)).toBeCloseTo(0.2);
  });

  it("retorna null quando a tarifa total é zero (divisão por zero)", () => {
    expect(calcularRentabilidadeTerrestre([{ tarifa: 0, rentabilidade: 0 }])).toBeNull();
  });
});

describe("calcularTktMedioTerrestre", () => {
  it("usa contagem distinta de tkt_003", () => {
    const vendas = [
      { tktCodigo: 10, tarifa: 300 },
      { tktCodigo: 10, tarifa: 300 },
    ];
    expect(calcularTktMedioTerrestre(vendas)).toBe(600);
  });

  it("retorna null para lista vazia", () => {
    expect(calcularTktMedioTerrestre([])).toBeNull();
  });
});

describe("calcularMetaRentabilidadeTerrestre", () => {
  it("aplica 9% sobre a meta de vendas (diferente do Aéreo, que usa 6%)", () => {
    expect(calcularMetaRentabilidadeTerrestre(1000)).toBeCloseTo(90);
  });

  it("retorna null quando a meta de vendas é null", () => {
    expect(calcularMetaRentabilidadeTerrestre(null)).toBeNull();
  });
});

describe("calcularQtdeDiarias", () => {
  it("soma a diferença em dias entre checkin e checkout de cada venda", () => {
    const vendas = [
      { checkin: "2026-01-01", checkout: "2026-01-04" }, // 3 dias
      { checkin: "2026-02-01", checkout: "2026-02-03" }, // 2 dias
    ];
    expect(calcularQtdeDiarias(vendas)).toBe(5);
  });

  it("ignora vendas com checkin ou checkout nulos", () => {
    const vendas = [
      { checkin: null, checkout: "2026-01-04" },
      { checkin: "2026-01-01", checkout: null },
      { checkin: "2026-01-01", checkout: "2026-01-02" },
    ];
    expect(calcularQtdeDiarias(vendas)).toBe(1);
  });

  it("retorna zero para lista vazia", () => {
    expect(calcularQtdeDiarias([])).toBe(0);
  });
});
