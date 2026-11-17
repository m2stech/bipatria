import { describe, expect, it } from "vitest";

import { sumPreservingNull } from "./aggregations";

describe("sumPreservingNull", () => {
  it("soma valores numéricos normalmente", () => {
    expect(sumPreservingNull([10, 20, 30])).toBe(60);
  });

  it("trata null como 0 quando há ao menos um valor real no grupo", () => {
    expect(sumPreservingNull([10, null, 20])).toBe(30);
  });

  it("retorna null quando todo o grupo é null (sem dado/permissão), nunca 0", () => {
    expect(sumPreservingNull([null, null, null])).toBeNull();
  });

  it("soma zero real sem confundir com ausência de dado", () => {
    expect(sumPreservingNull([0, 0, 0])).toBe(0);
  });

  it("lida com lista vazia retornando null (nenhum dado para agregar)", () => {
    expect(sumPreservingNull([])).toBeNull();
  });
});
