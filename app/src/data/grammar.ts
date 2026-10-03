import type { GrammarTopic } from '@/types';

import { GRAMMAR_EXTRA } from './grammar-extra';

type Q = [string, string[], number, string?];
const q = (t: Q) => ({ q: t[0], options: t[1], answer: t[2], why: t[3] });

const GRAMMAR_CORE: GrammarTopic[] = [
  {
    id: 'be',
    title: 'Le verbe BE (être / avoir un âge / avoir chaud…)',
    level: 'A1',
    explain:
      'En anglais, on utilise « be » pour l’âge, les sensations et l’état : I am 40 (pas « I have 40 »), I am cold, I am hungry. Formes : I am, you are, he/she/it is, we/you/they are. Négation : I’m not. Question : Are you…?',
    examples: [
      { en: 'I’m 40 years old.', fr: 'J’ai 40 ans.' },
      { en: 'She’s hungry.', fr: 'Elle a faim.' },
      { en: 'Are you ready?', fr: 'Tu es prêt ?' },
    ],
    mistakes: [
      { wrong: 'I have 40 years.', right: 'I am 40 years old.', why: 'L’âge se dit avec « be ».' },
      { wrong: 'I have cold.', right: 'I am cold.', why: 'Sensations : be + adjectif.' },
      { wrong: 'I am agree.', right: 'I agree.', why: '« agree » est un verbe, pas un adjectif.' },
    ],
    exercises: [
      q(['She ___ 25 years old.', ['has', 'is', 'have'], 1]),
      q(['I ___ hungry.', ['am', 'have', 'has'], 0]),
      q(['___ you ready?', ['Is', 'Are', 'Do'], 1]),
    ],
    say: ['I’m 40 years old.', 'I’m a bit tired today.', 'Are you ready?'],
  },
  {
    id: 'present-simple',
    title: 'Present simple (habitudes, faits)',
    level: 'A1',
    explain:
      'Pour les habitudes et les vérités générales. À he/she/it on ajoute -s : he works. Négation et question avec do/does : I don’t work, Does she work ? Après does, le verbe reste à la base : Does he work (pas « works »).',
    examples: [
      { en: 'I work in Paris.', fr: 'Je travaille à Paris.' },
      { en: 'He doesn’t drink coffee.', fr: 'Il ne boit pas de café.' },
      { en: 'Do you speak English?', fr: 'Tu parles anglais ?' },
    ],
    mistakes: [
      { wrong: 'He work here.', right: 'He works here.', why: 'Il manque le -s à la 3e personne.' },
      { wrong: 'Does she works?', right: 'Does she work?', why: 'Après does, verbe à la base.' },
    ],
    exercises: [
      q(['She ___ at a bank.', ['work', 'works', 'working'], 1]),
      q(['He ___ like fish.', ['don’t', 'doesn’t', 'isn’t'], 1]),
      q(['___ you live here?', ['Do', 'Does', 'Are'], 0]),
    ],
    say: ['I usually start at eight.', 'She doesn’t like meetings.', 'Do you work from home?'],
  },
  {
    id: 'present-continuous',
    title: 'Present continuous (maintenant, en ce moment)',
    level: 'A1',
    explain:
      'am/is/are + verbe-ing pour ce qui se passe maintenant ou en ce moment, et pour les projets proches. Les verbes d’état (know, like, want) ne se mettent pas en -ing.',
    examples: [
      { en: 'I’m working on a new project.', fr: 'Je travaille sur un nouveau projet.' },
      { en: 'We’re meeting at 5.', fr: 'On se voit à 17 h.' },
    ],
    mistakes: [
      { wrong: 'I am knowing the answer.', right: 'I know the answer.', why: 'Verbe d’état : pas de -ing.' },
      { wrong: 'I working now.', right: 'I’m working now.', why: 'Il faut « am » devant -ing.' },
    ],
    exercises: [
      q(['Right now I ___ a report.', ['write', 'am writing', 'writes'], 1]),
      q(['They ___ for you outside.', ['wait', 'is waiting', 'are waiting'], 2]),
    ],
    say: ['I’m currently testing a board.', 'What are you doing right now?'],
  },
  {
    id: 'past-simple',
    title: 'Past simple (hier, la semaine dernière)',
    level: 'A2',
    explain:
      'Pour une action terminée dans le passé. Verbes réguliers : +ed (worked). Irréguliers à connaître : go→went, see→saw, have→had, make→made, take→took, buy→bought, meet→met. Négation/question : did + verbe à la base.',
    examples: [
      { en: 'Yesterday I went to work and met my colleague.', fr: 'Hier, je suis allé travailler et j’ai croisé mon collègue.' },
      { en: 'Did you see the email?', fr: 'Tu as vu l’email ?' },
    ],
    mistakes: [
      { wrong: 'Yesterday I go to work.', right: 'Yesterday I went to work.', why: 'Hier = passé : went.' },
      { wrong: 'Did you went?', right: 'Did you go?', why: 'Après did : verbe à la base.' },
    ],
    exercises: [
      q(['Yesterday I ___ a new phone.', ['buy', 'bought', 'buyed'], 1]),
      q(['Did she ___ the message?', ['saw', 'see', 'seen'], 1]),
      q(['We ___ late last night.', ['worked', 'work', 'working'], 0]),
    ],
    say: ['Yesterday I went to work and saw my colleague.', 'I didn’t sleep well last night.', 'What did you do at the weekend?'],
  },
  {
    id: 'present-perfect',
    title: 'Present perfect (have + participe passé)',
    level: 'A2',
    explain:
      'Relie le passé au présent : expérience (I’ve been to London), résultat actuel (I’ve lost my keys), durée avec for/since (I’ve worked here for 3 years). On ne l’utilise PAS avec un moment passé précis (yesterday, in 2019) : on prend le past simple.',
    examples: [
      { en: 'I’ve worked here for three years.', fr: 'Je travaille ici depuis trois ans.' },
      { en: 'Have you ever been to Canada?', fr: 'Tu es déjà allé au Canada ?' },
    ],
    mistakes: [
      { wrong: 'I work here since 2020.', right: 'I’ve worked here since 2020.', why: 'Depuis + durée en cours : present perfect.' },
      { wrong: 'I have seen him yesterday.', right: 'I saw him yesterday.', why: 'Moment précis → past simple.' },
    ],
    exercises: [
      q(['I ___ here for two years.', ['work', 'have worked', 'worked'], 1]),
      q(['She ___ him yesterday.', ['has met', 'met', 'meet'], 1, 'yesterday = moment précis.']),
      q(['___ you ever tried sushi?', ['Did', 'Have', 'Do'], 1]),
    ],
    say: ['I’ve lived here for five years.', 'Have you ever spoken English at work?'],
  },
  {
    id: 'future',
    title: 'Futur : will / going to / present continuous',
    level: 'A2',
    explain:
      'going to = plan ou intention déjà décidé (I’m going to call him). will = décision spontanée, promesse, prédiction (I’ll check and get back to you). Present continuous = rendez-vous organisé (I’m meeting him at 5).',
    examples: [
      { en: 'I’ll help you with that.', fr: 'Je vais t’aider avec ça.' },
      { en: 'I’m going to start a new job.', fr: 'Je vais commencer un nouveau travail.' },
    ],
    mistakes: [
      { wrong: 'When I will arrive, I call you.', right: 'When I arrive, I’ll call you.', why: 'Après when/as soon as : présent.' },
    ],
    exercises: [
      q(['Phone’s ringing. — I ___ get it!', ['’m going to', '’ll', 'am getting'], 1]),
      q(['Call me as soon as you ___.', ['will arrive', 'arrive', 'arrived'], 1]),
    ],
    say: ['I’ll check and get back to you.', 'I’m going to practise every day.'],
  },
  {
    id: 'modals',
    title: 'Modaux : can, could, should, must, would',
    level: 'A2',
    explain:
      'can/could = capacité, demande polie. should = conseil. must = obligation forte. have to = obligation externe. would = politesse (Would you like…?). Après un modal : verbe à la base, jamais de « to » (sauf have to), jamais de -s.',
    examples: [
      { en: 'Could you help me?', fr: 'Pourriez-vous m’aider ?' },
      { en: 'You should rest.', fr: 'Tu devrais te reposer.' },
    ],
    mistakes: [
      { wrong: 'He cans swim.', right: 'He can swim.', why: 'Les modaux ne prennent pas de -s.' },
      { wrong: 'I must to go.', right: 'I must go.', why: 'Pas de « to » après un modal.' },
    ],
    exercises: [
      q(['You look tired. You ___ rest.', ['should', 'must to', 'shoulds'], 0]),
      q(['___ you open the window, please?', ['Could', 'Do', 'Are'], 0]),
    ],
    say: ['Could you repeat that, please?', 'You should try again.'],
  },
  {
    id: 'questions',
    title: 'Poser des questions',
    level: 'A1',
    explain:
      'Ordre : mot interrogatif + auxiliaire + sujet + verbe. What do you want ? Where did he go ? Questions indirectes (plus polies) : Could you tell me where the room is ? (ordre normal, pas d’inversion).',
    examples: [
      { en: 'Where did you go yesterday?', fr: 'Où es-tu allé hier ?' },
      { en: 'Do you know what time it starts?', fr: 'Sais-tu à quelle heure ça commence ?' },
    ],
    mistakes: [
      { wrong: 'Where you are going?', right: 'Where are you going?', why: 'L’auxiliaire passe avant le sujet.' },
      { wrong: 'Do you know where is it?', right: 'Do you know where it is?', why: 'Question indirecte : ordre normal.' },
    ],
    exercises: [
      q(['___ do you work?', ['Where', 'Where are', 'Where does'], 0]),
      q(['Could you tell me where ___?', ['is the station', 'the station is', 'does the station'], 1]),
    ],
    say: ['What time does the meeting start?', 'Could you tell me where the room is?'],
  },
  {
    id: 'articles',
    title: 'Articles : a / an / the / rien',
    level: 'A1',
    explain:
      'a/an = un parmi d’autres, première mention. the = déjà connu ou unique. Pas d’article pour les généralités au pluriel ou indénombrables : I like music. Avec les métiers : I’m an engineer.',
    examples: [
      { en: 'I need a laptop. The laptop is old.', fr: 'J’ai besoin d’un ordinateur. L’ordinateur est vieux.' },
      { en: 'She’s a doctor.', fr: 'Elle est médecin.' },
    ],
    mistakes: [
      { wrong: 'I am engineer.', right: 'I am an engineer.', why: 'Métier : article obligatoire.' },
      { wrong: 'I like the music.', right: 'I like music.', why: 'Généralité : pas d’article.' },
    ],
    exercises: [
      q(['She is ___ engineer.', ['a', 'an', 'the'], 1]),
      q(['I love ___ coffee.', ['the', 'a', '—'], 2]),
    ],
    say: ['I’m an engineer.', 'I need a break.'],
  },
  {
    id: 'prepositions',
    title: 'Prépositions : in / on / at',
    level: 'A2',
    explain:
      'at = point précis (at 5, at work, at the station). on = jours et surfaces (on Monday, on the table). in = périodes et espaces (in July, in 2024, in Paris, in the morning).',
    examples: [
      { en: 'See you on Monday at 9.', fr: 'À lundi, à 9 h.' },
      { en: 'I live in Lyon.', fr: 'J’habite à Lyon.' },
    ],
    mistakes: [
      { wrong: 'I’ll see you in Monday.', right: 'I’ll see you on Monday.', why: 'Jours : on.' },
      { wrong: 'I’m in the work.', right: 'I’m at work.', why: 'Lieu usuel : at work.' },
    ],
    exercises: [
      q(['The meeting is ___ Tuesday.', ['in', 'on', 'at'], 1]),
      q(['I wake up ___ 7 a.m.', ['at', 'on', 'in'], 0]),
    ],
    say: ['The meeting is on Tuesday at ten.', 'I’m at work until six.'],
  },
  {
    id: 'comparatives',
    title: 'Comparatifs et superlatifs',
    level: 'A2',
    explain:
      'Court : taller, the tallest. Long : more expensive, the most expensive. Irréguliers : good→better→best, bad→worse→worst. « than » pour comparer.',
    examples: [
      { en: 'This option is cheaper than that one.', fr: 'Cette option est moins chère que celle-là.' },
      { en: 'It’s the most reliable sensor.', fr: 'C’est le capteur le plus fiable.' },
    ],
    mistakes: [{ wrong: 'more cheap', right: 'cheaper', why: 'Adjectif court : -er.' }],
    exercises: [
      q(['This is ___ than that.', ['more good', 'better', 'best'], 1]),
      q(['It’s ___ expensive of all.', ['the most', 'more', 'most'], 0]),
    ],
    say: ['This is easier than I thought.', 'It’s the best option we have.'],
  },
  {
    id: 'conditionals',
    title: 'Conditionnel : if (type 1 et 2)',
    level: 'B1',
    explain:
      'Type 1 (réel) : If + présent, will + base : If it rains, I’ll stay home. Type 2 (irréel/hypothèse) : If + past, would + base : If I had time, I would help you.',
    examples: [
      { en: 'If you call me, I’ll answer.', fr: 'Si tu m’appelles, je répondrai.' },
      { en: 'If I were you, I would wait.', fr: 'Si j’étais toi, j’attendrais.' },
    ],
    mistakes: [{ wrong: 'If I will have time, I come.', right: 'If I have time, I’ll come.', why: 'Pas de will après if.' }],
    exercises: [
      q(['If it rains, we ___ inside.', ['stay', 'will stay', 'would stay'], 1]),
      q(['If I ___ rich, I would travel.', ['am', 'were', 'will be'], 1]),
    ],
    say: ['If you need help, just ask.', 'If I had more time, I would practise more.'],
  },
  {
    id: 'passive',
    title: 'Voix passive',
    level: 'B1',
    explain:
      'be + participe passé, quand l’action compte plus que l’agent. The test was delayed. The report has been sent. Très utilisé en contexte pro.',
    examples: [
      { en: 'The meeting was cancelled.', fr: 'La réunion a été annulée.' },
      { en: 'The device is tested daily.', fr: 'L’appareil est testé chaque jour.' },
    ],
    mistakes: [{ wrong: 'The test is delay.', right: 'The test is delayed.', why: 'Participe passé obligatoire.' }],
    exercises: [q(['The report ___ yesterday.', ['sent', 'was sent', 'is send'], 1])],
    say: ['The test has been delayed.', 'The files were sent this morning.'],
  },
  {
    id: 'linking',
    title: 'Mots de liaison : but, because, so, although, however',
    level: 'B1',
    explain:
      'because (cause), so (conséquence), but (opposition), although (bien que, + sujet+verbe), however (cependant, début de phrase, plus formel), despite/in spite of (+ nom ou -ing).',
    examples: [
      { en: 'I was tired, so I went to bed early.', fr: 'J’étais fatigué, alors je me suis couché tôt.' },
      { en: 'Although it was late, we kept working.', fr: 'Bien qu’il fût tard, nous avons continué.' },
    ],
    mistakes: [{ wrong: 'Although it was late, but we worked.', right: 'Although it was late, we worked.', why: 'Pas de but avec although.' }],
    exercises: [q(['___ it was raining, we went out.', ['Because', 'Although', 'So'], 1])],
    say: ['It’s cheap. However, it’s not reliable.', 'I was late because of the traffic.'],
  },
  {
    id: 'reported-speech',
    title: 'Discours rapporté',
    level: 'B1',
    explain:
      'On « recule » d’un temps : "I am tired" → He said (that) he was tired. will→would, can→could. say (sans personne), tell (+ personne) : He told me that…',
    examples: [{ en: 'She said she would call me later.', fr: 'Elle a dit qu’elle m’appellerait plus tard.' }],
    mistakes: [{ wrong: 'He said me that…', right: 'He told me that… / He said that…', why: 'say sans complément personne ; tell avec.' }],
    exercises: [q(['"I’m busy." → He said he ___ busy.', ['is', 'was', 'be'], 1])],
    say: ['He told me he would be late.'],
  },
  {
    id: 'relative',
    title: 'Propositions relatives : who, which, that',
    level: 'B1',
    explain:
      'who = personne, which = chose, that = les deux (usage courant). where = lieu. The man who called… The device that failed… Le pronom reste identique, pas de « qui/que/dont » à choisir.',
    examples: [{ en: 'The engineer who fixed it is on holiday.', fr: 'L’ingénieur qui l’a réparé est en vacances.' }],
    mistakes: [{ wrong: 'The man which called…', right: 'The man who called…', why: 'Personne → who.' }],
    exercises: [q(['The test ___ failed was the last one.', ['who', 'that', 'whose'], 1])],
    say: ['That’s the person who helped me.'],
  },
  {
    id: 'phrasal-verbs-grammar',
    title: 'Phrasal verbs : séparables ou non',
    level: 'B1',
    explain:
      'Verbe + particule. Séparables : turn the light on / turn it on (pronom entre les deux). Inséparables : look after children, look after them. Apprends-les en phrases, pas en liste.',
    examples: [{ en: 'Turn it off, please.', fr: 'Éteins-le, s’il te plaît.' }],
    mistakes: [{ wrong: 'Turn off it.', right: 'Turn it off.', why: 'Pronom entre le verbe et la particule.' }],
    exercises: [q(['Please ___.', ['turn off it', 'turn it off', 'off turn it'], 1])],
    say: ['I’ll figure it out.', 'Let’s wrap it up.'],
  },
  {
    id: 'used-to',
    title: 'Used to / be used to / get used to',
    level: 'B1',
    explain:
      'used to + base = habitude passée (I used to smoke). be used to + -ing/nom = être habitué (I’m used to working late). get used to = s’habituer.',
    examples: [{ en: 'I’m getting used to speaking English.', fr: 'Je m’habitue à parler anglais.' }],
    mistakes: [{ wrong: 'I’m used to work late.', right: 'I’m used to working late.', why: 'to est une préposition → -ing.' }],
    exercises: [q(['I’m used to ___ early.', ['wake up', 'waking up', 'woke up'], 1])],
    say: ['I’m not used to speaking in front of people yet.'],
  },
  {
    id: 'quantifiers',
    title: 'Quantité : much / many / a lot of / some / any',
    level: 'A2',
    explain:
      'many + dénombrable, much + indénombrable (surtout en négation/question), a lot of partout. some en affirmatif, any en négatif/question. Indénombrables : information, advice, news, luggage, software.',
    examples: [{ en: 'I don’t have much time.', fr: 'Je n’ai pas beaucoup de temps.' }],
    mistakes: [{ wrong: 'I need some informations.', right: 'I need some information.', why: 'information est indénombrable.' }],
    exercises: [q(['How ___ people came?', ['much', 'many', 'any'], 1])],
    say: ['Do you have any questions?', 'I don’t have much time today.'],
  },
];

export const GRAMMAR: GrammarTopic[] = [...GRAMMAR_CORE, ...GRAMMAR_EXTRA];
