# HISABKETAB AI — FULL WORKING FYP APPLICATION

Build a complete, production-structured full-stack application called:

# HisabKetab AI

HisabKetab AI is a Pakistan-focused personal finance, expense tracking, budgeting, financial planning, wealth management and income-tax preparation platform.

This project already had separate frontend prototypes for:

1. Expense Tracker
2. Tax Engine

Do NOT build another prototype.

Build a fully integrated WORKING application with:

- Real database
- Real authentication
- Real backend
- Real frontend
- Real CRUD functionality
- Working financial calculations
- Working budgeting
- Working financial goals
- Working recurring-obligation detection
- Working emergency-fund calculation
- Working tax calculation engine
- Working wealth statement
- Working wealth reconciliation
- Working tax-rule engine
- Working reports
- Working audit trail
- Working admin tax-rule management
- Automated testing
- Proper validations
- Proper API architecture
- Security controls

The following modules will be integrated LATER and must therefore use placeholder adapters/interfaces only:

- AI / LLM model
- OCR model
- ASR / Speech-to-Text model

Do NOT build fake AI, OCR or ASR.

Instead create clean integration interfaces for them so real models can be connected later without redesigning the system.

==================================================
1. CORE PRINCIPLE
==================================================

The architecture must be:

Frontend
    ↓
Backend API
    ↓
Application Services
    ↓
Financial Domain Layer
    ↓
Database

and separately:

Financial Data
    ↓
Tax Data Adapter
    ↓
Tax Classification
    ↓
Tax-Year Rule Engine
    ↓
Deterministic Tax Calculator
    ↓
Withholding/Credit Engine
    ↓
Wealth Statement Engine
    ↓
Wealth Reconciliation
    ↓
Calculation Audit Trail
    ↓
Tax Report

Never calculate tax using an LLM.

Never generate tax rates using AI.

Never calculate tax directly in frontend components.

All tax calculations must be deterministic.

==================================================
2. PROJECT SCOPE
==================================================

This project is primarily for INDIVIDUAL taxpayers in Pakistan.

Supported user types:

- Salaried individual
- Freelancer
- Self-employed professional
- Sole proprietor / individual business owner
- Landlord
- Investor
- Mixed-income individual

Do NOT attempt to implement:

- Corporate income tax
- Partnership/AOP taxation unless explicitly added later
- Sales tax
- Federal Excise
- Customs
- Company accounting
- Payroll system

Keep the scope focused on personal finance and individual income tax.

==================================================
3. RECOMMENDED TECHNOLOGY STACK
==================================================

Use:

Frontend:
- Next.js
- React
- TypeScript
- Tailwind CSS

Backend:
- Next.js server/API routes OR separate Node.js/Express service
- TypeScript

Database:
- PostgreSQL

ORM:
- Prisma

Authentication:
- Secure credentials authentication
- bcrypt/Argon2 password hashing
- session/JWT implementation following secure best practices

Validation:
- Zod

Charts:
- Recharts or equivalent

PDF/report generation:
- server-side PDF generation library

Testing:
- Vitest/Jest
- Supertest if required
- Playwright for end-to-end testing

Database migrations:
- Prisma migrations

Use environment variables for secrets.

==================================================
4. CODEBASE STRUCTURE
==================================================

Use a clean modular structure similar to:

/src
  /app
  /components
  /features
      /auth
      /transactions
      /accounts
      /budgets
      /goals
      /recurring
      /emergency-fund
      /assets
      /liabilities
      /reports
      /tax
  /server
  /services
  /repositories
  /domain
  /lib
  /validators

  /tax-engine
      /classification
      /rules
      /calculator
      /withholding
      /wealth
      /reconciliation
      /explanation
      /audit
      /validation

  /integrations
      /ai
      /ocr
      /asr

/prisma
/tests

Do not create one large application file.

==================================================
5. DATABASE DESIGN
==================================================

Design proper relational tables.

At minimum create:

users

profiles

financial_accounts

transactions

transaction_categories

budgets

budget_categories

financial_goals

goal_allocations

recurring_obligations

assets

liabilities

income_sources

withholding_tax_records

tax_profiles

tax_years

tax_rules

tax_slabs

tax_rule_conditions

tax_rule_references

tax_calculations

tax_calculation_steps

wealth_statements

wealth_statement_assets

