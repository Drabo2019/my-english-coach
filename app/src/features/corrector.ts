// Offline, rule-based detection of frequent French-speaker mistakes.
// Deliberately conservative: only flags patterns that are (almost) always wrong.

export interface Finding {
  category: string;
  original: string;
  correction: string;
  explanation: string;
  severity: 1 | 2 | 3;
}

const PAST: Record<string, string> = {
  go: 'went', see: 'saw', have: 'had', do: 'did', make: 'made', take: 'took', buy: 'bought',
  meet: 'met', eat: 'ate', come: 'came', say: 'said', get: 'got', give: 'gave', know: 'knew',
  think: 'thought', write: 'wrote', leave: 'left', find: 'found', tell: 'told', speak: 'spoke',
};

interface Rule {
  category: string;
  re: RegExp;
  fix: (m: RegExpMatchArray) => string;
  why: string;
  severity?: 1 | 2 | 3;
}

const RULES: Rule[] = [
  { category: 'be vs have', re: /\bI am agree\b/i, fix: () => 'I agree', why: '« agree » est un verbe : I agree.', severity: 3 },
  { category: 'be vs have', re: /\bI have (\d{1,3}) years?( old)?\b/i, fix: (m) => `I am ${m[1]} years old`, why: 'L’âge se dit avec « be » : I am 40 years old.', severity: 3 },
  { category: 'be vs have', re: /\bI have (hungry|cold|hot|thirsty|afraid|right|wrong)\b/i, fix: (m) => `I am ${m[1]}`, why: 'Sensations/états : be + adjectif.', severity: 3 },
  { category: 'past simple', re: /\b(yesterday|last (?:week|night|month|year)|ago)\b[^.?!]*?\b(I|we|they|he|she) (go|see|have|do|make|take|buy|meet|eat|come|say|get|give|know|think|write|leave|find|tell|speak)\b/i, fix: (m) => `${m[0].replace(new RegExp(`\\b${m[3]}\\b$`, 'i'), PAST[m[3].toLowerCase()])}`, why: 'Marqueur de passé (yesterday, last…, ago) → past simple (irrégulier).', severity: 3 },
  { category: 'past simple', re: /\bdid (\w+) (went|saw|had|made|took|bought|met|ate|came|said|got|gave|knew|thought|wrote|left|found|told|spoke)\b/i, fix: (m) => `did ${m[1]} ${Object.keys(PAST).find((k) => PAST[k] === m[2].toLowerCase()) ?? m[2]}`, why: 'Après « did » : verbe à la base.', severity: 2 },
  { category: 'third person -s', re: /\b(he|she|it) (have|do|go|work|like|want|need|live|know|think|say)\b(?! to)/i, fix: (m) => `${m[1]} ${m[2] === 'have' ? 'has' : m[2] === 'do' ? 'does' : m[2] === 'go' ? 'goes' : m[2] + 's'}`, why: 'À he/she/it, le présent prend -s.', severity: 2 },
  { category: 'does + base', re: /\b(does|doesn’t|doesn't) (he|she|it) (\w+s)\b/i, fix: (m) => `${m[1]} ${m[2]} ${m[3].replace(/s$/, '')}`, why: 'Après does, verbe à la base (sans -s).', severity: 2 },
  { category: 'uncountable', re: /\b(informations|advices|softwares|luggages|furnitures|news's)\b/i, fix: (m) => m[1].replace(/s$/, ''), why: 'Mot indénombrable : pas de pluriel.', severity: 2 },
  { category: 'articles', re: /\b(I am|I’m|I'm|she is|he is) (engineer|doctor|teacher|student|manager|technician|developer)\b/i, fix: (m) => `${m[1]} ${/^[aeiou]/i.test(m[2]) ? 'an' : 'a'} ${m[2]}`, why: 'Métier : article a/an obligatoire.', severity: 2 },
  { category: 'since/for', re: /\bsince (\d+|a|one|two|three|four|five|six|seven|eight|nine|ten) (years?|months?|weeks?|days?|hours?)\b/i, fix: (m) => `for ${m[1]} ${m[2]}`, why: 'Durée → for ; point de départ → since (since 2020).', severity: 2 },
  { category: 'modals', re: /\b(can|must|should|could|would|will) to (\w+)\b/i, fix: (m) => `${m[1]} ${m[2]}`, why: 'Pas de « to » après un modal.', severity: 2 },
  { category: 'modals', re: /\b(he|she|it) (cans|musts|shoulds)\b/i, fix: (m) => `${m[1]} ${m[2].replace(/s$/, '')}`, why: 'Les modaux ne prennent pas de -s.', severity: 2 },
  { category: 'comparatives', re: /\bmore (better|worse|bigger|cheaper|easier|faster)\b/i, fix: (m) => m[1], why: 'Comparatif court : pas de « more » en plus.', severity: 2 },
  { category: 'prepositions', re: /\bdepends? of\b/i, fix: () => 'depends on', why: 'depend ON.', severity: 2 },
  { category: 'prepositions', re: /\bwait (me|him|her|you|us|them)\b/i, fix: (m) => `wait for ${m[1]}`, why: 'wait FOR someone.', severity: 2 },
  { category: 'prepositions', re: /\bexplain me\b/i, fix: () => 'explain to me', why: 'explain something TO someone.', severity: 2 },
  { category: 'prepositions', re: /\bsay me\b/i, fix: () => 'tell me', why: 'tell someone / say something.', severity: 2 },
  { category: 'prepositions', re: /\bin (monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i, fix: (m) => `on ${m[1]}`, why: 'Jours : on.', severity: 1 },
  { category: 'gerund', re: /\blook(?:ing)? forward to (see|meet|hear|work|talk)\b/i, fix: (m) => `looking forward to ${m[1]}ing`, why: 'look forward to + -ing.', severity: 2 },
  { category: 'collocations', re: /\bdo (a|the|some) (mistakes?)\b/i, fix: (m) => `make ${m[1]} ${m[2]}`, why: 'On « make a mistake ».', severity: 2 },
  { category: 'structure', re: /\bI want that (you|he|she|they|we) (\w+)\b/i, fix: (m) => `I want ${m[1] === 'you' ? 'you' : m[1] === 'he' ? 'him' : m[1] === 'she' ? 'her' : m[1] === 'they' ? 'them' : 'us'} to ${m[2]}`, why: 'want + objet + to + verbe.', severity: 2 },
  { category: 'false friends', re: /\bI am (actually|eventually) (working|living|studying)\b/i, fix: (m) => `I am currently ${m[2]}`, why: 'Faux ami : actually = en fait ; actuellement = currently.', severity: 2 },
  { category: 'word order', re: /(?:^|[.?!]\s+)(what|where|when|why|how) (you|he|she|they|we) (are|is|do|did|will|can)\b/i, fix: (m) => `${m[1]} ${m[3]} ${m[2]}`, why: 'Question : auxiliaire avant le sujet.', severity: 2 },
];

export function analyze(text: string): Finding[] {
  const out: Finding[] = [];
  for (const r of RULES) {
    const m = text.match(r.re);
    if (m) {
      out.push({
        category: r.category,
        original: m[0].replace(/^[.?!]\s+/, ''),
        correction: r.fix(m),
        explanation: r.why,
        severity: r.severity ?? 2,
      });
    }
  }
  return out;
}
