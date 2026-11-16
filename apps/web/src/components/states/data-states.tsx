import { DatabaseZap, Inbox, LoaderCircle, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";

import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

type StateShellProps = {
  icon: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  role: "status" | "alert";
  className?: string;
};

function StateShell({ icon, title, description, action, role, className }: StateShellProps) {
  return (
    <div
      role={role}
      className={cn(
        "text-muted-foreground flex min-h-32 flex-col items-center justify-center gap-2 p-4 text-center",
        className,
      )}
    >
      <div aria-hidden="true">{icon}</div>
      <p className="text-foreground text-sm font-bold">{title}</p>
      {description ? <p className="max-w-sm text-xs">{description}</p> : null}
      {action}
    </div>
  );
}

type StateProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function LoadingState({ title = "Carregando dados…", description, className }: StateProps) {
  return (
    <StateShell
      role="status"
      className={className}
      title={title}
      description={description}
      icon={<LoaderCircle className="text-brand-purple size-6 animate-spin" />}
    />
  );
}

export function ErrorState({
  title = "Não foi possível carregar os dados",
  description = "Tente novamente em instantes. Se o problema persistir, contate o administrador.",
  action,
  className,
}: StateProps) {
  return (
    <StateShell
      role="alert"
      className={className}
      title={title}
      description={description}
      action={action}
      icon={<TriangleAlert className="text-brand-red size-6" />}
    />
  );
}

export function EmptyState({
  title = "Sem resultados",
  description = "Nenhum dado para os filtros selecionados.",
  action,
  className,
}: StateProps) {
  return (
    <StateShell
      role="status"
      className={className}
      title={title}
      description={description}
      action={action}
      icon={<Inbox className="size-6" />}
    />
  );
}

type UnavailableStateProps = StateProps & {
  lastValidLoad?: Date | string | null;
};

export function UnavailableState({
  title = "Dados indisponíveis",
  description,
  lastValidLoad,
  action,
  className,
}: UnavailableStateProps) {
  const lastLoad = lastValidLoad ? `Última carga válida: ${formatDate(lastValidLoad)}.` : undefined;
  return (
    <StateShell
      role="status"
      className={className}
      title={title}
      description={[description, lastLoad].filter(Boolean).join(" ") || undefined}
      action={action}
      icon={<DatabaseZap className="text-brand-orange size-6" />}
    />
  );
}
