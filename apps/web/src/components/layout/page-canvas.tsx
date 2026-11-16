"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { CANVAS_SIZES, type PageLayout } from "@/lib/navigation";
import { cn } from "@/lib/utils";

const MIN_SCALED_WIDTH = 768;

export function computeCanvasScale(containerWidth: number, canvasWidth: number): number {
  if (containerWidth < MIN_SCALED_WIDTH || containerWidth <= 0) return 1;
  return Math.min(1, containerWidth / canvasWidth);
}

type PageCanvasProps = {
  layout?: PageLayout;
  label: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Canvas de página com as dimensões do Power BI (1920 × 800; xray 1600 × 4700).
 * Em telas largas o canvas é reduzido para caber na largura; em telas estreitas
 * mantém o tamanho natural com rolagem horizontal controlada.
 */
export function PageCanvas({ layout = "standard", label, children, className }: PageCanvasProps) {
  const { width, height } = CANVAS_SIZES[layout];
  const hostRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const update = () => setScale(computeCanvasScale(host.clientWidth, width));
    update();
    const observer = new ResizeObserver(update);
    observer.observe(host);
    return () => observer.disconnect();
  }, [width]);

  return (
    <div ref={hostRef} className="w-full overflow-x-auto" data-testid="canvas-host">
      <div style={{ width: width * scale, height: height * scale }}>
        <section
          aria-label={label}
          data-canvas={layout}
          data-scale={scale}
          className={cn("bg-brand-pink relative origin-top-left overflow-hidden", className)}
          style={{ width, height, transform: `scale(${scale})` }}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
