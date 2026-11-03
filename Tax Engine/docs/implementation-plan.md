# HisabKetab implementation plan

One React/TypeScript application and Express API, retaining the existing visual language. PostgreSQL with Prisma replaces the isolated SQLite tax prototype. All authenticated records are owner-scoped; database transactions protect ledger writes and immutable tax snapshots. Decimal strings cross API boundaries; Decimal arithmetic is confined to domain/services. The tax adapter reads the same transaction, account, asset, liability and withholding records used by finance pages.

## Migration

The static Expense Tracker remains a reference, not a second runtime. Existing fictional SQLite imports are not migrated into real user accounts. Registration creates an empty private workspace; an explicit development seed creates four fictional personas. The existing tax components and styles are retained as reference while the integrated pages consume the authenticated API.

## Ordered checklist

1. Foundation, relational schema, migrations, credentials and sessions.
2. Categories, account ledger, linked transfers and transaction CRUD.
3. Dashboard, budgets, financial reports.
4. Recurrence discovery, goals/allocation, emergency fund, net worth.
5. Assets, liabilities, financial profile.
6. Versioned tax years/rules/slabs and source records.
7. Classification, deterministic decimal calculation, withholding.
8. Wealth snapshots and reconciliation.
9. Explanations, rule explorer, audit trail.
10. Server PDF and CSV reports.
11. Admin draft/clone/publish workflows.
12. Security review, unit/integration/E2E tests, responsive verification.

Unverified or unsupported tax treatment blocks calculation. AI, OCR, ASR and NLP parsing are disabled integration interfaces only.
