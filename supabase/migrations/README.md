# Supabase Migrations for VigiTickets

## Overview

This directory contains SQL migration files for the VigiTickets database schema.

## Database Schema

### Tables Created

1. **vigitckets_profiles** - User profiles (extends auth.users)
   - Roles: client, technician, developer, admin
   - Notification preferences per user

2. **vigitckets_projects** - Project management
   - Name, address, description
   - Created by admin users

3. **vigitckets_client_projects** - Many-to-many client to project mapping
   - Tracks which clients have access to which projects

4. **vigitckets_tickets** - Support tickets
   - Created by clients for their projects
   - Assigned to technicians/developers
   - Shared with additional team members
   - Statuses: Nouveau, Pris en charge, En cours, En attente client, Résolu, Clôturé
   - Priorities: basse, moyenne, haute, urgente

5. **vigitckets_ticket_messages** - Chat messages on tickets
   - Can be marked as internal (team only)
   - Supports file attachments

6. **vigitckets_ticket_attachments** - File uploads
   - Types: image, video, pdf, other
   - Stores file URL, size, original filename

7. **vigitckets_ticket_history** - Status change audit log
   - Tracks who changed status and when
   - Optional comment for each change

8. **vigitckets_notification_logs** - Email notification tracking
   - Types: new_ticket, status_change, new_message, assignment
   - Status: sent, failed
   - Stores error messages for debugging

## Row Level Security (RLS)

All tables have RLS enabled with specific policies:

### vigitckets_profiles
- Users can only see/edit their own profile
- Admins can see all profiles

### vigitckets_projects
- Vigidev team (technician, developer, admin) can see all
- Clients cannot see project list directly

### vigitckets_client_projects
- Clients see their own assignments
- Vigidev team can manage all assignments

### vigitckets_tickets
- Clients see their own tickets
- Vigidev team sees all tickets
- Access based on project assignment

### vigitckets_ticket_messages
- Visible to ticket creator, assigned user, shared users, and team

### vigitckets_ticket_attachments
- Same permissions as messages

### vigitckets_ticket_history
- Vigidev team can see all
- Clients see history for their own tickets

### vigitckets_notification_logs
- Users can only see their own logs

## How to Apply Migrations

### Using Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Link to your project
supabase link --project-ref tzmilnltvvtsvdmrkhin

# Apply migrations
supabase migration up
```

### Using Supabase Dashboard (Manual)

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. SQL Editor → New Query
4. Copy & paste contents of migration files
5. Run query

## Indexes

Indexes are created on frequently queried columns for performance:
- Foreign keys
- Role column
- Status column
- Recipient and ticket IDs

## Notes

- All tables use UUID primary keys
- Timestamps with timezone for consistency
- Cascading deletes configured appropriately
- Check constraints on enum-like columns
- Unique constraints on relationships (e.g., client cannot be assigned twice to same project)
