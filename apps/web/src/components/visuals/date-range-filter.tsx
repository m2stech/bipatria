"use client";

// Filtro de calendário (M3/M4): seleciona o intervalo de datas de emissão (periodoInicio/
// periodoFim em FiltrosVendas). É só um filtro de dados — não é módulo de agenda.
import { CalendarIcon } from "lucide-react";
import { useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDate } from "@/lib/format";

type DateRangeFilterProps = {
  periodoInicio: string | null;
  periodoFim: string | null;
  onChange: (periodoInicio: string | null, periodoFim: string | null) => void;
};

function parseIso(value: string | null): Date | undefined {
  if (value == null) return undefined;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function toIso(date: Date | undefined): string | null {
  if (date == null) return null;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DateRangeFilter({ periodoInicio, periodoFim, onChange }: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);
  const selected: DateRange | undefined =
    periodoInicio == null && periodoFim == null
      ? undefined
      : { from: parseIso(periodoInicio), to: parseIso(periodoFim) };

  const label =
    periodoInicio == null && periodoFim == null
      ? "Período"
      : `${formatDate(periodoInicio)} – ${formatDate(periodoFim)}`;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button variant="outline">
            <CalendarIcon aria-hidden="true" data-icon="inline-start" />
            {label}
          </Button>
        }
      />
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="range"
          selected={selected}
          defaultMonth={selected?.from}
          numberOfMonths={2}
          onSelect={(range) => onChange(toIso(range?.from), toIso(range?.to))}
        />
      </PopoverContent>
    </Popover>
  );
}
