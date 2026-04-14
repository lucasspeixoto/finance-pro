-- ============================================================
-- RPC - TRANSFER BALANCE BETWEEN ACCOUNTS
-- Run this function in the Supabase SQL Editor (or as a migration).
-- The transfer updates both balances atomically.
-- ============================================================

CREATE OR REPLACE FUNCTION transfer_balance_between_accounts(
  p_from_account_id UUID,
  p_to_account_id UUID,
  p_amount NUMERIC
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY INVOKER
AS $$
DECLARE
  v_from_account accounts;
  v_to_account accounts;
BEGIN
  IF p_from_account_id = p_to_account_id THEN
    RAISE EXCEPTION 'Source and destination accounts must be different';
  END IF;

  IF p_amount IS NULL OR p_amount <= 0 THEN
    RAISE EXCEPTION 'Transfer amount must be greater than zero';
  END IF;

  SELECT * INTO v_from_account
  FROM accounts
  WHERE id = p_from_account_id
  FOR UPDATE;

  SELECT * INTO v_to_account
  FROM accounts
  WHERE id = p_to_account_id
  FOR UPDATE;

  IF v_from_account.id IS NULL OR v_to_account.id IS NULL THEN
    RAISE EXCEPTION 'Account not found';
  END IF;

  IF v_from_account.user_id <> auth.uid() OR v_to_account.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF v_from_account.balance < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  UPDATE accounts
  SET balance = balance - p_amount
  WHERE id = p_from_account_id;

  UPDATE accounts
  SET balance = balance + p_amount
  WHERE id = p_to_account_id;

  RETURN TRUE;
END;
$$;
