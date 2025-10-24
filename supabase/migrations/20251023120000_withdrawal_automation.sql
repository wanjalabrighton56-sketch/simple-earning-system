-- =====================================================
-- WITHDRAWAL AUTOMATION MIGRATION
-- =====================================================
-- This migration adds automatic balance deduction on withdrawal request
-- and automatic status updates with transaction logging on admin approval/rejection
-- 
-- NO UI CHANGES - Backend logic only
-- =====================================================

-- =====================================================
-- FUNCTION: Process Withdrawal Request (Deduct Balance Immediately)
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

-- =====================================================
-- FUNCTION: Handle Admin Approval/Rejection
-- =====================================================
CREATE OR REPLACE FUNCTION handle_withdrawal_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only process on UPDATE when status changes
  IF TG_OP = 'UPDATE' AND OLD.status != NEW.status THEN
    
    -- CASE 1: Admin APPROVES withdrawal
    IF NEW.status = 'Approved' AND OLD.status = 'Pending' THEN
      -- Update timestamps
      NEW.approved_at = now();
      NEW.processed_at = now();

      -- Create transaction record for approval
      INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
      SELECT 
        NEW.user_id,
        'Withdrawal Approved',
        0, -- No balance change (already deducted)
        balance,
        NEW.wallet_source || ' Wallet',
        'Withdrawal #' || NEW.id || ' approved - KES ' || NEW.amount || ' processed'
      FROM user_profiles WHERE id = NEW.user_id;

      -- Log admin action
      INSERT INTO admin_actions (admin_id, action_type, target_table, target_id, details)
      VALUES (
        NEW.admin_id,
        'Withdrawal Approved',
        'withdrawals',
        NEW.id,
        jsonb_build_object(
          'amount', NEW.amount,
          'wallet_source', NEW.wallet_source,
          'user_id', NEW.user_id,
          'processor_notes', NEW.processor_notes
        )
      );

    -- CASE 2: Admin REJECTS withdrawal
    ELSIF NEW.status = 'Rejected' AND OLD.status = 'Pending' THEN
      -- Update timestamps
      NEW.rejected_at = now();
      NEW.processed_at = now();

      -- DO NOT return balance (as per requirement)
      -- Balance stays deducted even on rejection

      -- Create transaction record for rejection
      INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
      SELECT 
        NEW.user_id,
        'Withdrawal Rejected',
        0, -- No balance change (stays deducted)
        balance,
        NEW.wallet_source || ' Wallet',
        'Withdrawal #' || NEW.id || ' rejected - Reason: ' || COALESCE(NEW.rejection_reason, 'Not specified')
      FROM user_profiles WHERE id = NEW.user_id;

      -- Log admin action
      INSERT INTO admin_actions (admin_id, action_type, target_table, target_id, details)
      VALUES (
        NEW.admin_id,
        'Withdrawal Rejected',
        'withdrawals',
        NEW.id,
        jsonb_build_object(
          'amount', NEW.amount,
          'wallet_source', NEW.wallet_source,
          'user_id', NEW.user_id,
          'rejection_reason', NEW.rejection_reason
        )
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Trigger 1: Deduct balance when withdrawal is requested
DROP TRIGGER IF EXISTS on_withdrawal_request ON withdrawals;
CREATE TRIGGER on_withdrawal_request
  BEFORE INSERT ON withdrawals
  FOR EACH ROW
  EXECUTE FUNCTION process_withdrawal_request();

-- Trigger 2: Handle status changes (approval/rejection)
DROP TRIGGER IF EXISTS on_withdrawal_status_change ON withdrawals;
CREATE TRIGGER on_withdrawal_status_change
  BEFORE UPDATE ON withdrawals
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_withdrawal_status_change();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON FUNCTION process_withdrawal_request() IS 
'Automatically deducts balance from appropriate wallet when user requests withdrawal';

COMMENT ON FUNCTION handle_withdrawal_status_change() IS 
'Handles admin approval/rejection: creates transaction records and logs admin actions. Balance is NOT returned on rejection.';

COMMENT ON TRIGGER on_withdrawal_request ON withdrawals IS 
'Deducts balance immediately when withdrawal request is created';

COMMENT ON TRIGGER on_withdrawal_status_change ON withdrawals IS 
'Updates transaction history when admin approves or rejects withdrawal';
