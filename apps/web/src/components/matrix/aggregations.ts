// Agregação null-aware: usada pelos wrappers de matriz (TanStack Table e Material React Table).
// Soma valores numéricos, mas preserva null quando TODO o grupo não tem dado/permissão —
// somar nulls como 0 mascararia ausência de dado/permissão com um zero real (regra do CLAUDE.md).
export function sumPreservingNull(values: readonly (number | null)[]): number | null {
  if (values.every((v) => v === null)) return null;
  return values.reduce<number>((acc, v) => acc + (v ?? 0), 0);
}
