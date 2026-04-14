-- ============================================================
-- RPCs — MANAGE TRANSACTION + UPDATE ACCOUNT BALANCE
-- Run these functions in the Supabase SQL Editor (or as a migration).
-- Each function executes atomically: the transaction row and the
-- account balance are always updated together.
-- ============================================================


-- ------------------------------------------------------------
-- 1. CREATE transaction and update account balance
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION create_transaction_and_update_balance(
  p_user_id      UUID,
  p_account_id   UUID,
  p_category_id  UUID,
  p_type         transaction_type,
  p_amount       NUMERIC,
  p_description  TEXT,
  p_date         DATE,
  p_is_paid      BOOLEAN,
  p_notes        TEXT
)
RETURNS transactions
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_transaction transactions;
  v_delta       NUMERIC;
BEGIN
  -- Validate ownership
  IF auth.uid() IS DISTINCT FROM p_user_id THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  -- Compute balance delta based on transaction type
  v_delta := CASE p_type
    WHEN 'income'   THEN  p_amount
    WHEN 'expense'  THEN -p_amount
    WHEN 'transfer' THEN -p_amount
  END;

  -- Insert the new transaction
  INSERT INTO transactions (
    user_id, account_id, category_id, type,
    amount, description, date, is_paid, notes
  )
  VALUES (
    p_user_id, p_account_id, p_category_id, p_type,
    p_amount, p_description, p_date, p_is_paid, p_notes
  )
  RETURNING * INTO v_transaction;

  -- Update account balance
  UPDATE accounts
  SET balance = balance + v_delta
  WHERE id = p_account_id;

  RETURN v_transaction;
END;
$$;


-- ------------------------------------------------------------
-- 2. UPDATE transaction and update account balance
--    Handles account changes: reverts old delta, applies new delta.
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION update_transaction_and_update_balance(
  p_id           UUID,
  p_account_id   UUID,
  p_category_id  UUID,
  p_type         transaction_type,
  p_amount       NUMERIC,
  p_description  TEXT,
  p_date         DATE,
  p_is_paid      BOOLEAN,
  p_notes        TEXT
)
RETURNS transactions
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_old         transactions;
  v_transaction transactions;
  v_old_delta   NUMERIC;
  v_new_delta   NUMERIC;
BEGIN
  -- Fetch the existing transaction (RLS ensures user ownership)
  SELECT * INTO v_old FROM transactions WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  -- Delta to REVERT the old transaction effect
  v_old_delta := CASE v_old.type
    WHEN 'income'   THEN -v_old.amount
    WHEN 'expense'  THEN  v_old.amount
    WHEN 'transfer' THEN  v_old.amount
  END;

  -- Delta to APPLY the new transaction effect
  v_new_delta := CASE p_type
    WHEN 'income'   THEN  p_amount
    WHEN 'expense'  THEN -p_amount
    WHEN 'transfer' THEN -p_amount
  END;

  -- Revert old effect on the previous account
  UPDATE accounts
  SET balance = balance + v_old_delta
  WHERE id = v_old.account_id;

  -- Apply new effect on the (possibly different) new account
  UPDATE accounts
  SET balance = balance + v_new_delta
  WHERE id = p_account_id;

  -- Update the transaction row
  UPDATE transactions
  SET
    account_id  = p_account_id,
    category_id = p_category_id,
    type        = p_type,
    amount      = p_amount,
    description = p_description,
    date        = p_date,
    is_paid     = p_is_paid,
    notes       = p_notes
  WHERE id = p_id
  RETURNING * INTO v_transaction;

  RETURN v_transaction;
END;
$$;


-- ------------------------------------------------------------
-- 3. DELETE transaction and revert account balance
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION delete_transaction_and_update_balance(p_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_old   transactions;
  v_delta NUMERIC;
BEGIN
  -- Fetch the existing transaction (RLS ensures user ownership)
  SELECT * INTO v_old FROM transactions WHERE id = p_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Transaction not found';
  END IF;

  -- Delta to REVERT the transaction effect
  v_delta := CASE v_old.type
    WHEN 'income'   THEN -v_old.amount
    WHEN 'expense'  THEN  v_old.amount
    WHEN 'transfer' THEN  v_old.amount
  END;

  -- Delete the transaction
  DELETE FROM transactions WHERE id = p_id;

  -- Revert account balance
  UPDATE accounts
  SET balance = balance + v_delta
  WHERE id = v_old.account_id;
END;
$$;
