-- =====================================================
-- TEST WITHDRAWAL FLOW
-- =====================================================
-- Run these queries in Supabase SQL Editor to test withdrawal automation
-- =====================================================

-- STEP 1: Create a test user with balance
-- =====================================================
-- First, create an auth user (you can also do this via Supabase Auth UI)
-- For testing, we'll create a user profile directly

INSERT INTO user_profiles (
  id,
  username,
  email,
  phone,
  task_balance,
  referral_balance,
  balance,
  is_activated
) VALUES (
  gen_random_uuid(),
  'testuser',
  'testuser@example.com',
  '254712345678',
  1000.00,  -- KES 1000 in Task Wallet
  500.00,   -- KES 500 in Referral Wallet
  1500.00,  -- Total balance
  true      -- Account activated
)
RETURNING id, username, email, task_balance, referral_balance, balance;

-- Copy the returned 'id' (UUID) - you'll need it for the next steps
-- Example: 123e4567-e89b-12d3-a456-426614174000


-- =====================================================
-- STEP 2: Request a withdrawal (replace USER_ID_HERE with actual UUID)
-- =====================================================
-- This simulates a user requesting KES 300 withdrawal from Task Wallet

INSERT INTO withdrawals (
  user_id,
  amount,
  wallet_source,
  status
) VALUES (
  'USER_ID_HERE',  -- Replace with the UUID from Step 1
  300.00,
  'Task',
  'Pending'
)
RETURNING id, user_id, amount, wallet_source, status, requested_at;

-- Copy the withdrawal 'id' for Step 4


-- =====================================================
-- STEP 3: Verify balance was deducted automatically
-- =====================================================
-- Check the user's balance after withdrawal request

SELECT 
  username,
  task_balance,      -- Should be 700.00 (1000 - 300)
  referral_balance,  -- Should still be 500.00
  balance            -- Should be 1200.00 (1500 - 300)
FROM user_profiles
WHERE id = 'USER_ID_HERE';  -- Replace with UUID from Step 1


-- Check transaction was created
SELECT 
  type,
  amount,
  balance_after,
  source,
  description,
  created_at
FROM transactions
WHERE user_id = 'USER_ID_HERE'  -- Replace with UUID from Step 1
ORDER BY created_at DESC
LIMIT 1;

-- Should show: "Withdrawal Request" with amount -300.00


-- =====================================================
-- STEP 4: Admin approves the withdrawal
-- =====================================================
-- This simulates admin changing status in Supabase Table Editor

UPDATE withdrawals
SET 
  status = 'Approved',
  admin_id = 'USER_ID_HERE',  -- Replace with UUID (can be same user for testing)
  processor_notes = 'M-PESA payment sent successfully'
WHERE id = 'WITHDRAWAL_ID_HERE';  -- Replace with withdrawal id from Step 2


-- =====================================================
-- STEP 5: Verify approval was logged automatically
-- =====================================================
-- Check withdrawal status updated

SELECT 
  id,
  amount,
  wallet_source,
  status,           -- Should be 'Approved'
  requested_at,
  approved_at,      -- Should be set to now()
  processed_at,     -- Should be set to now()
  processor_notes
FROM withdrawals
WHERE id = 'WITHDRAWAL_ID_HERE';  -- Replace with withdrawal id from Step 2


-- Check transaction was created for approval
SELECT 
  type,              -- Should be 'Withdrawal Approved'
  amount,            -- Should be 0 (balance already deducted)
  balance_after,
  source,
  description,
  created_at
FROM transactions
WHERE user_id = 'USER_ID_HERE'  -- Replace with UUID from Step 1
ORDER BY created_at DESC
LIMIT 2;  -- Should show 2 records: Request + Approval


-- Check admin action was logged
SELECT 
  action_type,       -- Should be 'Withdrawal Approved'
  target_table,      -- Should be 'withdrawals'
  target_id,
  details,
  created_at
FROM admin_actions
WHERE target_table = 'withdrawals'
  AND target_id = 'WITHDRAWAL_ID_HERE'  -- Replace with withdrawal id
ORDER BY created_at DESC
LIMIT 1;


-- =====================================================
-- STEP 6: Test rejection (optional)
-- =====================================================
-- Create another withdrawal request

INSERT INTO withdrawals (
  user_id,
  amount,
  wallet_source,
  status
) VALUES (
  'USER_ID_HERE',  -- Replace with UUID from Step 1
  200.00,
  'Referral',
  'Pending'
)
RETURNING id, amount, wallet_source, status;

-- Copy the new withdrawal 'id'


-- Reject the withdrawal
UPDATE withdrawals
SET 
  status = 'Rejected',
  admin_id = 'USER_ID_HERE',  -- Replace with UUID
  rejection_reason = 'Invalid bank details provided'
WHERE id = 'NEW_WITHDRAWAL_ID_HERE';  -- Replace with new withdrawal id


-- Verify balance was NOT returned (stays deducted)
SELECT 
  username,
  task_balance,      -- Should still be 700.00
  referral_balance,  -- Should be 300.00 (500 - 200, stays deducted)
  balance            -- Should be 1000.00 (1200 - 200, stays deducted)
FROM user_profiles
WHERE id = 'USER_ID_HERE';


-- Check rejection transaction was created
SELECT 
  type,              -- Should be 'Withdrawal Rejected'
  amount,            -- Should be 0 (balance NOT returned)
  description,
  created_at
FROM transactions
WHERE user_id = 'USER_ID_HERE'
ORDER BY created_at DESC
LIMIT 1;


-- =====================================================
-- CLEANUP (optional - run after testing)
-- =====================================================
-- Delete test data

DELETE FROM transactions WHERE user_id = 'USER_ID_HERE';
DELETE FROM withdrawals WHERE user_id = 'USER_ID_HERE';
DELETE FROM admin_actions WHERE details->>'user_id' = 'USER_ID_HERE';
DELETE FROM user_profiles WHERE id = 'USER_ID_HERE';


-- =====================================================
-- EXPECTED RESULTS SUMMARY
-- =====================================================
-- ✓ Step 1: Test user created with KES 1500 balance
-- ✓ Step 2: Withdrawal request created (KES 300 from Task)
-- ✓ Step 3: Balance deducted automatically (1500 → 1200)
-- ✓ Step 3: Transaction record created ("Withdrawal Request")
-- ✓ Step 4: Admin approves withdrawal
-- ✓ Step 5: approved_at and processed_at timestamps set
-- ✓ Step 5: Transaction record created ("Withdrawal Approved")
-- ✓ Step 5: Admin action logged
-- ✓ Step 6: Rejection tested (balance NOT returned)
-- ✓ Step 6: Transaction record created ("Withdrawal Rejected")
