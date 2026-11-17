import { describe, expect, it } from "vitest";

import { FILTROS_VAZIOS } from "../data/filtros";
import { filtrosParaSearchParams, searchParamsParaFiltros } from "./query-params";

describe("filtrosParaSearchParams", () => {
  it("não inclui nenhum parâmetro quando os filtros estão vazios", () => {
    const params = filtrosParaSearchParams(FILTROS_VAZIOS);
    expect(params.toString()).toBe("");
  });

  it("inclui apenas os filtros preenchidos", () => {
    const params = filtrosParaSearchParams({
      ...FILTROS_VAZIOS,
      agencia: "Agência Alfa",
      periodoInicio: "2026-01-01",
    });
    expect(params.get("agencia")).toBe("Agência Alfa");
    expect(params.get("periodo_inicio")).toBe("2026-01-01");
    expect(params.get("executivo")).toBeNull();
  });
});

describe("searchParamsParaFiltros", () => {
  it("retorna filtros vazios quando a query string está vazia", () => {
    const filtros = searchParamsParaFiltros(new URLSearchParams(""));
    expect(filtros).toEqual(FILTROS_VAZIOS);
  });

  it("faz o round-trip completo (serializar e desserializar)", () => {
    const original: typeof FILTROS_VAZIOS = {
      ...FILTROS_VAZIOS,
      agencia: "Agência Alfa",
      executivo: "Executivo A",
      cia: "JJ",
      nacionalInternacional: "internacional",
    };
    const params = filtrosParaSearchParams(original);
    const restaurado = searchParamsParaFiltros(params);
    expect(restaurado).toEqual(original);
  });

  it("ignora valor inválido de nacionalInternacional", () => {
    const filtros = searchParamsParaFiltros(new URLSearchParams("nac_int=invalido"));
    expect(filtros.nacionalInternacional).toBeNull();
  });
});
