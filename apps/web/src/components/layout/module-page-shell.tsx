import Image from "next/image";

import { AppHeader, SideNav } from "@/components/layout/app-shell";
import { PageCanvas } from "@/components/layout/page-canvas";
import { UnavailableState } from "@/components/states/data-states";
import { COVER_SLUG, type ModuleDefinition, type PageDefinition } from "@/lib/navigation";

type ModulePageShellProps = {
  currentModule: ModuleDefinition;
  currentPage: PageDefinition;
};

export function ModulePageShell({ currentModule, currentPage }: ModulePageShellProps) {
  const isCover = currentPage.slug === COVER_SLUG;

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader
        moduleSlug={currentModule.slug}
        pageLabel={`${currentModule.label} — ${currentPage.label}`}
      />
      <div className="flex min-h-0 flex-1 flex-col md:flex-row">
        <SideNav currentModule={currentModule} activePage={currentPage.slug} />
        <main className="min-w-0 flex-1 p-2 md:p-3">
          <PageCanvas layout={currentPage.layout} label={currentPage.label}>
            {isCover ? (
              <Image
                src="/brand/capa.png"
                alt="Capa Pátria"
                fill
                priority
                sizes="(min-width: 768px) 1920px, 100vw"
                className="object-cover object-bottom"
              />
            ) : (
              <div className="flex h-[800px] items-center justify-center">
                <UnavailableState
                  title={currentPage.label}
                  description="Conteúdo desta página será implementado nas próximas milestones."
                />
              </div>
            )}
          </PageCanvas>
        </main>
      </div>
    </div>
  );
}
