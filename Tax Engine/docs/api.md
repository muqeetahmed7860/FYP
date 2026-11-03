# API

JSON request/response. Monetary inputs are decimal strings with up to two fractional digits. Date inputs are YYYY-MM-DD. Errors use `{error:{code,message}}`. All routes except register/login/health require the session cookie. Mutations require `x-csrf-token`, returned by authentication and `/api/auth/me`.

| Route | Methods / behavior |
| --- | --- |
| /api/auth/register, /login | POST name/email/password or email/password |
| /api/auth/me | GET current user and CSRF token |
| /api/auth/logout | POST invalidate current session |
| /api/accounts | GET ledger balances, POST create |
| /api/accounts/:id | PUT update/archive, DELETE empty account |
| /api/transactions | GET paginated filtered records, POST create |
| /api/transactions/:id | PUT with revision, DELETE atomically reverse entries |
| /api/categories | GET shared category reference data |
| /api/budgets, /goals, /assets, /liabilities, /withholding, /recurring | GET / POST; PUT / DELETE /:id |
| /api/recurring/discover | POST pattern analysis |
| /api/goals/recommend-allocation | POST {available,save} |
| /api/emergency-fund | GET; POST /calculate |
| /api/net-worth | GET current and history; POST /snapshot |
| /api/profile | GET masked profile, PUT edit |
| /api/dashboard | GET aggregates and trends |
| /api/notifications | GET generated notifications; PUT /:id mark read |
| /api/tax/years | GET years/status/version |
| /api/tax/profile/:year | GET additional facts; PUT /api/tax/profile |
| /api/tax/:year/data | GET standardized dataset from source records |
| /api/tax/calculate | POST {taxYear}; optional userId must match session |
| /api/tax/:year/calculate | POST equivalent calculation route |
| /api/tax/calculations | GET history (?year=); GET /:id; POST /:id/finalize |
| /api/tax/rules | GET ?year= (admins can inspect ?version=) |
| /api/tax/wealth-statement | GET ?year=; POST {taxYear} |
| /api/tax/reconcile | POST {taxYear} |
| /api/reports | GET saved reports |
| /api/reports/tax | POST {calculationId} → PDF URL |
| /api/reports/finance | POST → PDF URL |
| /api/reports/:id/pdf | GET authenticated server-generated PDF |
| /api/reports/export.csv | GET ?type=transactions/budgets/goals/assets/liabilities/withholding |
| /api/audit | GET own audit trail |
| /api/admin/overview | GET admin summary |
| /api/admin/tax-years | POST {year} |
| /api/admin/rules | POST complete draft rule document |
| /api/admin/rules/clone | POST sourceYear/sourceVersion/targetYear/targetVersion |
| /api/admin/rules/publish | POST taxYear/version |

Transaction filters: search, accountId, type, categoryId, from, to, min, max, paymentMethod, taxRelevant, sort=date/amount, direction=asc/desc, page. Page size 100. Create requires a UUID idempotencyKey. A transfer requires distinct owned accountId and destinationAccountId; category is ignored. Income/expense require a matching category.

Account openingBalance/openingDate become immutable after activity. Asset inventory excludes cash/bank to avoid double counting; add those as accounts instead. Goal allocation saves a recommendation and never silently moves money.
