# 🗄️ Supabase Database Setup Guide

## Quick Setup

Follow these steps to set up the VigiTickets database on your Supabase project.

### Step 1: Navigate to SQL Editor

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `tzmilnltvvtsvdmrkhin`
3. Click **SQL Editor** in the left sidebar
4. Click **New Query**

### Step 2: Run Migrations

#### Migration 1: Create Tables

1. Open `/supabase/migrations/001_create_tables.sql`
2. Copy the entire content
3. Paste into SQL Editor
4. Click **Run** button

Expected output: All tables created successfully

#### Migration 2: Enable RLS & Policies

1. Open `/supabase/migrations/002_enable_rls.sql`
2. Copy the entire content
3. Paste into SQL Editor
4. Click **Run** button

Expected output: RLS enabled and policies created

### Step 3: Verify Tables

In SQL Editor, run this query to verify:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'vigitckets_%'
ORDER BY table_name;
```

You should see 8 tables:
- vigitckets_client_projects
- vigitckets_notification_logs
- vigitckets_profiles
- vigitckets_projects
- vigitckets_ticket_attachments
- vigitckets_ticket_history
- vigitckets_ticket_messages
- vigitckets_tickets

### Step 4: Create Storage Bucket for Attachments

1. Go to **Storage** in the left sidebar
2. Click **Create a new bucket**
3. Name: `vigitckets_attachments`
4. Check "Make it private"
5. Click **Create bucket**

### Step 5: Configure Storage RLS

In SQL Editor, create RLS policies for the storage bucket:

```sql
-- Allow users to upload files to their ticket messages
CREATE POLICY "ticket_attachments_upload" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'vigitckets_attachments' AND
  auth.role() = 'authenticated'
);

-- Allow users to view files they have access to
CREATE POLICY "ticket_attachments_view" ON storage.objects
FOR SELECT USING (
  bucket_id = 'vigitckets_attachments' AND
  auth.role() = 'authenticated'
);
```

### Step 6: Create Test Users (Optional)

For testing, create users via Supabase Dashboard:

1. Go to **Authentication** → **Users**
2. Click **Add user**
3. Create test accounts:
   - Admin: `admin@vigidev.com` / password: `test123456`
   - Technician: `tech@vigidev.com` / password: `test123456`
   - Client: `client@example.com` / password: `test123456`

### Step 7: Seed Test Data (Optional)

1. After creating auth users, get their UUIDs from the Users list
2. Update `/supabase/seed.sql` with actual UUIDs
3. Run the seed SQL in SQL Editor

## Database Schema Overview

### User Roles

- **client**: Can create tickets for assigned projects
- **technician**: Can manage tickets, assign tasks
- **developer**: Can work on tickets assigned to them
- **admin**: Full access (create projects, manage users, etc.)

### Ticket Status Flow

```
Nouveau → Pris en charge → En cours → En attente client → Résolu → Clôturé
```

### Ticket Priorities

- basse (low)
- moyenne (medium)
- haute (high)
- urgente (urgent)

## Security

### Row Level Security (RLS)

All tables have RLS enabled to protect user data:
- Clients can only see their own tickets and assigned projects
- Vigidev team (technician, developer, admin) can see all tickets
- Users can only modify their own data (except admins)

### Key Policies

1. **Profiles**: Users see their own profile, admins see all
2. **Projects**: Only Vigidev team can see projects
3. **Tickets**: Clients see their own, team sees all
4. **Messages**: Only ticket participants can see
5. **Attachments**: Protected like messages

## Troubleshooting

### Tables not created?

- Check for SQL errors in the output
- Verify syntax in migration files
- Try running one table at a time

### RLS policies not working?

- Verify RLS is enabled: Settings → Database → RLS
- Check auth user has proper role in vigitckets_profiles
- Test with direct SQL queries first

### Storage bucket issues?

- Ensure bucket name is exactly `vigitckets_attachments`
- Set to private, not public
- Create RLS policies for bucket

## Next Steps

1. ✅ Tables created
2. ✅ RLS enabled
3. ✅ Storage bucket configured
4. → Test auth pages (`/login`, `/register`, `/invite`)
5. → Create client/vigidev dashboards (Phase 2)

## Useful Links

- [Supabase Docs](https://supabase.com/docs)
- [RLS Overview](https://supabase.com/docs/guides/auth/row-level-security)
- [Storage Docs](https://supabase.com/docs/guides/storage)
- [Your Project](https://supabase.com/dashboard/project/tzmilnltvvtsvdmrkhin)

---

**Status**: Ready for Phase 1 Testing ✨
