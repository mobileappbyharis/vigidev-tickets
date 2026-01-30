-- Allow public signup by permitting INSERT on vigitckets_profiles for unauthenticated users
-- This is needed for the registration flow where users create their own profiles

-- Drop existing restrictive policy if it exists
DROP POLICY IF EXISTS "Users can insert their own profile" ON vigitckets_profiles;

-- Create new policy that allows anyone to insert (they will insert with their own user ID from auth)
CREATE POLICY "Allow public signup - insert own profile"
  ON vigitckets_profiles
  FOR INSERT
  WITH CHECK (
    -- Allow insert if the user ID matches the authenticated user's ID
    -- OR if it's a new registration (auth.uid() will return the user ID even for signup)
    auth.uid() = id
  );

-- Keep existing SELECT policy for authenticated users
CREATE POLICY "Users can view own profile and admins can view all"
  ON vigitckets_profiles
  FOR SELECT
  USING (
    auth.uid() = id OR
    (auth.uid() IN (
      SELECT id FROM vigitckets_profiles WHERE role IN ('admin', 'developer', 'technician')
    ))
  );

-- Keep existing UPDATE policy
CREATE POLICY "Users can update own profile"
  ON vigitckets_profiles
  FOR UPDATE
  USING (auth.uid() = id);
