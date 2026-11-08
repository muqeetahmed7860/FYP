ALTER TABLE "TaxProfile" ADD COLUMN "openingWealthConfirmed" BOOLEAN NOT NULL DEFAULT false, ADD COLUMN "expensesReviewed" BOOLEAN NOT NULL DEFAULT false;
-- Existing profiles required an explicit opening wealth value before this migration.
UPDATE "TaxProfile" SET "openingWealthConfirmed" = true;
