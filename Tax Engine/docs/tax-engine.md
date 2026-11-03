# Tax pipeline and legal scope

The engine accepts owner and tax year, reads source data once in a transaction and executes classification → ordinary-scope validation → authorized expenses → schedule selection → decimal slab calculation → surcharge → authorized withholding → wealth reconciliation → readiness → snapshot.

The 2026 ordinary salary and non-salary tables were checked against the official [FBR Ordinance amended through 31 July 2025](https://download1.fbr.gov.pk/Docs/2025881983148210Income-Tax-Ordinance,-2001-Amended-upto-31.07.2025.pdf), printed pages 490–492. Salary-share selection is strictly greater than 75%. Surcharge is configured, not embedded in the calculator. Seed scope is conservatively limited to ordinary resident income no greater than Rs. 10 million; other cases block for rule review.

TY2027 was independently verified after the official documents became retrievable: [Ordinance amended through 30 June 2026](https://download1.fbr.gov.pk/Docs/2026724177725705IncomeTaxOrdinanace2001.pdf), printed pages 506–509 and section 4AB on page 34, plus [official 2027 rate card](https://download1.fbr.gov.pk/Docs/202681113864992WithholdingTaxRatesCard2027.pdf), pages 1–2. The year has its own published version 2, eight salary brackets and zero salary surcharge. The ordinary non-salaried table was independently checked in the 2026 Ordinance. No runtime fallback to 2026 exists; missing rules in any year still block calculation.

Freelance receipts use Business, never a fictitious statutory head. The user must confirm ordinary local receipts. Investment, property, capital gains, export/final/minimum regimes, exemptions and special cases require their specific verified configuration; incomplete treatment blocks calculation. Business expenses require a verified category authorization; personal expenses are not deducted. The default seed does not pretend every business expense is deductible.

Withholding credit needs matching section, nature, treatment, tax year and certificate reference. Final/minimum amounts are not automatically credits. Loans are not ordinary taxable income; the evidence needed for loan/gift treatment remains a tax-review responsibility. Unknown income categories block.

Money uses Decimal.js; each reported monetary amount is rounded half-up to two decimal places. The engine is deterministic for immutable data and rule inputs. The persisted input hash includes the dataset and full rule configuration. Reports preserve rule sources and substitutions.

Reconciliation: expected closing wealth = opening wealth + non-capital receipts − non-capital expenses + other inflows − other outflows. Transfers are excluded. Explicit Loan Received, Asset Purchase, Investment Purchase and Loan Principal categories are balance-sheet movements and are excluded from wealth creation/consumption; corresponding assets and liabilities must be recorded. Interest remains an expense. `src/domain/wealthFlows.ts` contains this configurable category mapping. Only non-ledger adjustments belong in other inflows/outflows. Withholding already deducted from receipts needs consistent gross income/tax payment ledger entries. Reconciliation differences remain visible and prevent finalization.

Readiness is a data completeness indicator, not FBR approval. Finalization requires all checks and zero wealth difference. No official return is filed.
