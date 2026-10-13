# AI / voice research

Status: Phase 0 (2026-10-03). Method: web search + reading the libraries' own type definitions. Facts marked **[unverified]** came from secondary pages or are from memory and must be re-checked before a purchase/licensing decision. Re-run this research before every major AI change.

Legend: ✔ yes · ✘ no · ~ partial · ? unknown

## Comparison

| Name | URL | License | Cost | Open source | Offline | Android | iOS | Web | CPU/RAM / model size | Quality / latency | FR | EN | STT | TTS | LLM |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Android SpeechRecognizer** (`expo-speech-recognition`) | github.com/jamsch/expo-speech-recognition | MIT (wrapper); engine = OS/Google | Free | wrapper ✔, engine ✘ | ~ (on-device on Android 13+ when the language pack is installed) | ✔ | ✔ | ✔ (Web Speech) | none to load | Good, streaming, low latency | ✔ | ✔ | ✔ | ✘ | ✘ |
| **Android TextToSpeech** (`expo-speech`) | docs.expo.dev | MIT (wrapper); engine = OS | Free | wrapper ✔ | ✔ (installed voices) | ✔ | ✔ | ✔ | none | Robotic to good depending on phone; instant | ✔ | ✔ | ✘ | ✔ | ✘ |
| **whisper.cpp / whisper.rn** | github.com/mybigday/whisper.rn | MIT (code and OpenAI Whisper weights) | Free | ✔ | ✔ | ✔ (CPU only, min SDK 23) | ✔ (Metal) | ✘ (use WASM variants) | tiny ≈ 75 MB, base ≈ 145 MB, small ≈ 475 MB, medium ≈ 1.5 GB (secondary source) | Good; best accuracy for accented speech; NOT streaming-native: segment-based, latency grows with model; battery cost | ✔ | ✔ | ✔ | ✘ | ✘ |
| **faster-whisper** | github.com/SYSTRAN/faster-whisper | MIT | Free | ✔ | ✔ (desktop/server) | ✘ (Python/CTranslate2) | ✘ | ✘ | server-class | Excellent; use for a PC-side STT endpoint | ✔ | ✔ | ✔ | ✘ | ✘ |
| **Vosk** | alphacephei.com/vosk | Apache-2.0 **[unverified]** | Free | ✔ | ✔ | ✔ | ✔ | ~ | small EN model ≈ tens of MB **[unverified]** | Lower accuracy than Whisper; true streaming, light | ✔ | ✔ | ✔ | ✘ | ✘ |
| **sherpa-onnx** (+ `react-native-sherpa-onnx`) | github.com/k2-fsa/sherpa-onnx | Apache-2.0 **[unverified]** | Free | ✔ | ✔ | ✔ | ✔ | ✔ (WASM) | depends on model; runs Whisper, Zipformer, Kokoro, VITS/Piper voices | One runtime for STT **and** TTS; streaming recognisers available | ✔ | ✔ | ✔ | ✔ | ✘ |
| **Kokoro-82M** | huggingface.co/hexgrad/Kokoro-82M | Apache-2.0 | Free | ✔ | ✔ | ✔ via sherpa-onnx | ✔ | ✔ | 82M params, ≈ real-time on a modern mobile CPU (claim in secondary sources) | Best open small TTS in 2026; multiple EN voices | ✘ weak | ✔ | ✘ | ✔ | ✘ |
| **Piper** | github.com/OHF-Voice/piper1-gpl | **GPL-3.0** (changed from MIT in Oct 2025; embeds eSpeak NG) | Free | ✔ | ✔ | ✔ | ✔ | ✔ | 15–100 MB per voice | Good, very fast | ✔ | ✔ | ✘ | ✔ | ✘ |
| **llama.cpp / llama.rn** | github.com/mybigday/llama.rn | MIT | Free | ✔ | ✔ | ✔ (API 24+, NEON) | ✔ | ✘ | Llama-3.2-1B Q4 ≈ 0.8 GB file / ≈ 1 GB RAM; Qwen2.5-1.5B Q4 ≈ 1 GB / 1.2 GB; Qwen2.5-0.5B Q8 ≈ 0.6 GB (secondary source) | 1–1.5B models hold a simple A2–B1 chat; weak at correction. Latency 3–10 tok/s on mid phones. Battery heavy | ~ | ✔ | ✘ | ✘ | ✔ |
| **Ollama / LM Studio / llama.cpp server** | ollama.com | MIT (Ollama) | Free (your PC) | ✔ | ✔ (LAN only) | ✔ as client over HTTP | ✔ | ✔ | PC: 8 GB RAM for 3–8B Q4 models; GPU optional | Much better conversation + corrections than on-phone models; requires your PC to be on and reachable | ✔ | ✔ | ✘ | ✘ | ✔ |
| **ONNX Runtime (Mobile)** | onnxruntime.ai | MIT | Free | ✔ | ✔ | ✔ | ✔ | ✔ | n/a (runtime) | Foundation under sherpa-onnx / Kokoro | – | – | – | – | – |
| **Web Speech API** | MDN | Browser | Free | ✘ | ✘ (Chrome sends audio to Google) | ~ (Chrome) | ~ | ✔ | none | Fine for Web phase | ✔ | ✔ | ✔ | ✔ | ✘ |

