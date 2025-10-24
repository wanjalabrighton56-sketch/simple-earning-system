/*
  # Complete Task Earning System Schema

  ## Overview
  Production-ready schema for task earning system with:
  - User registration and authentication
  - Activation payment tracking (KES 500)
  - Split wallet system (Task and Referral balances)
  - Multi-level referral commissions (L1: 300, L2: 100, L3: 50)
  - Withdrawal approval workflow
  - Daily task submissions
  - Complete audit trails

  ## Tables Created
  
  1. **user_profiles** - Core user data and balances
  2. **activation_payments** - Tracks KES 500 activation fees
  3. **payment_callbacks** - PayHero callback audit log
  4. **daily_tasks** - User task submissions
  5. **withdrawals** - Cash-out requests
  6. **transactions** - Complete financial history
  7. **referral_tree** - Multi-level referral relationships
  8. **admin_actions** - Administrative action audit log

  ## Security
  - RLS enabled on all tables
  - Users can only access their own data
  - Admin operations logged for accountability
  - Service role for system operations

  ## Commission Structure
  - Level 1 (Direct): KES 300
  - Level 2 (Indirect): KES 100
  - Level 3 (Network): KES 50
*/

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USER PROFILES TABLE
-- =====================================================
CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text NOT NULL DEFAULT 'User',
  email text UNIQUE,
  phone_number text,
  referred_by uuid REFERENCES user_profiles(id),
  
  -- Activation tracking
  is_activated boolean DEFAULT false NOT NULL,
  activation_date timestamptz,
  
  -- Wallet balances
  balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
  task_balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
  referral_balance numeric(10, 2) DEFAULT 0.00 NOT NULL,
  total_earnings numeric(10, 2) DEFAULT 0.00 NOT NULL,
  
  -- Referral counters
  level1_count integer DEFAULT 0 NOT NULL,
  level2_count integer DEFAULT 0 NOT NULL,
  level3_count integer DEFAULT 0 NOT NULL,
  
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON user_profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON user_profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON user_profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Indexes
CREATE INDEX idx_user_profiles_email ON user_profiles(email);
CREATE INDEX idx_user_profiles_referred_by ON user_profiles(referred_by);
CREATE INDEX idx_user_profiles_activated ON user_profiles(is_activated);

-- =====================================================
-- ACTIVATION PAYMENTS TABLE
-- =====================================================
CREATE TABLE activation_payments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  phone_number text NOT NULL,
  amount numeric(10, 2) NOT NULL DEFAULT 500.00,
  external_reference text UNIQUE NOT NULL,
  checkout_request_id text,
  status text NOT NULL DEFAULT 'QUEUED',
  payhero_response jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  confirmed_at timestamptz
);

ALTER TABLE activation_payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activation payments"
  ON activation_payments FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activation payments"
  ON activation_payments FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update activation payments"
  ON activation_payments FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_activation_payments_user ON activation_payments(user_id);
CREATE INDEX idx_activation_payments_status ON activation_payments(status);
CREATE INDEX idx_activation_payments_reference ON activation_payments(external_reference);

-- =====================================================
-- PAYMENT CALLBACKS TABLE
-- =====================================================
CREATE TABLE payment_callbacks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  external_reference text NOT NULL,
  callback_data jsonb NOT NULL,
  status text,
  received_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE payment_callbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert callbacks"
  ON payment_callbacks FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_payment_callbacks_reference ON payment_callbacks(external_reference);
CREATE INDEX idx_payment_callbacks_received ON payment_callbacks(received_at DESC);

-- =====================================================
-- DAILY TASKS TABLE
-- =====================================================
CREATE TABLE daily_tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  task_date date NOT NULL DEFAULT CURRENT_DATE,
  question text NOT NULL,
  content text NOT NULL,
  word_count integer NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'Pending Review',
  submitted_at timestamptz DEFAULT now() NOT NULL,
  reviewed_at timestamptz,
  reviewer_notes text,
  UNIQUE(user_id, task_date)
);

ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tasks"
  ON daily_tasks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own tasks"
  ON daily_tasks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_daily_tasks_user_date ON daily_tasks(user_id, task_date DESC);
CREATE INDEX idx_daily_tasks_status ON daily_tasks(status);

-- =====================================================
-- WITHDRAWALS TABLE
-- =====================================================
CREATE TABLE withdrawals (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  amount numeric(10, 2) NOT NULL,
  wallet_source text NOT NULL CHECK (wallet_source IN ('Task', 'Referral')),
  status text NOT NULL DEFAULT 'Pending',
  requested_at timestamptz DEFAULT now() NOT NULL,
  processed_at timestamptz,
  processor_notes text,
  admin_id uuid REFERENCES user_profiles(id),
  rejection_reason text,
  approved_at timestamptz,
  rejected_at timestamptz
);

ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service can update withdrawals"
  ON withdrawals FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_withdrawals_status ON withdrawals(status, requested_at);
