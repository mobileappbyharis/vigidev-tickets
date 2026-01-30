/**
 * Build information - automatically updated on each deployment
 * Generated at build time
 */
export const BUILD_INFO = {
  version: process.env.NEXT_PUBLIC_BUILD_VERSION || '0.0.0',
  timestamp: process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || new Date().toISOString(),
  buildDate: new Date(process.env.NEXT_PUBLIC_BUILD_TIMESTAMP || Date.now()),
};

export function formatBuildDate(date: Date): string {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
}