wealth_statement_liabilities

wealth_reconciliations

generated_reports

notifications

audit_logs

system_settings

==================================================
6. USER TABLE
==================================================

Include:

id
email
phone
passwordHash
role
status
createdAt
updatedAt

Roles:

USER
ADMIN

Do not store plain-text passwords.

==================================================
7. USER FINANCIAL PROFILE
==================================================

Include:

name
CNIC
occupation
taxpayerType
residentialStatus
preferredCurrency
monthlyIncomeEstimate
primaryIncomeType
taxRegistrationStatus
NTN if applicable

Mask CNIC in the frontend.

Example:

35202-*****-7

==================================================
8. FINANCIAL ACCOUNTS
==================================================

Allow users to create:

- Cash
- Bank Account
- Debit/Card account
- Credit Card
- Easypaisa
- JazzCash
- Investment Account
- Other Wallet

Fields:

accountName
accountType
openingBalance
currentBalance
institution
currency
active

==================================================
9. TRANSACTION ENGINE
==================================================

Users must be able to:

Create
Read
Update
Delete
Search
Filter
Sort

transactions.

Transaction fields:

id
userId
accountId
type

INCOME
EXPENSE
TRANSFER

amount
date
category
subcategory
merchant
description
paymentMethod
person
taxRelevant
businessOrPersonal
recurring
source
createdAt

Sources:

MANUAL
OCR
VOICE
IMPORT
SYSTEM

For now:

MANUAL must work completely.

OCR and VOICE should use placeholder integration adapters.

==================================================
10. TRANSFERS
==================================================

A transfer between a user's own accounts must NOT count as income or expense.

Example:

Bank → Easypaisa

Rs. 10,000

Create linked transfer records.

Prevent double counting.

==================================================
11. ACCOUNT BALANCES
==================================================

Account balances must update correctly after:

Income
Expense
Transfer
Edit
Delete

Prefer ledger-based balance calculation where practical.

Financial totals must be reproducible from transactions.

==================================================
12. EXPENSE CATEGORIES
==================================================

Seed categories such as:

Food
Groceries
Transport
Petrol
Rent
Utilities
Internet
Mobile
Healthcare
Education
Shopping
Entertainment
Travel
Insurance
Debt Payment
Charity
Business Expense
Professional Expense
Tax Payment
Other

Income categories:

Salary
Freelance
Business
Rental
Investment
Capital Gain
Gift
Loan Received
Refund
Other

Important:

Loan received is NOT ordinary taxable income by default.

Transfers are NOT income.

These distinctions must remain configurable for tax classification.

==================================================
13. DASHBOARD
==================================================

Display:

Available balance
This month's income
This month's expenses
Savings
Savings rate
Net worth
Monthly budget status
Upcoming obligations
Goal progress
Tax readiness

Charts:

Income vs expenses
Spending categories
Monthly trend
Savings trend

==================================================
14. BUDGET MANAGEMENT
==================================================

Users can create:

Weekly budgets
Monthly budgets
Category budgets

Budget fields:

period
startDate
endDate
amount
category
alertThreshold

Calculate:

Spent
Remaining
Percentage used

Formula:

remainingBudget =
budgetLimit - eligibleExpenses

Show alerts at configurable levels such as:

75%
90%
100%

==================================================
15. ADAPTIVE BUDGET OPTIMIZATION
==================================================

Implement a deterministic initial version without AI.

Inputs:

Current budget
Spent amount
Remaining days
Historical daily spending
Recurring obligations due before period end
Savings target

Calculate:

Projected Period Spending

Recommended Remaining Discretionary Amount

Recommended Daily Spending Limit

Example concept:

availableDiscretionary =
remainingBudget
- upcomingMandatoryObligations

recommendedDailySpend =
availableDiscretionary / remainingDays

Also calculate spending trend from historical periods.

Structure this service so a forecasting/AI model can replace or enhance the algorithm later.

==================================================
16. RECURRING FINANCIAL OBLIGATION DISCOVERY
==================================================

Implement working pattern-based discovery.

Do not use AI initially.

Analyze past transactions for:

- Same/similar merchant
- Similar amount
- Similar category
- Approximate periodic interval
- Monthly recurrence
- Weekly recurrence
- Quarterly recurrence
- Annual recurrence

Calculate a recurrence confidence score.

Example factors:

