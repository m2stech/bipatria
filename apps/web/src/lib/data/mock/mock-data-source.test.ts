import { describe, expect, it } from "vitest";

import { FILTROS_VAZIOS } from "../filtros";
import { gerarVendasAereoMock } from "./fixtures-aereo";
import { gerarVendasOperadoraMock } from "./fixtures-operadora";
import { gerarVendasTerrestreMock } from "./fixtures-terrestre";
import { mockDataSource } from "./mock-data-source";

describe("fixtures determinísticas", () => {
  it("gera sempre os mesmos dados para o Aéreo (mesma seed)", () => {
    const a = gerarVendasAereoMock(50);
    const b = gerarVendasAereoMock(50);
    expect(a).toEqual(b);
  });

  it("gera sempre os mesmos dados para o Terrestre (mesma seed)", () => {
    const a = gerarVendasTerrestreMock(50);
    const b = gerarVendasTerrestreMock(50);
    expect(a).toEqual(b);
  });

  it("gera sempre os mesmos dados para a Operadora (mesma seed)", () => {
    const a = gerarVendasOperadoraMock(50);
    const b = gerarVendasOperadoraMock(50);
    expect(a).toEqual(b);
  });

  it("inclui casos de borda do Aéreo: tarifa zero e data de embarque ausente/inconsistente", () => {
    const vendas = gerarVendasAereoMock(300);
    expect(vendas.some((v) => v.tarifa === 0)).toBe(true);
    expect(vendas.some((v) => v.dataEmbarque === null)).toBe(true);
    expect(
      vendas.some(
        (v) => v.dataEmbarque != null && v.dataEmissao != null && v.dataEmbarque < v.dataEmissao,
      ),
    ).toBe(true);
  });

  it("inclui casos de borda do Terrestre: checkin/checkout ausentes", () => {
    const vendas = gerarVendasTerrestreMock(300);
    expect(vendas.some((v) => v.checkin === null && v.checkout === null)).toBe(true);
  });

  it("inclui casos de borda da Operadora: TotalRecebimento zero", () => {
    const vendas = gerarVendasOperadoraMock(300);
    expect(vendas.some((v) => v.totalRecebimento === 0)).toBe(true);
  });
});

describe("mockDataSource", () => {
  it("retorna todas as vendas do Aéreo quando os filtros estão vazios", async () => {
    const vendas = await mockDataSource.getVendasAereo(FILTROS_VAZIOS);
    expect(vendas.length).toBeGreaterThan(0);
  });

  it("filtra vendas do Aéreo por agência (nome de exibição ou código)", async () => {
    const todas = await mockDataSource.getVendasAereo(FILTROS_VAZIOS);
    const agenciaAlvo = todas[0].clienteCodigo;
    const filtradas = await mockDataSource.getVendasAereo({
      ...FILTROS_VAZIOS,
      agencia: agenciaAlvo,
    });
    expect(filtradas.length).toBeGreaterThan(0);
    expect(
      filtradas.every((v) => v.clienteCodigo === agenciaAlvo || v.cliente === agenciaAlvo),
    ).toBe(true);
  });

  it("filtra vendas do Aéreo por período", async () => {
    const filtradas = await mockDataSource.getVendasAereo({
      ...FILTROS_VAZIOS,
      periodoInicio: "2026-01-01",
      periodoFim: "2026-01-31",
    });
    expect(
      filtradas.every(
        (v) =>
          v.dataEmissao != null && v.dataEmissao >= "2026-01-01" && v.dataEmissao <= "2026-01-31",
      ),
    ).toBe(true);
  });

  it("retorna agências, cias e metas do Aéreo", async () => {
    expect((await mockDataSource.getAgenciasAereo()).length).toBeGreaterThan(0);
    expect((await mockDataSource.getCiasAereo()).length).toBeGreaterThan(0);
    expect((await mockDataSource.getMetasPromotorAereo()).length).toBeGreaterThan(0);
  });

  it("filtra vendas da Operadora e Grupos de forma independente", async () => {
    const operadora = await mockDataSource.getVendasOperadora(FILTROS_VAZIOS);
    const grupos = await mockDataSource.getVendasGrupos(FILTROS_VAZIOS);
    expect(operadora.length).toBeGreaterThan(0);
    expect(grupos.length).toBeGreaterThan(0);
  });
});
