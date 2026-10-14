import React, { useState } from 'react';
import { Linking } from 'react-native';

import { Btn, Card, Row, T } from '@/components/ui';
import { useLoad } from '@/hooks/use-load';
import { currentVersion, downloadAndInstall, hasNativeVersion, type UpdateInfo } from '@/services/updates';
import { cachedUpdate, refreshUpdate } from '@/services/updates/auto';
import { plainNotes } from '@/services/updates/version';

import { useApp } from './app-context';

/** Today screen: a quiet version line, and a single row when a newer version exists. Android still asks you to confirm. */
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
      setMsg(u.available ? '' : 'You are up to date.');
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
    const firstNote = plainNotes(upd.notes, 160).split('\n')[0];
    return (
      <Card tone="accent">
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <T style={{ flex: 1, fontWeight: '600' }}>{`Version ${upd.latest} is available`}</T>
          {upd.apkUrl ? (
            <Btn small label={progress !== null ? `${Math.round(progress * 100)}%` : 'Update'} disabled={progress !== null} onPress={install} />
          ) : (
            <Btn small label="Open page" onPress={() => Linking.openURL(upd.pageUrl)} />
          )}
        </Row>
        {!!firstNote && <T v="small" dim numberOfLines={2}>{firstNote}</T>}
        {!!msg && <T v="small">{msg}</T>}
      </Card>
    );
  }

  return (
    <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
      <T v="small" dim style={{ flex: 1 }}>{msg || `Version ${currentVersion()}`}</T>
      <Btn small kind="ghost" label={busy ? 'Checking…' : 'Check for updates'} disabled={busy} onPress={check} />
    </Row>
  );
}
