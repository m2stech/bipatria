export type ModuleSlug = "aereo" | "terrestre" | "operadora";

export type PageLayout = "standard" | "xray";

export type PageIconKey =
  | "capa"
  | "auditoria"
  | "vendas"
  | "agencias"
  | "executivos"
  | "metas"
  | "share-diario"
  | "cias"
  | "agencias-inativas"
  | "xray"
  | "produtos";

export type PageDefinition = {
  slug: string;
  label: string;
  icon: PageIconKey;
  layout: PageLayout;
};

export type ModuleDefinition = {
  slug: ModuleSlug;
  label: string;
  description: string;
  pages: readonly PageDefinition[];
};

export const CANVAS_SIZES = {
  standard: { width: 1920, height: 800 },
  xray: { width: 1600, height: 4700 },
} as const satisfies Record<PageLayout, { width: number; height: number }>;

export const COVER_SLUG = "capa";

const page = (
  slug: string,
  label: string,
  icon: PageIconKey,
  layout: PageLayout = "standard",
): PageDefinition => ({ slug, label, icon, layout });

const commonPages = [
  page(COVER_SLUG, "Capa", "capa"),
  page("auditoria-de-dados", "Auditoria de dados", "auditoria"),
  page("vendas", "Vendas", "vendas"),
  page("agencias", "Agências", "agencias"),
  page("executivos", "Executivos", "executivos"),
  page("metas", "Metas", "metas"),
  page("share-diario", "Share diário", "share-diario"),
] as const;

const [cover, audit, sales, agencies, executives, goals, dailyShare] = commonPages;

// "Duplicata de Executivos" e demais páginas ocultas/legadas ficam fora das rotas até decisão registrada.
export const MODULES: readonly ModuleDefinition[] = [
  {
    slug: "aereo",
    label: "Aéreo",
    description: "Vendas aéreas, companhias, agências e xray",
    pages: [
      cover,
      audit,
      sales,
      agencies,
      executives,
      goals,
      dailyShare,
      page("cias", "Cias", "cias"),
      page("cias-frontur", "Cias Frontur", "cias"),
      page("agencias-inativas", "Agências inativas", "agencias-inativas"),
      page("xray", "xray", "xray", "xray"),
    ],
  },
  {
    slug: "terrestre",
    label: "Terrestre",
    description: "Vendas terrestres, produtos e agências",
    pages: [
      cover,
      audit,
      sales,
      agencies,
      executives,
      goals,
      dailyShare,
      page("produtos", "Produtos", "produtos"),
      page("agencias-inativas", "Agências inativas", "agencias-inativas"),
    ],
  },
  {
    slug: "operadora",
    label: "Operadora",
    description: "Recebimentos da operadora, produtos e grupos",
    pages: [
      cover,
      audit,
      sales,
      agencies,
      executives,
      goals,
      dailyShare,
      page("produtos", "Produtos", "produtos"),
      page("produtos-x-grupos", "Produtos X Grupos", "produtos"),
    ],
  },
];

export function getModule(slug: string): ModuleDefinition | undefined {
  return MODULES.find((m) => m.slug === slug);
}

export function getPage(moduleSlug: string, pageSlug: string): PageDefinition | undefined {
  return getModule(moduleSlug)?.pages.find((p) => p.slug === pageSlug);
}

export function pageHref(moduleSlug: string, pageSlug: string): string {
  return `/${moduleSlug}/${pageSlug}`;
}
