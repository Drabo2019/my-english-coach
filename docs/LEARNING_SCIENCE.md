# Learning science → product decisions

The problem to solve: *"I recognise the word, but I can't produce it when I speak."* Everything below targets the path **understand → remember → build sentences → speak → get feedback → speak again**.

| Principle | Evidence base (well established) | How the app applies it |
|---|---|---|
| **Active recall** (retrieval practice) beats re-reading | Testing effect (Roediger & Karpicke) | Review cards show French and ask you to *produce* English (type or say). "Show answer" comes after an attempt. |
| **Spaced repetition** | Spacing effect; SM-2/Leitner family | `features/srs.ts`: SM-2 variant; slow answers (>8 s) count as "hard"; lapses return in 10 min. |
| **Production vs recognition** | Productive vs receptive vocabulary gap | State machine NEW → LEARNING → FAMILIAR → ACTIVE → MASTERED (+ NEEDS_REVIEW). **ACTIVE/MASTERED require production**; recognition alone caps at FAMILIAR. |
| **Learn in chunks, not isolated words** | Lexical approach; collocations/formulaic sequences speed fluency | Sentences are a first-class item type; vocab pages show collocations and examples; small-talk blocks. |
| **Comprehensible input + i+1** | Krashen (influential, debated) | Listening/reading at near-level (selection by profile), slow/normal/fast playback. |
| **Output hypothesis / pushed output** | Swain | Conversation, Find the words, Speak without fear. Time spoken is the headline metric. |
| **Corrective feedback: recasts and delayed correction** | SLA research on feedback timing | Default mode corrects *after* the conversation; Strict mode corrects immediately by choice. |
| **Low affective filter** | Anxiety lowers performance (Krashen/MacIntyre) | "Communication first, perfection later"; errors are data, never red failure screens; no streak guilt. |
| **Fluency needs automatisation** | Skill acquisition theory (DeKeyser) | Timed short answers, repetition of the same frames in different contexts, Sentence engine (order / gap / FR→EN / speak). |
| **Interleaving and variety** | Interleaved practice | Daily plan mixes 2–5 activities, weighted by weakness. |
| **Error-driven personalisation** | Learner corpora show L1-specific errors (French: *I am agree*, *since 3 years*, *informations*) | `features/corrector.ts` rules; recurring mistakes get a drill screen and feed the plan and notifications. |
| **Honest progress** | Self-efficacy depends on accurate feedback | Levels are labelled estimates; Progress shows measured minutes/words only. No fluency promises. |

## Level model

Seven skills (vocabulary, grammar, listening, reading, writing, speaking, pronunciation), each a fractional index on CEFR Pre-A1…C2 (0…6). Overall = mean. Not an official certificate. Sources of evidence: placement test, weekly check (small steps), exercise scores.

## What we do NOT claim

- No claim about time-to-fluency. 
- Offline corrector is deliberately conservative (few false positives); it does not detect style/naturalness.
- Pronunciation score = intelligibility proxy via recognition, not phoneme accuracy.

## To validate with real use

Session length vs retention; whether "Speak without fear" levels are ordered right for you; whether the weekly check moves the level plausibly. Use the in-app Feedback to record this, then update the plan weights in `features/plan.ts`.
