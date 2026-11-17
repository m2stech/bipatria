"use client";

import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";

import type { VendasRow } from "@/app/dev/chart-prototype/fixtures";
import { cn } from "@/lib/utils";

import { sumPreservingNull } from "./aggregations";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

type Props = {
  rows: VendasRow[];
};

export function TanstackSalesMatrix({ rows }: Props) {
  const [grouping, setGrouping] = useState<string[]>(["executivo", "mes"]);
  const [expanded, setExpanded] = useState({});

  const columns = useMemo<ColumnDef<VendasRow>[]>(
    () => [
      { accessorKey: "executivo", header: "Executivo" },
      { accessorKey: "mes", header: "Mês" },
      { accessorKey: "cia", header: "Cia" },
      {
        accessorKey: "tarifa",
        header: "Tarifa",
        aggregationFn: "sum",
        cell: (info) => currency.format(info.getValue<number>()),
        aggregatedCell: (info) => currency.format(info.getValue<number>()),
      },
      {
        accessorKey: "bilhetes",
        header: "Bilhetes",
        aggregationFn: "sum",
      },
      {
        accessorKey: "rentabilidade",
        header: "Rentabilidade",
        aggregationFn: (columnId, leafRows) =>
          sumPreservingNull(leafRows.map((row) => row.getValue<number | null>(columnId))),
        cell: (info) => {
          const value = info.getValue<number | null>();
          return value === null ? "—" : currency.format(value);
        },
        aggregatedCell: (info) => {
          const value = info.getValue<number | null>();
          return value === null ? "—" : currency.format(value);
        },
      },
    ],
    [],
  );

  const table = useReactTable({
    data: rows,
    columns,
    state: { grouping, expanded },
    onGroupingChange: setGrouping,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div
      className="overflow-auto rounded-md border"
      role="table"
      aria-label="Vendas por executivo e mês"
    >
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-3 py-2 text-left font-bold">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className={cn("border-t", row.depth > 0 && "bg-background")}>
              {row.getVisibleCells().map((cell) => {
                const isGroupedCell = cell.column.getIsGrouped();
                return (
                  <td
                    key={cell.id}
                    className="px-3 py-1.5"
                    style={{ paddingLeft: isGroupedCell ? row.depth * 16 + 12 : undefined }}
                  >
                    {cell.getIsGrouped() ? (
                      <button
                        type="button"
                        onClick={row.getToggleExpandedHandler()}
                        className="flex items-center gap-1 font-bold"
                        aria-expanded={row.getIsExpanded()}
                      >
                        {row.getIsExpanded() ? (
                          <ChevronDown className="size-3.5" aria-hidden="true" />
                        ) : (
                          <ChevronRight className="size-3.5" aria-hidden="true" />
                        )}
                        {flexRender(cell.column.columnDef.cell, cell.getContext())} (
                        {row.subRows.length})
                      </button>
                    ) : cell.getIsAggregated() ? (
                      flexRender(
                        cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                        cell.getContext(),
                      )
                    ) : cell.getIsPlaceholder() ? null : (
                      flexRender(cell.column.columnDef.cell, cell.getContext())
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
