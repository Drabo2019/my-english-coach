# Architecture

```
app/                      Expo project (the only deployable)
  src/
    app/                  Expo Router screens (file = route)
      (tabs)/             Home · Learn · Speak · Review · Progress
      learn/ speak/       feature screens
      onboarding, placement, how-to-say, search, mistakes, saved, resources, settings, feedback, weekly, five
    components/ui.tsx     tiny UI kit (T, Card, Btn, Chip, Speak…) with theming / font scale
    features/             pure logic + app state
      srs.ts              spaced repetition (SM-2 variant, 6 states)
      plan.ts             "Today's English" generator (weakness-weighted)
      placement.ts        level test + level estimation
      corrector.ts        offline rule-based error detector (French-speaker errors)
      items.ts            card ↔ content mapping, new-card picker, similarity
      app-context.tsx     profile + settings provider
      ConversationView.tsx
    services/
      speech/             STTProvider · TTSProvider · PronunciationProvider  (+ Android implementations)
      ai/                 ConversationAIProvider (offline scripted | OpenAI-compatible) + router with fallback
      storage/            db.ts (SQLite + migrations), repo.ts (queries), defaults.ts
      updates/            GitHub Releases checker + APK download/install, version.ts
      notifications.ts    smart evening reminder from real data
    data/                 bundled content (vocabulary, sentences, grammar, scenarios, reading, listening, phrasebook…)
    types/ constants/ hooks/
  plugins/withReleaseSigning.js   config plugin: signs with your keystore
  tests/                  Vitest (pure logic + data integrity)
docs/                     this folder
.github/workflows/        CI + release
```

## Principles

1. **Providers, not vendors.** Screens import `tts`, `stt`, `pronunciation` from `services/speech` and `getAI()` from `services/ai`. Swapping Android STT for whisper.rn / sherpa-onnx changes one file. `getAI()` returns the LLM provider when enabled and **falls back to offline** per call, so a dead server never blocks learning.
2. **Pure core, thin UI.** SRS, plan, placement, corrector and version comparison have no React or native imports → unit-tested on the dev machine.
3. **Offline by default.** Content is bundled TypeScript data (versioned with the app). User data is SQLite. Network is used only for: optional LLM, update check, "Learn More" links.
4. **Migrations from day one.** `db.ts` holds an ordered `MIGRATIONS[]`; the DB version is `PRAGMA user_version`. New schema = append a migration, never edit an old one. Content ids are stable strings (`vocab:modern-get`, `sent:s0012`); renaming an id orphans SRS history, so retire instead of rename.
5. **No account in MVP.** Sync (Phase 7) will add a `sync` service and an outbox table without changing screens.

## Data model (SQLite)

`kv` (profile, settings, misc) · `srs` (one row per card: state, ease, interval, due, reps, lapses, avg_ms) · `mistakes` (category, original, correction, frequency, severity) · `activity` (seconds per skill per day → streak, minutes, speaking time) · `convo` (turns; deletable) · `feedback` (real-user-test notes) · `saved` (My English) · `scores` (placement/weekly/exercise score history).

## Key flows

- **Onboarding → placement → profile**: goals/time/domain → 18 MCQ + 3 spoken repeats → fractional CEFR per skill + weaknesses.
- **Today's plan**: `buildPlan(profile, due, difficult, topMistake, minutesDone)` → 1–5 blocks whose minutes add up to the remaining daily goal; speaking always favoured.
- **Conversation**: user turn (STT or typed) → `ai.reply()` → TTS. On Finish: `ai.review()` → rule-based + (optional) LLM findings → stored in `mistakes` → shown ❌/✅ with reason and a natural version.
- **Review**: due cards + ≤5 new; grade (again/hard/good/easy) is suggested from how close your typed/spoken answer was; production flag drives ACTIVE/MASTERED.
- **Update**: Settings → GitHub latest release → compare semver → download APK → Android installer (user confirms).

## Porting to iOS / Web

- iOS: same code; needs a Mac or EAS Build for the binary (Apple requires it). Replace nothing: `expo-speech`, `expo-speech-recognition`, `expo-sqlite`, `expo-notifications` all support iOS. Only the *APK updater* is Android-only (guarded by `Platform.OS`).
- Web: `expo export --platform web`. STT uses Web Speech API (Chrome); `expo-sqlite` runs on wa-sqlite (check bundling before shipping). Updater hidden.
