import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <div className="bg-card w-full max-w-sm rounded-lg border p-6 shadow-xs">
        <div className="bg-brand-red mb-4 flex justify-center rounded-md">
          <Image src="/brand/logo-patria-claro.png" alt="Pátria" width={96} height={96} priority />
        </div>
        <h1 className="text-brand-purple text-lg font-bold">Entrar</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          O acesso por usuário e senha será habilitado na milestone de autenticação. Não há cadastro
          público: o acesso é concedido por convite do administrador.
        </p>
        <Link href="/" className="text-brand-purple mt-4 inline-block text-sm underline">
          Voltar ao início
        </Link>
      </div>
    </main>
  );
}
