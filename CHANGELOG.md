# Changelog

## [0.5.3] - 2026-10-14
- Design (audit lot 2): the interface is now in English. Today screen simplified (one primary action, a single plan card, a discreet update line instead of a big card, the repeated "Recommended" block removed); Search, "How do I say…?" and Settings are icons in the header of every tab; tabs use vector icons and "Today" replaces "Home"; onboarding has a step indicator and a full-width Continue; the level test shows a progress bar and its difficulty now rises steadily from A1 to C2; Settings is reordered (Learning, Audio and accessibility, Your data, App) with the AI partner and update source under "Advanced". 5-Minute English and My English moved to the Learn tab.
- Design polish (audit lot 1): filter chips now respond instantly to touch; small buttons and chips have larger touch areas (48 px); release notes in the update card are shown as plain text instead of raw Markdown; error messages use the theme colour (dark mode, high contrast); the header buttons of the level test keep a margin from the screen edge; the "I don't know" answer is in English and as large as the others; skill names in Progress are capitalised; no more "0.0.0" version on web.
- Release workflow also publishes `my-english-coach.apk` (stable name) so a permanent direct-download link exists (`.../releases/latest/download/my-english-coach.apk`).

## [0.5.2] - 2026-10-13
- Home: a visible "Check for updates" button; when a newer version exists, a card with the release notes and an "Update now" button (download + Android installer) right on the home screen.

## [0.5.1] - 2026-10-13
- Feedback export now starts with the app version and the phone model, so test reports can be traced.

## [0.5.0] - 2026-10-13
- Advanced learners: the level test now reaches C2 (vocabulary, grammar, reading, listening, a C1 spoken repeat) and the estimate no longer under-rates strong learners. Retake it from Settings -> Learning.
- New C1/C2 content: 61 sentences (nuance, diplomacy, negotiation, inversion, mixed conditionals, subjunctive, cleft sentences, idioms), 45 words (incl. phrasal verbs and false friends), 6 grammar topics, 5 reading texts, 3 listenings, 5 Find-the-words situations. Shadowing now offers C1 and C2.
- Docs: tester guide (docs/GUIDE-TESTEURS.md, with HTML/PDF in docs/guides).

## [0.4.0] - 2026-10-13
- Find the words: measures the time before your first words (hesitation) and gives a short comment.
- New Speak → Shadowing: listen to a sentence, then repeat it at once; choose level (A1–B2) and speed (slow / normal / native); word-level score.

## [0.3.0] - 2026-10-12
- Backup: export your whole progress as a JSON file (Settings → Backup) and restore it on any install. The LLM API key is never included; restoring asks for confirmation and replaces local data atomically.
- Automatic update check: once a day at startup (silent, can be disabled), with a banner on Home. The GitHub repository is now preset, so Settings no longer needs to be filled in.
- AI partner: replies stream in as they are generated; a setup guide with a connection test (Settings → AI conversation partner → Setup guide) lists the models your Ollama exposes; the partner remembers recent conversations, your frequent mistakes and words you keep forgetting (deleted with “Delete conversation history”).
- Note: on-device voices (Whisper/Kokoro via sherpa-onnx) were evaluated and deliberately NOT integrated yet: see docs/AI_RESEARCH.md.

## [0.2.2] - 2026-10-12
- Content: sentences 434 → 504 (spoken fillers to gain time, French-speaker traps as correct models, bank/post/transport/housing, feelings). MVP content targets are now all met.

## [0.2.1] - 2026-10-12
- New app icon: white speech bubble with a voice waveform (one amber bar) on a blue→violet gradient. Adaptive, themed (monochrome) and splash variants. Source script: `app/assets/icon-src/make_icons.py`.

## [0.2.0] - 2026-10-03
- Content: vocabulary 136 → 312, sentences 114 → 434, grammar 19 → 25, scenarios 11 → 21, find-the-words 8 → 16, pronunciation 12 → 26, listening 6 → 20, reading 6 → 20.
- Fix: offline corrector wrongly flagged correct indirect questions ("show me where we are"). Word-order rule now applies to direct questions only.
- Existing sentence ids (s0001…) are frozen so your progress is kept; new sentences use t…/u… ids.

## [0.1.3] - 2026-10-03
- Fix: Settings text fields (GitHub repository, AI endpoint/model/key, professional domain) dropped characters while typing. They now keep your input locally and save after a short pause or when you leave the field.

## [0.1.2] - 2026-10-03
- Fix: bottom tab bar overlapped Android's navigation bar (now respects system insets); conversation input bar too.
- Fix: Android Back button closed the app from sub-views. Back now returns to the previous step (exercise list, review session, onboarding steps, Speak-without-fear steps).
- Added explicit controls: Back/Retour, Stop session (Review), Quit/Close (level check), Close (How do I say…).

## [0.1.1] - 2026-10-03
- Fix: on-screen keyboard hid the message bar in conversations (Android).
- Fix: SRS never gave MASTERED to cards that were only recognised, not produced.

## [0.1.0] - 2026-10-03
First usable Android build.

- Onboarding (goals, daily time, domain, variant) and a level check: vocabulary, grammar, reading, listening, 3 spoken repeats → per-skill CEFR estimate and priorities (not an official certification).
- Home: "Today's English" plan weighted by your weaknesses, "Talk to me", recommendations, 5-Minute English.
- Learn: sentences engine (order / gap / FR→EN / speak), vocabulary with meanings, collocations, IPA, US/UK, grammar topics with mistakes and exercises, listening (slow/normal/fast), reading with tap-to-define, writing with correction, real-world English.
- Speak: AI conversation (offline scripted partner + optional OpenAI-compatible LLM), 11 scenarios × 4 levels, Find the words with progressive hints, Speak without fear (10 levels), pronunciation minimal pairs, small talk.
- "How do I say…?" reachable from every tab, offline phrasebook + LLM.
- Review: spaced repetition with 6 states; ACTIVE/MASTERED require production.
- My English Mistakes: recurring errors detected offline and drilled; global search; favourites.
- Settings: version, update check (GitHub Releases), AI endpoint, French support, accessibility (text size, high contrast), privacy controls, smart reminders.
- Feedback screen for the real-user-test phase.

Known limitations: content volume below MVP targets; pronunciation scoring is word-level intelligibility only; offline conversation is scripted; STT quality/offline availability depends on the phone.
