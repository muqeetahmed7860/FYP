# Architecture

The active application is `src/IntegratedApp.tsx` + `server/start.ts`. React/Vite and Express retain the existing prototype stack, avoiding a disruptive framework rewrite. The frontend never calculates tax. Requests pass through authentication, CSRF verification, strict Zod validation, application services, pure financial domain functions and Prisma/PostgreSQL.

Finance: `server/routes/finance.ts` → `server/services/ledger.ts` / `finance.ts` → `src/domain/finance.ts` / `money.ts`.

Tax: `server/services/tax.ts` builds an owner-scoped dataset from the same ledger and declared wealth records. `src/domain/tax.ts` resolves a single applicable verified rule, calculates decimal amounts and produces explanations. A serializable transaction saves the dataset, rule version, input hash, result, calculation steps, wealth snapshot and audit record together.

The original tax prototype files remain reference material. They are not imported by the integrated entry point. The old static Expense Tracker is a design reference and not an authenticated data source. Its sample OCR, voice and AI behavior is intentionally not carried forward.

All money crosses the API as decimal strings and uses Decimal.js with precision 40. Display-only chart values are converted to numbers in React; they are never used for persisted calculations.

The local database helper creates a separate PostgreSQL cluster on port 55432, inside ignored `.local-postgres`, with generated SCRAM credentials. It does not change the existing system cluster.
