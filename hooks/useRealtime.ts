'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

/**
 * Hook to subscribe to Supabase Realtime events
 */
export function useRealtime(
  table: string,
  onInsert?: (payload: RealtimePostgresChangesPayload<any>) => void,
  onUpdate?: (payload: RealtimePostgresChangesPayload<any>) => void,
  onDelete?: (payload: RealtimePostgresChangesPayload<any>) => void,
  filter?: string
) {
  useEffect(() => {
    let channel: RealtimeChannel | null = null;

    const subscribe = async () => {
      const channelName = `${table}:${filter || '*'}`;

      channel = supabase
        .channel(channelName)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: table,
            ...(filter && { filter }),
          },
          (payload: RealtimePostgresChangesPayload<any>) => onInsert?.(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            ...(filter && { filter }),
          },
          (payload: RealtimePostgresChangesPayload<any>) => onUpdate?.(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table,
            ...(filter && { filter }),
          },
          (payload: RealtimePostgresChangesPayload<any>) => onDelete?.(payload)
        )
        .subscribe();
    };

    subscribe();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [table, filter, onInsert, onUpdate, onDelete]);
}
