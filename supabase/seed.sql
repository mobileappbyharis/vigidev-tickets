-- Seed data for VigiTickets (for development/testing)
-- Note: In production, use proper admin interface or API

-- Insert test users (requires auth users to be created first via UI or API)
-- Format: (uuid, email, full_name, role)

-- Example profiles (replace UUIDs with actual auth user IDs from your Supabase project)
--
-- INSERT INTO vigitckets_profiles (id, email, full_name, role) VALUES
-- ('uuid-admin-1', 'admin@vigidev.com', 'Admin Vigidev', 'admin'),
-- ('uuid-tech-1', 'tech@vigidev.com', 'Technicien Vigidev', 'technician'),
-- ('uuid-dev-1', 'dev@vigidev.com', 'Developer Vigidev', 'developer'),
-- ('uuid-client-1', 'client@example.com', 'Client One', 'client'),
-- ('uuid-client-2', 'client2@example.com', 'Client Two', 'client');

-- Example projects (replace created_by with actual admin UUID)
--
-- INSERT INTO vigitckets_projects (id, name, address, description, created_by) VALUES
-- (gen_random_uuid(), 'Projet Alpha', '123 Rue de Paris, 75001 Paris', 'Installation système de sécurité', 'uuid-admin-1'),
-- (gen_random_uuid(), 'Projet Beta', '456 Avenue Champs, 75008 Paris', 'Mise à niveau vidéosurveillance', 'uuid-admin-1');

-- Example client-project assignments
--
-- INSERT INTO vigitckets_client_projects (client_id, project_id, assigned_by) VALUES
-- ('uuid-client-1', (SELECT id FROM vigitckets_projects WHERE name = 'Projet Alpha' LIMIT 1), 'uuid-admin-1'),
-- ('uuid-client-2', (SELECT id FROM vigitckets_projects WHERE name = 'Projet Beta' LIMIT 1), 'uuid-admin-1');

-- Steps to seed data:
-- 1. Create auth users in Supabase Dashboard → Authentication → Users
-- 2. Get the UUID of each user
-- 3. Uncomment and update the INSERT statements above with actual UUIDs
-- 4. Run this file in Supabase SQL Editor
