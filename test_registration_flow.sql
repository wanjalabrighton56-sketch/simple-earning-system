-- Test registration and login flow
-- Run this in Supabase SQL Editor to verify user creation works

-- First, check if test user exists and clean up
DELETE FROM user_profiles WHERE email = 'testuser@example.com';
DELETE FROM auth.users WHERE email = 'testuser@example.com';

-- Check that tables are accessible
SELECT COUNT(*) as user_count FROM user_profiles;
SELECT COUNT(*) as auth_count FROM auth.users;

-- Verify RLS policies allow user creation
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- Test user creation manually (simulating what the app should do)
INSERT INTO auth.users (
  id,
  instance_id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000000',
  'authenticated',
  'authenticated',
  'testuser@example.com',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{}',
  now(),
  now()
) RETURNING id, email;

-- Get the user ID for profile creation
WITH new_user AS (
  SELECT id FROM auth.users WHERE email = 'testuser@example.com'
)
INSERT INTO user_profiles (
  id,
  username,
  email,
  phone,
  is_activated
) 
SELECT 
  id,
  'testuser',
  'testuser@example.com',
  '254712345678',
  false
FROM new_user
RETURNING *;

-- Verify user was created successfully
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.username,
  p.phone,
  p.is_activated,
  p.created_at
FROM auth.users u
JOIN user_profiles p ON u.id = p.id
WHERE u.email = 'testuser@example.com';