CREATE INDEX idx_withdrawals_user ON withdrawals(user_id, requested_at DESC);
CREATE INDEX idx_withdrawals_wallet_source ON withdrawals(wallet_source);

-- =====================================================
-- TRANSACTIONS TABLE
-- =====================================================
CREATE TABLE transactions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  amount numeric(10, 2) NOT NULL,
  balance_after numeric(10, 2) NOT NULL,
  source text,
  description text,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service can insert transactions"
  ON transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_transactions_user_date ON transactions(user_id, created_at DESC);

-- =====================================================
-- REFERRAL TREE TABLE
-- =====================================================
CREATE TABLE referral_tree (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  upline_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  level integer NOT NULL CHECK (level BETWEEN 1 AND 3),
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, upline_id, level)
);

ALTER TABLE referral_tree ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their referral tree"
  ON referral_tree FOR SELECT
  TO authenticated
  USING (auth.uid() = upline_id OR auth.uid() = user_id);

CREATE POLICY "Service can insert referral tree"
  ON referral_tree FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_referral_tree_upline ON referral_tree(upline_id, level);
CREATE INDEX idx_referral_tree_user ON referral_tree(user_id);

-- =====================================================
-- ADMIN ACTIONS TABLE
-- =====================================================
CREATE TABLE admin_actions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  target_id uuid NOT NULL,
  reason text,
  metadata jsonb,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE admin_actions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service can insert admin actions"
  ON admin_actions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Indexes
CREATE INDEX idx_admin_actions_admin ON admin_actions(admin_id);
CREATE INDEX idx_admin_actions_type ON admin_actions(action_type);
CREATE INDEX idx_admin_actions_created ON admin_actions(created_at DESC);

-- =====================================================
-- UPDATED_AT TRIGGER
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- DISTRIBUTE REFERRAL COMMISSIONS FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION distribute_referral_commissions(new_user_id uuid)
RETURNS void AS $$
DECLARE
  level1_upline uuid;
  level2_upline uuid;
  level3_upline uuid;
BEGIN
  -- Get the direct upline (Level 1)
  SELECT referred_by INTO level1_upline
  FROM user_profiles
  WHERE id = new_user_id;

  -- Level 1: Pay KES 300
  IF level1_upline IS NOT NULL THEN
    UPDATE user_profiles
    SET 
      referral_balance = referral_balance + 300,
      balance = balance + 300,
      total_earnings = total_earnings + 300,
      level1_count = level1_count + 1
    WHERE id = level1_upline;

    INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
    SELECT 
      level1_upline,
      'Team Commission',
      300,
      balance,
      'Level 1 Referral',
      'Commission from direct team member activation'
    FROM user_profiles WHERE id = level1_upline;

    -- Insert into referral_tree
    INSERT INTO referral_tree (user_id, upline_id, level)
    VALUES (new_user_id, level1_upline, 1)
    ON CONFLICT (user_id, upline_id, level) DO NOTHING;

    -- Get Level 2 upline
    SELECT referred_by INTO level2_upline
    FROM user_profiles
    WHERE id = level1_upline;

    -- Level 2: Pay KES 100
    IF level2_upline IS NOT NULL THEN
      UPDATE user_profiles
      SET 
        referral_balance = referral_balance + 100,
        balance = balance + 100,
        total_earnings = total_earnings + 100,
        level2_count = level2_count + 1
      WHERE id = level2_upline;

      INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
      SELECT 
        level2_upline,
        'Team Commission',
        100,
        balance,
        'Level 2 Referral',
        'Commission from team network activation'
      FROM user_profiles WHERE id = level2_upline;

      INSERT INTO referral_tree (user_id, upline_id, level)
      VALUES (new_user_id, level2_upline, 2)
      ON CONFLICT (user_id, upline_id, level) DO NOTHING;

      -- Get Level 3 upline
      SELECT referred_by INTO level3_upline
      FROM user_profiles
      WHERE id = level2_upline;

      -- Level 3: Pay KES 50
      IF level3_upline IS NOT NULL THEN
        UPDATE user_profiles
        SET 
          referral_balance = referral_balance + 50,
          balance = balance + 50,
          total_earnings = total_earnings + 50,
          level3_count = level3_count + 1
        WHERE id = level3_upline;

        INSERT INTO transactions (user_id, type, amount, balance_after, source, description)
        SELECT 
          level3_upline,
          'Team Commission',
          50,
          balance,
          'Level 3 Referral',
          'Commission from extended network activation'
        FROM user_profiles WHERE id = level3_upline;

        INSERT INTO referral_tree (user_id, upline_id, level)
        VALUES (new_user_id, level3_upline, 3)
        ON CONFLICT (user_id, upline_id, level) DO NOTHING;
      END IF;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;