frequency consistency
date interval consistency
amount similarity
merchant similarity

Output:

CONFIRMED
LIKELY
POSSIBLE

Allow users to:

Confirm
Reject
Edit

Store confirmed obligations separately.

Examples:

Rent
Internet
Mobile bill
Loan installment
Subscriptions
Insurance

==================================================
17. FINANCIAL GOALS
==================================================

Users can create goals:

Emergency Fund
House
Vehicle
Education
Vacation
Investment
Debt Repayment
Custom

Fields:

targetAmount
currentAmount
targetDate
priority
minimumContribution
status

==================================================
18. FINANCIAL GOAL CONFLICT RESOLUTION
==================================================

Implement deterministic goal allocation.

Inputs:

Available monthly surplus
Goal priority
Target amount
Remaining requirement
Deadline
Minimum contribution

Allocate available funds between competing goals.

The algorithm must respect:

available funds
minimum contributions
priority
deadlines

It must never allocate more money than available.

Return:

recommended allocation per goal

and explanation.

Keep this algorithm replaceable by a more advanced optimization model later.

==================================================
19. PERSONALIZED EMERGENCY FUND ESTIMATION
==================================================

Do NOT use Monte Carlo Simulation.

Calculate a personalized recommendation using:

Essential monthly expenses
Income stability
Recurring obligations
Dependents if provided
Debt obligations
Employment/income type
Current savings

Create a transparent deterministic scoring approach.

Example:

Base emergency coverage:
3 months of essential expenses

Then adjust months of recommended coverage according to:

Stable salary → lower multiplier
Variable freelance/business income → higher multiplier
High debt obligations → increase
Dependents → increase

Keep all coefficients configurable.

Show:

Recommended emergency fund
Current emergency savings
Funding gap
Months of coverage
Calculation explanation

==================================================
20. ASSETS
==================================================

Support:

Cash
Bank balance
Property
Vehicle
Investment
Gold
Business interest
Other

Fields:

description
assetType
acquisitionDate
acquisitionCost
currentDeclaredValue
sourceOfFunds
ownershipPercentage

==================================================
21. LIABILITIES
==================================================

Support:

Loan
Mortgage
Credit card
Personal debt
Business liability
Other

Fields:

description
liabilityType
originalAmount
outstandingAmount
lender
startDate
endDate

==================================================
22. NET WORTH
==================================================

Calculate:

Net Worth =
Total Assets - Total Liabilities

Provide historical net-worth snapshots.

==================================================
23. TAX ENGINE — MAIN REQUIREMENT
==================================================

Create a reusable Tax Engine service.

It must work independently from the UI.

Primary API:

POST /api/tax/calculate

Input:

userId
taxYear

The engine must fetch required financial information from the HisabKetab database.

Do NOT require duplicate tax-entry data if the information already exists in the expense tracker.

==================================================
24. TAX DATA ADAPTER
==================================================

Create:

buildTaxDataset(userId, taxYear)

It must gather:

User profile

Income transactions

Business/professional expenses

Personal expenses

Tax payments

Withholding taxes

Assets

Liabilities

Opening wealth

Closing wealth

Capital transactions

Investment-related transactions

Property/rental records

Return one standardized TaxDataset.

==================================================
25. TAX YEAR
==================================================

Never use one universal tax configuration.

Create:

TaxYear

with:

year
startDate
endDate
status
ruleVersion

Support at least:

Tax Year 2026
Tax Year 2027

Tax rules must be versioned.

==================================================
26. AUTHORITATIVE TAX SOURCES
==================================================

Tax rules must be entered and verified against authoritative Pakistan sources, including:

Income Tax Ordinance, 2001

Income Tax Rules, 2002

Applicable Finance Act

First Schedule

Official FBR withholding tax rate cards

Never create a tax rate merely because an LLM suggests it.

Every stored tax rule must have:

sourceDocument
section
schedule
division
clause if relevant
effectiveDate
taxYear
version
verified status

==================================================
27. CURRENT SOURCE BASELINE
==================================================

At the time of development, use the latest verified official FBR publications.

The implementation should support updating the legal source without changing application code.

Never assume tax rates remain unchanged between tax years.

==================================================
28. TAX HEAD CLASSIFICATION
==================================================

Support the major individual heads:

Salary

Income from Property

Income from Business

