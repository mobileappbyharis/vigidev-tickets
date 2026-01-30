-- Create vigitckets_profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS vigitckets_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('client', 'technician', 'developer', 'admin')),
  notify_new_ticket BOOLEAN DEFAULT true,
  notify_status_change BOOLEAN DEFAULT true,
  notify_new_message BOOLEAN DEFAULT true,
  notify_assignment BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_projects table
CREATE TABLE IF NOT EXISTS vigitckets_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_client_projects table (many-to-many)
CREATE TABLE IF NOT EXISTS vigitckets_client_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES vigitckets_projects(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(client_id, project_id)
);

-- Create vigitckets_tickets table
CREATE TABLE IF NOT EXISTS vigitckets_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES vigitckets_projects(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  assigned_to UUID REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  shared_with UUID[] DEFAULT '{}',
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'Nouveau' CHECK (status IN ('Nouveau', 'Pris en charge', 'En cours', 'En attente client', 'Résolu', 'Clôturé')),
  priority TEXT NOT NULL DEFAULT 'moyenne' CHECK (priority IN ('basse', 'moyenne', 'haute', 'urgente')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_ticket_messages table
CREATE TABLE IF NOT EXISTS vigitckets_ticket_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES vigitckets_tickets(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_internal BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_ticket_attachments table
CREATE TABLE IF NOT EXISTS vigitckets_ticket_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES vigitckets_tickets(id) ON DELETE CASCADE,
  message_id UUID REFERENCES vigitckets_ticket_messages(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video', 'pdf', 'other')),
  file_size INTEGER NOT NULL,
  original_filename TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_ticket_history table
CREATE TABLE IF NOT EXISTS vigitckets_ticket_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id UUID NOT NULL REFERENCES vigitckets_tickets(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE SET NULL,
  old_status TEXT,
  new_status TEXT,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vigitckets_notification_logs table
CREATE TABLE IF NOT EXISTS vigitckets_notification_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID NOT NULL REFERENCES vigitckets_profiles(id) ON DELETE CASCADE,
  ticket_id UUID REFERENCES vigitckets_tickets(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('new_ticket', 'status_change', 'new_message', 'assignment')),
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'failed')),
  error_message TEXT
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_vigitckets_profiles_email ON vigitckets_profiles(email);
CREATE INDEX IF NOT EXISTS idx_vigitckets_profiles_role ON vigitckets_profiles(role);
CREATE INDEX IF NOT EXISTS idx_vigitckets_projects_created_by ON vigitckets_projects(created_by);
CREATE INDEX IF NOT EXISTS idx_vigitckets_client_projects_client_id ON vigitckets_client_projects(client_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_client_projects_project_id ON vigitckets_client_projects(project_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_tickets_project_id ON vigitckets_tickets(project_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_tickets_created_by ON vigitckets_tickets(created_by);
CREATE INDEX IF NOT EXISTS idx_vigitckets_tickets_assigned_to ON vigitckets_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_vigitckets_tickets_status ON vigitckets_tickets(status);
CREATE INDEX IF NOT EXISTS idx_vigitckets_ticket_messages_ticket_id ON vigitckets_ticket_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_ticket_messages_author_id ON vigitckets_ticket_messages(author_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_ticket_attachments_ticket_id ON vigitckets_ticket_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_notification_logs_recipient_id ON vigitckets_notification_logs(recipient_id);
CREATE INDEX IF NOT EXISTS idx_vigitckets_notification_logs_ticket_id ON vigitckets_notification_logs(ticket_id);
