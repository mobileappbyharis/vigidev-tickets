'use client';

import { useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Hook to subscribe to Supabase Realtime events
 */
export function useRealtime(
  table: string,
  onInsert?: (payload: any) => void,
  onUpdate?: (payload: any) => void,
  onDelete?: (payload: any) => void,
  filter?: string
) {
  useEffect(() => {
    let channel: RealtimeChannel;

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
          (payload) => onInsert?.(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: table,
            ...(filter && { filter }),
          },
          (payload) => onUpdate?.(payload)
        )
        .on(
          'postgres_changes',
          {
            event: 'DELETE',
            schema: 'public',
            table: table,
            ...(filter && { filter }),
          },
          (payload) => onDelete?.(payload)
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
