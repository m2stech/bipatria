// Filtros comuns aos três módulos. Campos específicos de um módulo (cia, cabine) ficam opcionais
// e só são usados pelo Aéreo — não presumir que todo filtro se aplica a todo domínio.
export type FiltrosVendas = {
  periodoInicio: string | null; // ISO yyyy-MM-dd
  periodoFim: string | null;
  agencia: string | null;
  executivo: string | null;
  rede: string | null;
  mentoria: string | null;
  cia: string | null; // só Aéreo
  filial: string | null;
  nacionalInternacional: "nacional" | "internacional" | null;
  origem: string | null;
  destino: string | null;
  sistema: string | null;
  produto: string | null;
  fornecedor: string | null;
  cabine: string | null; // só Aéreo
};

export const FILTROS_VAZIOS: FiltrosVendas = {
  periodoInicio: null,
  periodoFim: null,
  agencia: null,
  executivo: null,
  rede: null,
  mentoria: null,
  cia: null,
  filial: null,
  nacionalInternacional: null,
  origem: null,
  destino: null,
  sistema: null,
  produto: null,
  fornecedor: null,
  cabine: null,
};

export function filtrosEstaoVazios(filtros: FiltrosVendas): boolean {
  return Object.values(filtros).every((v) => v === null);
}
