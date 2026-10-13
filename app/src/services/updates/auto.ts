import { kvGet, kvSet } from '../storage/db';
import { DEFAULT_UPDATE_REPO } from '../storage/defaults';
import { checkForUpdate, currentVersion, type UpdateInfo } from './index';
import { compareVersions, shouldCheck } from './version';

interface Cached {
  checkedAt: number;
  info: UpdateInfo | null;
}

/** Reads the last stored check and re-evaluates "available" against the version actually installed now. */
export async function cachedUpdate(): Promise<UpdateInfo | null> {
  const c = await kvGet<Cached | null>('updateCheck', null);
  if (!c?.info) return null;
  const current = currentVersion();
  return { ...c.info, current, available: compareVersions(c.info.latest, current) > 0 };
}

/** At most one network call per 24 h, silent on failure (offline is normal). */
export async function autoCheckForUpdate(repo: string, enabled: boolean): Promise<UpdateInfo | null> {
  if (!enabled) return cachedUpdate();
  const c = await kvGet<Cached | null>('updateCheck', null);
  if (!shouldCheck(c?.checkedAt ?? null)) return cachedUpdate();
  try {
    const info = await checkForUpdate(repo.trim() || DEFAULT_UPDATE_REPO);
    await kvSet('updateCheck', { checkedAt: Date.now(), info } satisfies Cached);
    return info;
  } catch {
    return cachedUpdate();
  }
}
