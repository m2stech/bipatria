// Implementação mock do DataSource — único ponto que a UI deve importar durante M3–M10.
// A troca pela implementação real do Supabase (M11) substitui apenas este arquivo.
import type { DataSource } from "../data-source";
import type { FiltrosVendas } from "../filtros";
import { aplicarFiltrosVendas } from "./apply-filters";
import {
  gerarAgenciasAereoMock,
  gerarCiasAereoMock,
  gerarMetasPromotorAereoMock,
  gerarVendasAereoMock,
} from "./fixtures-aereo";
import {
  gerarAgenciasTerrestreMock,
  gerarMetasPromotorTerrestreMock,
  gerarVendasTerrestreMock,
} from "./fixtures-terrestre";
import { gerarVendasGruposMock, gerarVendasOperadoraMock } from "./fixtures-operadora";

// Geradas uma vez por processo (determinísticas) para evitar recomputar a cada chamada.
const vendasAereo = gerarVendasAereoMock();
const agenciasAereo = gerarAgenciasAereoMock();
const ciasAereo = gerarCiasAereoMock();
const metasAereo = gerarMetasPromotorAereoMock();

const vendasTerrestre = gerarVendasTerrestreMock();
const agenciasTerrestre = gerarAgenciasTerrestreMock();
const metasTerrestre = gerarMetasPromotorTerrestreMock();

const vendasOperadora = gerarVendasOperadoraMock();
const vendasGrupos = gerarVendasGruposMock();

export const mockDataSource: DataSource = {
  async getVendasAereo(filtros: FiltrosVendas) {
    return aplicarFiltrosVendas(vendasAereo, filtros);
  },
  async getAgenciasAereo() {
    return agenciasAereo;
  },
  async getCiasAereo() {
    return ciasAereo;
  },
  async getMetasPromotorAereo() {
    return metasAereo;
  },

  async getVendasTerrestre(filtros: FiltrosVendas) {
    return aplicarFiltrosVendas(vendasTerrestre, filtros);
  },
  async getAgenciasTerrestre() {
    return agenciasTerrestre;
  },
  async getMetasPromotorTerrestre() {
    return metasTerrestre;
  },

  async getVendasOperadora(filtros: FiltrosVendas) {
    return aplicarFiltrosVendas(vendasOperadora, filtros);
  },
  async getVendasGrupos(filtros: FiltrosVendas) {
    return aplicarFiltrosVendas(vendasGrupos, filtros);
  },
};
