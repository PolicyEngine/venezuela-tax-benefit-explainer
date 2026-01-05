/**
 * Venezuela Tax-Benefit Calculator
 *
 * Implements Venezuela's tax and benefit system for 2025.
 * Validated against policyengine-ve.
 *
 * References:
 * - Income Tax: Ley de Impuesto sobre la Renta
 * - IVSS: Ley del Seguro Social
 * - BANAVIH: Ley del Régimen Prestacional de Vivienda y Hábitat
 * - Amor Mayor: Decreto 8.694 (Gaceta Oficial)
 * - Hogares de la Patria: Decreto 1.149 (Gaceta 40.465)
 */

// 2025 Parameters (matching policyengine-ve)
const TAX_UNIT = 43; // VES per Tax Unit (Unidad Tributaria)
const MINIMUM_WAGE_MONTHLY = 130; // VES/month
const MINIMUM_WAGE_ANNUAL = MINIMUM_WAGE_MONTHLY * 12; // 1560 VES/year

// Income Tax Brackets with deductions (in Tax Units)
// Formula: tax_TU = income_TU * rate - deduction_TU
const TAX_BRACKETS = [
  { threshold: 0, rate: 0.06, deduction: 0 },
  { threshold: 1000, rate: 0.09, deduction: 30 },
  { threshold: 1500, rate: 0.12, deduction: 75 },
  { threshold: 2000, rate: 0.16, deduction: 155 },
  { threshold: 2500, rate: 0.2, deduction: 255 },
  { threshold: 3000, rate: 0.24, deduction: 375 },
  { threshold: 4000, rate: 0.29, deduction: 575 },
  { threshold: 6000, rate: 0.34, deduction: 875 },
];

// Payroll Tax Rates
const IVSS_RATE = 0.04; // 4%
const IVSS_CAP_MULTIPLIER = 5; // 5x minimum wage cap
const BANAVIH_RATE = 0.01; // 1% (no cap)

// Benefit Amounts (annual)
const AMOR_MAYOR_BENEFIT = MINIMUM_WAGE_ANNUAL; // Equal to min wage
const SISTEMA_PATRIA_MONTHLY = 90; // VES/month (but eligibility is complex)
const BONO_ESCOLARIDAD_MONTHLY = 446; // VES/month per child
const BONO_LACTANCIA_MONTHLY = 558; // VES/month

// Age thresholds for Amor Mayor
const AMOR_MAYOR_AGE_MALE = 65;
const AMOR_MAYOR_AGE_FEMALE = 60;

export interface HouseholdInput {
  grossIncome: number;
  age: number;
  isMale: boolean;
  hasCarnetPatria: boolean;
  isAmorMayorEligible?: boolean; // For soft eligibility modeling
  schoolAgeChildren: number;
  isBreastfeeding: boolean;
  isSistemaPatriaEligible?: boolean;
}

export interface PayrollTaxResult {
  ivss: number;
  banavih: number;
  total: number;
}

export interface CalculationResult {
  grossIncome: number;
  incomeTax: number;
  payrollTax: number;
  ivss: number;
  banavih: number;
  sistemaPatria: number;
  amorMayor: number;
  bonoEscolaridad: number;
  bonoLactancia: number;
  totalTaxes: number;
  totalBenefits: number;
  netIncome: number;
}

/**
 * Calculate income tax using policyengine-ve formula:
 * tax = income_TU * rate - deduction_TU (converted to VES)
 */
export function calculateIncomeTax(grossIncome: number): number {
  const incomeInTU = grossIncome / TAX_UNIT;

  // Find applicable bracket (highest threshold <= income)
  let applicableBracket = TAX_BRACKETS[0];
  for (const bracket of TAX_BRACKETS) {
    if (incomeInTU >= bracket.threshold) {
      applicableBracket = bracket;
    }
  }

  // Calculate tax: (income * rate - deduction) in TU, then convert to VES
  const taxTU = incomeInTU * applicableBracket.rate - applicableBracket.deduction;
  return Math.max(taxTU * TAX_UNIT, 0);
}

/**
 * Calculate payroll taxes (IVSS + BANAVIH)
 * IVSS: 4% capped at 5x minimum wage
 * BANAVIH: 1% with no cap
 */
export function calculatePayrollTax(grossIncome: number): PayrollTaxResult {
  // IVSS has annual cap of 5x minimum wage
  const annualCap = MINIMUM_WAGE_MONTHLY * IVSS_CAP_MULTIPLIER * 12;
  const cappedIncome = Math.min(grossIncome, annualCap);
  const ivss = cappedIncome * IVSS_RATE;

  // BANAVIH has no cap
  const banavih = grossIncome * BANAVIH_RATE;

  return {
    ivss,
    banavih,
    total: ivss + banavih,
  };
}

/**
 * Calculate Gran Mision Amor Mayor pension
 *
 * This is a "flat transfer" that creates a benefit cliff at the minimum wage.
 * Eligibility: Age 60+ (women) or 65+ (men), income < min wage, Carnet Patria
 */
