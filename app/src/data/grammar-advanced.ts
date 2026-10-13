import type { GrammarTopic } from '@/types';

type Q = [string, string[], number, string?];
const q = (t: Q) => ({ q: t[0], options: t[1], answer: t[2], why: t[3] });

// Batch 5 (0.5): advanced grammar (C1).
export const GRAMMAR_ADVANCED: GrammarTopic[] = [
  {
    id: 'inversion',
    title: 'Inversion après un adverbe négatif (Never have I…)',
    level: 'C1',
    explain:
      'Dans un style soutenu, un adverbe négatif ou restrictif placé en tête de phrase entraîne l’inversion sujet / auxiliaire, comme dans une question : never, rarely, seldom, hardly… when, no sooner… than, not only… but also, only after/when. Sans auxiliaire, on ajoute do/does/did.',
    examples: [
      { en: 'Never have I worked with such a team.', fr: 'Jamais je n’ai travaillé avec une telle équipe.' },
      { en: 'Not only did they delay the launch, they also changed the specs.', fr: 'Non seulement ils ont retardé le lancement, mais ils ont aussi changé les spécifications.' },
      { en: 'No sooner had we arrived than it started to rain.', fr: 'À peine étions-nous arrivés qu’il s’est mis à pleuvoir.' },
    ],
    mistakes: [
      { wrong: 'Never I have seen such a mess.', right: 'Never have I seen such a mess.', why: 'Après never en tête de phrase : auxiliaire avant le sujet.' },
      { wrong: 'Not only they were late, but…', right: 'Not only were they late, but…', why: 'Not only en tête : inversion.' },
      { wrong: 'No sooner we had left than…', right: 'No sooner had we left than…', why: 'No sooner + auxiliaire + sujet.' },
    ],
    exercises: [
      q(['Rarely ___ such a clear presentation.', ['I have seen', 'have I seen', 'I saw'], 1]),
      q(['Hardly ___ sat down when the phone rang.', ['had she', 'she had', 'did she'], 0, 'Hardly + had + sujet… when.']),
      q(['Only after the audit ___ the error.', ['they discovered', 'did they discover', 'they did discover'], 1, 'Only after… + inversion avec did.']),
    ],
    say: ['Never have I seen such a mess.', 'Not only did we finish early, we also saved money.', 'No sooner had I sent it than I spotted a typo.'],
  },
  {
    id: 'mixed-conditionals',
    title: 'Conditionnels mixtes',
    level: 'C1',
    explain:
      'On mélange passé et présent. Cause dans le passé, effet dans le présent : If + past perfect, would + base verb (If I had studied medicine, I would be a doctor now). Cause générale/présente, effet dans le passé : If + past simple, would have + participe (If he were more careful, he wouldn’t have made that mistake).',
    examples: [
      { en: 'If I had taken that offer, I’d be living in Dubai now.', fr: 'Si j’avais accepté cette offre, je vivrais à Dubaï maintenant.' },
      { en: 'If she weren’t so stubborn, she would have accepted help.', fr: 'Si elle n’était pas si têtue, elle aurait accepté de l’aide.' },
    ],
    mistakes: [
      { wrong: 'If I would have known, I would have told you.', right: 'If I had known, I would have told you.', why: 'Pas de would dans la proposition en if.' },
      { wrong: 'If I had more time, I would have finished yesterday.', right: 'If I had had more time, I would have finished yesterday.', why: 'Cause passée : past perfect.' },
    ],
    exercises: [
      q(['If we ___ the contract last year, we would be market leaders today.', ['signed', 'had signed', 'would sign'], 1]),
      q(['If he ___ more organised, he wouldn’t have missed the deadline.', ['were', 'had been', 'would be'], 0, 'Caractère présent/général : were.']),
    ],
    say: ['If I had left earlier, I’d be home by now.', 'If he were more careful, this wouldn’t have happened.'],
  },
  {
    id: 'cleft',
    title: 'Mise en relief : It is… that / What… is',
    level: 'C1',
    explain:
      'Pour insister, on découpe la phrase. It is/was + élément + that/who… (It was the budget that caused the delay). What + sujet + verbe + is/was + élément (What I need is more time). Très utile à l’oral pour structurer son propos.',
    examples: [
      { en: 'It was the lack of testing that caused the failure.', fr: 'C’est le manque de tests qui a causé l’échec.' },
      { en: 'What we need is a clear deadline.', fr: 'Ce dont nous avons besoin, c’est d’une échéance claire.' },
      { en: 'All I want is a straight answer.', fr: 'Tout ce que je veux, c’est une réponse franche.' },
    ],
    mistakes: [
      { wrong: 'It is the budget which is the problem.', right: 'It’s the budget that’s the problem.', why: 'En mise en relief, on préfère that (ou who pour une personne).' },
      { wrong: 'What I need it is more time.', right: 'What I need is more time.', why: 'Pas de pronom de reprise : « What I need is… ».' },
    ],
    exercises: [
      q(['___ made the difference was the support of the team.', ['That', 'What', 'It'], 1]),
      q(['It was Anna ___ solved the problem.', ['who', 'which', 'what'], 0]),
    ],
    say: ['What I’d like to do is walk you through the results.', 'It was the timing that worried me.'],
  },
  {
    id: 'subjunctive',
    title: 'Subjonctif et formes en be : insist that he be…',
    level: 'C1',
    explain:
      'Après des verbes comme insist, suggest, recommend, demand, propose, require et des adjectifs comme essential, vital, important, on utilise la forme de base du verbe, sans -s ni temps : I suggest that he go (US/formel). En anglais britannique courant on dit aussi should : I suggest that he should go. « It’s time / I’d rather / if only » prennent le prétérit pour parler du présent.',
    examples: [
      { en: 'It is essential that every employee be informed.', fr: 'Il est essentiel que chaque employé soit informé.' },
      { en: 'I’d rather you didn’t tell her yet.', fr: 'Je préférerais que tu ne lui dises pas encore.' },
      { en: 'It’s high time we left.', fr: 'Il est grand temps de partir.' },
    ],
    mistakes: [
      { wrong: 'I suggest that he goes to the doctor.', right: 'I suggest that he go (should go) to the doctor.', why: 'Après suggest : base verb (ou should).' },
      { wrong: 'It’s time we will start.', right: 'It’s time we started.', why: 'It’s time + prétérit.' },
    ],
    exercises: [
      q(['The manager demanded that the report ___ by Monday.', ['is finished', 'be finished', 'was finished'], 1]),
      q(['I’d rather you ___ in the meeting.', ['don’t speak', 'didn’t speak', 'won’t speak'], 1]),
    ],
    say: ['I insist that she be given a chance.', 'It’s high time we made a decision.'],
  },
  {
    id: 'participle-clauses',
    title: 'Propositions participiales',
    level: 'C1',
    explain:
      'On raccourcit une phrase avec un participe présent (-ing), passé ou parfait (having + participe). Le sujet du participe doit être le même que celui de la principale. Having finished the report, I went home = After I had finished… Faire attention aux « dangling participles » : *Walking down the street, the bank appeared* est incorrect.',
    examples: [
      { en: 'Having read the contract, she decided not to sign.', fr: 'Ayant lu le contrat, elle a décidé de ne pas signer.' },
      { en: 'Written in 1990, the code is hard to maintain.', fr: 'Écrit en 1990, le code est difficile à maintenir.' },
      { en: 'Not knowing the answer, he stayed silent.', fr: 'Ne connaissant pas la réponse, il est resté silencieux.' },
    ],
    mistakes: [
      { wrong: 'Walking to the station, my phone rang.', right: 'Walking to the station, I heard my phone ring.', why: 'Le sujet du participe doit être le sujet de la principale.' },
      { wrong: 'Having seen the film, it was boring.', right: 'Having seen the film, I found it boring.', why: 'Même sujet pour les deux actions.' },
    ],
    exercises: [
      q(['___ the instructions, he started the machine.', ['Reading', 'Having read', 'To read'], 1, 'Action terminée avant : having + participe.']),
      q(['Which sentence is correct?', ['Opening the door, the room was empty.', 'Opening the door, she saw an empty room.', 'Opened the door, an empty room appeared.'], 1]),
    ],
    say: ['Having finished the report, I sent it to the client.', 'Not knowing what to do, I asked for help.'],
  },
  {
    id: 'hedging-modals',
    title: 'Nuancer : modaux et atténuation (might well, would seem)',
    level: 'C1',
    explain:
      'Les anglophones avancés atténuent leurs affirmations : might well / may well (probablement), could be, seem / appear, tend to, to some extent, it would seem that. En français on dit « il semblerait que… » ; en anglais c’est un marqueur de politesse et de précision, très présent dans les réunions et l’écrit professionnel.',
    examples: [
      { en: 'This could well be the main cause.', fr: 'Ce pourrait bien être la cause principale.' },
      { en: 'It would seem that the figures were wrong.', fr: 'Il semblerait que les chiffres étaient faux.' },
      { en: 'Users tend to ignore the warning.', fr: 'Les utilisateurs ont tendance à ignorer l’avertissement.' },
    ],
    mistakes: [
      { wrong: 'It is the wrong figure.', right: 'It would seem to be the wrong figure.', why: 'Pour rester prudent / poli, on atténue.' },
      { wrong: 'I think maybe that perhaps…', right: 'I’m inclined to think that…', why: 'Une seule marque d’atténuation suffit.' },
    ],
    exercises: [
      q(['Which is the most cautious?', ['It is a mistake.', 'It could well be a mistake.', 'It must be a mistake.'], 1]),
      q(['Users ___ to skip the tutorial.', ['tend', 'tends', 'are tending'], 0]),
    ],
    say: ['It would seem that we’re behind schedule.', 'That could well be the case.'],
  },
];
