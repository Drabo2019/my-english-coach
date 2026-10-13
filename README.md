# My English Coach

Personal English coach for a French speaker: **understand → remember → build sentences → speak → get feedback → speak again.** Android first (APK), then iOS and Web from the same React Native codebase.

- Offline-first: vocabulary, sentences, grammar, reading, listening (TTS), review, progress all work without network.
- Learns *you*: per-skill CEFR estimate, spaced repetition with production-based mastery, recurring-mistake tracking, weakness-weighted daily plan.
- Speaks with you: AI conversation partner (offline scripted, or your own LLM endpoint such as Ollama), post-conversation corrections, "How do I say…?" everywhere, progressive hints when you can't find words.
- Free: no subscription, no account, no paid API required.

## Install (Android)

1. Get the APK: [**download the latest APK**](https://github.com/Drabo2019/my-english-coach/releases/latest/download/my-english-coach.apk) (always the newest release; release notes on the [Releases page](https://github.com/Drabo2019/my-english-coach/releases/latest)), or build it locally into `dist/`.
2. Copy it to the phone and open it; allow "install from this source" once.
3. Open the app → allow the microphone → complete onboarding and the level check.

Optional AI partner on your PC (free): install Ollama, run `ollama pull llama3.2`, start it with `OLLAMA_HOST=0.0.0.0`, then in the app: Settings → AI conversation partner → enable, Base URL `http://<PC-LAN-IP>:11434/v1`, model `llama3.2`.

## Develop

```bash
cd app
npm install
npm run typecheck && npm test && npx expo lint
./build-apk.sh                     # release APK → dist/
npx expo run:android               # dev build on a connected device/emulator
```

Requirements: Node 22, JDK 17 (Android Studio's JBR works), Android SDK. See `docs/RELEASE.md`.

## Docs

| | |
|---|---|
| [TECHNOLOGY_DECISIONS](docs/TECHNOLOGY_DECISIONS.md) | stack and why |
| [AI_RESEARCH](docs/AI_RESEARCH.md) | STT / TTS / LLM comparison |
| [COMPETITOR_RESEARCH](docs/COMPETITOR_RESEARCH.md) | what others do, what we adapt |
| [LEARNING_SCIENCE](docs/LEARNING_SCIENCE.md) | pedagogy → features |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | code layout, providers, data |
| [ROADMAP](docs/ROADMAP.md) | phases and backlog |
| [PRIVACY](docs/PRIVACY.md) | where data goes |
| [RELEASE](docs/RELEASE.md) · [UPDATE_SYSTEM](docs/UPDATE_SYSTEM.md) | shipping and updating the APK |
| [CONTENT_GUIDELINES](docs/CONTENT_GUIDELINES.md) | how to add and validate content |

Level estimates in the app are self-assessment tools, not official certification.
