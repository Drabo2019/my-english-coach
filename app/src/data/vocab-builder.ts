import type { Level, Register, VocabItem } from '@/types';

type Extra = Partial<
  Pick<
    VocabItem,
    'meanings' | 'collocations' | 'synonyms' | 'antonyms' | 'mistakes' | 'related' | 'register' | 'usUk' | 'region'
  >
>;

export function v(
  cat: string,
  word: string,
  ipa: string,
  pos: string,
  fr: string,
  level: Level,
  en: string,
  frEx: string,
  x: Extra = {},
): VocabItem {
  return {
    id: `${cat}-${word}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    word,
    ipa,
    pos,
    fr: fr.split('/').map((s) => s.trim()),
    examples: [{ en, fr: frEx }],
    level,
    register: 'neutral' as Register,
    cat,
    ...x,
  };
}

