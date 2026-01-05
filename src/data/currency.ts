/**
 * Currency utilities for Venezuela Tax-Benefit Explainer
 *
 * Handles VES/USD conversion and formatting.
 * Exchange rate is approximate for 2025 - should be updated periodically.
 */

// 2025 approximate exchange rate: ~45 VES per 1 USD
// This is the official rate; parallel market rates vary significantly
export const VES_PER_USD = 45;
export const VES_TO_USD_RATE = 1 / VES_PER_USD; // ~0.0222

export type CurrencyCode = "VES" | "USD";

/**
 * Convert VES to USD
 */
export function convertVesToUsd(ves: number): number {
  return ves * VES_TO_USD_RATE;
}

/**
 * Convert USD to VES
 */
export function convertUsdToVes(usd: number): number {
  return usd / VES_TO_USD_RATE;
}

/**
 * Format a currency value with appropriate symbol and separators
 *
 * @param value - The numeric value to format
 * @param currency - Target currency code ("VES" or "USD")
 * @param fromVes - If true and currency is USD, convert from VES first
 */
export function formatCurrency(
  value: number,
  currency: CurrencyCode,
  fromVes: boolean = false,
): string {
  let displayValue = value;

  // Convert from VES to USD if needed
  if (fromVes && currency === "USD") {
    displayValue = convertVesToUsd(value);
  }

  if (currency === "VES") {
    // Venezuelan bolivar formatting
    return `${displayValue.toLocaleString("es-VE", {
      maximumFractionDigits: 0,
    })} Bs`;
  } else {
    // USD formatting
    return displayValue.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}

/**
 * Get a display label for the currency
 */
export function getCurrencyLabel(currency: CurrencyCode): string {
  return currency === "VES" ? "Bolívares (VES)" : "US Dollars (USD)";
}

/**
 * Get the symbol for the currency
 */
export function getCurrencySymbol(currency: CurrencyCode): string {
  return currency === "VES" ? "Bs" : "$";
}
