"use client";

import { Suspense } from "react";

import { RechartsBarChart } from "@/components/charts/recharts-bar-chart";
import { RechartsDonutChart } from "@/components/charts/recharts-donut-chart";
import { TanstackSalesMatrix } from "@/components/matrix/tanstack-sales-matrix";

import { ciasBarData, domInterData, vendasMatrixData } from "./fixtures";

const chartColors = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

// Rota interna de demonstração (M2), não faz parte da navegação de produto.
// ECharts e Material React Table foram avaliados e descartados — ver
// docs/adr/0001-biblioteca-de-visuais.md e docs/adr/evidencias/0001-chart-prototype.png
// para a comparação completa com as 4 candidatas.
export default function ChartPrototypePage() {
  return (
    <main className="mx-auto max-w-6xl space-y-10 p-6">
      <header className="space-y-1">
        <h1 className="text-brand-purple text-xl font-bold">
          Wrappers de visuais escolhidos (M2) — Recharts + TanStack Table
        </h1>
        <p className="text-muted-foreground text-sm">
          Ver decisão e comparação com ECharts/Material React Table em{" "}
          <code>docs/adr/0001-biblioteca-de-visuais.md</code>.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Gráfico de barras — Cias</h2>
        <div className="rounded-lg border p-4">
          <RechartsBarChart
            data={ciasBarData}
            categoryKey="cia"
            series={[
              { key: "tarifa", label: "Tarifa", color: chartColors[0] },
              { key: "rentabilidade", label: "Rentabilidade", color: chartColors[1] },
            ]}
            valueFormat="currency-compact"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Rosca — Doméstico/Internacional</h2>
        <div className="rounded-lg border p-4">
          <RechartsDonutChart
            data={domInterData.map((d) => ({ name: d.categoria, value: d.bilhetes }))}
            colors={chartColors}
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">Barras com rótulo de valor</h2>
        <p className="text-muted-foreground text-sm">
          Valor total acima de cada barra via <code>&lt;LabelList&gt;</code>, nativo do Recharts.
        </p>
        <div className="rounded-lg border p-4">
          <RechartsBarChart
            data={ciasBarData}
            categoryKey="cia"
            series={[{ key: "tarifa", label: "Tarifa", color: chartColors[0] }]}
            valueFormat="currency-compact"
            showValueLabels
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold">
          Matriz com hierarquia e subtotais — Executivo → Mês → Cia
        </h2>
        <p className="text-muted-foreground text-sm">
          Espelha o <code>pivotTable</code> &quot;Cias aéreas&quot; da página Vendas do Aéreo
          (promotor_003 → hierarquia de datas → cia). Diego Alves simula um executivo sem permissão
          de rentabilidade: o subtotal do grupo deve mostrar “—”, nunca R$ 0,00.
        </p>
        <div className="rounded-lg border p-4">
          <Suspense fallback={<p className="text-muted-foreground text-sm">Carregando…</p>}>
            <TanstackSalesMatrix rows={vendasMatrixData} />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
