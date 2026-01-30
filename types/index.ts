/**
 * User and Authentication Types
 */
export type UserRole = 'client' | 'technician' | 'developer' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  notify_new_ticket: boolean;
  notify_status_change: boolean;
  notify_new_message: boolean;
  notify_assignment: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, any>;
}

/**
 * Project Types
 */
export interface Project {
  id: string;
  name: string;
  address: string;
  description?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ClientProject {
  id: string;
  client_id: string;
  project_id: string;
  assigned_at: string;
  assigned_by: string;
}

/**
 * Ticket Types
 */
export type TicketStatus =
  | 'Nouveau'
  | 'Pris en charge'
  | 'En cours'
  | 'En attente client'
  | 'Résolu'
  | 'Clôturé';

export type TicketPriority = 'basse' | 'moyenne' | 'haute' | 'urgente';

export type FileType = 'image' | 'video' | 'pdf' | 'other';

export interface Ticket {
  id: string;
  project_id: string;
  created_by: string;
  assigned_to?: string;
  shared_with: string[];
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  created_at: string;
  updated_at: string;
}

export interface TicketMessage {
  id: string;
  ticket_id: string;
  author_id: string;
  content: string;
  is_internal: boolean;
  created_at: string;
}

export interface TicketAttachment {
  id: string;
  ticket_id: string;
  message_id?: string;
  file_url: string;
  file_type: FileType;
  file_size: number;
  original_filename: string;
  created_at: string;
}

export interface TicketHistory {
  id: string;
  ticket_id: string;
  changed_by: string;
  old_status: TicketStatus;
  new_status: TicketStatus;
  comment?: string;
  created_at: string;
}

/**
 * Notification Types
 */
export type NotificationType =
  | 'new_ticket'
  | 'status_change'
  | 'new_message'
  | 'assignment';

export interface NotificationLog {
  id: string;
  recipient_id: string;
  ticket_id?: string;
  type: NotificationType;
  subject: string;
  sent_at: string;
  status: 'sent' | 'failed';
  error_message?: string;
}

/**
 * UI and Component Types
 */
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

export interface FilterOptions {
  projectId?: string;
  clientId?: string;
  status?: TicketStatus;
  priority?: TicketPriority;
  assignedTo?: string;
  search?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  status: number;
}
