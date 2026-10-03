# Technology decisions

Date: 2026-10-03. Rule applied: **free > open source > simple > maintainable (one developer) > offline > private > evolvable**. No paid API is ever required.

## Stack (chosen)

| Concern | Choice | Why | Rejected / deferred |
|---|---|---|---|
| App framework | **Expo SDK 57 (React Native 0.86, New Architecture) + TypeScript**, Expo Router | One codebase for Android / iOS / Web. Native modules work through `expo prebuild` (Continuous Native Generation), so voice libraries are not blocked. Router gives typed, file-based navigation. | *RN CLI*: more control, but you hand-maintain `android/` and `ios/`. Nothing in this app needs that today. *Flutter*: would restart the web/iOS story and lose the JS ecosystem (whisper.rn, llama.rn, sherpa-onnx bindings). |
| Build | **Local Gradle build** (`app/build-apk.sh`), JDK 17 (Android Studio JBR), signed with your own keystore | Free, no cloud queue, reproducible in GitHub Actions. | *EAS Build*: convenient but the free tier is queue-limited; adds an account. Kept as an **optional** path, not a dependency. *EAS Update (OTA JS)*: needs EAS (paid at scale). Not needed: GitHub Releases + in-app updater covers APK distribution. |
| Local DB | **expo-sqlite** with versioned SQL migrations (`PRAGMA user_version`) | First-party, offline, zero native setup, same API on web (wa-sqlite). Our queries are simple (SRS due dates, aggregates). | *WatermelonDB / Realm*: more power (sync, reactivity), more moving parts and native config. Revisit at Phase 7 (cloud sync). |
| Speech-to-text (v0.1) | **Android `SpeechRecognizer`** via `expo-speech-recognition` | Zero model download, low battery, streaming partials, works with the phone's English pack. On-device mode depends on device + installed language pack. | See AI_RESEARCH.md for whisper.rn / sherpa-onnx upgrade path. |
| Text-to-speech (v0.1) | **Android TextToSpeech** via `expo-speech` | Offline voices are free, instant, US/UK accent selectable. Voice quality varies by phone. | Kokoro-82M via sherpa-onnx (Apache-2.0) is the quality upgrade. Piper is **GPL-3.0** since Oct 2025: avoid linking it. |
| Conversation AI | **Provider abstraction**: (1) offline scripted + rule-based corrector (always works), (2) any **OpenAI-compatible endpoint** you configure (Ollama / LM Studio / llama.cpp server on your PC or LAN, or a cloud API if you ever choose) | Free path today (Ollama on your PC), no cloud lock-in, no key required. App falls back to offline automatically. | On-device LLM (`llama.rn`): feasible (Qwen2.5-1.5B Q4 ≈ 1 GB) but heavy on RAM/battery; planned Phase 2/3 after real usage data. |
| Pronunciation | Transcript-vs-target comparison (word-level) | Honest, cheap, works offline. | Phoneme-level scoring (needs a forced-alignment / GOP model): Phase 3. The UI states this limit. |
| Updates | **GitHub Releases + in-app checker + Android package installer** | Free, simple, secure (Android asks the user; same-key signature enforced). | Self-hosted update server: unnecessary. |
| CI | **GitHub Actions** (typecheck, lint, unit tests, APK build, Release on tag) | Free for public repos; private has monthly minutes. | |
| Tests | **Vitest** for pure logic (SRS, corrector, plan, placement, data integrity) | Fast, no device needed. | Detox / Maestro for device UI tests: Phase 2. |

## Environment found (Step 1)

Node 22.22, npm 10.9, Git 2.45, JDK 24 (system) + **JDK 17 (Android Studio JBR, used for builds)**, Android SDK (platforms 34/36, build-tools 34–36, NDK 27, CMake 3.22), AVDs Pixel 3a/5/6 API 34, Python 3.7. Gradle 9.3.1 via the wrapper. First cold build: ~24 min; later builds are incremental.

## Architecture constraints that drove the decisions

1. Voice libs need native code → rules out Expo Go; needs a dev/release build. Accepted.
2. Everything else must keep working offline → data is bundled in the app; DB is local; AI is optional.
3. Single developer → no backend, no microservices, no mandatory account.

## Known risks

- Android speech recognition quality/offline availability varies by phone. Mitigation: provider interface; swap to whisper.rn later.
- Bundled content is small (see CONTENT_GUIDELINES.md for targets and the pipeline for adding more).
- `expo-speech-recognition` ties to the Google/OEM recogniser, which may use the network unless the offline English pack is installed. Documented in PRIVACY.md.
