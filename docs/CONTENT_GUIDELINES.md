# Content guidelines

Content = TypeScript data in `app/src/data/`. Everything is validated by `app/tests/logic.test.ts` (ids unique, answers point to options, no seed sentence trips the error detector).

## MVP targets vs current

| Area | Target | Now |
|---|---|---|
| Vocabulary | 300–500 words | **312** (19 categories) |
| Sentences | 500+ | **504** (34 situations) |
| Grammar topics | 20–30 | **25** |
| Scenarios | 20 | **21** (+ free talk; 4 levels each via modes) |
| Find-the-words tasks | – | 16 |
| Pronunciation drills | 20+ | **26** |
| Listening | 20+ | **20** |
| Reading | 20+ | **20** |
| Writing | 10+ | 10 prompts |

All MVP volume targets are met. Add content by feedback: the in-app "I want more sentences / I get stuck here" counts decide *where*.

## Item rules

**VocabularyItem** (`data/vocabulary.ts`, helper `v(...)`): id auto = `category-word`; IPA in slashes; `fr` = main translations separated by `/`; at least 1 example with French; level CEFR; `register` formal/neutral/informal/slang; add `collocations`, `mistakes` (French-speaker traps, false friends) and `usUk` whenever relevant. Polysemic words (get, miss, keep…) list `meanings`.

**Sentence** (`data/sentences.ts`, helper `s(...)`): natural, spoken-level English; one idea; `grammar` tag; `register`; optional `alt` (more natural/informal variant). Prefer sentences the learner will actually say (work, meetings, phone, problems, small talk). Avoid textbook-only phrasing.

**Grammar topic**: simple French explanation (≤ 4 sentences), 2–3 examples, **frequent mistakes** (wrong/right/why), ≥ 2 exercises, sentences to say aloud.

**Scenario**: 3–5 AI turns each with up to 3 progressive hints and keywords (used offline and by "What can I say next?").

## Quality rules (human and AI-generated content)

1. **Never trust generated content blindly.** Every AI-drafted item must be reviewed for: correct English, natural register, correct CEFR level, accurate French translation, non-duplication.
2. Run `npm test` (ids, structure, "does not flag correct sentences") and `npm run typecheck`.
3. Detect duplicates: lowercase + strip punctuation of the English text; no near-duplicates in the same situation.
4. Level check: the item should be understandable by a typical learner at that level using ≥ 90 % known vocabulary (use the Oxford 3000/5000 lists as a guide).
5. Metadata mandatory: level, register, situation/category; region (`us`/`uk`) when spelling or word choice differs.
6. Versioning: content ships with the app version. Changing an `id` loses SRS history; retire (delete) and add a new id instead of renaming.
7. Copyright: write original content or use openly licensed sources with attribution recorded here. Do **not** paste text from competitors, textbooks, or dictionaries.

## Style

French explanations are plain and short; English examples are real-world. Tone: encouraging, never punishing ("Not yet", not "Wrong"). Always say *why* an English form is correct.

## Adding bulk content later (Phase 2+)

Pipeline: draft with an LLM → script validates structure/duplicates/level → you review a sample → merge → release. Keep a `data/CHANGELOG` note for each batch.
