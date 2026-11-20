# HisabKetab AI

A responsive, frontend-only FYP prototype built with HTML, CSS, and vanilla JavaScript. Open `index.html` directly in a browser. No installation or build step is needed.

The default view is the dashboard. Open `index.html#splash` to demonstrate splash → login, or use Settings → Help & Support → Replay onboarding. Signup uses the displayed demo OTP `123456`.

## Demo journeys

- Home → Add transaction → Manual, Voice, or Scan receipt. Voice supports press-and-hold and a sample playback button. Receipt scanning accepts an image or the sample receipt. Both require review and confirmation.
- Transactions → search, filters, date range, sorting, details, editing, duplication, recurring flags, and deletion.
- Budget → monthly/weekly limits, category budgets, AI optimization, and recurring obligations.
- Goals → creation/editing, savings contributions, allocation, and personalized emergency-fund estimates.
- Insights → five chart views and financial health.
- Assets → add/edit assets and liabilities.
- Tax → explainable sample calculation, document checklist, reconciliation, and printable report. Export PDF opens the browser print dialog; choose Save as PDF.
- AI Assistant → simulated answers from current session data.
- Settings → profiles, language preference, demo connections, notifications, data export, and admin demonstration.

## Important data boundaries

All edits live in memory and reset on reload. No backend, database, authentication, speech recognition, OCR, AI service, bank integration, payment processing, or FBR integration is implemented. No financial data is uploaded. Uploaded receipt contents are not analyzed; sample extraction is deliberately fixed.

Dashboard balance/income/expenses and budget remaining respond to transaction changes. Sample historical charts/category baselines are labeled illustrative. Goal contributions update tracked savings only; they do not transfer money. Allocation acceptance saves a plan without transferring funds.

Home tracked wealth starts at Rs. 1,850,000; the separate full asset inventory starts at Rs. 4,550,000 net worth. Annual tax/reconciliation/report amounts are a separate sample scenario. The tax demo uses an expressly illustrative 5% rule, not an official Pakistani tax slab. The optimization scenario has 12 remaining days by design; it is not the calendar day count for October 7.

The language selector saves English, Urdu, or Roman Urdu preferences. Primary interface copy remains English. Currency is PKR.
