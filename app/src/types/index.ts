export type Level = 'Pre-A1' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export const LEVELS: Level[] = ['Pre-A1', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export type Skill =
  | 'vocabulary'
  | 'grammar'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'pronunciation';
export const SKILLS: Skill[] = [
  'vocabulary',
  'grammar',
  'listening',
  'reading',
  'writing',
  'speaking',
  'pronunciation',
];

export type Register = 'formal' | 'neutral' | 'informal' | 'slang';
export type Region = 'intl' | 'us' | 'uk';

export interface VocabItem {
  id: string;
  word: string;
  ipa: string;
  pos: string;
  fr: string[]; // translations
  meanings?: string[]; // other senses (FR)
  examples: { en: string; fr: string }[];
  collocations?: string[];
  synonyms?: string[];
  antonyms?: string[];
  mistakes?: string;
  related?: string[];
  level: Level;
  register: Register;
  region?: Region;
  usUk?: string;
  cat: string;
}

export interface Sentence {
  id: string;
  en: string;
  fr: string;
  level: Level;
  situation: string;
  register: Register;
  grammar?: string;
  alt?: string; // alternative natural wording
}

export interface GrammarTopic {
  id: string;
  title: string;
  level: Level;
  explain: string; // simple FR explanation
  examples: { en: string; fr: string }[];
  mistakes: { wrong: string; right: string; why: string }[];
  exercises: { q: string; options: string[]; answer: number; why?: string }[];
  say: string[]; // sentences to say aloud
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  persona: string; // AI role description
  opening: string; // first AI line
  level: Level;
  goal: string;
  script: { ai: string; hints: string[]; keywords?: string[] }[]; // offline script
}

export interface ReadingText {
  id: string;
  title: string;
  level: Level;
  text: string;
  questions: { q: string; options: string[]; answer: number }[];
}

export interface ListeningItem {
  id: string;
  level: Level;
  text: string;
  accent: 'us' | 'uk';
  questions: { q: string; options: string[]; answer: number }[];
  gaps?: string[]; // words to fill
}

export interface PronunciationPair {
  id: string;
  a: string;
  b: string;
  sounds: string;
  tip: string;
  sentence: string;
}

export interface FindWordsTask {
  id: string;
  level: Level;
  situation: string;
  hints: string[]; // 3 progressive hints
  model: string;
  keywords: string[];
}

export interface Resource {
  id: string;
  name: string;
  url: string;
  skills: Skill[];
  levels: Level[];
  note: string;
}

export type SrsState = 'NEW' | 'LEARNING' | 'FAMILIAR' | 'ACTIVE' | 'MASTERED' | 'NEEDS_REVIEW';

export interface SrsCard {
  id: string; // vocab:xxx | sent:xxx
  kind: 'vocab' | 'sentence';
  state: SrsState;
  ease: number;
  interval: number; // days
  due: number; // epoch ms
  reps: number;
  lapses: number;
  lastSeen: number;
  avgMs: number;
}

export interface UserMistake {
  id: string;
  category: string;
  original: string;
  correction: string;
  explanation: string;
  frequency: number;
  lastOccurrence: number;
  severity: 1 | 2 | 3;
}

export type CorrectionMode = 'friendly' | 'teacher' | 'immersion' | 'beginner' | 'strict';

export interface Profile {
  onboarded: boolean;
  goals: string[];
  minutesPerDay: number;
  frenchSupport: number; // 0-100
  variant: 'intl' | 'us' | 'uk';
  domain: string;
  levels: Record<Skill, number>; // index into LEVELS (0..6) fractional allowed
  confidence: 'low' | 'medium' | 'high';
}
