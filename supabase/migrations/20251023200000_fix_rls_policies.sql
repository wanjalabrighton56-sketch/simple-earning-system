-- =====================================================
-- FIX RLS POLICIES FOR APP LOADING
-- =====================================================
-- This fixes the continuous loading issue by ensuring
-- authenticated users can read their own profiles
-- =====================================================

-- Drop existing policies that might be too restrictive
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON user_profiles;

-- Create proper policies for user_profiles
CREATE POLICY "Users can read own profile"
ON user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow service role full access (for backend operations)
CREATE POLICY "Service role has full access"
ON user_profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Fix transactions table policies
DROP POLICY IF EXISTS "Users can view own transactions" ON transactions;

CREATE POLICY "Users can read own transactions"
ON transactions
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Fix withdrawals table policies
DROP POLICY IF EXISTS "Users can view own withdrawals" ON withdrawals;
DROP POLICY IF EXISTS "Users can create withdrawals" ON withdrawals;

CREATE POLICY "Users can read own withdrawals"
ON withdrawals
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own withdrawals"
ON withdrawals
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix daily_tasks table policies
DROP POLICY IF EXISTS "Users can view own tasks" ON daily_tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON daily_tasks;

CREATE POLICY "Users can read own tasks"
ON daily_tasks
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can create own tasks"
ON daily_tasks
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Fix referral_tree policies
DROP POLICY IF EXISTS "Users can view referrals" ON referral_tree;

CREATE POLICY "Users can read own referral tree"
ON referral_tree
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR upline_id = auth.uid());

-- Ensure RLS is enabled on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_tree ENABLE ROW LEVEL SECURITY;
ALTER TABLE activation_payments ENABLE ROW LEVEL SECURITY;

-- Comments
COMMENT ON POLICY "Users can read own profile" ON user_profiles IS 
'Allows authenticated users to read their own profile data';

COMMENT ON POLICY "Service role has full access" ON user_profiles IS 
'Allows backend service to perform all operations';
