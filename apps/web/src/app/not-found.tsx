import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-3 p-4 text-center">
      <h1 className="text-brand-purple text-2xl font-bold">Página não encontrada</h1>
      <p className="text-muted-foreground text-sm">O endereço acessado não existe neste painel.</p>
      <Link href="/" className="text-brand-purple text-sm underline">
        Voltar ao início
      </Link>
    </main>
  );
}
