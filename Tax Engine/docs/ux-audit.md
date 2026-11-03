# HisabKetab usability audit and implementation map

The integrated React application is the working product. The static Prototype UI is a reference only. Financial calculations, ledger ownership, decimal arithmetic and immutable tax snapshots remain authoritative.

| Existing screens | User goal / essential information | Secondary information / change |
| --- | --- | --- |
| Overview, Insights | Available money, monthly income/spend, quick entry | Charts and net worth move behind experience level and widget settings |
| Transactions | Enter amount, category, payment method; review activity | Account defaults, date, merchant, notes, tax and recurrence under More details; filters collapse |
| Accounts | Add cash/bank wallet and see balance | Located in Profile; opening balance rules remain enforced |
| Budgets | Set a monthly limit, see remaining spending | Dates, category limits, savings reserve and alert threshold expand |
| Goals, Allocation, Emergency, Recurring | Plan savings and upcoming bills | Group under Plan; explain allocation and coverage without exposing identifiers |
| Assets, Liabilities, Net worth | Record what I own and owe | Group under Profile; valuation and calculation details expand |
| Tax dashboard, Tax profile, Review | Prepare an estimate using existing records | Contextual setup; no tax questions in general onboarding |
| Calculation, Classification, Slabs, Explanation | Understand estimated tax and tax paid | Guided calculation; legal references, formulas and traces expand |
| Wealth, Reconciliation, Readiness | Find missing information and review readiness | Plain-language prompts; formula stays in details |
| Reports | Download saved financial or tax reports | Group under Tax/Plan context; retain PDF and CSV exports |
| Profile, Settings, Notifications, Audit | Manage identity, privacy, preferences and access | Settings grouped into clear sections; optional advanced financial profile |
| Admin | Manage support metadata, tax years/rules and configuration | Separate /admin shell and server-side role checks; structured rule/slab editor, preview, immutable history |

## Information architecture

- Home: greeting, available money, four actions, monthly summary, optional checklist/widgets.
- Transactions: quick entry, search, optional filters and details.
- Plan: Budget, Goals, Emergency fund, Recurring bills, Insights, allocation.
- Tax: Summary, guided calculation, tax paid, wealth review, reports; legal detail disclosed on demand.
- Profile: personal information, accounts, assets/debts, settings, help.
- Administration: Dashboard, Users, Tax management, Configuration, Content, System.

Beginner is the default; Standard reveals planning/insights; Advanced reveals wealth and detailed tools. Direct links and contextual More controls preserve every existing capability. Theme, density, language, motion, dashboard order and notification preferences are saved per account.

## Design contract

Preserve the forest-green identity. Use semantic light/dark surfaces, a restrained 4/8px spacing rhythm, readable system fonts, 44px targets, native accessible controls/dialogs, visible focus and 150–300ms motion with reduced-motion overrides. Mobile uses exactly five primary destinations; wide data tables become labelled cards. All new admin writes require server authorization and audit records. AI/OCR/voice remain honestly unavailable without providers.

The design skill's Python search runtime was unavailable on this host; the skill's accessibility, navigation and responsive defaults inform this contract.
