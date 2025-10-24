-- =====================================================
-- WITHDRAWAL AUTOMATION - PART 1: Request Function
-- =====================================================

CREATE OR REPLACE FUNCTION process_withdrawal_request()
RETURNS TRIGGER AS $$
DECLARE
  current_task_balance numeric(10, 2);
  current_referral_balance numeric(10, 2);
  current_total_balance numeric(10, 2);
BEGIN
  -- Only process on INSERT (new withdrawal request)
  IF TG_OP = 'INSERT' THEN
    -- Get current balances
    SELECT task_balance, referral_balance, balance
    INTO current_task_balance, current_referral_balance, current_total_balance
    FROM user_profiles
    WHERE id = NEW.user_id;

    -- Validate sufficient balance
    IF NEW.wallet_source = 'Task' THEN
      IF current_task_balance < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient task wallet balance';
      END IF;
    ELSIF NEW.wallet_source = 'Referral' THEN
      IF current_referral_balance < NEW.amount THEN
        RAISE EXCEPTION 'Insufficient referral wallet balance';
      END IF;
    END IF;

    -- Deduct balance immediately from the appropriate wallet
    IF NEW.wallet_source = 'Task' THEN
      UPDATE user_profiles
      SET 
        task_balance = task_balance - NEW.amount,
        balance = balance - NEW.amount,
        updated_at = now()
      WHERE id = NEW.user_id;
    ELSIF NEW.wallet_source = 'Referral' THEN
      UPDATE user_profiles
      SET 
        referral_balance = referral_balance - NEW.amount,
        balance = balance - NEW.amount,
        updated_at = now()
      WHERE id = NEW.user_id;
    END IF;

    -- Create transaction record for withdrawal request
    INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
    SELECT 
      NEW.user_id,
      'Withdrawal Request',
      -NEW.amount,
      balance,
      NEW.wallet_source || ' Wallet',
      'Withdrawal request #' || NEW.id || ' - Status: Pending'
    FROM user_profiles WHERE id = NEW.user_id;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
