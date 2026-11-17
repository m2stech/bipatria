// Contrato de acesso a dados. A UI depende só desta interface — a troca de mock por Supabase
// (M11) não deve exigir mudanças nos componentes de página.
import type { AgenciaAereo, CiaAereo, MetaPromotorAereo, VendaAereo } from "../domain/aereo";
import type { AgenciaTerrestre, MetaPromotorTerrestre, VendaTerrestre } from "../domain/terrestre";
import type { VendaGrupo, VendaOperadora } from "../domain/operadora";
import type { FiltrosVendas } from "./filtros";

export type DataSource = {
  getVendasAereo(filtros: FiltrosVendas): Promise<VendaAereo[]>;
  getAgenciasAereo(): Promise<AgenciaAereo[]>;
  getCiasAereo(): Promise<CiaAereo[]>;
  getMetasPromotorAereo(): Promise<MetaPromotorAereo[]>;

  getVendasTerrestre(filtros: FiltrosVendas): Promise<VendaTerrestre[]>;
  getAgenciasTerrestre(): Promise<AgenciaTerrestre[]>;
  getMetasPromotorTerrestre(): Promise<MetaPromotorTerrestre[]>;

  getVendasOperadora(filtros: FiltrosVendas): Promise<VendaOperadora[]>;
  getVendasGrupos(filtros: FiltrosVendas): Promise<VendaGrupo[]>;
};
