// PRNG determinístico (mulberry32) para fixtures reprodutíveis — nunca usar Math.random() aqui,
// senão os testes e a comparação visual com o Power BI deixam de ser reproduzíveis entre execuções.
export function createPrng(seed: number): () => number {
  let state = seed >>> 0;
  return function next(): number {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickFrom<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)];
}

export function intBetween(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

export function floatBetween(rng: () => number, min: number, max: number): number {
  return rng() * (max - min) + min;
}

export function isoDateBetween(rng: () => number, start: string, end: string): string {
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  const resultMs = Math.floor(floatBetween(rng, startMs, endMs));
  return new Date(resultMs).toISOString().slice(0, 10);
}
