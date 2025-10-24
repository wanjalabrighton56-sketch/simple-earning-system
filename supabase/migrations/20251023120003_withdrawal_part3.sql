-- =====================================================
-- WITHDRAWAL AUTOMATION - PART 3: Create Triggers
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
