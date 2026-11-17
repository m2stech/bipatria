// Fixtures sintéticas determinísticas do Terrestre. Sem dados reais; casos de borda:
// nulos em checkin/checkout, tarifa zero.
import type {
  AgenciaTerrestre,
  MetaPromotorTerrestre,
  VendaTerrestre,
} from "../../domain/terrestre";
import { createPrng, floatBetween, intBetween, isoDateBetween, pickFrom } from "./prng";

const SEED_TERRESTRE = 20261117 + 1000;

const AGENCIAS = ["Agência Alfa", "Agência Beta", "Agência Gama", "Agência Delta"];
const EXECUTIVOS = ["Executivo A", "Executivo B", "Executivo C"];
const REDES = ["Rede Norte", "Rede Sul", "Sem rede"];
const PRODUTOS = ["Hotel", "Pacote", "Transfer"];
const FORNECEDORES = ["Fornecedor 1", "Fornecedor 2"];
const SISTEMAS = ["Sabre", "Amadeus"];
const ORIGENS = ["GRU", "GIG"];
const DESTINOS = ["MIA", "LIS"];
const FILIAIS = ["Matriz", "Filial RJ"];

export function gerarVendasTerrestreMock(quantidade = 200): VendaTerrestre[] {
  const rng = createPrng(SEED_TERRESTRE);
  const vendas: VendaTerrestre[] = [];

  for (let i = 0; i < quantidade; i++) {
    const dataEmissao = isoDateBetween(rng, "2026-01-01", "2026-11-17");

    const bordaCheckin = rng();
    let checkin: string | null;
    let checkout: string | null;
    if (bordaCheckin < 0.05) {
      checkin = null;
      checkout = null;
    } else {
      checkin = isoDateBetween(rng, dataEmissao, "2027-02-01");
      checkout = isoDateBetween(rng, checkin, "2027-03-01");
    }

    const tarifaZero = rng() < 0.04;
    const tarifa = tarifaZero ? 0 : floatBetween(rng, 200, 6000);
    const rentabilidade = tarifaZero ? 0 : floatBetween(rng, -100, 900);

    vendas.push({
      nomeDaOrigem: "BI.xlsx",
      vendaid: 2_000_000 + i,
      clienteCodigo: pickFrom(rng, AGENCIAS),
      fornecedorCodigo: pickFrom(rng, FORNECEDORES),
      subproduto: pickFrom(rng, PRODUTOS),
      localizador: `LOC${intBetween(rng, 10000, 99999)}`,
      tktCodigo: intBetween(rng, 200000, 200000 + Math.floor(quantidade / 3)),
      dataEmissao,
      tarifaNet: tarifa * 0.9,
      tarifa,
      taxaEmbarque: 0,
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
      checkin,
      checkout,
      cnpj: intBetween(rng, 10000000000000, 99999999999999),
      filial: pickFrom(rng, FILIAIS),
      fornecedor: pickFrom(rng, FORNECEDORES),
      markup: String(floatBetween(rng, 0, 100).toFixed(2)),
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
    });
  }

  return vendas;
}

export function gerarAgenciasTerrestreMock(): AgenciaTerrestre[] {
  const rng = createPrng(SEED_TERRESTRE + 1);
  return AGENCIAS.map((agencia) => ({
    agencia,
    executivo: pickFrom(rng, EXECUTIVOS),
    redes: pickFrom(rng, REDES),
    ultimaCompra: isoDateBetween(rng, "2026-06-01", "2026-11-17"),
    valorVendaUltimaCompra: floatBetween(rng, 500, 5000),
    rentabilidadeUltimaCompra: floatBetween(rng, -50, 500),
    estado: pickFrom(rng, ["SP", "RJ", null]),
    cidade: pickFrom(rng, ["São Paulo", "Rio de Janeiro", null]),
  }));
}

export function gerarMetasPromotorTerrestreMock(): MetaPromotorTerrestre[] {
  const rng = createPrng(SEED_TERRESTRE + 2);
  return EXECUTIVOS.map((promotor) => ({
    promotor,
    mes: "2026-11-01",
    meta: floatBetween(rng, 8000, 40000),
  }));
}
