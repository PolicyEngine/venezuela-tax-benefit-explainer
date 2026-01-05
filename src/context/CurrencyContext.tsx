/**
 * CurrencyContext - Global currency state for the app
 *
 * Provides VES/USD toggle functionality across all components.
 */

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CurrencyCode } from "../data/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined,
);

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: CurrencyCode;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({
  children,
  defaultCurrency = "VES",
}) => {
  const [currency, setCurrency] = useState<CurrencyCode>(defaultCurrency);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "VES" ? "USD" : "VES"));
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, toggleCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = (): CurrencyContextType => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
};

export default CurrencyContext;
