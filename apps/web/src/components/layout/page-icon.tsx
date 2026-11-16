import { Boxes } from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { PageIconKey } from "@/lib/navigation";

const IMAGE_ICONS: Partial<Record<PageIconKey, string>> = {
  auditoria: "/brand/icons/auditoria.png",
  vendas: "/brand/icons/vendas.png",
  agencias: "/brand/icons/agencias.png",
  "agencias-inativas": "/brand/icons/agencias.png",
  executivos: "/brand/icons/executivos.png",
  metas: "/brand/icons/metas.png",
  "share-diario": "/brand/icons/share-diario.png",
  cias: "/brand/icons/cias.png",
  xray: "/brand/icons/xray.png",
};

type PageIconProps = {
  icon: PageIconKey;
  size?: number;
  className?: string;
};

export function PageIcon({ icon, size = 36, className }: PageIconProps) {
  if (icon === "capa") {
    return (
      <Image
        src="/brand/logo-patria-claro.png"
        alt=""
        width={size}
        height={size}
        className={cn("bg-brand-red rounded-md", className)}
      />
    );
  }

  const src = IMAGE_ICONS[icon];
  if (src) {
    return (
      <Image
        src={src}
        alt=""
        width={size}
        height={size}
        className={cn(icon === "agencias-inativas" && "opacity-50 grayscale", className)}
      />
    );
  }

  return <Boxes aria-hidden="true" className={cn("text-brand-red", className)} size={size * 0.7} />;
}
