import { describe, expect, it } from "vitest";

import {
  calcularDiasAdvp,
  calcularMetaRentabilidadeAereo,
  calcularRentabilidadeAereo,
  calcularTktMedioAereo,
  classificarFaixaAdvp,
  isCompraUrgente,
  isMargemNegativa,
} from "./aereo";

describe("calcularRentabilidadeAereo", () => {
  it("divide rentabilidade total pela tarifa total", () => {
    const vendas = [
      { tarifa: 1000, rentabilidade: 100 },
      { tarifa: 500, rentabilidade: 50 },
    ];
    expect(calcularRentabilidadeAereo(vendas)).toBeCloseTo(150 / 1500);
  });

  it("retorna null quando a tarifa total é zero (divisão por zero)", () => {
    const vendas = [{ tarifa: 0, rentabilidade: 0 }];
    expect(calcularRentabilidadeAereo(vendas)).toBeNull();
  });

  it("retorna null para lista vazia", () => {
    expect(calcularRentabilidadeAereo([])).toBeNull();
  });
});

describe("calcularTktMedioAereo", () => {
  it("usa contagem distinta de tkt_003, não contagem de linhas", () => {
    const vendas = [
      { tktCodigo: 1, tarifa: 100 },
      { tktCodigo: 1, tarifa: 100 }, // mesmo tkt repetido não deve contar duas vezes
      { tktCodigo: 2, tarifa: 200 },
    ];
    // tarifa total = 400, tkts distintos = 2 -> 200
    expect(calcularTktMedioAereo(vendas)).toBe(200);
  });

  it("retorna null quando não há tickets (divisão por zero)", () => {
    expect(calcularTktMedioAereo([])).toBeNull();
  });
});

describe("calcularMetaRentabilidadeAereo", () => {
  it("aplica 6% sobre a meta de vendas (diferente do Terrestre/Operadora, que usam 9%)", () => {
    expect(calcularMetaRentabilidadeAereo(1000)).toBeCloseTo(60);
  });

  it("retorna null quando a meta de vendas é null (mês futuro)", () => {
    expect(calcularMetaRentabilidadeAereo(null)).toBeNull();
  });
});

describe("calcularDiasAdvp", () => {
  it("calcula a diferença em dias entre emissão e embarque", () => {
    expect(calcularDiasAdvp("2026-01-01", "2026-01-15")).toBe(14);
  });

  it("retorna null quando a emissão é nula", () => {
    expect(calcularDiasAdvp(null, "2026-01-15")).toBeNull();
  });

  it("retorna null quando o embarque é nulo", () => {
    expect(calcularDiasAdvp("2026-01-01", null)).toBeNull();
  });

  it("retorna null quando o embarque é anterior à emissão (data inconsistente)", () => {
    expect(calcularDiasAdvp("2026-01-15", "2026-01-01")).toBeNull();
  });
});

describe("classificarFaixaAdvp", () => {
  it("classifica como 'Sem data' quando emissão ou embarque estão ausentes", () => {
    expect(classificarFaixaAdvp(null, "2026-01-15")).toBe("6 Sem data");
    expect(classificarFaixaAdvp("2026-01-01", null)).toBe("6 Sem data");
  });

  it("classifica como 'Data inconsistente' quando embarque é anterior à emissão", () => {
    expect(classificarFaixaAdvp("2026-01-15", "2026-01-01")).toBe("7 Data inconsistente");
  });

  it.each([
    [0, "1 Curto | 0–13 dias"],
    [13, "1 Curto | 0–13 dias"],
    [14, "2 Médio 1 | 14–20 dias"],
    [20, "2 Médio 1 | 14–20 dias"],
    [21, "3 Médio 2 | 21–27 dias"],
    [27, "3 Médio 2 | 21–27 dias"],
    [28, "4 Médio 3 | 28–59 dias"],
    [59, "4 Médio 3 | 28–59 dias"],
    [60, "5 Longo | 60+ dias"],
    [120, "5 Longo | 60+ dias"],
  ])("classifica %i dias como %s", (dias, faixaEsperada) => {
    const emissao = "2026-01-01";
    const embarque = new Date(emissao);
    embarque.setDate(embarque.getDate() + dias);
    const embarqueIso = embarque.toISOString().slice(0, 10);
    expect(classificarFaixaAdvp(emissao, embarqueIso)).toBe(faixaEsperada);
  });
});

describe("isCompraUrgente", () => {
  it("é urgente para 0 ou 1 dia de antecedência", () => {
    expect(isCompraUrgente(0)).toBe(true);
    expect(isCompraUrgente(1)).toBe(true);
  });

  it("não é urgente para 2+ dias ou quando ADVP é nulo", () => {
    expect(isCompraUrgente(2)).toBe(false);
    expect(isCompraUrgente(null)).toBe(false);
  });
});

describe("isMargemNegativa", () => {
  it("é verdadeiro quando rentabilidade é negativa", () => {
    expect(isMargemNegativa(-1)).toBe(true);
    expect(isMargemNegativa(0)).toBe(false);
    expect(isMargemNegativa(1)).toBe(false);
  });
});
