import React from "react";
import ScrollyStory from "./components/ScrollyStory";
import CurrencyToggle from "./components/CurrencyToggle";
import { CurrencyProvider } from "./context/CurrencyContext";
import "./App.css";

function App() {
  return (
    <CurrencyProvider>
      <CurrencyToggle />
      <ScrollyStory />
    </CurrencyProvider>
  );
}

export default App;
