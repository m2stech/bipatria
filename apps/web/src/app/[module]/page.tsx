import { notFound, redirect } from "next/navigation";

import { COVER_SLUG, getModule, MODULES, pageHref } from "@/lib/navigation";

export function generateStaticParams() {
  return MODULES.map((m) => ({ module: m.slug }));
}

export default async function ModuleIndex(props: PageProps<"/[module]">) {
  const { module: moduleSlug } = await props.params;
  if (!getModule(moduleSlug)) notFound();
  redirect(pageHref(moduleSlug, COVER_SLUG));
}
