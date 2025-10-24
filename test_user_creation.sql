-- Test complete user flow
INSERT INTO auth.users (
  id, email, encrypted_password, email_confirmed_at, 
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'testuser@demo.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) ON CONFLICT (id) DO NOTHING;

INSERT INTO user_profiles (
  id, username, email, phone, task_balance, referral_balance, balance, is_activated
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'testuser',
  'testuser@demo.com',
  '254712345678',
  1500.00,
  800.00,
  2300.00,
  true
) ON CONFLICT (id) DO UPDATE SET
  task_balance = EXCLUDED.task_balance,
  referral_balance = EXCLUDED.referral_balance,
  balance = EXCLUDED.balance,
  is_activated = EXCLUDED.is_activated;

-- Test withdrawal
INSERT INTO withdrawals (
  user_id, amount, wallet_source, status
) VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  500.00,
  'Task',
  'Pending'
);

-- Verify balance deduction
SELECT username, task_balance, referral_balance, balance 
FROM user_profiles 
WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479';

-- Check transaction created
SELECT type, amount, description, created_at
FROM transactions 
WHERE user_id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
ORDER BY created_at DESC;
