-- =====================================================
-- WITHDRAWAL AUTOMATION - PART 2: Status Change Function
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
        0,
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

      -- Create transaction record for rejection
      INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
      SELECT 
        NEW.user_id,
        'Withdrawal Rejected',
        0,
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
