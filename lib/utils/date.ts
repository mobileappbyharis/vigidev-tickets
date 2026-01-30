import {
  format,
  formatDistanceToNow,
  parseISO,
  isToday,
  isYesterday,
} from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Format date to readable string (French locale)
 */
export function formatDate(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMMM yyyy', { locale: fr });
}

/**
 * Format date with time (French locale)
 */
export function formatDateTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'dd MMMM yyyy HH:mm', { locale: fr });
}

/**
 * Format time only (French locale)
 */
export function formatTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, 'HH:mm', { locale: fr });
}

/**
 * Format relative time (e.g. "il y a 2 heures")
 */
export function formatRelativeTime(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return formatDistanceToNow(d, { addSuffix: true, locale: fr });
}

/**
 * Smart date formatting (Today/Yesterday or date)
 */
export function formatSmartDate(date: string | Date) {
  const d = typeof date === 'string' ? parseISO(date) : date;

  if (isToday(d)) {
    return `Aujourd'hui à ${formatTime(d)}`;
  }

  if (isYesterday(d)) {
    return `Hier à ${formatTime(d)}`;
  }

  return formatDate(d);
}
