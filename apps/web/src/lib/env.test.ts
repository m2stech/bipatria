import { describe, expect, it, vi } from "vitest";

describe("env", () => {
  it("rejeita NEXT_PUBLIC_SUPABASE_URL inválida", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "nao-e-uma-url");
    await expect(import("./env")).rejects.toThrow(/Variáveis de ambiente inválidas/);
  });

  it("aceita ausência das variáveis (ainda não definidas pelo cliente)", async () => {
    vi.resetModules();
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", undefined);
    const { env } = await import("./env");
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });
});
