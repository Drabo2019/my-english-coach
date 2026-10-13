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
        Le partenaire de conversation fonctionne hors-ligne (scripté). Pour une vraie conversation libre et des corrections fines, branche-le sur un modèle qui tourne sur ton PC
        (gratuit, tes textes restent chez toi).
      </T>

      <Card>
        <T v="h2">1 · Installer Ollama sur le PC</T>
        <T>Télécharge Ollama (ollama.com), installe-le, puis dans un terminal :</T>
        <T style={{ fontFamily: 'monospace' }}>ollama pull llama3.2</T>
        <T v="small" dim>Modèle léger (≈ 2 Go), correct en anglais. Pour de meilleures corrections si ton PC a 16 Go de RAM : qwen2.5:7b.</T>
      </Card>

      <Card>
        <T v="h2">2 · Autoriser le téléphone à se connecter</T>
        <T>Par défaut Ollama n’écoute que sur le PC. Définis la variable d’environnement puis redémarre Ollama :</T>
        <T style={{ fontFamily: 'monospace' }}>OLLAMA_HOST=0.0.0.0</T>
        <T v="small" dim>Windows : Paramètres → Variables d’environnement. Autorise aussi le port 11434 dans le pare-feu (réseau privé).</T>
      </Card>

      <Card>
        <T v="h2">3 · Adresse du PC</T>
        <T>Le téléphone et le PC doivent être sur le même Wi-Fi. Trouve l’adresse IP du PC (commande ipconfig) puis saisis :</T>
        <SavedInput value={settings.llmBaseUrl} onSave={(v) => updateSettings({ llmBaseUrl: v.trim() })} autoCapitalize="none" placeholder="http://192.168.1.20:11434/v1" />
        <T v="small" dim>Format : http://IP-DU-PC:11434/v1</T>
        <T v="small">Modèle</T>
        <SavedInput value={settings.llmModel} onSave={(v) => updateSettings({ llmModel: v.trim() })} autoCapitalize="none" placeholder="llama3.2" />
      </Card>

      <Card>
        <T v="h2">4 · Tester</T>
        <Btn label={busy ? 'Testing…' : 'Test connection'} disabled={busy} onPress={test} />
        {result?.ok && (
          <>
            <T color={th.good}>{`✅ Connected. ${result.models.length} model(s) available.`}</T>
            <Row>
              {result.models.slice(0, 8).map((m) => (
                <Chip key={m} label={m} active={m === settings.llmModel} onPress={() => updateSettings({ llmModel: m })} />
              ))}
            </Row>
            {!modelOk && <T color={th.warn}>{`Le modèle « ${settings.llmModel} » n’est pas dans la liste : touche un modèle ci-dessus.`}</T>}
          </>
        )}
        {result && !result.ok && (
          <>
            <T color={th.bad}>{`❌ ${result.error}`}</T>
            <T v="small" dim>
              Vérifie : Ollama lancé ; OLLAMA_HOST=0.0.0.0 ; même Wi-Fi ; pare-feu ; IP correcte (pas « localhost » : ce serait le téléphone lui-même).
            </T>
          </>
        )}
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <T style={{ flex: 1 }}>Utiliser ce partenaire IA dans les conversations</T>
          <Switch value={settings.llmEnabled} onValueChange={(v) => updateSettings({ llmEnabled: v })} />
        </Row>
        <T v="small" dim>Si le PC est éteint ou injoignable, l’app retombe automatiquement sur le mode hors-ligne.</T>
      </Card>
    </Screen>
  );
}
