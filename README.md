# Flooring Pricing Calculator

A production-ready estimator for flooring sales teams. Capture rooms, materials, labor, and job-site scalers, then generate a client-ready proposal you can print or save as PDF.

The sample job (Hearth & Grain Flooring · Ellison residence) loads on first visit so the app looks finished in a demo. Edits persist in `localStorage` and survive a refresh.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

| Script | Purpose |
| --- | --- |
| `npm run dev` | Next.js development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## How estimators use it

1. **Estimate tab** — fill in client/project info, add rooms (length × width or a square-foot override), pick a material per area, and toggle demo/underlayment.
2. **Rate sheet** — house prices for hardwood, engineered, LVP, tile, carpet, laminate, and vinyl, plus removal, underlayment, transitions, stairs, waste %, tax, deposit, and optional discount.
3. **Table of services** — derived lines stay linked to rooms and rates; add/remove custom lines (furniture move, shoe molding, moisture tests, etc.). Totals update as you type.
4. **Client scalers** — occupancy, timeline, complexity slider, material grade, and regional cost index. Each control shows its % impact; the combined multiplier is applied before tax.
5. **Proposal tab** — letterhead (logo upload or initials mark), scope, itemized table, plain-language scaler explanation, totals, deposit, terms, and signature lines.
6. **Print / Download PDF** — opens the system print dialog with print CSS. Choose “Save as PDF” in the printer list.

Use **Sample** in the header to restore the Ellison residence demo.

## Pricing math

```
line subtotal     = sum of included qty × unit price
scaled subtotal   = line subtotal × occupancy × timeline × (1 + complexity) × grade × region
after discount    = scaled subtotal × (1 − discount %)
tax               = after discount × tax %
total             = after discount + tax
deposit           = total × deposit %
```

Material quantities include the waste factor. Labor, demo, and room sizes do not.

No backend is required. Everything runs in the browser.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · React 19
