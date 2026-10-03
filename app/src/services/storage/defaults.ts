import type { CorrectionMode, Profile } from '@/types';

export const DEFAULT_PROFILE: Profile = {
  onboarded: false,
  goals: [],
  minutesPerDay: 15,
  frenchSupport: 100,
  variant: 'intl',
  domain: 'engineering / electronics',
  levels: { vocabulary: 2, grammar: 2, listening: 2, reading: 2, writing: 2, speaking: 1, pronunciation: 1 },
  confidence: 'low',
};

export interface Settings {
  correctionMode: CorrectionMode;
  llmEnabled: boolean;
  llmBaseUrl: string; // OpenAI-compatible, e.g. http://192.168.1.10:11434/v1 (Ollama)
  llmModel: string;
  llmApiKey: string;
  updateRepo: string; // "owner/repo" on GitHub
  fontScale: number;
  highContrast: boolean;
  ttsRate: number;
  notifications: boolean;
}

export const DEFAULT_SETTINGS: Settings = {
  correctionMode: 'friendly',
  llmEnabled: false,
  llmBaseUrl: 'http://10.0.2.2:11434/v1',
  llmModel: 'llama3.2',
  llmApiKey: '',
  updateRepo: '',
  fontScale: 1,
  highContrast: false,
  ttsRate: 0.9,
  notifications: true,
};
