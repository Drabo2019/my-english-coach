import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { Linking, Switch } from 'react-native';

import { Btn, Card, Chip, Row, SavedInput, Screen, T } from '@/components/ui';
import { useApp } from '@/features/app-context';
import { ensureWorkingModel, testLlmConnection } from '@/services/ai';
import { useTheme } from '@/hooks/use-theme';

const CLOUD = [
  {
    id: 'groq',
    name: 'Groq',
    baseUrl: 'https://api.groq.com/openai/v1',
    model: 'llama-3.1-8b-instant',
    keysUrl: 'https://console.groq.com/keys',
  },
  {
    id: 'gemini',
    name: 'Google Gemini',
    baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
    model: 'gemini-2.5-flash',
    keysUrl: 'https://aistudio.google.com/apikey',
  },
] as const;

export default function AiSetup() {
  const th = useTheme();
  const { settings, updateSettings } = useApp();
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState('');
  const [result, setResult] = useState<{ ok: boolean; models: string[]; error?: string } | null>(null);

  const test = async () => {
    setBusy(true);
    setResult(null);
    const r = await testLlmConnection(settings);
    setResult(r);
    setNote('');
    if (r.ok) {
      // End-to-end: a real one-word chat. Providers rename and retire models (and may still list a retired one).
      const w = await ensureWorkingModel(settings, r.models);
      if (!w.ok) setResult({ ok: false, models: r.models, error: w.error ?? 'The model did not answer.' });
      else if (w.changed) {
        await updateSettings({ llmModel: w.model });
        setNote(`The model “${settings.llmModel}” is not available any more. Switched to “${w.model}”, which answers.`);
      }
    }
    setBusy(false);
  };

  const modelOk = result?.ok && result.models.some((m) => m.replace(/^models\//, '') === settings.llmModel || m.startsWith(`${settings.llmModel}:`));

  return (
    <Screen>
      <Stack.Screen options={{ title: 'AI partner setup' }} />
      <T dim>
        The conversation partner works offline (scripted). For real free conversation and finer corrections, connect it to a model running on your PC
        (free, and your texts stay at home).
      </T>

      <Card>
        <T v="h2">Option A · A free cloud AI (no PC needed)</T>
        <T>
          Create a free account with one of these services, copy your API key, paste it below, then run the test. Only the text of your conversation is
          sent to the service you pick, never your audio.
        </T>
        {CLOUD.map((c) => (
          <Row key={c.id}>
            <Btn
              small
              label={`Use ${c.name}`}
              onPress={() => updateSettings({ llmBaseUrl: c.baseUrl, llmModel: c.model, llmEnabled: true })}
            />
            <Btn small kind="ghost" label={`Get a ${c.name} key`} onPress={() => Linking.openURL(c.keysUrl)} />
          </Row>
        ))}
        <T v="small" dim>
          Free plans, limits and model names are decided by each provider and can change. If the test fails, pick a model from the list it shows.
        </T>
        <T v="small" dim>{`Currently set: ${settings.llmBaseUrl}  ·  model ${settings.llmModel}${settings.llmEnabled ? '' : '  ·  AI is off'}`}</T>
        <T v="small">API key (cloud services only)</T>
        <SavedInput
          value={settings.llmApiKey}
          onSave={(v) => updateSettings({ llmApiKey: v.trim() })}
          autoCapitalize="none"
          secureTextEntry
          placeholder="Paste your API key"
        />
      </Card>

      <Card>
        <T v="h2">Option B · Your own PC. Step 1: install Ollama</T>
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
                <Chip key={m} label={m} active={m.replace(/^models\//, '') === settings.llmModel} onPress={() => updateSettings({ llmModel: m.replace(/^models\//, '') })} />
              ))}
            </Row>
            {!!note && <T color={th.good}>{note}</T>}
            {!modelOk && !note && <T color={th.warn}>{`The model “${settings.llmModel}” is not in the list: tap one of the models above.`}</T>}
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
