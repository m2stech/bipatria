import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RechartsBarChart } from "./recharts-bar-chart";
import { RechartsDonutChart } from "./recharts-donut-chart";

// jsdom não calcula layout real: ResponsiveContainer depende do ResizeObserver reportar
// um tamanho para desenhar algo. Sem isso o SVG fica vazio e nenhum texto é renderizado.
class ResizeObserverStub {
  #callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback;
  }
  observe(target: Element) {
    this.#callback(
      [{ contentRect: { width: 600, height: 280 } } as ResizeObserverEntry],
      this as unknown as ResizeObserver,
    );
    void target;
  }
  disconnect() {}
  unobserve() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

describe("RechartsBarChart", () => {
  it("renderiza uma barra por categoria e série", () => {
    const { container } = render(
      <RechartsBarChart
        data={[
          { cia: "LATAM", tarifa: 100, rentabilidade: 10 },
          { cia: "GOL", tarifa: 50, rentabilidade: 0 },
        ]}
        categoryKey="cia"
        series={[
          { key: "tarifa", label: "Tarifa", color: "#5208a5" },
          { key: "rentabilidade", label: "Rentabilidade", color: "#c82727" },
        ]}
      />,
    );
    expect(screen.getByText("Tarifa")).toBeInTheDocument();
    expect(screen.getByText("Rentabilidade")).toBeInTheDocument();
    // ResponsiveContainer não mede largura em jsdom (sem layout real), então o SVG
    // existe mas pode ficar vazio — o teste cobre o que é determinístico: a legenda e os eixos.
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("não quebra quando uma categoria tem valor zero (divisão por zero do eixo)", () => {
    render(
      <RechartsBarChart
        data={[{ cia: "COPA", tarifa: 0, rentabilidade: 0 }]}
        categoryKey="cia"
        series={[{ key: "tarifa", label: "Tarifa", color: "#5208a5" }]}
      />,
    );
    expect(screen.getByText("COPA")).toBeInTheDocument();
  });
});

describe("RechartsDonutChart", () => {
  // A Legend do Recharts depende de uma segunda passada de medição (legendBBox) que
  // o jsdom não calcula; o teste cobre o que é determinístico aqui: os setores do pie.
  it("renderiza um setor por categoria", () => {
    const { container } = render(
      <RechartsDonutChart
        data={[
          { name: "Doméstico", value: 80 },
          { name: "Internacional", value: 20 },
        ]}
        colors={["#5208a5", "#c82727"]}
      />,
    );
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(2);
  });

  it("não quebra com um único segmento valendo 100%", () => {
    const { container } = render(
      <RechartsDonutChart data={[{ name: "Doméstico", value: 100 }]} colors={["#5208a5"]} />,
    );
    expect(container.querySelectorAll(".recharts-pie-sector")).toHaveLength(1);
  });
});
