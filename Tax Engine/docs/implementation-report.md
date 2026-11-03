# Implementation report — 2 November 2026

## Delivered

One integrated React/Express application backed by a running PostgreSQL database and Prisma migrations. Registration, login, session security, owner-scoped CRUD and profile onboarding are connected to real storage. The former standalone SQLite tax server is retired; both project entry points route to the integrated application.

Financial accounts use reproducible ledger balances. Transfers create linked equal/opposite entries and never count as income or expense. Create, edit and delete are atomic; idempotency and revision checks prevent duplicate submissions and stale writes. Budgets, historical projections, obligations, recurrence discovery, goals/allocation, emergency funds, assets, liabilities, net worth, notifications and reports use saved user data.

The tax adapter reads the same financial records. Year-specific verified rules drive classification, progressive/fixed/final/minimum tax, exemptions, deductions, credits, withholding, surcharge and wealth requirements. Rules and calculation inputs are captured with results. Published rule records and calculation snapshots are protected by database triggers. Draft finalization requires full readiness and reconciled wealth.

Rule administration supports year creation, draft editing, source references, slabs, cloning, verification, publication and deactivation through a new version. Conflicting rules, malformed parameters, slab overlaps/gaps and discontinuities are rejected. PDFs are generated on the server; CSV exports neutralize spreadsheet formulas.

AI, OCR, ASR and NLP parsing are explicit disabled adapters. No model is used for tax or financial arithmetic.

## Verification

- **79 automated tests passed**, including real PostgreSQL authentication/authorization and admin rule-version integration tests, both years' tax boundaries, rounding, transfers, duplicate protection, deductions, credits and immutable snapshots.
- **Full Playwright browser workflow passed**: register, profile, logout/login, account, salary, expense, budget, goal, asset, liability, withholding, tax facts, calculation, slab/trace, wealth statement, reconciliation, finalization, PDF download and logout.
- Responsive document-overflow checks passed at **320, 375, 768 and 1440 pixels**. Desktop/mobile screenshots were visually inspected; mobile tables were adjusted to scroll without breaking currency/date text.
- TypeScript checks and ESLint passed. Production build passed with application and chart bundles separated.
- Dependency audit reported **zero vulnerabilities** after fixes. Prisma remains on the compatible 6.19 line; dependency overrides for deepmerge-ts and minimatch are pinned in the lockfile and verified by the build/tests.
- The documented `npm run db:local` command was tested under Windows PowerShell. The separate project database listens on loopback port 55432.

## Explicit limits

1. **TY2026 and TY2027 ordinary income are independently configured.** TY2027 documents loaded successfully on retry; version 2 contains the verified changed salary brackets and salary surcharge removal. Unavailable rules still block calculation.
2. The verified default numeric coverage is ordinary resident salary/non-salary income up to the conservative scope limit. Other statutory regimes and business expense eligibility require verified configuration. Generic evaluator support does not mean all Pakistan individual-tax rules are legally covered.
3. Declared asset/liability values need review for the selected tax year. Historical valuations and amortization are not inferred. Explicit capital-flow categories prevent loans, asset purchases and principal repayments from masquerading as wealth creation/consumption.
4. This is a local working FYP application. Public production deployment, HTTPS operations, backups/restore procedures, email reset/verification, MFA and distributed rate limiting remain deployment/hardening work. No official FBR filing integration exists.
5. Automated tests retain uniquely named fixture users and test rule revisions in the configured development database. Use a separate test database in CI. Demo identities and transactions are fictional.

See README for startup, private demo credentials, admin promotion and complete API/developer documentation.
