/**
 * CurrencyContext - Global currency state for the app
 *
 * Provides VES/USD toggle functionality across all components.
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  CurrencyCode,
  fetchExchangeRate,
  getVesPerUsd,
} from "../data/currency";

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (currency: CurrencyCode) => void;
  toggleCurrency: () => void;
  exchangeRate: number;
  isLoadingRate: boolean;
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
  const [exchangeRate, setExchangeRate] = useState<number>(getVesPerUsd());
  const [isLoadingRate, setIsLoadingRate] = useState(true);

  useEffect(() => {
    fetchExchangeRate().then((rate) => {
      setExchangeRate(rate);
      setIsLoadingRate(false);
    });
  }, []);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "VES" ? "USD" : "VES"));
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, toggleCurrency, exchangeRate, isLoadingRate }}
    >
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
