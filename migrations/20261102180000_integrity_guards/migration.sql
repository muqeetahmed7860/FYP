ALTER TABLE "Transaction" ADD CONSTRAINT "transaction_positive_amount" CHECK (amount > 0);
ALTER TABLE "Transaction" ADD CONSTRAINT "transaction_type" CHECK (type IN ('INCOME','EXPENSE','TRANSFER'));
ALTER TABLE "Transaction" ADD CONSTRAINT "transfer_distinct_accounts" CHECK ((type = 'TRANSFER' AND "destinationAccountId" IS NOT NULL AND "destinationAccountId" <> "accountId") OR (type <> 'TRANSFER' AND "destinationAccountId" IS NULL));
ALTER TABLE "FinancialGoal" ADD CONSTRAINT "goal_amounts" CHECK ("targetAmount" > 0 AND "currentAmount" >= 0 AND "currentAmount" <= "targetAmount" AND "minimumContribution" >= 0);
ALTER TABLE "Budget" ADD CONSTRAINT "budget_bounds" CHECK (amount > 0 AND "endDate" >= "startDate");
ALTER TABLE "Asset" ADD CONSTRAINT "asset_values" CHECK ("currentDeclaredValue" >= 0 AND "acquisitionCost" >= 0 AND "ownershipPercentage" > 0 AND "ownershipPercentage" <= 100);
ALTER TABLE "Liability" ADD CONSTRAINT "liability_values" CHECK ("outstandingAmount" >= 0 AND "originalAmount" >= 0 AND "monthlyPayment" >= 0);
ALTER TABLE "WithholdingTaxRecord" ADD CONSTRAINT "withholding_positive" CHECK (amount > 0);
ALTER TABLE "TaxSlab" ADD CONSTRAINT "slab_values" CHECK ("lowerBound" >= 0 AND "baseTax" >= 0 AND rate >= 0 AND rate <= 1 AND ("upperBound" IS NULL OR "upperBound" > "lowerBound"));

CREATE FUNCTION guard_calculation_snapshot() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN RAISE EXCEPTION 'Calculation snapshots cannot be deleted'; END IF;
  IF OLD.status = 'FINALIZED' OR NEW.dataset IS DISTINCT FROM OLD.dataset OR NEW.result IS DISTINCT FROM OLD.result OR NEW."inputHash" IS DISTINCT FROM OLD."inputHash" OR NEW."ruleVersion" IS DISTINCT FROM OLD."ruleVersion" OR NEW."userId" IS DISTINCT FROM OLD."userId" OR NEW."taxYear" IS DISTINCT FROM OLD."taxYear" THEN
    RAISE EXCEPTION 'Calculation snapshots are immutable';
  END IF;
  IF NEW.status <> 'FINALIZED' OR NEW."finalizedAt" IS NULL THEN RAISE EXCEPTION 'Only finalization is allowed'; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER immutable_calculation BEFORE UPDATE OR DELETE ON "TaxCalculation" FOR EACH ROW EXECUTE FUNCTION guard_calculation_snapshot();

CREATE FUNCTION guard_published_rule() RETURNS trigger AS $$
BEGIN
  IF OLD.published THEN RAISE EXCEPTION 'Published rules are immutable'; END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER immutable_rule BEFORE UPDATE OR DELETE ON "TaxRule" FOR EACH ROW EXECUTE FUNCTION guard_published_rule();

CREATE FUNCTION guard_rule_child() RETURNS trigger AS $$
DECLARE target_id TEXT;
BEGIN
  IF TG_OP = 'DELETE' THEN target_id := OLD."ruleId"; ELSE target_id := NEW."ruleId"; END IF;
  IF EXISTS (SELECT 1 FROM "TaxRule" WHERE id = target_id AND published) THEN RAISE EXCEPTION 'Published rule details are immutable'; END IF;
  IF TG_OP = 'UPDATE' AND EXISTS (SELECT 1 FROM "TaxRule" WHERE id = OLD."ruleId" AND published) THEN RAISE EXCEPTION 'Published rule details are immutable'; END IF;
  IF TG_OP = 'DELETE' THEN RETURN OLD; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER immutable_slab BEFORE INSERT OR UPDATE OR DELETE ON "TaxSlab" FOR EACH ROW EXECUTE FUNCTION guard_rule_child();
CREATE TRIGGER immutable_condition BEFORE INSERT OR UPDATE OR DELETE ON "TaxRuleCondition" FOR EACH ROW EXECUTE FUNCTION guard_rule_child();
CREATE TRIGGER immutable_reference BEFORE INSERT OR UPDATE OR DELETE ON "TaxRuleReference" FOR EACH ROW EXECUTE FUNCTION guard_rule_child();

CREATE FUNCTION guard_ledger_owner() RETURNS trigger AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM "Transaction" t JOIN "FinancialAccount" a ON a.id = NEW."accountId" AND a."userId" = t."userId" WHERE t.id = NEW."transactionId") THEN RAISE EXCEPTION 'Ledger entry ownership mismatch'; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER ledger_owner BEFORE INSERT OR UPDATE ON "LedgerEntry" FOR EACH ROW EXECUTE FUNCTION guard_ledger_owner();
