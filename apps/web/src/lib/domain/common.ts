// Tipos compartilhados entre domínios. Campos de negócio (tarifa, rentabilidade, chaves)
// NÃO são compartilhados entre módulos — ver domain/aereo.ts, domain/terrestre.ts, domain/operadora.ts.

export type FaixaAdvp =
  | "1 Curto | 0–13 dias"
  | "2 Médio 1 | 14–20 dias"
  | "3 Médio 2 | 21–27 dias"
  | "4 Médio 3 | 28–59 dias"
  | "5 Longo | 60+ dias"
  | "6 Sem data"
  | "7 Data inconsistente";

export type DiaSemana =
  | "Domingo"
  | "Segunda-feira"
  | "Terça-feira"
  | "Quarta-feira"
  | "Quinta-feira"
  | "Sexta-feira"
  | "Sábado";

// d_Calendario: campo relevante para filtro de calendário e agrupamentos mensais.
export type DiaCalendario = {
  data: string; // ISO yyyy-MM-dd
  ano: number;
  mesNumero: number;
  mesAno: string; // "novembro/2026", ordenado por mesAnoOrdem
  mesAnoOrdem: number;
  trimestreNome: string; // "T4 2026"
  diaDaSemana: DiaSemana;
  ehFinalDeSemana: boolean;
  ehDiaUtil: boolean;
};
