# Venezuela Tax-Benefit Explainer

An interactive scrollytelling visualization of Venezuela's tax and benefit system, built with React and TypeScript.

## Features

- Progressive storytelling using react-scrollama
- Visualizes income tax brackets, payroll taxes, and social benefits
- Demonstrates the Amor Mayor pension "cliff" effect (MTR > 100%)
- Shows different household types (single worker, elder, family)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Run tests
npm test

# Build for production
npm run build
```

## Project Structure

```
src/
  components/
    ScrollyStory.tsx    # Main scrollytelling component
    NetIncomeChart.tsx  # Recharts visualization
  data/
    calculator.ts       # Venezuela tax-benefit calculations
  design/
    colors.ts           # Venezuelan flag-inspired color palette
    typography.ts       # Editorial typography system
```

## Data Sources

- Income Tax: SENIAT (Servicio Nacional Integrado de Administración Aduanera y Tributaria)
- IVSS/BANAVIH: Venezuelan Social Security and Housing Fund laws
- Amor Mayor: Decreto 8.694 (Gaceta Oficial)
- Sistema Patria: Official Patria system announcements
- Child Benefits: Decreto 1.149 (Gaceta 40.465)
