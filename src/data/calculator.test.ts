/**
 * Tests for Venezuela tax-benefit calculator
 *
 * These tests validate the calculations for:
 * - Income tax (8 progressive brackets, 6-34%)
 * - Payroll taxes (IVSS 4%, BANAVIH 1%)
 * - Gran Mision Amor Mayor (pension with cliff at min wage)
 * - Sistema Patria bonuses
 * - Child benefits (escolaridad, lactancia)
 */

import {
  calculateIncomeTax,
  calculatePayrollTax,
  calculateAmorMayor,
  calculateSistemaPatriaBonus,
  calculateBonoEscolaridad,
  calculateBonoLactancia,
  calculateNetIncome,
  type HouseholdInput,
  type CalculationResult,
} from "./calculator";

// 2025 Tax Unit value
const TAX_UNIT_2025 = 43; // VES

describe("Income Tax", () => {
  it("should apply 6% rate for income in first bracket (0-1000 TU)", () => {
    const income = 500 * TAX_UNIT_2025; // 500 TU = 21,500 VES
    // All income taxed at 6% in first bracket
    expect(calculateIncomeTax(income)).toBeCloseTo(income * 0.06, 2);
  });

  it("should calculate 6% for income in first bracket", () => {
    // First bracket: 1-1000 TU at 6%
    const income = 1000 * TAX_UNIT_2025; // 43,000 VES
    const taxableIncome = income; // All in 6% bracket
    const expected = taxableIncome * 0.06;
    expect(calculateIncomeTax(income)).toBeCloseTo(expected, 2);
  });

  it("should apply progressive rates for higher income", () => {
    // 2000 TU income: 1000 at 6%, 500 at 9%, 500 at 12%
    const income = 2000 * TAX_UNIT_2025; // 86,000 VES
    const tax = calculateIncomeTax(income);
    // Should be more than flat 6% but less than flat 12%
    expect(tax).toBeGreaterThan(income * 0.06);
    expect(tax).toBeLessThan(income * 0.12);
  });
});

describe("Payroll Tax", () => {
  it("should calculate 5% total (4% IVSS + 1% BANAVIH)", () => {
    const income = 50000;
    const result = calculatePayrollTax(income);
    expect(result.ivss).toBe(income * 0.04);
    expect(result.banavih).toBe(income * 0.01);
    expect(result.total).toBe(income * 0.05);
  });

  it("should return 0 for 0 income", () => {
    const result = calculatePayrollTax(0);
    expect(result.total).toBe(0);
  });
});

describe("Amor Mayor Pension", () => {
  const MINIMUM_WAGE_ANNUAL = 1560; // VES/year for 2025
  const BENEFIT_AMOUNT = 1560; // Equal to minimum wage

  it("should provide benefit when income below threshold", () => {
    const income = MINIMUM_WAGE_ANNUAL - 100;
    expect(calculateAmorMayor(income, 65, true)).toBe(BENEFIT_AMOUNT);
  });

  it("should provide 0 when income at or above threshold (CLIFF)", () => {
    expect(calculateAmorMayor(MINIMUM_WAGE_ANNUAL, 65, true)).toBe(0);
    expect(calculateAmorMayor(MINIMUM_WAGE_ANNUAL + 1, 65, true)).toBe(0);
  });

  it("should require age 60+ for women, 65+ for men", () => {
    // Man under 65
    expect(calculateAmorMayor(0, 64, true)).toBe(0);
    expect(calculateAmorMayor(0, 65, true)).toBe(BENEFIT_AMOUNT);

    // Woman under 60
    expect(calculateAmorMayor(0, 59, false)).toBe(0);
    expect(calculateAmorMayor(0, 60, false)).toBe(BENEFIT_AMOUNT);
  });

  it("should require Carnet de la Patria", () => {
    // hasCarnetPatria = false (third param simulates this via eligible flag)
    expect(calculateAmorMayor(0, 65, true, false)).toBe(0);
  });
});

describe("Sistema Patria Bonus", () => {
  const MONTHLY_BONUS = 90; // VES/month for 2025

  it("should provide monthly bonus to eligible recipients", () => {
    expect(calculateSistemaPatriaBonus(true)).toBe(MONTHLY_BONUS * 12);
  });

  it("should provide 0 to ineligible", () => {
    expect(calculateSistemaPatriaBonus(false)).toBe(0);
  });
});

describe("Child Benefits", () => {
  describe("Bono Escolaridad", () => {
    const MONTHLY_AMOUNT = 446; // VES/month per school-age child

    it("should provide benefit per school-age child (4-17)", () => {
      expect(calculateBonoEscolaridad(1, true)).toBe(MONTHLY_AMOUNT * 12);
      expect(calculateBonoEscolaridad(2, true)).toBe(MONTHLY_AMOUNT * 12 * 2);
    });

    it("should require Carnet de la Patria", () => {
      expect(calculateBonoEscolaridad(1, false)).toBe(0);
    });
  });

  describe("Bono Lactancia", () => {
    const MONTHLY_AMOUNT = 558; // VES/month for breastfeeding mothers

    it("should provide benefit to breastfeeding mothers", () => {
      expect(calculateBonoLactancia(true, true)).toBe(MONTHLY_AMOUNT * 12);
    });

    it("should require Carnet de la Patria", () => {
      expect(calculateBonoLactancia(true, false)).toBe(0);
    });

    it("should provide 0 if not breastfeeding", () => {
      expect(calculateBonoLactancia(false, true)).toBe(0);
    });
  });
});

describe("Net Income Calculation", () => {
  it("should calculate correct net income for a simple case", () => {
    const input: HouseholdInput = {
      grossIncome: 50000,
      age: 30,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: false,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
    };

    const result = calculateNetIncome(input);

    expect(result.grossIncome).toBe(50000);
    expect(result.incomeTax).toBeGreaterThan(0);
    expect(result.payrollTax).toBe(50000 * 0.05);
    expect(result.netIncome).toBeLessThan(50000);
  });

  it("should show Amor Mayor cliff effect", () => {
    const baseInput: HouseholdInput = {
      grossIncome: 0,
      age: 65,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: true,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
    };

    // Just below cliff
    const belowCliff = calculateNetIncome({ ...baseInput, grossIncome: 1500 });
    // Just above cliff
    const aboveCliff = calculateNetIncome({ ...baseInput, grossIncome: 1600 });

    // Net income should DROP when crossing the cliff
    expect(belowCliff.netIncome).toBeGreaterThan(aboveCliff.netIncome);
    expect(belowCliff.amorMayor).toBeGreaterThan(0);
    expect(aboveCliff.amorMayor).toBe(0);
  });

  it("should include child benefits when applicable", () => {
    const withChildren: HouseholdInput = {
      grossIncome: 30000,
      age: 35,
      isMale: false,
      hasCarnetPatria: true,
      isAmorMayorEligible: false,
      schoolAgeChildren: 2,
      isBreastfeeding: true,
    };

    const result = calculateNetIncome(withChildren);

    expect(result.bonoEscolaridad).toBeGreaterThan(0);
    expect(result.bonoLactancia).toBeGreaterThan(0);
    expect(result.totalBenefits).toBeGreaterThan(0);
  });
});

describe("generateIncomeSchedule", () => {
  it("should generate array of calculations at different income levels", async () => {
    // This will be tested after implementation
  });
});
