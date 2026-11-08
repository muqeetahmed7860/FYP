-- Explicit owner-authorized account erasure is the sole exception to snapshot deletion.
CREATE OR REPLACE FUNCTION guard_calculation_snapshot() RETURNS trigger AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    IF current_setting('hisabketab.erasure_user', true) = OLD."userId" THEN RETURN OLD; END IF;
    RAISE EXCEPTION 'Calculation snapshots cannot be deleted';
  END IF;
  IF OLD.status = 'FINALIZED' OR NEW.dataset IS DISTINCT FROM OLD.dataset OR NEW.result IS DISTINCT FROM OLD.result OR NEW."inputHash" IS DISTINCT FROM OLD."inputHash" OR NEW."ruleVersion" IS DISTINCT FROM OLD."ruleVersion" OR NEW."userId" IS DISTINCT FROM OLD."userId" OR NEW."taxYear" IS DISTINCT FROM OLD."taxYear" THEN RAISE EXCEPTION 'Calculation snapshots are immutable'; END IF;
  IF NEW.status <> 'FINALIZED' OR NEW."finalizedAt" IS NULL THEN RAISE EXCEPTION 'Only finalization is allowed'; END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
