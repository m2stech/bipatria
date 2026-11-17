// Fixtures sintéticas determinísticas da Operadora e Grupos. Sem dados reais; casos de borda:
// TotalRecebimento zero (divisão por zero na rentabilidade).
import type { VendaGrupo, VendaOperadora } from "../../domain/operadora";
import { createPrng, floatBetween, intBetween, isoDateBetween, pickFrom } from "./prng";

const SEED_OPERADORA = 20261117 + 2000;

const CLIENTES = ["Agência Alfa", "Agência Beta", "Agência Gama"];
const PROMOTORES = ["Executivo A", "Executivo B"];
const FORNECEDORES = ["Operadora 1", "Operadora 2"];
const PRODUTOS = ["Pacote", "Cruzeiro", "Ingresso"];

function gerarBaseOperadora(quantidade: number, seedOffset: number) {
  const rng = createPrng(SEED_OPERADORA + seedOffset);
  const linhas: Omit<VendaOperadora, "nomeDaOrigem" | "diaDaSemana">[] = [];

  for (let i = 0; i < quantidade; i++) {
    const totalRecebimentoZero = rng() < 0.04;
    const totalRecebimento = totalRecebimentoZero ? 0 : floatBetween(rng, 300, 5000);
    const total = totalRecebimentoZero ? 0 : floatBetween(rng, -100, 800);

    linhas.push({
      turSubProdutoId: intBetween(rng, 1000, 9999),
      venda: 3_000_000 + i,
      numeroFile: `NF${intBetween(rng, 10000, 99999)}`,
      cliente: pickFrom(rng, CLIENTES),
      fornecedor: pickFrom(rng, FORNECEDORES),
      produto: pickFrom(rng, PRODUTOS),
      emissor: pickFrom(rng, PROMOTORES),
      promotor: pickFrom(rng, PROMOTORES),
      loc: `LOC${intBetween(rng, 10000, 99999)}`,
      emissao: isoDateBetween(rng, "2026-01-01", "2026-11-17"),
      tarifa: floatBetween(rng, 200, 4000),
      comissao: floatBetween(rng, 0, 400),
      taxaAntecipacao: 0,
      taxaCc: floatBetween(rng, 0, 50),
      total,
      totalRecebimento,
      taxa: floatBetween(rng, 0, 100),
      checkin: isoDateBetween(rng, "2026-01-01", "2027-01-01"),
      comissaoRecebida: floatBetween(rng, 0, 300),
      tipo: intBetween(rng, 1, 3),
      markup: floatBetween(rng, 0, 100),
      fpfr: pickFrom(rng, ["FATURADO", "INV"]),
      situacao: pickFrom(rng, ["Confirmado", "Cancelado"]),
      percRent: floatBetween(rng, -0.1, 0.3),
      situacaoVenda: intBetween(rng, 1, 2),
    });
  }

  return linhas;
}

export function gerarVendasOperadoraMock(quantidade = 250): VendaOperadora[] {
  return gerarBaseOperadora(quantidade, 0).map((linha, i) => ({
    ...linha,
    nomeDaOrigem: "0021.csv",
    diaDaSemana: [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ][i % 7],
  }));
}

export function gerarVendasGruposMock(quantidade = 100): VendaGrupo[] {
  return gerarBaseOperadora(quantidade, 500);
}