Capital Gains

Income from Other Sources

Relevant framework references should support:

Section 9
Taxable Income

Section 10
Total Income

Section 11
Heads of Income

Section 12
Salary

Section 15
Income from Property

Section 18
Income from Business

Section 37
Capital Gains

Section 39
Income from Other Sources

Do not rely only on these numbers.

Actual rule behavior must come from configured legal rules.

==================================================
29. FREELANCE INCOME
==================================================

Do not create a fictitious statutory "freelance income" head.

Treat freelance/professional receipts according to configured tax classification rules.

The engine must support different treatment where required by:

taxpayer facts
income source
tax year
relevant legal provisions

==================================================
30. TAX RULE MODEL
==================================================

Each tax rule should contain:

id

ruleCode

taxYear

name

description

taxpayerType

incomeHead

legalSource

section

schedule

division

clause

effectiveFrom

effectiveTo

priority

ruleType

formulaType

active

verified

notes

==================================================
31. TAX RULE TYPES
==================================================

Support:

INCOME_CLASSIFICATION

EXEMPTION

DEDUCTION

ALLOWABLE_EXPENSE

TAX_CREDIT

PROGRESSIVE_SLAB

FIXED_RATE

WITHHOLDING

SURCHARGE

MINIMUM_TAX

FINAL_TAX

ADJUSTABLE_TAX

WEALTH_RULE

REPORTING_REQUIREMENT

==================================================
32. RULE CONDITIONS
==================================================

Rules should support conditions.

Example:

taxYear = 2027

AND

taxpayerCategory = SALARIED

AND

salaryIncomePercentage meets configured criteria

AND

taxableIncome > threshold

Do not scatter conditions throughout application code.

Use a rule evaluation layer.

==================================================
33. TAX SLAB TABLE
==================================================

Create tax_slabs:

id
ruleId
lowerBound
upperBound
baseTax
rate
excessOver
sequence

Use DECIMAL types.

Never use JavaScript floating-point arithmetic for currency calculations where precision matters.

Use Decimal libraries / database decimal types.

==================================================
34. PROGRESSIVE TAX ALGORITHM
==================================================

Use a generic calculator:

Tax =
Base Tax
+
(Taxable Income - Excess Threshold)
× Rate

The calculator receives the applicable slab.

It does NOT contain tax-year-specific numbers.

==================================================
35. TAXABLE INCOME
==================================================

Calculate taxable income according to configured rules.

Do NOT calculate:

income - every expense

because personal expenses are not automatically tax deductions.

Separate:

Personal expenses

from:

Potential allowable business/professional expenses.

Only apply a deduction when an enabled tax rule authorizes it.

==================================================
36. WITHHOLDING TAX
==================================================

Create withholding_tax_records.

Fields:

userId
taxYear
date
amount
section
nature
payer
certificateReference
taxTreatment

Treatment:

ADJUSTABLE
FINAL
MINIMUM
NON_CREDITABLE
REVIEW_REQUIRED

Do not automatically subtract every withholding amount from final liability.

The applicable rule determines treatment.

==================================================
37. WITHHOLDING RULES
==================================================

Because Pakistan withholding treatment varies by provision, store withholding rules separately.

Every withholding result should show:

Section
Transaction nature
Rate
Tax base
Tax amount
Treatment
Credit allowed or not
Rule reference

==================================================
38. TAX CALCULATION PIPELINE
==================================================

Run calculations in a fixed sequence:

1. Validate tax profile

2. Determine tax year

3. Retrieve financial dataset

4. Classify income

5. Determine applicable taxpayer category

6. Calculate income under each head

7. Apply allowed deductions/adjustments

8. Calculate taxable income

9. Resolve applicable tax calculation rules

10. Apply progressive slab/fixed rules

11. Apply additional applicable rules where configured

12. Calculate gross tax liability

13. Process withholding and eligible credits

14. Calculate net tax payable

15. Determine potential refund position where appropriate

16. Prepare wealth statement

17. Perform wealth reconciliation

18. Determine tax-data completeness

19. Save immutable calculation snapshot

20. Generate calculation explanation

==================================================
39. CALCULATION OUTPUT
==================================================

Output:

Tax year

Taxpayer type

Income by head

Total income

Taxable income

Applied slab

Base tax

Marginal rate

Tax on excess

Gross tax liability

