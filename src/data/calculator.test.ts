/**
 * Tests for Venezuela tax-benefit calculator
 *
 * These tests validate against policyengine-ve calculations.
 * Test values are from running policyengine-ve directly.
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

// 2025 Parameters matching policyengine-ve
const TAX_UNIT = 43; // VES
const MIN_WAGE_MONTHLY = 130; // VES
const MIN_WAGE_ANNUAL = MIN_WAGE_MONTHLY * 12; // 1560 VES

describe("Income Tax - validated against policyengine-ve", () => {
  it("should match PE for 50000 VES income: 3210", () => {
    // PE output: income_tax = 3210.00
    // Formula: (50000/43) * 0.09 - 30 = 1162.79 * 0.09 - 30 = 74.65 TU * 43 = 3210
    expect(calculateIncomeTax(50000)).toBeCloseTo(3210, 0);
  });

  it("should match PE for 1500 VES income: 90", () => {
    // PE output: income_tax = 90.00
    // Formula: (1500/43) * 0.06 - 0 = 34.88 * 0.06 = 2.09 TU * 43 = 90
    expect(calculateIncomeTax(1500)).toBeCloseTo(90, 0);
  });

  it("should match PE for 1600 VES income: 96", () => {
    // PE output: income_tax = 96.00
    expect(calculateIncomeTax(1600)).toBeCloseTo(96, 0);
  });

  it("should return 0 for 0 income", () => {
    expect(calculateIncomeTax(0)).toBe(0);
  });
});

describe("Payroll Tax - validated against policyengine-ve", () => {
  it("should match PE for 50000 VES income: 812", () => {
    // PE output: employee_payroll_tax = 812.00
    // IVSS: min(50000, 7800) * 0.04 = 7800 * 0.04 = 312
    // BANAVIH: 50000 * 0.01 = 500
    // Total: 312 + 500 = 812
    const result = calculatePayrollTax(50000);
    expect(result.total).toBeCloseTo(812, 0);
    expect(result.ivss).toBeCloseTo(312, 0);
    expect(result.banavih).toBeCloseTo(500, 0);
  });

  it("should cap IVSS at 5x minimum wage", () => {
    // Cap = 130 * 5 * 12 = 7800 VES annual
    const annualCap = MIN_WAGE_MONTHLY * 5 * 12;
    const result = calculatePayrollTax(100000); // Well above cap
    // IVSS should be capped: 7800 * 0.04 = 312
    expect(result.ivss).toBeCloseTo(annualCap * 0.04, 0);
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

describe("Net Income Calculation - validated against policyengine-ve", () => {
  it("should match PE for 50000 VES single worker: net ~45978", () => {
    // PE output: person_net_income = 45978.00
    // Gross: 50000, Tax: 3210, Payroll: 812, Benefits: 0
    const input: HouseholdInput = {
      grossIncome: 50000,
      age: 35,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: false,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
      isSistemaPatriaEligible: false,
    };

    const result = calculateNetIncome(input);

    expect(result.grossIncome).toBe(50000);
    expect(result.incomeTax).toBeCloseTo(3210, 0);
    expect(result.payrollTax).toBeCloseTo(812, 0);
    expect(result.netIncome).toBeCloseTo(45978, 0);
  });

  it("should match PE for elder below cliff: net ~2895", () => {
    // PE output: person_net_income = 2895.00
    // Gross: 1500, Tax: 90, Payroll: 75, Amor Mayor: 1560, Net: 2895
    const input: HouseholdInput = {
      grossIncome: 1500,
      age: 68,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: true,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
      isSistemaPatriaEligible: false,
    };

    const result = calculateNetIncome(input);
    expect(result.amorMayor).toBe(1560);
    expect(result.netIncome).toBeCloseTo(2895, 0);
  });

  it("should match PE for elder above cliff: net ~1424", () => {
    // PE output: person_net_income = 1424.00
    // Gross: 1600, Tax: 96, Payroll: 80, Amor Mayor: 0, Net: 1424
    const input: HouseholdInput = {
      grossIncome: 1600,
      age: 68,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: true,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
      isSistemaPatriaEligible: false,
    };

    const result = calculateNetIncome(input);
    expect(result.amorMayor).toBe(0);
    expect(result.netIncome).toBeCloseTo(1424, 0);
  });

  it("should show Amor Mayor cliff effect: net drops by ~1471", () => {
    const baseInput: HouseholdInput = {
      grossIncome: 0,
      age: 68,
      isMale: true,
      hasCarnetPatria: true,
      isAmorMayorEligible: true,
      schoolAgeChildren: 0,
      isBreastfeeding: false,
      isSistemaPatriaEligible: false,
    };

    // Just below cliff
    const belowCliff = calculateNetIncome({ ...baseInput, grossIncome: 1500 });
    // Just above cliff
    const aboveCliff = calculateNetIncome({ ...baseInput, grossIncome: 1600 });

    // Net income should DROP when crossing the cliff (2895 vs 1424)
    expect(belowCliff.netIncome).toBeGreaterThan(aboveCliff.netIncome);
    expect(belowCliff.netIncome - aboveCliff.netIncome).toBeCloseTo(1471, 0);
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
      isSistemaPatriaEligible: false,
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
