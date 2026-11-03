-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "csrfToken" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cnic" TEXT NOT NULL DEFAULT '',
    "occupation" TEXT NOT NULL DEFAULT '',
    "taxpayerType" TEXT NOT NULL DEFAULT 'SALARIED',
    "residentialStatus" TEXT NOT NULL DEFAULT 'RESIDENT',
    "preferredCurrency" TEXT NOT NULL DEFAULT 'PKR',
    "monthlyIncomeEstimate" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "primaryIncomeType" TEXT NOT NULL DEFAULT 'Salary',
    "taxRegistrationStatus" TEXT NOT NULL DEFAULT 'UNREGISTERED',
    "ntn" TEXT NOT NULL DEFAULT '',
    "dependents" INTEGER NOT NULL DEFAULT 0,
    "emergencySavings" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "essentialMonthlyExpenses" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "incomeStability" TEXT NOT NULL DEFAULT 'STABLE',

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FinancialAccount" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "openingBalance" DECIMAL(20,2) NOT NULL,
    "openingDate" DATE NOT NULL,
    "institution" TEXT NOT NULL DEFAULT '',
    "currency" TEXT NOT NULL DEFAULT 'PKR',
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "FinancialAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "essential" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TransactionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "destinationAccountId" TEXT,
    "type" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "date" DATE NOT NULL,
    "categoryId" TEXT,
    "subcategory" TEXT NOT NULL DEFAULT '',
    "merchant" TEXT NOT NULL DEFAULT '',
    "description" TEXT NOT NULL DEFAULT '',
    "paymentMethod" TEXT NOT NULL DEFAULT 'BANK',
    "person" TEXT NOT NULL DEFAULT '',
    "taxRelevant" BOOLEAN NOT NULL DEFAULT false,
    "businessOrPersonal" TEXT NOT NULL DEFAULT 'PERSONAL',
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "source" TEXT NOT NULL DEFAULT 'MANUAL',
    "idempotencyKey" TEXT NOT NULL,
    "revision" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LedgerEntry" (
    "id" TEXT NOT NULL,
    "transactionId" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "LedgerEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "alertThreshold" INTEGER NOT NULL DEFAULT 75,
    "savingsTarget" DECIMAL(20,2) NOT NULL DEFAULT 0,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BudgetCategory" (
    "budgetId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "BudgetCategory_pkey" PRIMARY KEY ("budgetId","categoryId")
);

-- CreateTable
CREATE TABLE "FinancialGoal" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "goalType" TEXT NOT NULL DEFAULT 'CUSTOM',
    "targetAmount" DECIMAL(20,2) NOT NULL,
    "currentAmount" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "targetDate" DATE NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 3,
    "minimumContribution" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',

    CONSTRAINT "FinancialGoal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GoalAllocation" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "explanation" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GoalAllocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecurringObligation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "merchant" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "intervalDays" INTEGER NOT NULL,
    "nextDueDate" DATE NOT NULL,
    "confidence" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'POSSIBLE',
    "fingerprint" TEXT NOT NULL,

    CONSTRAINT "RecurringObligation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "assetType" TEXT NOT NULL,
    "acquisitionDate" DATE NOT NULL,
    "acquisitionCost" DECIMAL(20,2) NOT NULL,
    "currentDeclaredValue" DECIMAL(20,2) NOT NULL,
    "sourceOfFunds" TEXT NOT NULL,
    "ownershipPercentage" DECIMAL(5,2) NOT NULL DEFAULT 100,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Liability" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "liabilityType" TEXT NOT NULL,
    "originalAmount" DECIMAL(20,2) NOT NULL,
    "outstandingAmount" DECIMAL(20,2) NOT NULL,
    "monthlyPayment" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "lender" TEXT NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,

    CONSTRAINT "Liability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncomeSource" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "incomeType" TEXT NOT NULL,

    CONSTRAINT "IncomeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WithholdingTaxRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "amount" DECIMAL(20,2) NOT NULL,
    "section" TEXT NOT NULL,
    "nature" TEXT NOT NULL,
    "payer" TEXT NOT NULL,
    "certificateReference" TEXT NOT NULL,
    "taxTreatment" TEXT NOT NULL DEFAULT 'REVIEW_REQUIRED',

    CONSTRAINT "WithholdingTaxRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "openingWealth" DECIMAL(20,2) NOT NULL,
    "otherInflows" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "otherOutflows" DECIMAL(20,2) NOT NULL DEFAULT 0,
    "adjustmentsExplanation" TEXT NOT NULL DEFAULT '',
    "assetsReviewed" BOOLEAN NOT NULL DEFAULT false,
    "liabilitiesReviewed" BOOLEAN NOT NULL DEFAULT false,
    "withholdingReviewed" BOOLEAN NOT NULL DEFAULT false,
    "ordinaryResidentConfirmed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "TaxProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxYear" (
    "year" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "ruleVersion" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "TaxYear_pkey" PRIMARY KEY ("year")
);

