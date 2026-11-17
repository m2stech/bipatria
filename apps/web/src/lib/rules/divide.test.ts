import { describe, expect, it } from "vitest";

import { divide } from "./divide";

describe("divide", () => {
  it("divide normalmente quando o denominador é diferente de zero", () => {
    expect(divide(10, 2)).toBe(5);
  });

  it("retorna null quando o denominador é zero", () => {
    expect(divide(10, 0)).toBeNull();
  });

  it("retorna o resultado alternativo informado quando o denominador é zero", () => {
    expect(divide(10, 0, 0)).toBe(0);
  });

  it("retorna null quando o numerador é null", () => {
    expect(divide(null, 5)).toBeNull();
  });

  it("retorna null quando o denominador é null ou undefined", () => {
    expect(divide(10, null)).toBeNull();
    expect(divide(10, undefined)).toBeNull();
  });
});
