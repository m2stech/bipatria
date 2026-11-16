import type { Metadata } from "next";

import { AppHeader } from "@/components/layout/app-shell";
import { UnavailableState } from "@/components/states/data-states";

export const metadata: Metadata = { title: "Administração" };

export default function AdminPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader pageLabel="Administração" />
      <main className="flex flex-1 items-center justify-center p-4">
        <UnavailableState
          title="Administração de usuários"
          description="Gestão de usuários, perfis e escopos será habilitada na milestone de autenticação."
        />
      </main>
    </div>
  );
}
