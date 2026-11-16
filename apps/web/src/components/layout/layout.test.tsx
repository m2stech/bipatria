import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SideNav } from "@/components/layout/app-shell";
import { computeCanvasScale, PageCanvas } from "@/components/layout/page-canvas";
import { getModule } from "@/lib/navigation";

vi.mock("next/image", () => ({
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

class ResizeObserverStub {
  observe() {}
  disconnect() {}
}
vi.stubGlobal("ResizeObserver", ResizeObserverStub);

describe("computeCanvasScale", () => {
  it("reduz o canvas para caber na largura em telas largas", () => {
    expect(computeCanvasScale(960, 1920)).toBe(0.5);
  });

  it("nunca amplia além do tamanho natural", () => {
    expect(computeCanvasScale(3000, 1920)).toBe(1);
  });

  it("mantém tamanho natural em telas estreitas", () => {
    expect(computeCanvasScale(390, 1920)).toBe(1);
    expect(computeCanvasScale(0, 1920)).toBe(1);
  });
});

describe("PageCanvas", () => {
  it("usa 1920 × 800 por padrão e 1600 × 4700 no xray", () => {
    const { rerender } = render(<PageCanvas label="Vendas" />);
    const standard = screen.getByRole("region", { name: "Vendas" });
    expect(standard).toHaveStyle({ width: "1920px", height: "800px" });

    rerender(<PageCanvas label="xray" layout="xray" />);
    expect(screen.getByRole("region", { name: "xray" })).toHaveStyle({
      width: "1600px",
      height: "4700px",
    });
  });
});

describe("SideNav", () => {
  it("lista as páginas do módulo e marca a ativa", () => {
    const aereo = getModule("aereo")!;
    render(<SideNav currentModule={aereo} activePage="vendas" />);
    expect(screen.getAllByRole("link")).toHaveLength(aereo.pages.length);
    expect(screen.getByRole("link", { name: /Vendas/ })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: /Agências$/ })).not.toHaveAttribute("aria-current");
  });
});