Eligible credits

Adjustable withholding

Net estimated tax payable

Potential refund if applicable

Rules applied

Calculation steps

Wealth summary

Reconciliation result

Completeness/readiness result

==================================================
40. EXPLAINABLE TAX RULE REASONING ENGINE
==================================================

This is a major CCP.

Every calculated amount must be explainable.

Generate TaxCalculationStep records.

Fields:

sequence

stepName

inputAmount

ruleId

ruleCode

legalSource

section

schedule

clause

formula

substitution

result

reasonApplied

Example:

Step:
Salary Tax Calculation

Rule:
TY2027-SAL-05

Applicable because:
Taxpayer satisfies configured salaried-person condition and taxable salary falls within the configured range.

Formula:
Base Tax + (Taxable Income - Threshold) × Rate

Substitution:
Rs. X + (Rs. Y - Rs. Z) × R%

Result:
Rs. N

==================================================
41. RULE EXPLORER
==================================================

Frontend page:

Tax → Rule Explorer

Allow searching by:

Tax Year
Income Head
Taxpayer Type
Section
Rule Code

Show:

Legal source
Section
Schedule
Clause
Rule description
Conditions
Formula
Effective period
Verification status

==================================================
42. TAX ADMIN RULE MANAGER
==================================================

Admins can:

Create tax year

Create tax rule

Edit draft rule

Add slab

Edit slab

Add source reference

Deactivate rule

Clone prior year's rules

Publish new rule version

Never silently modify rules already used in finalized calculations.

Use rule versioning.

==================================================
43. RULE PUBLISHING
==================================================

Rule status:

DRAFT
VERIFIED
ACTIVE
RETIRED

Only ACTIVE + VERIFIED rules may be used for final calculations.

==================================================
44. PREVENT INVALID TAX CONFIGURATION
==================================================

Validate:

Duplicate active rules

Overlapping slab ranges

Missing ranges

Missing base-tax values

Missing excess thresholds

Negative rates

Invalid effective periods

Unverified source

Circular rule dependencies

==================================================
45. TAX CALCULATION SNAPSHOTS
==================================================

When tax is calculated, save:

Financial data snapshot

Tax rule version

Applicable rules

Calculation inputs

Calculation outputs

Timestamp

Do not allow historical results to silently change when tax rules are later updated.

==================================================
46. WEALTH STATEMENT
==================================================

Implement wealth-statement preparation for the user's tax year.

Show:

Cash

Bank balances

Vehicles

Property

Investments

Other assets

Total assets

Loans

Other liabilities

Total liabilities

Net wealth

==================================================
47. WEALTH RECONCILIATION
==================================================

Implement:

Change in Wealth =
Closing Net Wealth - Opening Net Wealth

Compare financial sources and uses according to configured reconciliation logic.

Display:

Opening Wealth

Closing Wealth

Increase/Decrease in Wealth

Income

Personal Expenses

Other declared inflows

Other declared outflows

Adjustments

Calculated Difference

Status:

RECONCILED

NOT_RECONCILED

REVIEW_REQUIRED

Do not hide discrepancies.

==================================================
48. TAX READINESS / DATA COMPLETENESS
==================================================

This is NOT a legal certification.

Calculate data completeness based on:

Profile complete

Income sources recorded

Withholding information recorded

Assets recorded

Liabilities recorded

Personal expenses available

Opening wealth available

Wealth reconciliation complete

Required tax-rule set available

Display:

Tax Data Readiness: X%

Clearly label this as:

"Data completeness indicator — not FBR approval."

==================================================
49. TAX REPORT
==================================================

Generate:

HISABKETAB AI
INCOME TAX CALCULATION & TAX READINESS REPORT

Include:

Taxpayer profile

Tax year

Income summary

Income by head

Deductions/adjustments

Taxable income

Tax slab

Gross tax liability

Withholding and credits

Net estimated tax payable

Assets

Liabilities

Net wealth

Wealth reconciliation

Rules applied

Legal references

Calculation trail

Data completeness

Report generation timestamp

Footer:

"This report is generated by HisabKetab AI for tax-preparation assistance. It is not an official FBR return or proof of filing."

==================================================
50. FBR / IRIS
==================================================

Do NOT claim direct filing unless an official supported integration exists.

Do NOT request or store the user's FBR/IRIS password.

