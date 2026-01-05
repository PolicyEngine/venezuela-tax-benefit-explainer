/**
 * Currency utilities for Venezuela Tax-Benefit Explainer
 *
 * Handles VES/USD conversion and formatting.
 * Exchange rate fetched from API.
 */

// Default rate (updated when API call succeeds)
// Source: https://fred.stlouisfed.org/series/DEXVZUS
let VES_PER_USD_CURRENT = 300; // ~300 VES per USD as of Jan 2026

export const getVesPerUsd = () => VES_PER_USD_CURRENT;
export const setVesPerUsd = (rate: number) => {
  VES_PER_USD_CURRENT = rate;
};

// Legacy exports for compatibility
export const VES_PER_USD = VES_PER_USD_CURRENT;
export const VES_TO_USD_RATE = 1 / VES_PER_USD_CURRENT;

export type CurrencyCode = "VES" | "USD";

/**
 * Fetch latest exchange rate from API
 * Uses exchangerate-api.com free tier
 */
export async function fetchExchangeRate(): Promise<number> {
  try {
    const response = await fetch(
      "https://api.exchangerate-api.com/v4/latest/USD",
    );
    const data = await response.json();
    if (data.rates && data.rates.VES) {
      VES_PER_USD_CURRENT = data.rates.VES;
      return data.rates.VES;
    }
  } catch (error) {
    console.warn("Failed to fetch exchange rate, using default:", error);
  }
  return VES_PER_USD_CURRENT;
}

/**
 * Convert VES to USD
 */
export function convertVesToUsd(ves: number): number {
  return ves / VES_PER_USD_CURRENT;
}

/**
 * Convert USD to VES
 */
export function convertUsdToVes(usd: number): number {
  return usd * VES_PER_USD_CURRENT;
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
