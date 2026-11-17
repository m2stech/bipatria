// Fixtures sintéticas determinísticas do Aéreo. Sem dados reais de clientes — nomes e códigos
// são fictícios. Inclui casos de borda citados no PLAN.md M3: nulos, tarifa zero, data inconsistente.
import type { AgenciaAereo, CiaAereo, MetaPromotorAereo, VendaAereo } from "../../domain/aereo";
import { createPrng, floatBetween, intBetween, isoDateBetween, pickFrom } from "./prng";

const SEED_AEREO = 20261117;

const AGENCIAS = [
  "Agência Alfa",
  "Agência Beta",
  "Agência Gama",
  "Agência Delta",
  "Agência Épsilon",
];
const EXECUTIVOS = ["Executivo A", "Executivo B", "Executivo C"];
const REDES = ["Rede Norte", "Rede Sul", "Sem rede"];
const CIAS = ["JJ", "G3", "AD", "LA"];
const PRODUTOS = ["Aéreo Nacional", "Aéreo Internacional"];
const FORNECEDORES = ["Fornecedor 1", "Fornecedor 2", "Fornecedor 3"];
const SISTEMAS = ["Sabre", "Amadeus"];
const CABINES = ["Econômica", "Executiva", "Primeira"];
const ORIGENS = ["GRU", "GIG", "CNF", "BSB"];
const DESTINOS = ["MIA", "LIS", "EZE", "SSA"];
const FILIAIS = ["Matriz", "Filial RJ", "Filial MG"];

export function gerarVendasAereoMock(quantidade = 300): VendaAereo[] {
  const rng = createPrng(SEED_AEREO);
  const vendas: VendaAereo[] = [];

  for (let i = 0; i < quantidade; i++) {
    const tktCodigo = intBetween(rng, 100000, 100000 + Math.floor(quantidade / 3));
    const dataEmissao = isoDateBetween(rng, "2026-01-01", "2026-11-17");

    // Casos de borda: ~5% sem data de embarque, ~3% com embarque antes da emissão (inconsistente)
    const bordaEmbarque = rng();
    let dataEmbarque: string | null;
    if (bordaEmbarque < 0.05) {
      dataEmbarque = null;
    } else if (bordaEmbarque < 0.08) {
      dataEmbarque = isoDateBetween(rng, "2025-06-01", dataEmissao);
    } else {
      dataEmbarque = isoDateBetween(rng, dataEmissao, "2027-03-01");
    }

    // ~4% com tarifa zero (divisão por zero em ticket médio/rentabilidade)
    const tarifaZero = rng() < 0.04;
    const tarifa = tarifaZero ? 0 : floatBetween(rng, 300, 8000);
    const rentabilidade = tarifaZero ? 0 : floatBetween(rng, -200, 1200);

    vendas.push({
      nomeDaOrigem: "BI.xlsx",
      vendaid: 1_000_000 + i,
      clienteCodigo: pickFrom(rng, AGENCIAS),
      fornecedorCodigo: pickFrom(rng, FORNECEDORES),
      subproduto: pickFrom(rng, PRODUTOS),
      localizador: `LOC${intBetween(rng, 10000, 99999)}`,
      tktCodigo,
      dataEmissao,
      tarifaNet: tarifa * 0.9,
      tarifa,
      taxaEmbarque: tarifaZero ? 0 : floatBetween(rng, 20, 150),
      taxaTurismo: 0,
      taxaExtra: 0,
      taxaServico: 0,
      taxaDu: 0,
      taxaCartao: 0,
      fee: floatBetween(rng, 0, 50),
      descontoCliente: 0,
      multaReemissao: 0,
      multaReembolso: 0,
      valorVenda: tarifa,
      saldoCliente: 0,
      saldoFornecedor: 0,
      saldoCartao: 0,
      rentabilidade,
      qtdFornecedor: 1,
      filialCodigo: pickFrom(rng, FILIAIS),
      produto: pickFrom(rng, PRODUTOS),
      emissor: pickFrom(rng, EXECUTIVOS),
      promotorCodigo: pickFrom(rng, EXECUTIVOS),
      passageiro: `Passageiro ${i + 1}`,
      tipoDeViagemCodigo: pickFrom(rng, ["OW", "RT"]),
      numeroVenda: i + 1,
      cliente: pickFrom(rng, AGENCIAS),
      cia: pickFrom(rng, CIAS),
      ciaAjustada: pickFrom(rng, CIAS),
      cnpj: intBetween(rng, 10000000000000, 99999999999999),
      dataEmbarque,
      filial: pickFrom(rng, FILIAIS),
      fornecedor: pickFrom(rng, FORNECEDORES),
      markup: floatBetween(rng, 0, 100),
      pax: `Pax ${i + 1}`,
      promotor: pickFrom(rng, EXECUTIVOS),
      tipo: "Emissão",
      sistema: pickFrom(rng, SISTEMAS),
      formaDePagamento: pickFrom(rng, ["INV", "FATURADO"]),
      formaDeRecebimento: pickFrom(rng, ["INV", "FATURADO"]),
      trecho: `${pickFrom(rng, ORIGENS)}-${pickFrom(rng, DESTINOS)}`,
      viagemGlobal: `VG${intBetween(rng, 1000, 9999)}`,
      origem: pickFrom(rng, ORIGENS),
      destinoFinal: pickFrom(rng, DESTINOS),
      redes: pickFrom(rng, REDES),
      owRt: pickFrom(rng, ["OW", "RT"]),
      chaveUnicidade: `CU${i}`,
      diaSemanaCompra: pickFrom(rng, [
        "Domingo",
        "Segunda-feira",
        "Terça-feira",
        "Quarta-feira",
        "Quinta-feira",
        "Sexta-feira",
        "Sábado",
      ]),
      rota: `${pickFrom(rng, ORIGENS)} - ${pickFrom(rng, DESTINOS)}`,
      cabine: pickFrom(rng, CABINES),
      cbn: pickFrom(rng, ["Y", "C", "F"]),
      ciaSubProduto: pickFrom(rng, CIAS),
    });
  }

  return vendas;
}

export function gerarAgenciasAereoMock(): AgenciaAereo[] {
  const rng = createPrng(SEED_AEREO + 1);
  return AGENCIAS.map((agencia) => ({
    agencia,
    executivo: pickFrom(rng, EXECUTIVOS),
    redes: pickFrom(rng, REDES),
    ultimaCompra: isoDateBetween(rng, "2026-06-01", "2026-11-17"),
    valorVendaUltimaCompra: floatBetween(rng, 500, 5000),
    rentabilidadeUltimaCompra: floatBetween(rng, -50, 500),
    estado: pickFrom(rng, ["SP", "RJ", "MG", null]),
    cidade: pickFrom(rng, ["São Paulo", "Rio de Janeiro", "Belo Horizonte", null]),
  }));
}

export function gerarCiasAereoMock(): CiaAereo[] {
  return CIAS.map((cia) => ({
    cia,
    icao: cia,
    airline: `Companhia ${cia}`,
    callSign: cia,
    countryRegion: "Brasil",
  }));
}

export function gerarMetasPromotorAereoMock(): MetaPromotorAereo[] {
  const rng = createPrng(SEED_AEREO + 2);
  return EXECUTIVOS.map((promotor) => ({
    promotor,
    mes: "2026-11-01",
    meta: floatBetween(rng, 10000, 50000),
  }));
}
