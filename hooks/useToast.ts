'use client';

import toast from 'react-hot-toast';

/**
 * Hook to show toast notifications
 */
export function useToast() {
  const success = (message: string, duration = 3000) => {
    toast.success(message, { duration });
  };

  const error = (message: string, duration = 4000) => {
    toast.error(message, { duration });
  };

  const info = (message: string, duration = 3000) => {
    toast(message, { duration });
  };

  const loading = (message: string) => {
    return toast.loading(message);
  };

  const dismiss = (toastId?: string) => {
    if (toastId) {
      toast.dismiss(toastId);
    } else {
      toast.dismiss();
    }
  };

  return { success, error, info, loading, dismiss };
}
