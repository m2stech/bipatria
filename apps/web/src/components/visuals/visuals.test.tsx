import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ClearFiltersButton } from "@/components/visuals/clear-filters-button";
import { IndicatorCard, VisualContainer } from "@/components/visuals/visuals";
import { UnavailableState } from "@/components/states/data-states";

describe("estados de dados", () => {
  it("VisualContainer mostra cada estado em vez do conteúdo", () => {
    const { rerender } = render(
      <VisualContainer title="Vendas" status="loading">
        <p>conteúdo</p>
      </VisualContainer>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Carregando dados");
    expect(screen.queryByText("conteúdo")).not.toBeInTheDocument();

    rerender(
      <VisualContainer title="Vendas" status="error">
        <p>conteúdo</p>
      </VisualContainer>,
    );
    expect(screen.getByRole("alert")).toHaveTextContent("Não foi possível carregar");

    rerender(
      <VisualContainer title="Vendas" status="empty">
        <p>conteúdo</p>
      </VisualContainer>,
    );
    expect(screen.getByRole("status")).toHaveTextContent("Sem resultados");

    rerender(
      <VisualContainer title="Vendas" status="ready">
        <p>conteúdo</p>
      </VisualContainer>,
    );
    expect(screen.getByText("conteúdo")).toBeInTheDocument();
  });

  it("UnavailableState exibe a data da última carga válida", () => {
    render(<UnavailableState lastValidLoad="2026-10-31T00:00:00Z" />);
    expect(screen.getByRole("status")).toHaveTextContent("Última carga válida: 31/10/2026");
  });

  it("IndicatorCard mostra o valor quando pronto e traço sem valor", () => {
    const { rerender } = render(<IndicatorCard label="Total" value="R$ 1,00" />);
    expect(screen.getByText("R$ 1,00")).toBeInTheDocument();
    rerender(<IndicatorCard label="Total" />);
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("ClearFiltersButton tem rótulo padrão em pt-BR", () => {
    render(<ClearFiltersButton />);
    expect(screen.getByRole("button", { name: "Limpar filtros" })).toBeInTheDocument();
  });
});
