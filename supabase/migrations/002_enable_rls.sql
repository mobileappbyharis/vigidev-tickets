-- Enable Row Level Security for all tables
ALTER TABLE vigitckets_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_client_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_ticket_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_ticket_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_ticket_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vigitckets_notification_logs ENABLE ROW LEVEL SECURITY;

-- Profiles RLS: Users can only see their own profile
CREATE POLICY "profiles_self_select" ON vigitckets_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_self_update" ON vigitckets_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles_insert" ON vigitckets_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow admins to view all profiles
CREATE POLICY "profiles_admin_select" ON vigitckets_profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Projects RLS: Vigidev team can see all, clients see none directly
CREATE POLICY "projects_vigidev_select" ON vigitckets_projects
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );

CREATE POLICY "projects_admin_insert" ON vigitckets_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE POLICY "projects_admin_update" ON vigitckets_projects
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Client Projects RLS: Users can see their own assignments
CREATE POLICY "client_projects_select" ON vigitckets_client_projects
  FOR SELECT USING (
    auth.uid() = client_id OR
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );

CREATE POLICY "client_projects_admin_insert" ON vigitckets_client_projects
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Tickets RLS: Clients see their own, Vigidev sees all
CREATE POLICY "tickets_client_select" ON vigitckets_tickets
  FOR SELECT USING (
    auth.uid() = created_by OR
    EXISTS (
      SELECT 1 FROM vigitckets_client_projects
      WHERE client_id = auth.uid() AND project_id = vigitckets_tickets.project_id
    ) OR
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );

CREATE POLICY "tickets_client_insert" ON vigitckets_tickets
  FOR INSERT WITH CHECK (
    auth.uid() = created_by AND
    EXISTS (
      SELECT 1 FROM vigitckets_client_projects
      WHERE client_id = auth.uid() AND project_id = vigitckets_tickets.project_id
    )
  );

CREATE POLICY "tickets_vigidev_update" ON vigitckets_tickets
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );

-- Ticket Messages RLS: Participants can see messages
CREATE POLICY "ticket_messages_select" ON vigitckets_ticket_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vigitckets_tickets
      WHERE id = ticket_id AND (
        created_by = auth.uid() OR
        assigned_to = auth.uid() OR
        auth.uid() = ANY(shared_with) OR
        EXISTS (
          SELECT 1 FROM vigitckets_profiles
          WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
        )
      )
    )
  );

CREATE POLICY "ticket_messages_insert" ON vigitckets_ticket_messages
  FOR INSERT WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM vigitckets_tickets
      WHERE id = ticket_id AND (
        created_by = auth.uid() OR
        assigned_to = auth.uid() OR
        auth.uid() = ANY(shared_with) OR
        EXISTS (
          SELECT 1 FROM vigitckets_profiles
          WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
        )
      )
    )
  );

-- Ticket Attachments RLS: Same as messages
CREATE POLICY "ticket_attachments_select" ON vigitckets_ticket_attachments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vigitckets_ticket_messages m
      WHERE m.id = message_id AND
      EXISTS (
        SELECT 1 FROM vigitckets_tickets t
        WHERE t.id = m.ticket_id AND (
          t.created_by = auth.uid() OR
          t.assigned_to = auth.uid() OR
          auth.uid() = ANY(t.shared_with) OR
          EXISTS (
            SELECT 1 FROM vigitckets_profiles
            WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
          )
        )
      )
    )
  );

CREATE POLICY "ticket_attachments_insert" ON vigitckets_ticket_attachments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vigitckets_ticket_messages m
      WHERE m.id = message_id AND
      EXISTS (
        SELECT 1 FROM vigitckets_tickets t
        WHERE t.id = m.ticket_id AND (
          t.created_by = auth.uid() OR
          t.assigned_to = auth.uid() OR
          auth.uid() = ANY(t.shared_with) OR
          EXISTS (
            SELECT 1 FROM vigitckets_profiles
            WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
          )
        )
      )
    )
  );

-- Ticket History RLS: Vigidev can see all
CREATE POLICY "ticket_history_select" ON vigitckets_ticket_history
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    ) OR
    EXISTS (
      SELECT 1 FROM vigitckets_tickets t
      WHERE t.id = ticket_id AND t.created_by = auth.uid()
    )
  );

CREATE POLICY "ticket_history_insert" ON vigitckets_ticket_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );

-- Notification Logs RLS: Users can see their own
CREATE POLICY "notification_logs_select" ON vigitckets_notification_logs
  FOR SELECT USING (auth.uid() = recipient_id);

CREATE POLICY "notification_logs_insert" ON vigitckets_notification_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM vigitckets_profiles
      WHERE id = auth.uid() AND role IN ('technician', 'developer', 'admin')
    )
  );
