import type { ListeningItem, PronunciationPair, ReadingText, Resource } from '@/types';

import { LISTENING_EXTRA, PRONUNCIATION_EXTRA, READING_EXTRA } from './content-extra';

const READING_CORE: ReadingText[] = [
  {
    id: 'r1', title: 'A busy morning', level: 'A1',
    text: 'Tom wakes up at seven. He drinks a coffee and eats some bread. Then he takes the bus to work. The bus is late today, so Tom is late too. He says sorry to his boss.',
    questions: [
      { q: 'What time does Tom wake up?', options: ['At six', 'At seven', 'At eight'], answer: 1 },
      { q: 'Why is Tom late?', options: ['He missed his alarm', 'The bus is late', 'He is ill'], answer: 1 },
    ],
  },
  {
    id: 'r2', title: 'A new colleague', level: 'A2',
    text: 'Last Monday, a new colleague called Sara joined our team. She used to work in a small company in Spain. At lunch, we talked about our hobbies. Sara loves cycling and she goes to the mountains every weekend. I think we will get along well.',
    questions: [
      { q: 'Where did Sara work before?', options: ['In a large company in France', 'In a small company in Spain', 'She did not work'], answer: 1 },
      { q: 'What does Sara do at the weekend?', options: ['She goes cycling in the mountains', 'She stays at home', 'She works'], answer: 0 },
    ],
  },
  {
    id: 'r3', title: 'The delayed test', level: 'B1',
    text: 'The team planned to finish the test on Thursday, but a power supply failed on Wednesday. The engineers had to order a new one, which will arrive next week. Although this is frustrating, the manager decided not to rush. "We would rather have reliable results than fast ones," she said.',
    questions: [
      { q: 'Why was the test delayed?', options: ['A power supply failed', 'Nobody was available', 'The manager cancelled it'], answer: 0 },
      { q: 'What does the manager prefer?', options: ['Fast results', 'Reliable results', 'Cheaper results'], answer: 1 },
    ],
  },
  {
    id: 'r4', title: 'Working from home', level: 'B1',
    text: 'More and more people work from home at least two days a week. Many say they save time because they do not need to commute. However, some feel isolated and miss talking to colleagues. Companies are now looking for a balance between flexibility and teamwork.',
    questions: [
      { q: 'What is one advantage mentioned?', options: ['More meetings', 'No commute', 'Higher salary'], answer: 1 },
      { q: 'What do some people miss?', options: ['Their desk', 'Talking to colleagues', 'The weather'], answer: 1 },
    ],
  },
  {
    id: 'r5', title: 'Email: asking for an update', level: 'B1',
    text: 'Hi Anna,\nI hope you are well. I am writing to ask about the status of the order we placed on 3 March. We were told it would arrive by Friday, but we have not received it yet. Could you let me know when we can expect it?\nThanks in advance,\nMarc',
    questions: [
      { q: 'Why does Marc write?', options: ['To cancel an order', 'To ask about an order', 'To say thank you'], answer: 1 },
      { q: 'What was promised?', options: ['Delivery by Friday', 'A refund', 'A discount'], answer: 0 },
    ],
  },
  {
    id: 'r6', title: 'Learning a language as an adult', level: 'B2',
    text: 'Adults often believe they are too old to learn a language well. Research suggests otherwise: adults learn faster at the beginning because they can use strategies, even if children usually reach a more natural accent. What matters most is regular practice and, above all, speaking early rather than waiting until you feel ready.',
    questions: [
      { q: 'What do adults do better at the beginning?', options: ['Pronunciation', 'Use strategies', 'Forget less'], answer: 1 },
      { q: 'What does the text recommend?', options: ['Waiting until you are ready', 'Speaking early', 'Avoiding mistakes'], answer: 1 },
    ],
  },
];

