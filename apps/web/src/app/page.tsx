import Image from "next/image";
import Link from "next/link";

import { MODULES, pageHref, COVER_SLUG } from "@/lib/navigation";

export default function Home() {
  return (
    <main className="bg-brand-red flex min-h-screen flex-col">
      <div className="relative flex-1">
        <Image
          src="/brand/capa.png"
          alt="Pátria"
          fill
          priority
          sizes="100vw"
          className="object-cover object-bottom"
        />
      </div>
      <nav
        aria-label="Módulos"
        className="bg-brand-pink flex flex-col items-stretch gap-3 px-6 py-6 sm:flex-row sm:justify-center"
      >
        {MODULES.map((m) => (
          <Link
            key={m.slug}
            href={pageHref(m.slug, COVER_SLUG)}
            className="bg-brand-purple focus-visible:ring-brand-orange flex-1 rounded-lg px-6 py-4 text-center text-white outline-none focus-visible:ring-4 sm:max-w-xs"
          >
            <span className="block text-lg font-bold">{m.label}</span>
            <span className="block text-xs opacity-90">{m.description}</span>
          </Link>
        ))}
      </nav>
    </main>
  );
}
