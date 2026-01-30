'use client';

import { useEffect, useState } from 'react';
import { BUILD_INFO, formatBuildDate } from '@/lib/build-info';

export function BuildInfo() {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Set initial time
    setCurrentTime(formatBuildDate(new Date()));

    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(formatBuildDate(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Don't render until mounted (avoid hydration mismatch)
  if (!mounted || !currentTime) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700 font-mono">
      <div className="whitespace-nowrap">
        v{BUILD_INFO.version}
      </div>
      <div className="whitespace-nowrap text-slate-400">
        {currentTime}
      </div>
    </div>
  );
}
