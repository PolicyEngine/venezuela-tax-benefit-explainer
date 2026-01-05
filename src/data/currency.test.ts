/**
 * Tests for currency conversion utilities
 */

import {
  convertVesToUsd,
  convertUsdToVes,
  formatCurrency,
  VES_TO_USD_RATE,
} from "./currency";

describe("Currency conversion", () => {
  it("should have a valid exchange rate", () => {
    expect(VES_TO_USD_RATE).toBeGreaterThan(0);
    expect(VES_TO_USD_RATE).toBeLessThan(1); // VES is much weaker than USD
  });

  it("should convert VES to USD correctly", () => {
    // 1000 VES at rate 0.0222 = 22.22 USD
    expect(convertVesToUsd(1000)).toBeCloseTo(1000 * VES_TO_USD_RATE, 2);
    expect(convertVesToUsd(0)).toBe(0);
  });

  it("should convert USD to VES correctly", () => {
    // 100 USD at rate 0.0222 = 4504.5 VES
    expect(convertUsdToVes(100)).toBeCloseTo(100 / VES_TO_USD_RATE, 2);
    expect(convertUsdToVes(0)).toBe(0);
  });

  it("should be reversible", () => {
    const originalVes = 5000;
    const usd = convertVesToUsd(originalVes);
    const backToVes = convertUsdToVes(usd);
    expect(backToVes).toBeCloseTo(originalVes, 2);
  });
});

describe("Currency formatting", () => {
  describe("VES formatting", () => {
    it("should format VES with Bs symbol", () => {
      expect(formatCurrency(1500, "VES")).toMatch(/Bs/);
      expect(formatCurrency(1500, "VES")).toMatch(/1[,.]?500/);
    });

    it("should format 0 VES", () => {
      expect(formatCurrency(0, "VES")).toMatch(/0.*Bs|Bs.*0/);
    });

    it("should format large VES amounts with separators", () => {
      const formatted = formatCurrency(50000, "VES");
      expect(formatted).toMatch(/50[,.]?000/);
    });
  });

  describe("USD formatting", () => {
    it("should format USD with $ symbol", () => {
      expect(formatCurrency(100, "USD")).toMatch(/\$/);
    });

    it("should format small USD amounts with 2 decimal places", () => {
      const formatted = formatCurrency(33.33, "USD");
      expect(formatted).toMatch(/33[.,]33/);
    });

    it("should format 0 USD", () => {
      expect(formatCurrency(0, "USD")).toMatch(/\$.*0|0.*\$/);
    });
  });
});

describe("formatCurrency with conversion", () => {
  it("should convert and format VES to USD when requested", () => {
    // 1000 VES -> ~22.22 USD (at 45 VES/USD rate)
    const result = formatCurrency(1000, "USD", true);
    expect(result).toMatch(/\$/);
    const valueMatch = result.match(/\$?([\d.,]+)/);
    expect(valueMatch).toBeTruthy();
  });

  it("should not convert when fromVes is false", () => {
    const result = formatCurrency(100, "USD", false);
    expect(result).toMatch(/\$100/);
  });
});
