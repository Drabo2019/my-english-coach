# Roadmap

Rule: always keep a **usable build**. Each phase ends with BUILD → TEST → RUN → FIX. After 0.1.0, run the *real user test* phase before adding features.

| Phase | Goal | Status |
|---|---|---|
| **0** Research + architecture | Docs, stack decision, toolchain proven | ✔ done 2026-10-03 |
| **1** Android MVP | Onboarding, placement, profile, dashboard, vocabulary, sentences, grammar, listening, reading, writing, speaking, scenarios, pronunciation, conversation (offline + LLM), SRS, mistakes, settings, local data, updater, CI | **0.1.0 built** (content volume below targets) |
| **1.5** Real user test (next) | You use it daily for 1–2 weeks; log feedback in-app (Too easy / Too hard / Wrong correction…). Fix bugs; tune plan weights; grow content where you got stuck | next |
| **2** AI conversation | Streaming replies ✔, Ollama setup guide + connection test ✔, conversation memory ✔ (0.3.0). Still open: on-device LLM trial (`llama.rn`), better LLM correction prompts, "emergency help" overlay | in progress |
| **3** Pronunciation + voice | sherpa-onnx: Whisper/Zipformer STT + Kokoro TTS; evaluate phoneme scoring; waveform/compare view. **Gated** on real-user feedback that Android STT/TTS is the bottleneck (see AI_RESEARCH spike) | |
| **4** Advanced personalisation | Dynamic profile (confidence, hesitation time), auto-generated drills from mistakes (LLM + validation), weekly/monthly assessments with trends, French-support auto-decrease | |
| **5** iOS | EAS Build or Mac build; TestFlight; audio-session tuning | |
| **6** Web | Static export, Web Speech API, PWA offline | |
| **7** Cloud sync | Optional account (self-hostable, e.g. Supabase/PocketBase), encrypted backup, multi-device | |

## Backlog (unordered)

- Content: MVP volume targets met (0.2.x). Next growth is feedback-driven (see in-app Feedback counts).
- Hesitation measurement (time-to-first-word) in Find the words.
- Shadowing mode (repeat with audio at 0.8×).
- ~~Export/import progress as JSON~~ done in 0.3.0.
- Maestro UI tests; Android instrumentation smoke test in CI on an emulator.
- Dictionary/API integrations (licensed) for the built-in dictionary.
- Tablets / landscape; accessibility audit with TalkBack.

## Research cadence

Every ~3 months: re-run COMPETITOR_RESEARCH.md and AI_RESEARCH.md; record changes here.
