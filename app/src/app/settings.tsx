import { Stack, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Switch } from 'react-native';

import { Btn, Card, Chip, Row, SavedInput, Screen, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { scheduleSmartReminder } from '@/services/notifications';
import { wipeAll, wipeConversations } from '@/services/storage/db';
import { checkForUpdate, currentVersion, downloadAndInstall, type UpdateInfo } from '@/services/updates';
import { useTheme } from '@/hooks/use-theme';
import { plainNotes } from '@/services/updates/version';
import { exportBackup, lastBackupAt, pickBackup, restoreBackup } from '@/services/backup';
import { DEFAULT_UPDATE_REPO } from '@/services/storage/defaults';

export default function Settings() {
  const th = useTheme();
  const { profile, settings, updateProfile, updateSettings, reload } = useApp();
  const [upd, setUpd] = useState<UpdateInfo | null>(null);
  const [msg, setMsg] = useState('');
  const [progress, setProgress] = useState<number | null>(null);
  const [backupMsg, setBackupMsg] = useState('');
  const [lastBackup, setLastBackup] = useState<string | null>(null);

  React.useEffect(() => {
    lastBackupAt().then(setLastBackup);
  }, []);

  const doExport = async () => {
    setBackupMsg('Preparing…');
    try {
      const r = await exportBackup();
      setLastBackup(new Date().toISOString());
      setBackupMsg(`Backup ready (${r.cards} cards). Save it somewhere safe (Drive, e-mail to yourself…).`);
    } catch (e) {
      setBackupMsg(String(e instanceof Error ? e.message : e));
    }
  };

  const doImport = async () => {
    try {
      const picked = await pickBackup();
      if (!picked) return;
      const { summary } = picked;
      Alert.alert(
        'Restore this backup?',
        `${summary.cards} cards · ${summary.mistakes} mistakes · ${summary.minutes} min of practice\nSaved ${summary.exportedAt.slice(0, 10)}\n\nThis REPLACES all the data currently on this phone.`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Restore',
            style: 'destructive',
            onPress: async () => {
              try {
                await restoreBackup(picked.file);
                await reload();
                setBackupMsg('Backup restored.');
              } catch (e) {
                setBackupMsg(`Restore failed: ${e instanceof Error ? e.message : e}`);
              }
            },
          },
        ],
      );
    } catch (e) {
      setBackupMsg(String(e instanceof Error ? e.message : e));
    }
  };

  const check = async () => {
    setMsg('Checking…');
    setUpd(null);
    try {
      const u = await checkForUpdate(settings.updateRepo.trim() || DEFAULT_UPDATE_REPO);
      setUpd(u);
      setMsg(u.available ? 'A new version is available.' : 'You are up to date.');
    } catch (e) {
      setMsg(String(e instanceof Error ? e.message : e));
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Settings' }} />

      <Card>
        <T v="h2">{`Version ${currentVersion()}`}</T>
        <T v="small" dim>GitHub repository hosting the APK releases (owner/repo):</T>
        <SavedInput value={settings.updateRepo} onSave={(v) => updateSettings({ updateRepo: v })} placeholder="owner/my-english-coach" autoCapitalize="none" />
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ flex: 1 }}>Check automatically once a day</T>
          <Switch value={settings.autoCheckUpdates} onValueChange={(v) => updateSettings({ autoCheckUpdates: v })} />
        </Row>
        <Btn kind="ghost" label="Check for updates" onPress={check} />
        {!!msg && <T>{msg}</T>}
        {upd?.available && (
          <>
            <T v="small">{`${upd.current} → ${upd.latest}`}</T>
            {!!upd.notes && <T v="small" dim>{plainNotes(upd.notes, 600)}</T>}
            {upd.apkUrl ? (
              <Btn
                label={progress !== null ? `Downloading ${Math.round(progress * 100)}%` : 'Download & install'}
                disabled={progress !== null}
                onPress={async () => {
                  try {
                    setProgress(0);
                    await downloadAndInstall(upd.apkUrl!, setProgress);
                  } catch (e) {
                    setMsg(String(e instanceof Error ? e.message : e));
                  }
                  setProgress(null);
                }}
              />
            ) : (
              <Btn kind="ghost" label="Open release page" onPress={() => Linking.openURL(upd.pageUrl)} />
            )}
            <T v="small" dim>Android te demandera de confirmer l’installation (et d’autoriser « sources inconnues » pour cette app la 1re fois).</T>
          </>
        )}
      </Card>

      <Card>
        <T v="h2">AI conversation partner</T>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ flex: 1 }}>Use an LLM (otherwise: offline scripted mode)</T>
          <Switch value={settings.llmEnabled} onValueChange={(v) => updateSettings({ llmEnabled: v })} />
        </Row>
        <Btn small kind="ghost" label="Setup guide + test connection" onPress={() => router.push('/ai-setup')} />
        <T v="small" dim>Endpoint compatible OpenAI : Ollama (http://IP-du-PC:11434/v1), LM Studio, llama.cpp server, ou une API cloud. Ton texte (pas l’audio) est envoyé à cette adresse.</T>
        <SavedInput value={settings.llmBaseUrl} onSave={(v) => updateSettings({ llmBaseUrl: v })} placeholder="Base URL" autoCapitalize="none" />
        <SavedInput value={settings.llmModel} onSave={(v) => updateSettings({ llmModel: v })} placeholder="Model name" autoCapitalize="none" />
        <SavedInput value={settings.llmApiKey} onSave={(v) => updateSettings({ llmApiKey: v })} placeholder="API key (optional)" autoCapitalize="none" secureTextEntry />
      </Card>

      <Card>
        <T v="h2">Learning</T>
        <T v="small" dim>Minutes per day</T>
        <Row>
          {[5, 10, 15, 20, 30, 45, 60].map((m) => (
            <Chip key={m} label={`${m}`} active={profile.minutesPerDay === m} onPress={() => updateProfile({ minutesPerDay: m })} />
          ))}
        </Row>
        <T v="small" dim>French support</T>
        <Row>
          {[100, 75, 50, 25, 0].map((p) => (
            <Chip key={p} label={`${p}%`} active={profile.frenchSupport === p} onPress={() => updateProfile({ frenchSupport: p })} />
          ))}
        </Row>
        <T v="small" dim>English variant</T>
        <Row>
          {(['intl', 'us', 'uk'] as const).map((v) => (
            <Chip key={v} label={v === 'intl' ? 'International' : v.toUpperCase()} active={profile.variant === v} onPress={() => updateProfile({ variant: v })} />
          ))}
        </Row>
        <T v="small" dim>Professional domain</T>
        <SavedInput value={profile.domain} onSave={(v) => updateProfile({ domain: v })} />
        <Btn small kind="ghost" label="Retake the level test (A1 → C2)" onPress={() => router.push('/placement')} />
      </Card>

      <Card>
        <T v="h2">Accessibility & audio</T>
        <T v="small" dim>Text size</T>
        <Row>
          {[0.9, 1, 1.15, 1.3].map((f) => (
            <Chip key={f} label={`${Math.round(f * 100)}%`} active={settings.fontScale === f} onPress={() => updateSettings({ fontScale: f })} />
          ))}
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <T>High contrast</T>
          <Switch value={settings.highContrast} onValueChange={(v) => updateSettings({ highContrast: v })} />
        </Row>
        <T v="small" dim>Voice speed</T>
        <Row>
          {[0.6, 0.75, 0.9, 1.1].map((r) => (
            <Chip key={r} label={`${r}×`} active={settings.ttsRate === r} onPress={() => updateSettings({ ttsRate: r })} />
          ))}
        </Row>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ flex: 1 }}>Smart reminders (evening, based on your data)</T>
          <Switch
            value={settings.notifications}
            onValueChange={async (v) => {
              await updateSettings({ notifications: v });
              await scheduleSmartReminder(v);
            }}
          />
        </Row>
      </Card>

      <Card>
        <T v="h2">Backup</T>
        <T v="small" dim>Tout est stocké sur ce téléphone. Exporte un fichier JSON (progression, mots, erreurs, favoris, historique) pour changer de téléphone ou te protéger d’une désinstallation. Ta clé d’API n’est jamais incluse.</T>
        <T v="small">{`Last backup: ${lastBackup ? lastBackup.slice(0, 10) : 'never'}`}</T>
        <Btn kind="ghost" label="Export backup (JSON)" onPress={doExport} />
        <Btn kind="ghost" label="Restore from a backup file" onPress={doImport} />
        {!!backupMsg && <T v="small">{backupMsg}</T>}
      </Card>

      <Card>
        <T v="h2">Privacy</T>
        <T v="small" dim>Tout est stocké localement sur ce téléphone (SQLite). Aucun compte. L’audio n’est jamais enregistré ni envoyé par l’app : la reconnaissance vocale est celle d’Android (selon ton téléphone, elle peut passer par le service de Google ; installe le pack vocal anglais hors-ligne pour rester local). Seul le texte est envoyé à ton LLM, si tu l’actives.</T>
        <Btn kind="ghost" label="Delete conversation history" onPress={async () => { await wipeConversations(); Alert.alert('Done', 'Conversation history deleted.'); }} />
        <Btn
          kind="danger"
          label="Delete ALL my data"
          onPress={() =>
            Alert.alert('Delete everything?', 'Progress, mistakes, vocabulary memory and settings will be erased.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: async () => { await wipeAll(); await reload(); } },
            ])
          }
        />
      </Card>
      <T v="small" color={th.textSecondary}>Level estimates are self-assessment tools, not official certification.</T>
    </Screen>
  );
}