const LISTENING_CORE: ListeningItem[] = [
  { id: 'l1', level: 'A1', accent: 'us', text: 'Hello. My name is Anna. I am from Canada. I work in a hospital.', questions: [{ q: 'Where is Anna from?', options: ['Canada', 'Australia', 'England'], answer: 0 }, { q: 'Where does she work?', options: ['In a school', 'In a hospital', 'In a shop'], answer: 1 }], gaps: ['Canada', 'hospital'] },
  { id: 'l2', level: 'A2', accent: 'uk', text: 'Excuse me, how do I get to the station? Go straight on, then turn left at the traffic lights. It takes about five minutes.', questions: [{ q: 'Where do you turn left?', options: ['At the bank', 'At the traffic lights', 'At the school'], answer: 1 }, { q: 'How long does it take?', options: ['Five minutes', 'Fifteen minutes', 'One hour'], answer: 0 }], gaps: ['left', 'five'] },
  { id: 'l3', level: 'A2', accent: 'us', text: 'I’d like to book a table for four people tomorrow at seven thirty, please.', questions: [{ q: 'How many people?', options: ['Two', 'Four', 'Six'], answer: 1 }, { q: 'What time?', options: ['6:30', '7:30', '8:30'], answer: 1 }], gaps: ['four', 'seven'] },
  { id: 'l4', level: 'B1', accent: 'uk', text: 'Hi Sam, it’s Julia. I’m afraid I can’t make the meeting this afternoon because my train has been cancelled. Could we move it to tomorrow morning?', questions: [{ q: 'Why can’t Julia come?', options: ['She is ill', 'Her train was cancelled', 'She has another meeting'], answer: 1 }, { q: 'What does she suggest?', options: ['Tomorrow morning', 'Next week', 'Tonight'], answer: 0 }], gaps: ['afraid', 'cancelled'] },
  { id: 'l5', level: 'B1', accent: 'us', text: 'So, as you can see, the error rate dropped by twenty percent after we changed the connector. We’re going to repeat the test next week to confirm.', questions: [{ q: 'What caused the improvement?', options: ['A new software', 'A new connector', 'A new team'], answer: 1 }, { q: 'When will they repeat the test?', options: ['Tomorrow', 'Next week', 'Next month'], answer: 1 }], gaps: ['twenty', 'connector'] },
  { id: 'l6', level: 'B2', accent: 'uk', text: 'Honestly, I’m not sure it’s going to work. We’ve tried something similar before and it didn’t go well, so I’d be a bit cautious about rushing into it.', questions: [{ q: 'How does the speaker feel?', options: ['Very enthusiastic', 'Cautious', 'Angry'], answer: 1 }], gaps: ['cautious'] },
];

const PRONUNCIATION_CORE: PronunciationPair[] = [
  { id: 'p1', a: 'ship', b: 'sheep', sounds: '/ɪ/ vs /iː/', tip: 'ship = voyelle courte et détendue ; sheep = voyelle longue, sourire.', sentence: 'The sheep is on the ship.' },
  { id: 'p2', a: 'live', b: 'leave', sounds: '/ɪ/ vs /iː/', tip: 'Même contraste court/long.', sentence: 'I live here, so I never leave.' },
  { id: 'p3', a: 'bad', b: 'bed', sounds: '/æ/ vs /e/', tip: '/æ/ : bouche bien ouverte ; /e/ : plus fermé.', sentence: 'The bad bed was too small.' },
  { id: 'p4', a: 'think', b: 'sink', sounds: '/θ/ vs /s/', tip: 'TH : langue entre les dents, souffle sans voix.', sentence: 'I think the sink is broken.' },
  { id: 'p5', a: 'three', b: 'tree', sounds: '/θr/ vs /tr/', tip: 'Ne remplace pas TH par T ou S.', sentence: 'Three birds sat in the tree.' },
  { id: 'p6', a: 'walk', b: 'work', sounds: '/ɔː/ vs /ɜː/', tip: 'walk : voyelle arrondie ; work : voyelle centrale, lèvres neutres.', sentence: 'I walk to work every day.' },
  { id: 'p7', a: 'this', b: 'zis', sounds: '/ð/ (TH voisé)', tip: 'Langue entre les dents + vibration. Le « z » français est une erreur courante.', sentence: 'This is the thing that I mean.' },
  { id: 'p8', a: 'very', b: 'berry', sounds: '/v/ vs /b/', tip: '/v/ : dents sur lèvre inférieure ; /b/ : lèvres fermées.', sentence: 'Very few berries were left.' },
  { id: 'p9', a: 'light', b: 'right', sounds: '/l/ vs /r/', tip: '/r/ anglais : langue recourbée, sans toucher ; pas le « r » français de gorge.', sentence: 'Turn right at the light.' },
  { id: 'p10', a: 'chip', b: 'ship', sounds: '/tʃ/ vs /ʃ/', tip: 'CH commence par un T explosif ; SH est continu.', sentence: 'Cheap ships carry cheap chips.' },
  { id: 'p11', a: 'wine', b: 'vine', sounds: '/w/ vs /v/', tip: '/w/ : lèvres arrondies, sans toucher les dents.', sentence: 'We went west with wine.' },
  { id: 'p12', a: 'full', b: 'fool', sounds: '/ʊ/ vs /uː/', tip: 'court/long de nouveau.', sentence: 'The fool was full of joy.' },
];

