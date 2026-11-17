import { describe, expect, it } from "vitest";

import {
  calcularMetaRentabilidadeOperadora,
  calcularRentabilidadeExecutivoOperadora,
  calcularRentabilidadeOperadora,
} from "./operadora";

describe("calcularRentabilidadeOperadora", () => {
  it("divide Total pelo TotalRecebimento (não tarifa_003/rentabilidade_003)", () => {
    const vendas = [{ total: 300, totalRecebimento: 1000 }];
    expect(calcularRentabilidadeOperadora(vendas)).toBeCloseTo(0.3);
  });

  it("retorna null quando TotalRecebimento é zero (divisão por zero)", () => {
    expect(calcularRentabilidadeOperadora([{ total: 0, totalRecebimento: 0 }])).toBeNull();
  });
});

describe("calcularMetaRentabilidadeOperadora", () => {
  it("aplica 9% sobre a meta de vendas (igual ao Terrestre, diferente do Aéreo)", () => {
    expect(calcularMetaRentabilidadeOperadora(1000)).toBeCloseTo(90);
  });

  it("retorna null quando a meta de vendas é null", () => {
    expect(calcularMetaRentabilidadeOperadora(null)).toBeNull();
  });
});

describe("calcularRentabilidadeExecutivoOperadora", () => {
  it("soma Total das vendas (valor absoluto, não uma divisão)", () => {
    const vendas = [{ total: 100 }, { total: 50 }];
    expect(calcularRentabilidadeExecutivoOperadora(vendas)).toBe(150);
  });

  it("retorna zero para lista vazia", () => {
    expect(calcularRentabilidadeExecutivoOperadora([])).toBe(0);
  });
});
