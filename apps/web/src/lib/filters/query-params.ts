// Serialização pura (sem React) entre FiltrosVendas e URLSearchParams — testável isoladamente
// e reaproveitada tanto pelo hook de cliente quanto por eventuais leituras no servidor.
import { FILTROS_VAZIOS, type FiltrosVendas } from "../data/filtros";

const CHAVES_FILTRO: Record<keyof FiltrosVendas, string> = {
  periodoInicio: "periodo_inicio",
  periodoFim: "periodo_fim",
  agencia: "agencia",
  executivo: "executivo",
  rede: "rede",
  mentoria: "mentoria",
  cia: "cia",
  filial: "filial",
  nacionalInternacional: "nac_int",
  origem: "origem",
  destino: "destino",
  sistema: "sistema",
  produto: "produto",
  fornecedor: "fornecedor",
  cabine: "cabine",
};

export function filtrosParaSearchParams(filtros: FiltrosVendas): URLSearchParams {
  const params = new URLSearchParams();
  for (const [chaveFiltro, chaveUrl] of Object.entries(CHAVES_FILTRO) as [
    keyof FiltrosVendas,
    string,
  ][]) {
    const valor = filtros[chaveFiltro];
    if (valor != null) params.set(chaveUrl, valor);
  }
  return params;
}

export function searchParamsParaFiltros(params: URLSearchParams): FiltrosVendas {
  const filtros = { ...FILTROS_VAZIOS };
  for (const [chaveFiltro, chaveUrl] of Object.entries(CHAVES_FILTRO) as [
    keyof FiltrosVendas,
    string,
  ][]) {
    const valor = params.get(chaveUrl);
    if (valor != null) {
      // nacionalInternacional é o único campo com domínio restrito; demais são string livre.
      if (chaveFiltro === "nacionalInternacional") {
        filtros.nacionalInternacional =
          valor === "nacional" || valor === "internacional" ? valor : null;
      } else {
        (filtros as Record<string, string | null>)[chaveFiltro] = valor;
      }
    }
  }
  return filtros;
}
