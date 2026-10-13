/** Compare MAJOR.MINOR.PATCH. Returns >0 if a is newer than b. */
export function compareVersions(a: string, b: string): number {
  const pa = a.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
  const pb = b.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < 3; i++) {
    const d = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (d !== 0) return d;
  }
  return 0;
}

export const UPDATE_CHECK_INTERVAL_MS = 24 * 60 * 60 * 1000;

/** True when a daily automatic check is due (never checked, or last check older than the interval). */
export function shouldCheck(lastCheckedAt: number | null, now = Date.now()): boolean {
  return lastCheckedAt === null || now - lastCheckedAt >= UPDATE_CHECK_INTERVAL_MS || lastCheckedAt > now;
}
