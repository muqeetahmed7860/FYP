# Database and migrations

`prisma/schema.prisma` is the relational schema. Apply committed SQL migrations with `npm run db:migrate`; generate types using `npm run db:generate`.

User owns Profile, FinancialAccount, Transaction, Budget, FinancialGoal, RecurringObligation, Asset, Liability, IncomeSource, WithholdingTaxRecord, TaxProfile, TaxCalculation, WealthStatement, GeneratedReport, Notification and AuditLog. Session tokens are stored hashed. Every API read and write includes the authenticated owner ID.

TransactionCategory is shared reference data. Transaction has ledger entries; transfers have two linked, equal and opposite entries under one transaction. Balances equal opening balance plus entries through the requested date. Editing replaces all linked entries atomically, deleting cascades to entries. A unique user/idempotency key prevents duplicate submission. Revision numbers detect stale edits. Accounts with activity can be archived, not deleted; their opening balance/date are locked.

BudgetCategory links category-scoped plans. GoalAllocation stores recommendations separately from contributions and account balances. Asset values exclude bank/cash (already counted from accounts). Ownership percentage is applied once. Negative account balances become liabilities in wealth statements.

TaxYear selects a published version; TaxRule has relational TaxSlab, TaxRuleCondition and TaxRuleReference records. Publishing never rewrites an existing version. TaxCalculation and child steps contain immutable historical data; finalization changes status only. WealthStatementAsset, WealthStatementLiability and WealthReconciliation preserve reviewed snapshots.

Declared asset and liability values represent the values reviewed at snapshot time; the app does not infer a historical property valuation or loan amortization. Review these before generating a tax-year snapshot. Account balances are reconstructed as of tax-year end.

Database triggers prevent calculation-result updates/deletes, mutation of published rules and child records, and ledger ownership mismatches. Check constraints enforce monetary bounds, transfer shape, goal bounds and budget dates. Production deployments require backups, least-privilege database credentials, TLS and restore testing. Demo seeding is explicitly forbidden under NODE_ENV=production.