Do NOT automate unofficial login to IRIS.

Instead generate structured information suitable for assisting a user when preparing their FBR return.

Create an export/data-mapping layer so future official integration can be added.

==================================================
51. TAX YEAR 2026 AND 2027
==================================================

Seed rule structures for both years.

The developer must verify actual numeric rates/slabs against official FBR source material before marking those rules:

VERIFIED = true

Do not guess missing legal values.

If an authoritative value has not been entered, block calculation and show:

"Required verified tax rule is unavailable."

Never silently use another year's rule.

==================================================
52. REPORTING
==================================================

Provide reports for:

Monthly expenses

Income

Category spending

Budget performance

Savings

Goals

Assets and liabilities

Net worth

Tax summary

Withholding

Wealth statement

Tax calculation

Export:

PDF
CSV where appropriate

==================================================
53. NOTIFICATIONS
==================================================

Implement:

Budget threshold warning

Budget exceeded

Recurring payment upcoming

Goal milestone

Emergency fund gap

Tax information incomplete

Wealth reconciliation difference

==================================================
54. SEARCH / FILTERS
==================================================

Transactions should support:

Search
Account
Type
Category
Date range
Amount range
Payment method
Tax relevance

==================================================
55. AUDIT LOG
==================================================

Track important changes:

Transaction created

Transaction edited

Transaction deleted

Asset changed

Liability changed

Tax rule changed

Tax calculation performed

Report generated

Do not expose sensitive values unnecessarily.

==================================================
56. SECURITY
==================================================

Implement:

Password hashing

Input validation

Authorization checks

CSRF protection where applicable

Secure cookies

Rate limiting

SQL injection prevention through ORM

XSS-safe rendering

Sensitive-field masking

Audit logging

Environment variables

Role-based access

No secrets in repository

Financial data must only be accessible to its owner or authorized admin functions.

==================================================
57. MONEY PRECISION
==================================================

Critical:

Never use imprecise binary floating point for financial calculations.

Use:

PostgreSQL DECIMAL/NUMERIC

and

Decimal.js or equivalent.

Round according to explicitly defined rules.

Write tests for rounding.

==================================================
58. DATABASE TRANSACTIONS
==================================================

Use database transactions for operations affecting:

Account balances

Transfers

Tax calculation snapshot

Goal allocation

Related financial records

Prevent partial updates.

==================================================
59. ERROR HANDLING
==================================================

Create consistent API errors.

Examples:

VALIDATION_ERROR

AUTHORIZATION_ERROR

INSUFFICIENT_DATA

TAX_RULE_NOT_FOUND

UNVERIFIED_TAX_RULE

TAX_RULE_CONFLICT

RECONCILIATION_ERROR

DATABASE_ERROR

Never swallow errors silently.

==================================================
60. AI INTEGRATION PLACEHOLDER
==================================================

Create interface:

interface FinancialAIProvider {
    answerFinancialQuestion(...)
    explainFinancialInsight(...)
}

Current implementation:

DisabledAIProvider

Return:

"AI functionality is not connected yet."

Do not fake AI responses.

==================================================
61. OCR INTEGRATION PLACEHOLDER
==================================================

Create:

interface OCRProvider {
    extractReceipt(file): Promise<ReceiptExtraction>
}

Current provider:

DisabledOCRProvider

Frontend may allow manual entry instead.

==================================================
62. ASR INTEGRATION PLACEHOLDER
==================================================

Create:

interface ASRProvider {
    transcribe(audio): Promise<Transcript>
}

Current provider:

DisabledASRProvider

Keep voice UI hidden or marked:

"Coming in AI integration phase"

==================================================
63. FUTURE NLP TRANSACTION PARSER
==================================================

Provide a clean interface:

parseFinancialText(text)

Expected future output:

[
 {
   type,
   amount,
   category,
   date,
   account,
   paymentMethod,
   splitParticipants
 }
]

Do not implement an unreliable fake parser now.

==================================================
64. USER INTERFACE PAGES
==================================================

Create working pages:

Authentication

Onboarding

Dashboard

Accounts

Transactions

Add Transaction

Budgets

Recurring Obligations

Financial Goals

Goal Allocation

Emergency Fund

Financial Insights

Assets

Liabilities

Net Worth

Reports

Tax Dashboard

Tax Profile

Income Classification