## Decisions

1. **v0.1 (shipped)**: Android STT + Android TTS (zero download, works now) + provider interface + offline scripted partner + optional OpenAI-compatible endpoint.
2. **Phase 2 (AI conversation)**: Documented recipe for Ollama on the PC (`OLLAMA_HOST=0.0.0.0`, model `llama3.2` or `qwen2.5:7b`). Add streaming replies. Evaluate `llama.rn` + Qwen2.5-1.5B for a fully on-phone mode.
3. **Phase 3 (voice)**: Integrate **sherpa-onnx** to get (a) Whisper/Zipformer STT with a *chosen* model independent of the phone, (b) **Kokoro** TTS for natural English voices. Add phoneme-level pronunciation scoring only if a permissive model is found (evaluate GOP-style scorers); until then keep word-level.
4. Avoid **Piper** in the app binary (GPL-3.0) unless the project is deliberately GPL; it is acceptable only as an external process or a PC-side server.

## Limits to be honest about

- A free Android recogniser will "auto-correct" mispronunciations into plausible words, which can hide errors. The pronunciation screen therefore labels results as *intelligibility*, not phoneme accuracy.
- Small on-device LLMs make grammar mistakes in their *own* corrections. Corrections from an LLM are shown together with the deterministic rule-based findings and are never auto-accepted into the SRS.
- Model sizes above are from secondary sources; confirm on the model card before shipping.

## Sources consulted

- whisper.rn docs summaries: mintlify.com/mybigday/whisper.rn
- Sherpa-ONNX RN bindings: github.com/XDcobra/react-native-sherpa-onnx
- Piper licence change report: reelmind.ai / OHF-Voice repository listing
- Local-LLM sizing: Hugging Face "LLM inference on edge" and library pages
- expo-speech-recognition README/types: github.com/jamsch/expo-speech-recognition and the installed package's `.d.ts`

## Spike: react-native-sherpa-onnx (2026-10-12)

Source: the library README (github.com/XDcobra/react-native-sherpa-onnx), read, not run.

| Item | Finding |
|---|---|
| What | RN TurboModule around sherpa-onnx 1.12.x. Offline + streaming STT (Zipformer, Paraformer, **Whisper**), TTS (VITS/**Piper voices**, Matcha, **Kokoro**), mic capture API. |
| Platforms | Android API 24+ and iOS 13+. |
| Model delivery | bundled assets, file paths, Play Asset Delivery, or runtime download via a download manager. Model type auto-detected. |
| License | SDK MIT; sherpa-onnx Apache-2.0; ONNX Runtime MIT; bundles FFmpeg (LGPL 2.1). Models have their own licences (check each card). |
| Maturity | ~40 stars, v0.3.0 with breaking changes from 0.2.x: young, single maintainer. |
| Cost to us | extra native libs in the APK (tens of MB per ABI) + a model download (Whisper tiny/base 75-145 MB; Kokoro roughly 100 MB class, to be confirmed on the model card). |

**Decision: not integrated blind.** It is feasible, but (1) quality can only be judged by listening/speaking on the phone, which cannot be verified from the build machine, (2) a young native dependency can crash at startup and would put the working app at risk, (3) the Android recogniser may already be good enough on your phone. Gate: integrate only if the real-user test shows the Android STT/TTS is the bottleneck. The `STTProvider` / `TTSProvider` interfaces mean it is a one-file swap plus a model downloader and a setting to choose the engine.

Suggested integration plan when the gate is passed: add the library behind a setting "Voice engine: Android | On-device (sherpa-onnx)", default Android; download models on demand over Wi-Fi with a progress UI; keep Android as automatic fallback; ship as an opt-in release first.
