/**
 * CurrencyToggle - Toggle between VES and USD display
 *
 * Floating toggle that lets users switch the currency display
 * across all charts and values.
 */

import React from "react";
import { useCurrency } from "../context/CurrencyContext";
import { VES_PER_USD } from "../data/currency";
import { colors } from "../design/colors";
import { fonts, fontSizes, fontWeights } from "../design/typography";

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useCurrency();

  const buttonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "0.5rem 1rem",
    border: "none",
    backgroundColor: isActive ? colors.azul : "transparent",
    color: isActive ? "white" : colors.inkLight,
    fontFamily: fonts.mono,
    fontSize: fontSizes.small,
    fontWeight: isActive ? fontWeights.semibold : fontWeights.regular,
    cursor: "pointer",
    transition: "all 0.2s ease",
  });

  return (
    <div
      style={{
        position: "fixed",
        top: "1rem",
        right: "1rem",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "0.25rem",
      }}
    >
      <div
        style={{
          display: "flex",
          borderRadius: "4px",
          overflow: "hidden",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          border: `1px solid ${colors.inkMuted}`,
          backgroundColor: "white",
        }}
      >
        <button
          onClick={() => setCurrency("VES")}
          style={buttonStyle(currency === "VES")}
          data-active={currency === "VES"}
          aria-pressed={currency === "VES"}
        >
          VES
        </button>
        <button
          onClick={() => setCurrency("USD")}
          style={buttonStyle(currency === "USD")}
          data-active={currency === "USD"}
          aria-pressed={currency === "USD"}
        >
          USD
        </button>
      </div>
      <div
        style={{
          fontSize: "10px",
          color: colors.inkLight,
          fontFamily: fonts.mono,
          backgroundColor: "rgba(255,255,255,0.9)",
          padding: "0.25rem 0.5rem",
          borderRadius: "2px",
        }}
      >
        1 USD ≈ {VES_PER_USD} VES
      </div>
    </div>
  );
};

export default CurrencyToggle;