Tax Calculation

Tax Slab Details

Withholding Taxes

Wealth Statement

Wealth Reconciliation

Tax Readiness

Rule Explorer

Tax Report

Notifications

Profile

Settings

Admin Dashboard

Tax Rule Manager

Audit Logs

==================================================
65. UI STYLE
==================================================

Modern Pakistani fintech design.

Primary:
Deep green

Secondary:
Blue

Background:
Light neutral

Use:

Professional cards
Responsive tables
Charts
Progress indicators
Clear forms

Currency:
PKR / Rs.

Desktop:
Sidebar

Mobile:
Bottom navigation

Responsive from mobile to desktop.

==================================================
66. DEMO DATA
==================================================

Seed several users:

1. Salaried employee

2. Freelancer

3. Small business/sole proprietor

4. Mixed-income taxpayer

Each user should have:

12 months transactions

Accounts

Budgets

Recurring expenses

Goals

Assets

Liabilities

Withholding records

Tax profile

Opening wealth

==================================================
67. AUTOMATED TAX TESTS
==================================================

This is mandatory.

Tests must cover:

Income exactly below slab

Income exactly at slab boundary

Income Rs.1 above boundary

Highest bracket

Zero income

Multiple income heads

Missing tax rule

Unverified tax rule

Wrong tax year

Withholding less than liability

Withholding equal to liability

Withholding greater than liability

Final/non-adjustable withholding

Allowable business expense

Personal expense incorrectly attempting deduction

Wealth reconciliation = zero difference

Wealth reconciliation mismatch

Negative amount rejection

Duplicate transaction prevention

==================================================
68. FINANCIAL TESTS
==================================================

Test:

Income updates account balance

Expense reduces balance

Transfer does not change overall net worth

Deleting transaction reverses effect

Editing amount updates correctly

Budget totals correctly

Category totals correctly

Net worth correctly

Goal allocation never exceeds available funds

Recurring detection handles date variation

==================================================
69. PROPERTY-BASED / INVARIANT TESTS
==================================================

Where practical test invariants such as:

Total money transferred between own accounts does not affect total wealth.

Net worth always equals:
assets - liabilities.

Budget remaining always equals:
limit - eligible spending.

Tax result using the same immutable input and same rule version must always be identical.

==================================================
70. END-TO-END TEST
==================================================

Create Playwright test:

Register

Login

Create account

Add salary income

Add expenses

Create budget

Create goal

Create asset

Create liability

Add withholding record

Open tax dashboard

Select tax year

Run calculation

Inspect applied slab

Inspect rule explanation

Generate wealth statement

Run reconciliation

Generate report

Logout

==================================================
71. API DOCUMENTATION
==================================================

Document APIs.

Examples:

POST /api/auth/register

POST /api/auth/login

GET /api/accounts

POST /api/accounts

GET /api/transactions

POST /api/transactions

PUT /api/transactions/:id

DELETE /api/transactions/:id

GET /api/budgets

POST /api/budgets

GET /api/goals

POST /api/goals

POST /api/goals/recommend-allocation

GET /api/emergency-fund

POST /api/emergency-fund/calculate

GET /api/tax/:year/data

POST /api/tax/:year/calculate

GET /api/tax/calculations/:id

GET /api/tax/rules

GET /api/tax/wealth-statement

POST /api/tax/reconcile

POST /api/reports/tax

==================================================
72. DEVELOPMENT SEQUENCE
==================================================

Do NOT attempt everything simultaneously.

Build in this exact order:

PHASE 1
Project foundation
Database
Authentication
Users

PHASE 2
Accounts
Transactions
Categories

PHASE 3
Dashboard
Budgets
Reports

PHASE 4
Recurring obligations
Goals
Emergency fund
Net worth

PHASE 5
Assets
Liabilities
Financial profile

PHASE 6
Tax database
Tax years
Tax rules
Tax slabs

PHASE 7
Income classification
Tax calculator
Withholding

PHASE 8
Wealth statement
Reconciliation

PHASE 9
Tax explanation
Rule explorer
Audit trail

PHASE 10
Tax report

PHASE 11
Admin rule manager

PHASE 12
Security
Testing
Validation
Bug fixing

==================================================
73. MIGRATION FROM EXISTING PROTOTYPES
==================================================

There are two existing frontend prototypes:

Expense Tracker UI

