import type { GrammarTopic } from '@/types';

type Q = [string, string[], number, string?];
const q = (t: Q) => ({ q: t[0], options: t[1], answer: t[2], why: t[3] });

export const GRAMMAR_EXTRA: GrammarTopic[] = [
  {
    id: 'there-is',
    title: 'There is / There are',
    level: 'A1',
    explain:
      'Pour dire qu’il y a quelque chose : there is + singulier, there are + pluriel. Négation : there isn’t / there aren’t. Question : Is there…? / Are there…? On n’utilise pas « it has » pour « il y a ».',
    examples: [
      { en: 'There is a problem with the printer.', fr: 'Il y a un problème avec l’imprimante.' },
      { en: 'Are there any questions?', fr: 'Y a-t-il des questions ?' },
    ],
    mistakes: [
      { wrong: 'It has a problem in the system.', right: 'There is a problem in the system.', why: '« il y a » = there is.' },
      { wrong: 'There is two options.', right: 'There are two options.', why: 'Pluriel : there are.' },
    ],
    exercises: [
      q(['___ three meetings today.', ['There is', 'There are', 'It has'], 1]),
      q(['___ a coffee machine on this floor?', ['Is there', 'Are there', 'Has it'], 0]),
    ],
    say: ['There’s a problem with the test.', 'Are there any questions?'],
  },
  {
    id: 'adverbs-frequency',
    title: 'Fréquence : always, usually, sometimes, never',
    level: 'A1',
    explain:
      'Les adverbes de fréquence se placent avant le verbe (I usually start at eight) mais après « be » (I am always late). Du plus au moins fréquent : always, usually, often, sometimes, rarely, never. Never est déjà négatif : pas de « don’t » en plus.',
    examples: [
      { en: 'I usually take the train.', fr: 'Je prends généralement le train.' },
      { en: 'She is never late.', fr: 'Elle n’est jamais en retard.' },
    ],
    mistakes: [
      { wrong: 'I don’t never drink coffee.', right: 'I never drink coffee.', why: 'Double négation interdite.' },
      { wrong: 'I usually am tired.', right: 'I am usually tired.', why: 'Avec be, l’adverbe vient après le verbe.' },
    ],
    exercises: [
      q(['I ___ eat meat. I’m vegetarian.', ['never', 'don’t never', 'always'], 0]),
      q(['He ___ late for meetings.', ['is always', 'always is', 'does always'], 0]),
    ],
    say: ['I usually start work at eight.', 'I rarely work on weekends.'],
  },
  {
    id: 'past-continuous',
    title: 'Past continuous (j’étais en train de…)',
    level: 'A2',
    explain:
      'was/were + verbe-ing : une action en cours à un moment du passé, ou interrompue par une autre (past simple). While I was working, the phone rang. On pose le décor avec le continuous, on raconte l’événement avec le simple.',
    examples: [
      { en: 'I was driving when you called.', fr: 'Je conduisais quand tu as appelé.' },
      { en: 'What were you doing at nine?', fr: 'Que faisais-tu à neuf heures ?' },
    ],
    mistakes: [{ wrong: 'I was work when he arrived.', right: 'I was working when he arrived.', why: 'was + verbe-ing.' }],
    exercises: [
      q(['I ___ a report when the power went off.', ['wrote', 'was writing', 'am writing'], 1]),
      q(['They ___ TV when I came in.', ['watched', 'were watching', 'watch'], 1]),
    ],
    say: ['I was working when you called.', 'What were you doing yesterday at nine?'],
  },
  {
    id: 'have-to-must',
    title: 'Obligation : must, have to, should',
    level: 'A2',
    explain:
      'must = obligation que je ressens ou règle forte ; have to = obligation externe (règle, horaire) ; should = conseil. Négation : don’t have to = pas obligé ; mustn’t = interdit. Passé : had to (must n’a pas de passé).',
    examples: [
      { en: 'I have to be at work at eight.', fr: 'Je dois être au travail à huit heures.' },
      { en: 'You mustn’t use your phone here.', fr: 'Il est interdit d’utiliser son téléphone ici.' },
    ],
    mistakes: [
      { wrong: 'I must to leave.', right: 'I must leave. / I have to leave.', why: 'Pas de « to » après must.' },
      { wrong: 'You don’t must smoke here.', right: 'You mustn’t smoke here.', why: 'must se nie avec mustn’t.' },
    ],
    exercises: [
      q(['I ___ work on Saturday. It’s optional.', ['mustn’t', 'don’t have to', 'can’t'], 1]),
      q(['Yesterday I ___ stay late.', ['must', 'had to', 'have to'], 1]),
    ],
    say: ['I have to finish this today.', 'You mustn’t forget the password.'],
  },
  {
    id: 'gerund-infinitive',
    title: 'Verbe + -ing ou to + verbe',
    level: 'B1',
    explain:
      'Certains verbes sont suivis de -ing (enjoy, avoid, finish, mind, suggest), d’autres de to + verbe (want, need, decide, hope, plan, manage). Après une préposition : toujours -ing (interested in learning).',
    examples: [
      { en: 'I enjoy speaking English.', fr: 'J’aime parler anglais.' },
      { en: 'I decided to apply for the job.', fr: 'J’ai décidé de postuler.' },
    ],
    mistakes: [
      { wrong: 'I suggest to go now.', right: 'I suggest going now.', why: 'suggest + -ing.' },
      { wrong: 'I look forward to see you.', right: 'I look forward to seeing you.', why: 'to est ici une préposition.' },
    ],
    exercises: [
      q(['She avoided ___ the question.', ['to answer', 'answering', 'answer'], 1]),
      q(['We plan ___ next month.', ['to start', 'starting', 'start'], 0]),
      q(['I’m interested in ___ more.', ['learn', 'to learn', 'learning'], 2]),
    ],
    say: ['I enjoy working with my team.', 'I’m looking forward to meeting you.'],
  },
  {
    id: 'question-tags',
    title: 'Question tags : isn’t it ? don’t you ?',
    level: 'B1',
    explain:
      'Petite question en fin de phrase pour confirmer ou relancer. Phrase positive → tag négatif ; phrase négative → tag positif. On reprend l’auxiliaire : It’s cold, isn’t it ? You work here, don’t you ? Très courant en small talk.',
    examples: [
      { en: 'Nice weather, isn’t it?', fr: 'Beau temps, non ?' },
      { en: 'You haven’t seen my keys, have you?', fr: 'Tu n’as pas vu mes clés, par hasard ?' },
    ],
    mistakes: [{ wrong: 'It’s cold, is it?', right: 'It’s cold, isn’t it?', why: 'Positif → tag négatif.' }],
    exercises: [
      q(['You speak English, ___?', ['don’t you', 'aren’t you', 'do you'], 0]),
      q(['She isn’t here, ___?', ['isn’t she', 'is she', 'does she'], 1]),
    ],
    say: ['It’s a lovely day, isn’t it?', 'You’re from France, aren’t you?'],
  },
];
