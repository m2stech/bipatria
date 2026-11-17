"use client";

// Estado de filtros com a URL como fonte de verdade (sem dependência externa — useSearchParams/
// useRouter nativos do Next). Cada módulo/página usa este hook; a troca de mock por dados reais
// (M11) não deve exigir mudanças aqui.
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import { FILTROS_VAZIOS, type FiltrosVendas } from "../data/filtros";
import { filtrosParaSearchParams, searchParamsParaFiltros } from "./query-params";

export function useFiltrosVendas() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const filtros = useMemo(() => searchParamsParaFiltros(searchParams), [searchParams]);

  const definirFiltros = useCallback(
    (proximosFiltros: Partial<FiltrosVendas>) => {
      const params = filtrosParaSearchParams({ ...filtros, ...proximosFiltros });
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
    },
    [filtros, pathname, router],
  );

  const limparFiltros = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [pathname, router]);

  const temFiltrosAtivos = useMemo(
    () => Object.values(filtros).some((valor) => valor !== null),
    [filtros],
  );

  return {
    filtros: filtros satisfies FiltrosVendas,
    definirFiltros,
    limparFiltros,
    temFiltrosAtivos,
  };
}

export { FILTROS_VAZIOS };
