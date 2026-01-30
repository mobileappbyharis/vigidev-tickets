'use client';

import { BUILD_INFO, formatBuildDate } from '@/lib/build-info';

export function BuildInfo() {
  const formattedDate = formatBuildDate(BUILD_INFO.buildDate);

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-slate-100 text-xs px-3 py-2 rounded-lg shadow-lg border border-slate-700 font-mono">
      <div className="whitespace-nowrap">
        v{BUILD_INFO.version}
      </div>
      <div className="whitespace-nowrap text-slate-400">
        {formattedDate}
      </div>
    </div>
  );
}
