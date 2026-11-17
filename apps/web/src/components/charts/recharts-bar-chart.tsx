"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type BarSeries = {
  key: string;
  label: string;
  color: string;
};

export type ValueFormat = "currency-compact" | "integer";

type RechartsBarChartProps = {
  data: Record<string, unknown>[];
  categoryKey: string;
  series: BarSeries[];
  valueFormat?: ValueFormat;
  /** Mostra o valor de cada barra acima dela, como nos relatórios de referência. */
  showValueLabels?: boolean;
};

const formatters: Record<ValueFormat, (value: number) => string> = {
  "currency-compact": (value) =>
    new Intl.NumberFormat("pt-BR", { notation: "compact", compactDisplay: "short" }).format(value),
  integer: (value) => new Intl.NumberFormat("pt-BR").format(value),
};

export function RechartsBarChart({
  data,
  categoryKey,
  series,
  valueFormat,
  showValueLabels,
}: RechartsBarChartProps) {
  const valueFormatter = valueFormat ? formatters[valueFormat] : undefined;
  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart
        data={data}
        margin={{ top: showValueLabels ? 20 : 8, right: 8, left: 8, bottom: 8 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={categoryKey} tick={{ fontSize: 12 }} />
        <YAxis
          tick={{ fontSize: 12 }}
          tickFormatter={valueFormatter}
          width={valueFormatter ? 72 : 48}
        />
        <Tooltip
          formatter={(value) =>
            valueFormatter && typeof value === "number" ? valueFormatter(value) : value
          }
        />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {series.map((s) => (
          <Bar key={s.key} dataKey={s.key} name={s.label} fill={s.color} radius={[4, 4, 0, 0]}>
            {showValueLabels && (
              <LabelList
                dataKey={s.key}
                position="top"
                fontSize={11}
                fontWeight={600}
                formatter={(value) => {
                  if (typeof value !== "number") return "";
                  return valueFormatter ? valueFormatter(value) : String(value);
                }}
              />
            )}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
