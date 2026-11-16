// Dados sintéticos para o protótipo de fidelidade (M2). Não representam clientes reais.

export type CiaBarDatum = {
  cia: string;
  tarifa: number;
  rentabilidade: number;
};

export const ciasBarData: CiaBarDatum[] = [
  { cia: "LATAM", tarifa: 4_820_000, rentabilidade: 612_000 },
  { cia: "GOL", tarifa: 3_940_000, rentabilidade: 455_000 },
  { cia: "AZUL", tarifa: 3_110_000, rentabilidade: 388_000 },
  { cia: "AMERICAN", tarifa: 1_280_000, rentabilidade: 94_000 },
  { cia: "AIR FRANCE", tarifa: 760_000, rentabilidade: 51_000 },
  { cia: "COPA", tarifa: 540_000, rentabilidade: 0 },
];

export type DonutDatum = {
  categoria: string;
  bilhetes: number;
};

export const domInterData: DonutDatum[] = [
  { categoria: "Doméstico", bilhetes: 8_420 },
  { categoria: "Internacional", bilhetes: 2_190 },
];

export type MonthlyDatum = {
  mes: string;
  tarifa: number;
  rentabilidade: number | null;
};

export const monthlyData: MonthlyDatum[] = [
  { mes: "jan", tarifa: 1_120_000, rentabilidade: 140_000 },
  { mes: "fev", tarifa: 980_000, rentabilidade: 118_000 },
  { mes: "mar", tarifa: 1_340_000, rentabilidade: 171_000 },
  { mes: "abr", tarifa: 1_205_000, rentabilidade: null }, // mês com dado ainda não publicado
  { mes: "mai", tarifa: 1_410_000, rentabilidade: 182_000 },
  { mes: "jun", tarifa: 1_560_000, rentabilidade: 203_000 },
];

// Estrutura de matriz hierárquica: Executivo -> Ano -> Mês, espelhando o pivotTable
// "Cias aéreas" da página Vendas do AEREO_PATRIA (promotor_003 -> Hierarquia de datas).
export type VendasRow = {
  executivo: string;
  ano: number;
  mes: string;
  cia: string;
  tarifa: number;
  bilhetes: number;
  rentabilidade: number | null; // null = regra de permissão/ausência de dado, não zero
};

const meses = ["jan", "fev", "mar", "abr", "mai", "jun"] as const;
const executivos = ["Ana Souza", "Bruno Lima", "Carla Nunes", "Diego Alves"];
const cias = ["LATAM", "GOL", "AZUL"];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

export const vendasMatrixData: VendasRow[] = (() => {
  const rand = seededRandom(42);
  const rows: VendasRow[] = [];
  for (const executivo of executivos) {
    for (const mes of meses) {
      for (const cia of cias) {
        const tarifa = Math.round(50_000 + rand() * 120_000);
        const bilhetes = Math.round(40 + rand() * 300);
        // Caso de borda: um executivo sem permissão de rentabilidade vê null, não 0.
        const rentabilidade =
          executivo === "Diego Alves" ? null : Math.round(tarifa * (0.08 + rand() * 0.06));
        rows.push({ executivo, ano: 2026, mes, cia, tarifa, bilhetes, rentabilidade });
      }
    }
  }
  return rows;
})();
