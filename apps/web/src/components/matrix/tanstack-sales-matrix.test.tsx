import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { VendasRow } from "@/app/dev/chart-prototype/fixtures";

import { TanstackSalesMatrix } from "./tanstack-sales-matrix";

const rows: VendasRow[] = [
  {
    executivo: "Ana Souza",
    ano: 2026,
    mes: "jan",
    cia: "LATAM",
    tarifa: 100,
    bilhetes: 5,
    rentabilidade: 10,
  },
  {
    executivo: "Ana Souza",
    ano: 2026,
    mes: "jan",
    cia: "GOL",
    tarifa: 200,
    bilhetes: 10,
    rentabilidade: 20,
  },
  {
    executivo: "Diego Alves",
    ano: 2026,
    mes: "jan",
    cia: "LATAM",
    tarifa: 50,
    bilhetes: 2,
    rentabilidade: null,
  },
];

describe("TanstackSalesMatrix", () => {
  it("agrupa por executivo (1 subgrupo de mês) e soma tarifa no subtotal", () => {
    render(<TanstackSalesMatrix rows={rows} />);
    // Agrupamento é executivo -> mês: Ana Souza tem 2 linhas, ambas em "jan",
    // então o nível "executivo" tem 1 subRow (o grupo do mês), não 2.
    expect(screen.getByRole("button", { name: /Ana Souza.*1/ })).toBeInTheDocument();
    expect(screen.getByText("R$ 300,00")).toBeInTheDocument(); // 100 + 200
  });

  it("mostra '—' no subtotal de rentabilidade quando todo o grupo não tem permissão/dado", () => {
    render(<TanstackSalesMatrix rows={rows} />);
    const diegoRow = screen.getByRole("button", { name: /Diego Alves.*1/ }).closest("tr");
    expect(diegoRow).not.toBeNull();
    expect(diegoRow).toHaveTextContent("—");
    expect(diegoRow).not.toHaveTextContent("R$ 0,00");
  });

  it("não falha quando bilhetes é zero em alguma linha (caso de borda numérico)", () => {
    const withZero: VendasRow[] = [
      {
        executivo: "Bruno Lima",
        ano: 2026,
        mes: "jan",
        cia: "AZUL",
        tarifa: 0,
        bilhetes: 0,
        rentabilidade: 0,
      },
    ];
    render(<TanstackSalesMatrix rows={withZero} />);
    expect(screen.getByRole("button", { name: /Bruno Lima.*1/ })).toBeInTheDocument();
  });
});
