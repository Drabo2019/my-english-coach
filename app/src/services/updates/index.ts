import * as Application from 'expo-application';
import * as FileSystem from 'expo-file-system/legacy';
import * as IntentLauncher from 'expo-intent-launcher';
import { Linking, Platform } from 'react-native';

import { compareVersions } from './version';

export interface UpdateInfo {
  current: string;
  latest: string;
  available: boolean;
  notes: string;
  apkUrl: string | null;
  pageUrl: string;
}

export const currentVersion = () => Application.nativeApplicationVersion ?? '0.0.0';
/** False on web, where there is no installed app version (and no APK to update). */
export const hasNativeVersion = () => !!Application.nativeApplicationVersion;

/** repo = "owner/name" of the GitHub repository hosting the Releases. */
export async function checkForUpdate(repo: string): Promise<UpdateInfo> {
  if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) throw new Error('Set the GitHub repository ("owner/repo") in Settings first.');
  const res = await fetch(`https://api.github.com/repos/${repo}/releases/latest`, {
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (res.status === 404) throw new Error('No release found (is the repository public and does it have a release?).');
  if (!res.ok) throw new Error(`GitHub HTTP ${res.status}`);
  const rel = await res.json();
  const latest = String(rel.tag_name ?? '').replace(/^v/, '');
  const apk = (rel.assets ?? []).find((a: { name: string }) => a.name.endsWith('.apk'));
  const current = currentVersion();
  return {
    current,
    latest,
    available: compareVersions(latest, current) > 0,
    notes: String(rel.body ?? ''),
    apkUrl: apk?.browser_download_url ?? null,
    pageUrl: String(rel.html_url ?? `https://github.com/${repo}/releases`),
  };
}

/**
 * Downloads the APK and opens Android's package installer. Android requires the user to confirm the
 * install and to allow "install unknown apps" for this app. We never bypass those protections.
 * The new APK must be signed with the same key as the installed one, or Android will refuse it.
 */
export async function downloadAndInstall(apkUrl: string, onProgress?: (p: number) => void): Promise<void> {
  if (Platform.OS !== 'android') {
    await Linking.openURL(apkUrl);
    return;
  }
  const dest = `${FileSystem.cacheDirectory}update.apk`;
  const dl = FileSystem.createDownloadResumable(apkUrl, dest, {}, (p) => {
    if (p.totalBytesExpectedToWrite > 0) onProgress?.(p.totalBytesWritten / p.totalBytesExpectedToWrite);
  });
  const r = await dl.downloadAsync();
  if (!r) throw new Error('Download failed');
  const contentUri = await FileSystem.getContentUriAsync(r.uri);
  await IntentLauncher.startActivityAsync('android.intent.action.VIEW', {
    data: contentUri,
    flags: 1 | 0x10000000, // GRANT_READ_URI_PERMISSION | NEW_TASK
    type: 'application/vnd.android.package-archive',
  });
}
