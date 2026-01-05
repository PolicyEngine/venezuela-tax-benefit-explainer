/**
 * Tests for CurrencyToggle component
 */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import CurrencyToggle from "./CurrencyToggle";
import { CurrencyProvider } from "../context/CurrencyContext";

const renderWithProvider = (defaultCurrency: "VES" | "USD" = "VES") => {
  return render(
    <CurrencyProvider defaultCurrency={defaultCurrency}>
      <CurrencyToggle />
    </CurrencyProvider>,
  );
};

describe("CurrencyToggle", () => {
  it("renders toggle buttons", () => {
    renderWithProvider();

    expect(screen.getByText("VES")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
  });

  it("shows VES as active by default", () => {
    renderWithProvider();

    const vesButton = screen.getByText("VES");
    const usdButton = screen.getByText("USD");

    // VES should be the active state
    expect(vesButton).toHaveAttribute("data-active", "true");
    expect(usdButton).toHaveAttribute("data-active", "false");
  });

  it("toggles to USD when USD button is clicked", () => {
    renderWithProvider();

    const usdButton = screen.getByText("USD");
    fireEvent.click(usdButton);

    expect(screen.getByText("VES")).toHaveAttribute("data-active", "false");
    expect(usdButton).toHaveAttribute("data-active", "true");
  });

  it("toggles back to VES when VES button is clicked", () => {
    renderWithProvider("USD");

    const vesButton = screen.getByText("VES");
    fireEvent.click(vesButton);

    expect(vesButton).toHaveAttribute("data-active", "true");
    expect(screen.getByText("USD")).toHaveAttribute("data-active", "false");
  });

  it("displays exchange rate info", () => {
    renderWithProvider();

    // The exchange rate display shows "1 USD ≈ 45 VES"
    expect(screen.getByText(/1 USD ≈ \d+ VES/)).toBeInTheDocument();
  });
});
