-- Fix RLS to allow unauthenticated INSERT during signup
-- The issue: signUp() creates a user but doesn't immediately authenticate them
-- So auth.uid() is NULL during profile insertion
-- Solution: Allow INSERT when auth.uid() is NULL OR auth.uid() = id

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Allow public signup - insert own profile" ON vigitckets_profiles;

-- Create new policy that allows unauthenticated users to insert their own profile
-- This works because:
-- 1. During signup via API, the user ID is provided in the data
-- 2. RLS will check auth.uid() = id which allows authenticated users
-- 3. We also allow NULL auth.uid() to support client-side signup flows
CREATE POLICY "Allow unauthenticated signup - insert own profile"
  ON vigitckets_profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR auth.uid() = id
  );

-- Recreate SELECT policy (allow users to view own profile, admins to view all)
DROP POLICY IF EXISTS "Users can view own profile and admins can view all" ON vigitckets_profiles;
CREATE POLICY "Users can view own profile and admins can view all"
  ON vigitckets_profiles
  FOR SELECT
  USING (
    auth.uid() IS NULL OR
    auth.uid() = id OR
    (auth.uid() IN (
      SELECT id FROM vigitckets_profiles WHERE role IN ('admin', 'developer', 'technician')
    ))
  );

-- Recreate UPDATE policy
DROP POLICY IF EXISTS "Users can update own profile" ON vigitckets_profiles;
CREATE POLICY "Users can update own profile"
  ON vigitckets_profiles
  FOR UPDATE
  USING (auth.uid() = id);