Tax Engine UI

Reuse good visual components where possible.

Do NOT maintain two applications.

Merge them into ONE application.

Tax Engine must become a feature/module inside HisabKetab AI.

Use one:

Authentication system

Database

User profile

Transaction store

Asset/liability store

Design system

==================================================
74. NO DUPLICATE DATA ENTRY
==================================================

Important:

If HisabKetab already contains:

Salary
Expenses
Assets
Liabilities
Withholding

the tax module should FETCH that information.

The user should not enter it again.

Tax module may request additional tax-specific details only when missing.

==================================================
75. TAX DATA REVIEW SCREEN
==================================================

Before calculation show:

Data imported from HisabKetab

Salary

Freelance income

Business income

Rental income

Investments

Personal expenses

Potential allowable expenses

Withholding

Assets

Liabilities

Allow user to inspect/correct source records before calculation.

==================================================
76. CALCULATION LOCKING
==================================================

Allow:

DRAFT calculation

and:

FINALIZED calculation snapshot

Once finalized:

Do not modify it.

If data changes create:

New Calculation Version.

==================================================
77. DISCLAIMER / SAFETY
==================================================

Display:

"HisabKetab AI provides financial organization and tax-preparation assistance. Tax calculations depend on the completeness of user data and configured tax rules. Users should verify final tax submissions where appropriate."

Do not claim:

Official FBR approval

Official filing confirmation

Guaranteed legal accuracy

unless those claims are actually supported.

==================================================
78. README
==================================================

Create complete README covering:

Project overview

Architecture

Installation

Environment variables

Database setup

Migrations

Seed data

Authentication

Transactions

Budget calculations

Recurring detection

Goals

Emergency fund

Tax-engine architecture

Tax rules

Tax-year versioning

Withholding

Wealth statement

Reconciliation

Reports

Tests

Future AI integration

Future OCR integration

Future ASR integration

==================================================
79. DEVELOPER DOCUMENTATION
==================================================

Also create:

docs/architecture.md

docs/database.md

docs/tax-engine.md

docs/tax-rule-format.md

docs/api.md

docs/security.md

docs/ai-integration.md

docs/testing.md

==================================================
80. FINAL ACCEPTANCE CRITERIA
==================================================

Do not consider the application finished unless:

✓ User registration works

✓ Login works

✓ Data persists in PostgreSQL

✓ Accounts work

✓ Transactions work

✓ Transfers work

✓ Budgets work

✓ Recurring obligations work

✓ Goals work

✓ Goal allocation works

✓ Emergency-fund calculation works

✓ Assets work

✓ Liabilities work

✓ Net worth works

✓ Tax profiles work

✓ Tax years work

✓ Tax rules are versioned

✓ Slab calculations work

✓ Income classification works

✓ Withholding processing works

✓ Tax calculation works

✓ Every tax result shows applicable rules

✓ Wealth statement works

✓ Wealth reconciliation works

✓ Tax report works

✓ Admin rule management works

✓ Historical tax calculation snapshots are preserved

✓ Authorization works

✓ Automated tests pass

✓ E2E test passes

✓ No TypeScript errors

✓ No broken routes

✓ No placeholder fake calculations

✓ No hard-coded tax calculation in frontend

✓ No AI required for core calculations

==================================================
81. FINAL INSTRUCTION TO CODEX
==================================================

First inspect the existing repository and existing Expense Tracker and Tax Engine frontend code.

Preserve useful UI components and styling.

Then produce:

1. Architecture plan

2. Database schema

3. Migration plan

4. Implementation checklist

Then IMPLEMENT the system phase-by-phase.

Do not only explain what should be built.

Write the actual code.

After each major phase:

- run type checking
- run lint
- run relevant tests
- fix failures before continuing

Do not leave TODO placeholders for functionality that is part of the current scope.

Only AI, OCR and ASR are intentionally deferred.

For tax rules:

do not invent legal values.

Use verified official FBR rules and keep them in version-controlled configuration/database records.

If a verified rule required for a calculation is unavailable:

BLOCK the calculation and report the missing rule instead of guessing.

At the end:

run the complete automated test suite

run the end-to-end workflow

review security-sensitive endpoints

review money precision

review authorization

review tax-rule versioning

review account balance consistency

and generate a final implementation report describing what works and any remaining limitations.