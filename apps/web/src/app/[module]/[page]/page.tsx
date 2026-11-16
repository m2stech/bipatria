import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ModulePageShell } from "@/components/layout/module-page-shell";
import { getModule, getPage, MODULES } from "@/lib/navigation";

export function generateStaticParams() {
  return MODULES.flatMap((m) => m.pages.map((p) => ({ module: m.slug, page: p.slug })));
}

export async function generateMetadata(props: PageProps<"/[module]/[page]">): Promise<Metadata> {
  const { module: moduleSlug, page: pageSlug } = await props.params;
  const currentModule = getModule(moduleSlug);
  const currentPage = getPage(moduleSlug, pageSlug);
  if (!currentModule || !currentPage) return {};
  return { title: `${currentPage.label} · ${currentModule.label}` };
}

export default async function ModulePage(props: PageProps<"/[module]/[page]">) {
  const { module: moduleSlug, page: pageSlug } = await props.params;
  const currentModule = getModule(moduleSlug);
  const currentPage = getPage(moduleSlug, pageSlug);
  if (!currentModule || !currentPage) notFound();

  return <ModulePageShell currentModule={currentModule} currentPage={currentPage} />;
}
