import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Switch } from 'react-native';

import { Btn, Card, Chip, Row, SavedInput, Screen, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { testLlmConnection } from '@/services/ai';
import { useTheme } from '@/hooks/use-theme';

export default function AiSetup() {
  const th = useTheme();
  const { settings, updateSettings } = useApp();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; models: string[]; error?: string } | null>(null);

  const test = async () => {
    setBusy(true);
    setResult(null);
    setResult(await testLlmConnection(settings));
    setBusy(false);
  };

  const modelOk = result?.ok && result.models.some((m) => m === settings.llmModel || m.startsWith(`${settings.llmModel}:`));

  return (
    <Screen>
      <Stack.Screen options={{ title: 'AI partner setup' }} />
      <T dim>
        The conversation partner works offline (scripted). For real free conversation and finer corrections, connect it to a model running on your PC
        (free, and your texts stay at home).
      </T>

      <Card>
        <T v="h2">1 · Install Ollama on your PC</T>
        <T>Download Ollama (ollama.com), install it, then run this in a terminal:</T>
        <T style={{ fontFamily: 'monospace' }}>ollama pull llama3.2</T>
        <T v="small" dim>A light model (about 2 GB), good enough in English. For better corrections if your PC has 16 GB of RAM: qwen2.5:7b.</T>
      </Card>

      <Card>
        <T v="h2">2 · Let the phone connect</T>
        <T>By default Ollama only listens on the PC itself. Set this environment variable, then restart Ollama:</T>
        <T style={{ fontFamily: 'monospace' }}>OLLAMA_HOST=0.0.0.0</T>
        <T v="small" dim>Windows: Settings → Environment variables. Also allow port 11434 in the firewall (private network).</T>
      </Card>

      <Card>
        <T v="h2">3 · Your PC’s address</T>
        <T>The phone and the PC must be on the same Wi-Fi. Find the PC’s IP address (ipconfig command), then enter:</T>
        <SavedInput value={settings.llmBaseUrl} onSave={(v) => updateSettings({ llmBaseUrl: v.trim() })} autoCapitalize="none" placeholder="http://192.168.1.20:11434/v1" />
        <T v="small" dim>Format: http://PC-IP:11434/v1</T>
        <T v="small">Model</T>
        <SavedInput value={settings.llmModel} onSave={(v) => updateSettings({ llmModel: v.trim() })} autoCapitalize="none" placeholder="llama3.2" />
      </Card>

      <Card>
        <T v="h2">4 · Test</T>
        <Btn label={busy ? 'Testing…' : 'Test connection'} disabled={busy} onPress={test} />
        {result?.ok && (
          <>
            <T color={th.good}>{`✅ Connected. ${result.models.length} model(s) available.`}</T>
            <Row>
              {result.models.slice(0, 8).map((m) => (
                <Chip key={m} label={m} active={m === settings.llmModel} onPress={() => updateSettings({ llmModel: m })} />
              ))}
            </Row>
            {!modelOk && <T color={th.warn}>{`The model “${settings.llmModel}” is not in the list: tap one of the models above.`}</T>}
          </>
        )}
        {result && !result.ok && (
          <>
            <T color={th.bad}>{`❌ ${result.error}`}</T>
            <T v="small" dim>
              Check: Ollama is running; OLLAMA_HOST=0.0.0.0; same Wi-Fi; firewall; correct IP (not “localhost”: that would be the phone itself).
            </T>
          </>
        )}
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ flex: 1 }}>Use this AI partner in conversations</T>
          <Switch value={settings.llmEnabled} onValueChange={(v) => updateSettings({ llmEnabled: v })} />
        </Row>
        <T v="small" dim>If the PC is off or unreachable, the app falls back to offline mode automatically.</T>
      </Card>
    </Screen>
  );
}