export function calculateAmorMayor(
  grossIncome: number,
  age: number,
  isMale: boolean,
  hasCarnetPatria: boolean = true,
): number {
  if (!hasCarnetPatria) return 0;

  const ageThreshold = isMale ? AMOR_MAYOR_AGE_MALE : AMOR_MAYOR_AGE_FEMALE;
  if (age < ageThreshold) return 0;

  // CLIFF: benefit drops to 0 at or above minimum wage
  if (grossIncome >= MINIMUM_WAGE_ANNUAL) return 0;

  return AMOR_MAYOR_BENEFIT;
}

/**
 * Calculate Sistema Patria monthly bonus
 * Note: In policyengine-ve, this shows 0 for basic cases - eligibility is complex
 * For the explainer, we model it as available with Carnet de la Patria
 */
export function calculateSistemaPatriaBonus(isEligible: boolean): number {
  return isEligible ? SISTEMA_PATRIA_MONTHLY * 12 : 0;
}

/**
 * Calculate Bono de Escolaridad (school bonus)
 * 446 Bs/month per school-age child (4-17 years)
 */
export function calculateBonoEscolaridad(
  schoolAgeChildren: number,
  hasCarnetPatria: boolean,
): number {
  if (!hasCarnetPatria) return 0;
  return schoolAgeChildren * BONO_ESCOLARIDAD_MONTHLY * 12;
}

/**
 * Calculate Bono de Lactancia (breastfeeding bonus)
 * 558 Bs/month for breastfeeding mothers
 */
export function calculateBonoLactancia(
  isBreastfeeding: boolean,
  hasCarnetPatria: boolean,
): number {
  if (!hasCarnetPatria || !isBreastfeeding) return 0;
  return BONO_LACTANCIA_MONTHLY * 12;
}

/**
 * Calculate complete net income with all taxes and benefits
 */
export function calculateNetIncome(input: HouseholdInput): CalculationResult {
  const {
    grossIncome,
    age,
    isMale,
    hasCarnetPatria,
    schoolAgeChildren,
    isBreastfeeding,
  } = input;

  // Calculate taxes
  const incomeTax = calculateIncomeTax(grossIncome);
  const payrollResult = calculatePayrollTax(grossIncome);

  // Calculate benefits
  // Sistema Patria eligibility is complex - default to false unless explicitly enabled
  const sistemaPatria = calculateSistemaPatriaBonus(
    input.isSistemaPatriaEligible ?? false,
  );

  // Amor Mayor uses household income for threshold test
  const isAmorMayorAgeEligible = isMale
    ? age >= AMOR_MAYOR_AGE_MALE
    : age >= AMOR_MAYOR_AGE_FEMALE;
  const amorMayor =
    (input.isAmorMayorEligible ?? isAmorMayorAgeEligible) && hasCarnetPatria
      ? grossIncome < MINIMUM_WAGE_ANNUAL
        ? AMOR_MAYOR_BENEFIT
        : 0
      : 0;

  const bonoEscolaridad = calculateBonoEscolaridad(
    schoolAgeChildren,
    hasCarnetPatria,
  );
  const bonoLactancia = calculateBonoLactancia(isBreastfeeding, hasCarnetPatria);

  const totalTaxes = incomeTax + payrollResult.total;
  const totalBenefits =
    sistemaPatria + amorMayor + bonoEscolaridad + bonoLactancia;
  const netIncome = grossIncome - totalTaxes + totalBenefits;

  return {
    grossIncome,
    incomeTax,
    payrollTax: payrollResult.total,
    ivss: payrollResult.ivss,
    banavih: payrollResult.banavih,
    sistemaPatria,
    amorMayor,
    bonoEscolaridad,
    bonoLactancia,
    totalTaxes,
    totalBenefits,
    netIncome,
  };
}

/**
 * Generate income schedule for charting
 */
export function generateIncomeSchedule(
  input: Omit<HouseholdInput, "grossIncome">,
  minIncome: number = 0,
  maxIncome: number = 200000,
  steps: number = 201,
): CalculationResult[] {
  const results: CalculationResult[] = [];
  const step = (maxIncome - minIncome) / (steps - 1);

  for (let i = 0; i < steps; i++) {
    const grossIncome = minIncome + i * step;
    results.push(calculateNetIncome({ ...input, grossIncome }));
  }

  return results;
}

/**
 * Calculate marginal tax rate at a given income level
 * MTR = change in net income / change in gross income
 * MTR > 100% indicates a benefit cliff
 */
export function calculateMarginalRate(
  input: Omit<HouseholdInput, "grossIncome">,
  grossIncome: number,
  delta: number = 1,
): number {
  const base = calculateNetIncome({ ...input, grossIncome });
  const higher = calculateNetIncome({
    ...input,
    grossIncome: grossIncome + delta,
  });

  const changeInNet = higher.netIncome - base.netIncome;
  const changeInGross = delta;

  // MTR = 1 - (change in net / change in gross)
  return 1 - changeInNet / changeInGross;
}

// Export constants for use in charts
export const CONSTANTS = {
  TAX_UNIT,
  MINIMUM_WAGE_MONTHLY,
  MINIMUM_WAGE_ANNUAL,
  AMOR_MAYOR_BENEFIT,
  SISTEMA_PATRIA_MONTHLY,
  BONO_ESCOLARIDAD_MONTHLY,
  BONO_LACTANCIA_MONTHLY,
  TAX_BRACKETS,
  IVSS_RATE,
  IVSS_CAP_MULTIPLIER,
  BANAVIH_RATE,
};
