# Privacy

Voice conversations are personal. Defaults are conservative.

## Where data lives

| Data | Where | Leaves the phone? |
|---|---|---|
| Profile, progress, vocabulary memory, mistakes, activity, feedback, saved items, conversation text | Local SQLite (`coach.db`) in the app's private storage | **No.** No account, no analytics, no telemetry. |
| Audio | **Never stored or sent by the app.** The app does not record to disk. | Android's speech recogniser processes it (see below). |
| Text to a language model | Only if *you* enable "AI conversation partner" and set an endpoint | Yes, to the URL you configured (e.g. your PC's Ollama). Only the text of the conversation (and the French phrase in "How do I say…"). |
| Update check | `api.github.com` (repository you set) | A normal HTTPS request; GitHub sees your IP. |
| "Learn More" | Opens external sites in the browser | Their own policies apply. |

## Speech recognition caveat (important)

The app uses Android's built-in `SpeechRecognizer`. Depending on the phone and whether the **offline English language pack** is installed (Android Settings → Google → Voice / Offline speech recognition), audio may be processed **on-device or by Google's servers**. The app cannot guarantee on-device processing. To keep it local: install the offline English pack, or switch to a local Whisper/sherpa-onnx provider when it ships (Phase 3).

## Your controls

Settings → *Delete conversation history* (turns only) and *Delete ALL my data* (everything). Smart reminders can be turned off. No data is kept after deletion.

## Providers used (v0.1.0)

| Provider | Purpose | Data sent |
|---|---|---|
| Android SpeechRecognizer (OS / Google) | Speech → text | Audio, possibly off-device (see above) |
| Android TextToSpeech (OS) | Text → speech | None off-device with offline voices |
| User-configured OpenAI-compatible endpoint (optional) | Conversation, corrections, translation | Conversation text |
| GitHub Releases API | Update check/download | Repo name, IP |

## Future

Cloud sync (Phase 7) will be opt-in, documented here first, and end-to-end encrypted if feasible.
