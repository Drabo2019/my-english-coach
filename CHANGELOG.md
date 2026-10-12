# Changelog

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