export const READING: ReadingText[] = [...READING_CORE, ...READING_EXTRA];
export const LISTENING: ListeningItem[] = [...LISTENING_CORE, ...LISTENING_EXTRA];
export const PRONUNCIATION: PronunciationPair[] = [...PRONUNCIATION_CORE, ...PRONUNCIATION_EXTRA];

export const RESOURCES: Resource[] = [
  { id: 'bc', name: 'British Council LearnEnglish', url: 'https://learnenglish.britishcouncil.org', skills: ['grammar', 'listening', 'reading', 'writing', 'vocabulary'], levels: ['A1', 'A2', 'B1', 'B2', 'C1'], note: 'Cours gratuits classés par niveau CEFR, avec audio.' },
  { id: 'bbc', name: 'BBC Learning English', url: 'https://www.bbc.co.uk/learningenglish', skills: ['listening', 'vocabulary', 'pronunciation'], levels: ['A2', 'B1', 'B2', 'C1'], note: '6 Minute English et News Review : écoute authentique avec transcriptions.' },
  { id: 'cam', name: 'Cambridge Dictionary', url: 'https://dictionary.cambridge.org', skills: ['vocabulary', 'pronunciation'], levels: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'], note: 'Définitions niveau CEFR, audio UK/US, exemples.' },
  { id: 'eg', name: 'English Grammar in Use (exercices en ligne Cambridge)', url: 'https://www.cambridge.org/elt/englishgrammarinuse', skills: ['grammar'], levels: ['A2', 'B1', 'B2'], note: 'Référence grammaire ; vérifie ce qui est en accès libre.' },
  { id: 'vo', name: 'VOA Learning English', url: 'https://learningenglish.voanews.com', skills: ['listening', 'reading'], levels: ['A2', 'B1', 'B2'], note: 'Actualité en anglais simplifié, audio lent, domaine public US.' },
  { id: 'ted', name: 'TED Talks (sous-titres EN)', url: 'https://www.ted.com/talks', skills: ['listening'], levels: ['B1', 'B2', 'C1'], note: 'Écoute naturelle avec transcriptions interactives.' },
  { id: 'fc', name: 'Forvo', url: 'https://forvo.com', skills: ['pronunciation'], levels: ['A1', 'A2', 'B1', 'B2', 'C1'], note: 'Prononciations de mots par des natifs.' },
  { id: 'yt', name: 'Rachel’s English (YouTube)', url: 'https://www.youtube.com/@rachelsenglish', skills: ['pronunciation'], levels: ['A2', 'B1', 'B2', 'C1'], note: 'Accent américain, liaison, intonation, en détail.' },
  { id: 'ec', name: 'English at Work (BBC)', url: 'https://www.bbc.co.uk/learningenglish/english/features/english-at-work', skills: ['listening', 'vocabulary'], levels: ['B1', 'B2'], note: 'Mini-séries sur l’anglais professionnel.' },
  { id: 'ox', name: 'Oxford Learner’s Dictionaries', url: 'https://www.oxfordlearnersdictionaries.com', skills: ['vocabulary', 'pronunciation'], levels: ['A1', 'A2', 'B1', 'B2', 'C1'], note: 'Oxford 3000/5000 : mots prioritaires par niveau.' },
];
