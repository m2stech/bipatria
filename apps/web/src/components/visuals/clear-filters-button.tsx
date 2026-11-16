import { FilterX } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";

export function ClearFiltersButton({
  children = "Limpar filtros",
  ...props
}: ComponentProps<typeof Button>) {
  return (
    <Button variant="outline" {...props}>
      <FilterX aria-hidden="true" data-icon="inline-start" />
      {children}
    </Button>
  );
}
