import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DateRangeFilter } from "@/components/visuals/date-range-filter";

describe("DateRangeFilter", () => {
  it("mostra rótulo padrão quando não há período selecionado", () => {
    render(<DateRangeFilter periodoInicio={null} periodoFim={null} onChange={vi.fn()} />);
    expect(screen.getByRole("button", { name: /período/i })).toBeInTheDocument();
  });

  it("mostra o período formatado em pt-BR quando já selecionado", () => {
    render(
      <DateRangeFilter periodoInicio="2026-01-05" periodoFim="2026-01-20" onChange={vi.fn()} />,
    );
    expect(screen.getByRole("button")).toHaveTextContent("05/01/2026 – 20/01/2026");
  });

  it("abre o calendário ao clicar no gatilho", async () => {
    const user = userEvent.setup();
    render(<DateRangeFilter periodoInicio={null} periodoFim={null} onChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: /período/i }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
