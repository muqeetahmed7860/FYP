# HisabKetab AI

A working, integrated Pakistan personal-finance and individual tax-preparation application. React + TypeScript + Tailwind + Express + PostgreSQL + Prisma. The existing green visual language is preserved with responsive desktop navigation and mobile bottom navigation.

## Run on this computer

```powershell
cd "F:\RIPHAH\FYP HisabKetab AI\FYP Project\Tax Engine"
npm run db:local
npm run dev
```

Open **http://127.0.0.1:3000** and create an account. The local database and migrations have already been installed. Registration creates an empty private workspace.

Four fictional demo accounts are available: `demo1@hisabketab.local` through `demo4@hisabketab.local`. Their password is the generated `DEMO_PASSWORD` in the ignored `.env` file. No password is hard-coded or committed. Never deploy these accounts to production.

## Fresh installation

Requires Node.js 24+, npm and PostgreSQL. The optional Windows helper expects PostgreSQL 18 at `C:\Program Files\PostgreSQL\18\bin` and creates a separate loopback cluster on port 55432.

```powershell
npm ci
npm run db:local
npm run db:generate
npm run db:migrate
npm run seed
# Optional fictional scenarios:
npm run seed:demo
npm run dev
```

For another PostgreSQL installation, copy `.env.example` to `.env`, configure a private `DATABASE_URL`, and skip `db:local`. `APP_ORIGIN` must match the browser URL. `PORT` defaults to 3000. `NODE_ENV=production` enables Secure cookies and production headers; production therefore needs HTTPS. `npm run build` builds the frontend; `npm start` serves it. Production database migration is `npm run db:migrate`.

To give an existing user administration access locally:

```powershell
npm run admin -- your-registered-email@example.com
```

## Working modules

- Credentials authentication, database sessions, profile/onboarding and masked CNIC.
- Accounts, transaction CRUD, search/filter/sort/pagination, idempotency and linked transfers. Balances are reconstructed from the ledger; edits and deletes reverse previous effects atomically.
- Dashboard charts, weekly/monthly/category budgets, threshold alerts, historical-spending projections and reserved-obligation daily spending recommendations.
- Pattern-based recurring discovery with confidence and confirm/reject/edit controls.
- Goals and bounded allocation plans; deterministic emergency fund estimates; declared assets/liabilities and net-worth snapshots.
- A shared tax-data adapter: users do not re-enter salary, expenses, assets, liabilities or withholding.
- Versioned tax years, relational rules/slabs/conditions/references, deterministic Decimal calculations, rule explanations, withholding/credit treatment and readiness.
- Wealth statements, reconciliation, immutable draft/finalized calculation snapshots, source/input hashes, audit logs and database-level immutability guards.
- Server-generated financial/tax PDFs, CSV exports, notifications, admin draft editing, cloning, verification and publication.
- Explicitly disabled AI, OCR, ASR and future financial-text-parser interfaces. No simulated model output.

## Tax scope and verification

The verified numeric seeds cover **TY2026 and TY2027 ordinary resident salary/non-salary income**, limited conservatively to ordinary receipts up to Rs. 10 million. TY2026 slabs were checked against the [2025 FBR Ordinance edition](https://download1.fbr.gov.pk/Docs/2025881983148210Income-Tax-Ordinance,-2001-Amended-upto-31.07.2025.pdf), printed pages 490–492; TY2027 uses the [2026 edition](https://download1.fbr.gov.pk/Docs/2026724177725705IncomeTaxOrdinanace2001.pdf), printed pages 506–509, cross-checked with the official 2027 withholding rate card. Personal expenses are not automatically tax deductions. Freelance receipts use the Business head, subject to the configured facts/regime.

TY2027 is a separately verified version 2 with its changed eight salary brackets and zero salaried surcharge. No calculation falls back to another year's rules. Missing legal treatment is blocked. Special property/investment/capital-gain/export/final/minimum regimes and business deduction eligibility require additional verified configuration. Generic evaluators exist for classification, exemptions, deductions, allowable expenses, credits, progressive/fixed/final/minimum tax, withholding, surcharge and wealth rules; they are not a claim of complete legal coverage.

Every result is a saved snapshot. Re-run after changing source records. Finalization requires complete readiness and zero reconciliation difference. Declared asset/liability values must be reviewed for the selected year; historical market values and loan amortization are not inferred. Other wealth adjustments must exclude amounts already represented in the ledger.

This application assists preparation. It is not an official FBR return, filing integration, proof of filing or legal certification.

## Architecture and money

`src/IntegratedApp.tsx` → authenticated API routes → `server/services` → `src/domain` → Prisma/PostgreSQL. All financial amounts are decimal strings in APIs, NUMERIC in PostgreSQL and Decimal.js in domain calculations. Reported money rounds half-up to two decimal places. Chart formatting is display-only. Transfers, related ledger changes, goal plans and calculation snapshots use database transactions.

The original static `Prototype UI` folder and unused tax presentation modules are retained as references. Both tax application entry points now resolve to the integrated app; the former SQLite server has been removed. Existing fictional SQLite data is not imported into real accounts.

## Tests

```powershell
npm run typecheck
npm run lint
npm test
npm run build
npm run test:e2e
npm audit
```

Tests use the configured local database and create unique fixture accounts, plus an isolated test rule year 2099. Use a dedicated test database in CI. Browser tests require installed Google Chrome. They cover registration/login, finance CRUD, tax calculation, slab/trace review, wealth reconciliation, finalization, PDF download, logout and 320/375/768/1440px overflow checks.

## Documentation

- [Implementation plan](docs/implementation-plan.md)
- [Architecture](docs/architecture.md)
- [Database](docs/database.md)
- [Tax engine](docs/tax-engine.md)
- [Rule format](docs/tax-rule-format.md)
- [API](docs/api.md)
- [Security](docs/security.md)
- [AI/OCR/ASR integration](docs/ai-integration.md)
- [Testing](docs/testing.md)
- [Final implementation report](docs/implementation-report.md)

Production hardening still needs operational hosting/TLS, backups, email verification/reset, MFA and centralized rate limiting for multiple server instances. None of these are represented as already deployed.
