// Porta o comportamento de DAX DIVIDE(numerador, denominador, [resultadoAlternativo]):
// retorna null em vez de lançar/Infinity/NaN quando o denominador é 0, null ou indefinido.
export function divide(
  numerador: number | null | undefined,
  denominador: number | null | undefined,
  resultadoAlternativo: number | null = null,
): number | null {
  if (numerador == null || denominador == null || denominador === 0) {
    return resultadoAlternativo;
  }
  return numerador / denominador;
}
