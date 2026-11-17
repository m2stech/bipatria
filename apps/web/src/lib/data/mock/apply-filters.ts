// Aplica os filtros comuns (FiltrosVendas) sobre qualquer lista de vendas com o shape mínimo
// necessário. Compartilhado entre os três domínios porque os NOMES de campo de filtro são iguais
// (agência, executivo, rede, etc.) mesmo quando os tipos de domínio completos diferem.
import type { FiltrosVendas } from "../filtros";

type VendaFiltravel = {
  dataEmissao?: string | null;
  cliente?: string;
  clienteCodigo?: string;
  promotor?: string;
  promotorCodigo?: string;
  redes?: string;
  cia?: string;
  filial?: string;
  origem?: string;
  destinoFinal?: string;
  sistema?: string;
  produto?: string;
  fornecedor?: string;
  cabine?: string;
};

export function aplicarFiltrosVendas<T extends VendaFiltravel>(
  vendas: readonly T[],
  filtros: FiltrosVendas,
): T[] {
  return vendas.filter((venda) => {
    if (filtros.periodoInicio && venda.dataEmissao && venda.dataEmissao < filtros.periodoInicio) {
      return false;
    }
    if (filtros.periodoFim && venda.dataEmissao && venda.dataEmissao > filtros.periodoFim) {
      return false;
    }
    if (
      filtros.agencia &&
      venda.cliente !== filtros.agencia &&
      venda.clienteCodigo !== filtros.agencia
    ) {
      return false;
    }
    if (
      filtros.executivo &&
      venda.promotor !== filtros.executivo &&
      venda.promotorCodigo !== filtros.executivo
    ) {
      return false;
    }
    if (filtros.rede && venda.redes !== filtros.rede) return false;
    if (filtros.cia && venda.cia !== filtros.cia) return false;
    if (filtros.filial && venda.filial !== filtros.filial) return false;
    if (filtros.origem && venda.origem !== filtros.origem) return false;
    if (filtros.destino && venda.destinoFinal !== filtros.destino) return false;
    if (filtros.sistema && venda.sistema !== filtros.sistema) return false;
    if (filtros.produto && venda.produto !== filtros.produto) return false;
    if (filtros.fornecedor && venda.fornecedor !== filtros.fornecedor) return false;
    if (filtros.cabine && venda.cabine !== filtros.cabine) return false;
    return true;
  });
}
