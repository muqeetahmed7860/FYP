# Versioned rules

A rule contains code, year, version, name, description, taxpayer type, income head, rule/formula type, active/verified/published state, legal section/schedule/division/clause, effective period, parameters, conditions, references and slabs.

Conditions use a restricted AND-only DSL: fields taxYear, taxpayerType, residentialStatus, taxableIncome, salaryShare, taxpayerCategory; operators EQ, NE, GT, GTE, LT, LTE and IN. No eval or executable rule text is accepted. Formula parameters are structured data. Conflicting matches fail closed.

Slabs require lowerBound, upperBound (null only for final bracket), baseTax, rate, excessOver and sequence. First lower bound is zero, adjacent bounds match, base tax is continuous, rate is in [0,1] and excessOver equals lowerBound. Rates are decimal strings.

Working evaluators: INCOME_CLASSIFICATION (category → head), SELECTION (salaryShare), SCOPE (maxOrdinaryIncome), REPORTING_REQUIREMENT (supported head), ALLOWABLE_EXPENSE and DEDUCTION (category/rate/annual cap), EXEMPTION (head/rate/cap), PROGRESSIVE_SLAB, SURCHARGE (threshold/rate), FIXED_RATE and FINAL_TAX (separate head/rate), MINIMUM_TAX (tax base/rate, only incremental liability), WITHHOLDING and ADJUSTABLE_TAX (nature/treatment/eligible), TAX_CREDIT (evidenced credit/rate/cap/refundability), and WEALTH_RULE (reconciliation requirement). Parameter schemas reject unknown keys, invalid numbers and executable dependencies. These generic evaluators do not imply that every statutory regime has a verified seed configuration.

Admin workflow: create year → clone prior version (all verification resets) → inspect/edit draft JSON including slabs and source references → verify against official source → publish. Change active=false only in a new draft to deactivate a rule. Published versions cannot be edited; historical calculations retain their own snapshots.

Numeric tax rules are in `prisma/rules.ts` and copied to PostgreSQL by seed. Subsequent changes are managed through the admin API without modifying calculation code. Synthetic test fixtures are clearly labeled TEST-ONLY and never seeded as legal rules.
