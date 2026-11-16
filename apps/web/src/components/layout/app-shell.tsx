import Image from "next/image";
import Link from "next/link";

import { PageIcon } from "@/components/layout/page-icon";
import { cn } from "@/lib/utils";
import { COVER_SLUG, MODULES, pageHref, type ModuleDefinition } from "@/lib/navigation";

type SideNavProps = {
  currentModule: ModuleDefinition;
  activePage: string;
};

export function SideNav({ currentModule, activePage }: SideNavProps) {
  return (
    <nav
      aria-label={`Páginas de ${currentModule.label}`}
      className="bg-sidebar flex shrink-0 gap-2 overflow-x-auto p-2 md:w-[88px] md:flex-col md:items-center md:overflow-y-auto md:py-3"
    >
      {currentModule.pages.map((p) => {
        const active = p.slug === activePage;
        return (
          <Link
            key={p.slug}
            href={pageHref(currentModule.slug, p.slug)}
            aria-current={active ? "page" : undefined}
            title={p.label}
            className={cn(
              "group flex w-[72px] shrink-0 flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-center text-[10px] leading-tight font-bold text-white outline-none",
              "focus-visible:ring-brand-orange focus-visible:ring-3",
              active ? "bg-brand-purple" : "hover:bg-white/15",
            )}
          >
            <span className="bg-brand-pink flex size-11 items-center justify-center rounded-lg">
              <PageIcon icon={p.icon} size={32} />
            </span>
            <span>{p.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

type AppHeaderProps = {
  moduleSlug?: string;
  pageLabel?: string;
};

export function AppHeader({ moduleSlug, pageLabel }: AppHeaderProps) {
  return (
    <header className="bg-brand-red flex flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2 text-white">
      <Link
        href="/"
        aria-label="Início — BI Pátria"
        className="focus-visible:ring-brand-orange rounded-md outline-none focus-visible:ring-3"
      >
        <Image src="/brand/logo-patria-claro.png" alt="Pátria" width={64} height={64} priority />
      </Link>

      <nav aria-label="Módulos" className="flex gap-1">
        {MODULES.map((m) => (
          <Link
            key={m.slug}
            href={pageHref(m.slug, COVER_SLUG)}
            aria-current={m.slug === moduleSlug ? "true" : undefined}
            className={cn(
              "focus-visible:ring-brand-orange rounded-md px-3 py-1.5 text-sm font-bold outline-none focus-visible:ring-3",
              m.slug === moduleSlug ? "bg-brand-purple" : "hover:bg-white/15",
            )}
          >
            {m.label}
          </Link>
        ))}
      </nav>

      {pageLabel ? <h1 className="text-base font-bold md:text-lg">{pageLabel}</h1> : null}

      <div className="ml-auto flex items-center gap-3 text-sm">
        <Link href="/admin" className="underline-offset-4 hover:underline">
          Administração
        </Link>
        <Link href="/login" className="underline-offset-4 hover:underline">
          Entrar
        </Link>
      </div>
    </header>
  );
}
