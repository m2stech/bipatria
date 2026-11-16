import type { ReactNode } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
  UnavailableState,
} from "@/components/states/data-states";
import { cn } from "@/lib/utils";

export type DataStatus = "ready" | "loading" | "error" | "empty" | "unavailable";

type DataStateSlotProps = {
  status: DataStatus;
  lastValidLoad?: Date | string | null;
  children?: ReactNode;
};

export function DataStateSlot({ status, lastValidLoad, children }: DataStateSlotProps) {
  switch (status) {
    case "loading":
      return <LoadingState />;
    case "error":
      return <ErrorState />;
    case "empty":
      return <EmptyState />;
    case "unavailable":
      return <UnavailableState lastValidLoad={lastValidLoad} />;
    default:
      return <>{children}</>;
  }
}

type VisualContainerProps = DataStateSlotProps & {
  title: string;
  className?: string;
};

export function VisualContainer({
  title,
  status,
  lastValidLoad,
  className,
  children,
}: VisualContainerProps) {
  return (
    <section
      aria-label={title}
      aria-busy={status === "loading"}
      className={cn(
        "bg-card text-card-foreground flex flex-col rounded-lg border shadow-xs",
        className,
      )}
    >
      <h2 className="text-brand-purple px-3 pt-2 text-sm font-bold">{title}</h2>
      <div className="min-h-0 flex-1 overflow-auto p-3">
        <DataStateSlot status={status} lastValidLoad={lastValidLoad}>
          {children}
        </DataStateSlot>
      </div>
    </section>
  );
}

type IndicatorCardProps = {
  label: string;
  value?: string;
  status?: DataStatus;
  lastValidLoad?: Date | string | null;
  className?: string;
};

export function IndicatorCard({
  label,
  value,
  status = "ready",
  lastValidLoad,
  className,
}: IndicatorCardProps) {
  return (
    <section
      aria-label={label}
      aria-busy={status === "loading"}
      className={cn(
        "bg-card text-card-foreground flex min-w-40 flex-col gap-1 rounded-lg border p-3 shadow-xs",
        className,
      )}
    >
      <h2 className="text-muted-foreground text-xs font-bold">{label}</h2>
      <DataStateSlot status={status} lastValidLoad={lastValidLoad}>
        <p className="text-brand-purple text-2xl font-bold">{value ?? "—"}</p>
      </DataStateSlot>
    </section>
  );
}
