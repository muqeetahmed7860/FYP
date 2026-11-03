# Verification

- `npm run typecheck` checks frontend, server, seed, scripts and tests.
- `npm run lint` checks active integrated code. Retained prototype reference files are excluded.
- `npm test` runs pure financial/tax tests, retained tax regressions and real PostgreSQL integration tests. Seed categories/rules first.
- `npm run test:e2e` launches/reuses the local server and runs Chrome via Playwright. Requires installed Chrome. Registers a unique user and tests login, accounts, salary/expense records, budget, goal, asset, liability, withholding, tax profile, calculation, slab, trace, wealth, reconciliation, finalization, PDF download and logout.
- Browser test captures desktop/mobile screenshots and checks document overflow at 320, 375, 768 and 1440 pixels.

Integration tests create uniquely named users in the configured database and retain their records for debugging. Run against a dedicated local/test database, not a production database. No production credentials belong in CI.

Tests cover decimal half-up rounding, balance edit/delete behavior, transfer conservation, budget arithmetic, bounded allocation, recurrence date variation, wealth differences, salary boundaries, missing/unverified/wrong-year/conflicting rules, multiple heads, withholding/refund positions, authorized expenses, and personal expense non-deductibility. API tests verify authorization, CSRF, duplicate protection, hash storage, private reports and historical snapshot preservation.
