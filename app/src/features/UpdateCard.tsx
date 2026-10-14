import React, { useState } from 'react';
import { Linking } from 'react-native';

import { Btn, Card, Row, T } from '@/components/ui';
import { useLoad } from '@/hooks/use-load';
import { currentVersion, downloadAndInstall, hasNativeVersion, type UpdateInfo } from '@/services/updates';
import { cachedUpdate, refreshUpdate } from '@/services/updates/auto';
import { plainNotes } from '@/services/updates/version';

import { useApp } from './app-context';

/** Home button: check for a new version and install it in one place. Android still asks you to confirm. */
export function UpdateCard() {
  const { settings } = useApp();
  const [cached] = useLoad(cachedUpdate);
  const [fresh, setFresh] = useState<UpdateInfo | null>(null);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const upd = fresh ?? cached;

  const check = async () => {
    setBusy(true);
    setMsg('Checking…');
    try {
      const u = await refreshUpdate(settings.updateRepo);
      setFresh(u);
      setMsg(u.available ? '' : `You are up to date (v${currentVersion()}).`);
    } catch (e) {
      setMsg(`${e instanceof Error ? e.message : e}`);
    }
    setBusy(false);
  };

  const install = async () => {
    if (!upd?.apkUrl) return;
    setProgress(0);
    setMsg('');
    try {
      await downloadAndInstall(upd.apkUrl, setProgress);
    } catch (e) {
      setMsg(`${e instanceof Error ? e.message : e}`);
    }
    setProgress(null);
  };

  if (!hasNativeVersion()) return null;
  if (upd?.available) {
    return (
      <Card tone="accent">
        <T style={{ fontWeight: '600' }}>{`New version available: ${upd.latest} (you have ${upd.current})`}</T>
        {!!upd.notes && <T v="small" dim>{plainNotes(upd.notes)}</T>}
        {upd.apkUrl ? (
          <Btn
            label={progress !== null ? `Downloading ${Math.round(progress * 100)}%` : '⬇ Update now'}
            disabled={progress !== null}
            onPress={install}
          />
        ) : (
          <Btn label="Open release page" onPress={() => Linking.openURL(upd.pageUrl)} />
        )}
        <T v="small" dim>Android will ask you to confirm the installation. Your progress is kept.</T>
        {!!msg && <T v="small">{msg}</T>}
      </Card>
    );
  }
  return (
    <Row style={{ justifyContent: 'space-between' }}>
      <Btn small kind="ghost" label={busy ? 'Checking…' : '🔄 Check for updates'} disabled={busy} onPress={check} />
      {!!msg && <T v="small" dim style={{ flex: 1 }}>{msg}</T>}
    </Row>
  );
}
