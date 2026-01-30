#!/usr/bin/env node

/**
 * Apply RLS fix directly to Supabase database
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const SQL = `
-- Fix RLS to allow unauthenticated INSERT during signup
DROP POLICY IF EXISTS "Allow public signup - insert own profile" ON vigitckets_profiles;
DROP POLICY IF EXISTS "Allow unauthenticated signup - insert own profile" ON vigitckets_profiles;

-- Create new policy that allows unauthenticated users to insert their own profile
CREATE POLICY "Allow unauthenticated signup - insert own profile"
  ON vigitckets_profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NULL OR auth.uid() = id
  );

-- Update SELECT policy to allow NULL auth.uid()
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
`;

async function applyRLSFix() {
  try {
    console.log('🔐 Applying RLS fix to Supabase...');

    const { error } = await supabase.rpc('exec_sql', {
      sql: SQL
    }).catch(() => {
      // exec_sql might not exist, try direct query
      return supabase.from('_sql').select('*');
    });

    if (error) {
      console.error('❌ Error applying RLS fix:', error);
      process.exit(1);
    }

    console.log('✓ RLS fix applied successfully');
  } catch (err) {
    console.error('❌ Failed to apply RLS fix:', err.message);
    process.exit(1);
  }
}

applyRLSFix();