-- CreateTable
CREATE TABLE "TaxRule" (
    "id" TEXT NOT NULL,
    "ruleCode" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "taxpayerType" TEXT NOT NULL DEFAULT 'ALL',
    "incomeHead" TEXT NOT NULL DEFAULT 'ALL',
    "section" TEXT NOT NULL,
    "schedule" TEXT NOT NULL,
    "division" TEXT NOT NULL,
    "clause" TEXT NOT NULL DEFAULT '',
    "effectiveFrom" DATE NOT NULL,
    "effectiveTo" DATE NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "ruleType" TEXT NOT NULL,
    "formulaType" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT NOT NULL DEFAULT '',
    "parameters" JSONB NOT NULL,

    CONSTRAINT "TaxRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxSlab" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "lowerBound" DECIMAL(20,2) NOT NULL,
    "upperBound" DECIMAL(20,2),
    "baseTax" DECIMAL(20,2) NOT NULL,
    "rate" DECIMAL(12,8) NOT NULL,
    "excessOver" DECIMAL(20,2) NOT NULL,
    "sequence" INTEGER NOT NULL,

    CONSTRAINT "TaxSlab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRuleCondition" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "TaxRuleCondition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRuleReference" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "sourceDocument" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "page" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),

    CONSTRAINT "TaxRuleReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCalculation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "ruleVersion" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "inputHash" TEXT NOT NULL,
    "dataset" JSONB NOT NULL,
    "result" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalizedAt" TIMESTAMP(3),

    CONSTRAINT "TaxCalculation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxCalculationStep" (
    "id" TEXT NOT NULL,
    "calculationId" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "stepName" TEXT NOT NULL,
    "detail" JSONB NOT NULL,

    CONSTRAINT "TaxCalculationStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WealthStatement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "taxYear" INTEGER NOT NULL,
    "asOf" TIMESTAMP(3) NOT NULL,
    "totalAssets" DECIMAL(20,2) NOT NULL,
    "totalLiabilities" DECIMAL(20,2) NOT NULL,
    "netWealth" DECIMAL(20,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WealthStatement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WealthStatementAsset" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "WealthStatementAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WealthStatementLiability" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "value" DECIMAL(20,2) NOT NULL,

    CONSTRAINT "WealthStatementLiability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WealthReconciliation" (
    "id" TEXT NOT NULL,
    "statementId" TEXT NOT NULL,
    "openingWealth" DECIMAL(20,2) NOT NULL,
    "expectedClosing" DECIMAL(20,2) NOT NULL,
    "difference" DECIMAL(20,2) NOT NULL,
    "explanation" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WealthReconciliation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedReport" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "snapshot" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "GeneratedReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");

-- CreateIndex
CREATE INDEX "FinancialAccount_userId_idx" ON "FinancialAccount"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "TransactionCategory_name_type_key" ON "TransactionCategory"("name", "type");

-- CreateIndex
CREATE INDEX "Transaction_userId_date_idx" ON "Transaction"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_userId_idempotencyKey_key" ON "Transaction"("userId", "idempotencyKey");

-- CreateIndex
CREATE UNIQUE INDEX "LedgerEntry_transactionId_accountId_key" ON "LedgerEntry"("transactionId", "accountId");

-- CreateIndex
CREATE INDEX "Budget_userId_idx" ON "Budget"("userId");

-- CreateIndex
CREATE INDEX "FinancialGoal_userId_idx" ON "FinancialGoal"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "GoalAllocation_goalId_batchId_key" ON "GoalAllocation"("goalId", "batchId");

-- CreateIndex
CREATE UNIQUE INDEX "RecurringObligation_userId_fingerprint_key" ON "RecurringObligation"("userId", "fingerprint");

-- CreateIndex
CREATE INDEX "Asset_userId_idx" ON "Asset"("userId");

-- CreateIndex
CREATE INDEX "Liability_userId_idx" ON "Liability"("userId");

-- CreateIndex
CREATE INDEX "WithholdingTaxRecord_userId_taxYear_idx" ON "WithholdingTaxRecord"("userId", "taxYear");

-- CreateIndex
CREATE UNIQUE INDEX "TaxProfile_userId_taxYear_key" ON "TaxProfile"("userId", "taxYear");

-- CreateIndex
CREATE UNIQUE INDEX "TaxRule_taxYear_version_ruleCode_key" ON "TaxRule"("taxYear", "version", "ruleCode");

-- CreateIndex
CREATE UNIQUE INDEX "TaxSlab_ruleId_sequence_key" ON "TaxSlab"("ruleId", "sequence");

-- CreateIndex
CREATE INDEX "TaxCalculation_userId_taxYear_idx" ON "TaxCalculation"("userId", "taxYear");

-- CreateIndex
CREATE UNIQUE INDEX "Notification_userId_key_key" ON "Notification"("userId", "key");

-- CreateIndex
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialAccount" ADD CONSTRAINT "FinancialAccount_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TransactionCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LedgerEntry" ADD CONSTRAINT "LedgerEntry_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "FinancialAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Budget" ADD CONSTRAINT "Budget_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BudgetCategory" ADD CONSTRAINT "BudgetCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TransactionCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FinancialGoal" ADD CONSTRAINT "FinancialGoal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GoalAllocation" ADD CONSTRAINT "GoalAllocation_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "FinancialGoal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecurringObligation" ADD CONSTRAINT "RecurringObligation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asset" ADD CONSTRAINT "Asset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Liability" ADD CONSTRAINT "Liability_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IncomeSource" ADD CONSTRAINT "IncomeSource_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WithholdingTaxRecord" ADD CONSTRAINT "WithholdingTaxRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxProfile" ADD CONSTRAINT "TaxProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRule" ADD CONSTRAINT "TaxRule_taxYear_fkey" FOREIGN KEY ("taxYear") REFERENCES "TaxYear"("year") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxSlab" ADD CONSTRAINT "TaxSlab_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "TaxRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRuleCondition" ADD CONSTRAINT "TaxRuleCondition_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "TaxRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxRuleReference" ADD CONSTRAINT "TaxRuleReference_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "TaxRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCalculation" ADD CONSTRAINT "TaxCalculation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaxCalculationStep" ADD CONSTRAINT "TaxCalculationStep_calculationId_fkey" FOREIGN KEY ("calculationId") REFERENCES "TaxCalculation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WealthStatement" ADD CONSTRAINT "WealthStatement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WealthStatementAsset" ADD CONSTRAINT "WealthStatementAsset_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "WealthStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WealthStatementLiability" ADD CONSTRAINT "WealthStatementLiability_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "WealthStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WealthReconciliation" ADD CONSTRAINT "WealthReconciliation_statementId_fkey" FOREIGN KEY ("statementId") REFERENCES "WealthStatement"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeneratedReport" ADD CONSTRAINT "GeneratedReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
