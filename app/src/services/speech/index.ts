import * as Speech from 'expo-speech';
import { ExpoSpeechRecognitionModule } from 'expo-speech-recognition';

// ---------- Provider contracts (the rest of the app depends only on these) ----------
export interface TTSProvider {
  speak(text: string, opts?: { rate?: number; lang?: 'en-US' | 'en-GB' }): Promise<void>;
  stop(): void;
}

export interface STTResult {
  transcript: string;
  confidence: number; // 0..1, -1 if unknown
}

export interface STTProvider {
  isAvailable(): Promise<boolean>;
  /** Listen until the user stops talking. Resolves with the final transcript ('' if nothing heard). */
  listen(opts?: { lang?: string; onPartial?: (t: string) => void; hints?: string[] }): Promise<STTResult>;
  stop(): void;
}

export interface WordResult {
  word: string;
  ok: boolean;
}
export interface PronunciationResult {
  score: number; // 0..100
  words: WordResult[];
  note: string;
}
export interface PronunciationProvider {
  assess(target: string, heard: STTResult): PronunciationResult;
}

// ---------- Android native TTS ----------
export const androidTTS: TTSProvider = {
  speak(text, opts) {
    return new Promise((resolve) => {
      Speech.stop();
      Speech.speak(text, {
        language: opts?.lang ?? 'en-US',
        rate: opts?.rate ?? 0.9,
        onDone: () => resolve(),
        onStopped: () => resolve(),
        onError: () => resolve(),
      });
    });
  },
  stop() {
    Speech.stop();
  },
};

// ---------- Android native STT (on-device when available) ----------
let active: { cancel: () => void } | null = null;

export const androidSTT: STTProvider = {
  async isAvailable() {
    try {
      return ExpoSpeechRecognitionModule.isRecognitionAvailable();
    } catch {
      return false;
    }
  },
  async listen(opts) {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) throw new Error('Microphone permission denied');

    return new Promise<STTResult>((resolve, reject) => {
      let best: STTResult = { transcript: '', confidence: -1 };
      const subs: { remove: () => void }[] = [];
      const done = () => {
        subs.forEach((s) => s.remove());
        active = null;
      };
      subs.push(
        ExpoSpeechRecognitionModule.addListener('result', (e) => {
          const r = e.results?.[0];
          if (!r) return;
          best = { transcript: r.transcript, confidence: r.confidence ?? -1 };
          opts?.onPartial?.(r.transcript);
        }),
        ExpoSpeechRecognitionModule.addListener('error', (e) => {
          done();
          if (e.error === 'no-speech' || e.error === 'aborted') resolve(best);
          else reject(new Error(`${e.error}: ${e.message}`));
        }),
        ExpoSpeechRecognitionModule.addListener('end', () => {
          done();
          resolve(best);
        }),
      );
      active = {
        cancel: () => {
          ExpoSpeechRecognitionModule.stop();
        },
      };
      ExpoSpeechRecognitionModule.start({
        lang: opts?.lang ?? 'en-US',
        interimResults: true,
        maxAlternatives: 1,
        contextualStrings: opts?.hints,
        continuous: false,
      });
    });
  },
  stop() {
    active?.cancel();
  },
};

// ---------- Pronunciation: transcript-vs-target comparison ----------
// HONEST LIMIT: a general recogniser is not a phoneme scorer. We flag words it did not hear as
// intended, which is a useful proxy for intelligibility. Phoneme-level scoring is a Phase-3 item.
const clean = (s: string) =>
  s.toLowerCase().replace(/[’']/g, "'").replace(/[^a-z0-9' ]/g, ' ').split(/\s+/).filter(Boolean);

export const transcriptPronunciation: PronunciationProvider = {
  assess(target, heard) {
    const t = clean(target);
    const h = new Set(clean(heard.transcript));
    const words = t.map((w) => ({ word: w, ok: h.has(w) }));
    const ratio = words.length ? words.filter((w) => w.ok).length / words.length : 0;
    let score = Math.round(ratio * 100);
    if (heard.confidence >= 0 && ratio > 0) score = Math.round(score * (0.7 + 0.3 * heard.confidence));
    const missed = words.filter((w) => !w.ok).map((w) => w.word);
    const note =
      heard.transcript === ''
        ? 'Nothing was heard. Check the microphone and try again.'
        : missed.length === 0
          ? 'Clear. Every word was recognised.'
          : `Not recognised as intended: ${missed.join(', ')}. Listen again, slow down on those words.`;
    return { score, words, note };
  },
};

// Active providers (swap here to change implementation, e.g. whisper.rn / sherpa-onnx later).
export const tts: TTSProvider = androidTTS;
export const stt: STTProvider = androidSTT;
export const pronunciation: PronunciationProvider = transcriptPronunciation;
