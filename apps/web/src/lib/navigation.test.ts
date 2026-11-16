import { describe, expect, it } from "vitest";

import { COVER_SLUG, getModule, getPage, MODULES, pageHref } from "@/lib/navigation";
import { formatDate } from "@/lib/format";

describe("navigation", () => {
  it("expõe os três módulos com a capa como primeira página", () => {
    expect(MODULES.map((m) => m.slug)).toEqual(["aereo", "terrestre", "operadora"]);
    for (const m of MODULES) expect(m.pages[0].slug).toBe(COVER_SLUG);
  });

  it("não repete slugs dentro de um módulo", () => {
    for (const m of MODULES) {
      const slugs = m.pages.map((p) => p.slug);
      expect(new Set(slugs).size).toBe(slugs.length);
    }
  });

  it("inclui páginas específicas por módulo e omite a duplicata de Executivos", () => {
    expect(getPage("aereo", "xray")?.layout).toBe("xray");
    expect(getPage("terrestre", "produtos")).toBeDefined();
    expect(getPage("operadora", "produtos-x-grupos")).toBeDefined();
    expect(getPage("terrestre", "xray")).toBeUndefined();
    expect(MODULES.flatMap((m) => m.pages).some((p) => /duplicata/i.test(p.label))).toBe(false);
  });

  it("resolve módulo e href", () => {
    expect(getModule("inexistente")).toBeUndefined();
    expect(pageHref("aereo", "vendas")).toBe("/aereo/vendas");
  });
});

describe("formatDate", () => {
  it("formata em dd/MM/yyyy", () => {
    expect(formatDate("2026-11-05T00:00:00Z")).toBe("05/11/2026");
  });

  it("devolve traço para valor ausente ou inválido", () => {
    expect(formatDate(null)).toBe("—");
    expect(formatDate("não é data")).toBe("—");
  });
});
