/**
 * Venezuela Tax-Benefit Calculator
 *
 * Implements Venezuela's tax and benefit system for 2025.
 * Based on SENIAT income tax law and Sistema Patria programs.
 *
 * References:
 * - Income Tax: Ley de Impuesto sobre la Renta
 * - IVSS: Ley del Seguro Social
 * - BANAVIH: Ley del Régimen Prestacional de Vivienda y Hábitat
 * - Amor Mayor: Decreto 8.694 (Gaceta Oficial)
 * - Hogares de la Patria: Decreto 1.149 (Gaceta 40.465)
 */

// 2025 Parameters
const TAX_UNIT = 43; // VES per Tax Unit (Unidad Tributaria)
const MINIMUM_WAGE_ANNUAL = 1560; // VES/year

// Income Tax Brackets (in Tax Units)
const TAX_BRACKETS = [
  { threshold: 1000, rate: 0.06 },
  { threshold: 1500, rate: 0.09 },
  { threshold: 2000, rate: 0.12 },
  { threshold: 2500, rate: 0.16 },
  { threshold: 3000, rate: 0.2 },
  { threshold: 4000, rate: 0.24 },
  { threshold: 6000, rate: 0.29 },
  { threshold: Infinity, rate: 0.34 },
];

// Payroll Tax Rates
const IVSS_RATE = 0.04; // 4%
const BANAVIH_RATE = 0.01; // 1%

// Benefit Amounts (annual)
const AMOR_MAYOR_BENEFIT = 1560; // VES/year (equal to min wage)
const SISTEMA_PATRIA_MONTHLY = 90; // VES/month
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
 * Calculate progressive income tax using Tax Unit brackets
 */
export function calculateIncomeTax(grossIncome: number): number {
  const incomeInTU = grossIncome / TAX_UNIT;

  let tax = 0;
  let previousThreshold = 0;

  for (const bracket of TAX_BRACKETS) {
    if (incomeInTU <= previousThreshold) break;

    const taxableInBracket = Math.min(
      Math.max(incomeInTU - previousThreshold, 0),
      bracket.threshold - previousThreshold,
    );

    tax += taxableInBracket * bracket.rate * TAX_UNIT;
    previousThreshold = bracket.threshold;
  }

  return tax;
}

/**
 * Calculate payroll taxes (IVSS + BANAVIH)
 */
export function calculatePayrollTax(grossIncome: number): PayrollTaxResult {
  const ivss = grossIncome * IVSS_RATE;
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
  const sistemaPatria = calculateSistemaPatriaBonus(
    input.isSistemaPatriaEligible ?? hasCarnetPatria,
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
  const bonoLactancia = calculateBonoLactancia(
    isBreastfeeding,
    hasCarnetPatria,
  );

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
  MINIMUM_WAGE_ANNUAL,
  AMOR_MAYOR_BENEFIT,
  SISTEMA_PATRIA_MONTHLY,
  BONO_ESCOLARIDAD_MONTHLY,
  BONO_LACTANCIA_MONTHLY,
  TAX_BRACKETS,
  IVSS_RATE,
  BANAVIH_RATE,
};
