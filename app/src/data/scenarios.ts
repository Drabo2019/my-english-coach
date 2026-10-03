import type { FindWordsTask, Level, Scenario } from '@/types';

type Turn = { ai: string; hints: string[]; keywords?: string[] };
const sc = (id: string, title: string, icon: string, level: Level, goal: string, persona: string, script: Turn[]): Scenario => ({
  id, title, icon, level, goal, persona, opening: script[0].ai, script,
});

export const SCENARIOS: Scenario[] = [
  sc('smalltalk', 'Casual conversation', '☕', 'A2', 'Parler de sa journée', 'a friendly person chatting casually', [
    { ai: 'Hi! How was your day?', hints: ['Start with: "It was…"', 'Use: good / busy / tiring'], keywords: ['good', 'busy', 'fine', 'tired', 'great'] },
    { ai: 'Oh nice. What did you do today?', hints: ['Use the past: "I went…", "I worked…"', 'Say one thing you did'], keywords: ['went', 'worked', 'did', 'was'] },
    { ai: 'That sounds interesting. What are you going to do this evening?', hints: ['"I’m going to…"', 'Ideas: cook, relax, watch a film'], keywords: ['going', 'will', 'cook', 'watch', 'relax'] },
    { ai: 'Sounds good. Do you have any plans for the weekend?', hints: ['"I’m planning to…"', '"Nothing special."'], keywords: ['weekend', 'plan', 'going'] },
  ]),
  sc('work-test', 'At work: the delayed test', '🛠️', 'B1', 'Expliquer un retard à un collègue', 'a colleague who asks about a delayed test', [
    { ai: 'Hi! Why is the test delayed?', hints: ['Start with: "The test has been delayed because…"', 'Reason: a hardware issue / a missing part'], keywords: ['because', 'delayed', 'issue', 'problem'] },
    { ai: 'I see. When do you think it will be ready?', hints: ['"It should be ready by…"', 'Use: tomorrow / next week'], keywords: ['ready', 'should', 'tomorrow', 'week'] },
    { ai: 'Do you need any help from me?', hints: ['"Yes, could you…"', '"No, I can handle it."'], keywords: ['help', 'could', 'need', 'handle'] },
    { ai: 'Okay. Please keep me updated.', hints: ['"I’ll let you know as soon as…"'], keywords: ['let', 'know', 'update'] },
  ]),
  sc('interview', 'Job interview', '💼', 'B1', 'Se présenter en entretien', 'an interviewer at a technology company', [
    { ai: 'Thanks for coming. Tell me about yourself.', hints: ['"I’m a… with … years of experience."', 'Say your job, your experience'], keywords: ['experience', 'work', 'engineer', 'years'] },
    { ai: 'What are your main strengths?', hints: ['"I’m very…" (organised / reliable)', '"I’m good at…"'], keywords: ['good', 'strength', 'organised', 'reliable'] },
    { ai: 'Tell me about a difficult problem you solved.', hints: ['Use the past: "We had a problem with…"', '"I solved it by…"'], keywords: ['problem', 'solved', 'had', 'by'] },
    { ai: 'Why do you want to work here?', hints: ['"I’m interested in…"', '"I’d like to…"'], keywords: ['interested', 'want', 'like', 'learn'] },
  ]),
  sc('restaurant', 'Restaurant', '🍽️', 'A2', 'Commander un repas', 'a waiter in a restaurant', [
    { ai: 'Good evening! Are you ready to order?', hints: ['"I’d like…, please."', 'Ex: the soup, the chicken'], keywords: ['like', 'please', 'have'] },
    { ai: 'Would you like something to drink?', hints: ['"Just water, please."', '"Could I have a…?"'], keywords: ['water', 'could', 'please'] },
    { ai: 'Is everything okay with your meal?', hints: ['"Yes, it’s delicious."', '"Actually, …"'], keywords: ['yes', 'delicious', 'good', 'actually'] },
    { ai: 'Can I get you anything else?', hints: ['"Could we have the bill, please?"'], keywords: ['bill', 'check', 'no'] },
  ]),
  sc('airport', 'Airport', '✈️', 'A2', 'Enregistrement à l’aéroport', 'an airline check-in agent', [
    { ai: 'Good morning. Where are you flying today?', hints: ['"I’m flying to…"'], keywords: ['flying', 'to'] },
    { ai: 'May I see your passport, please?', hints: ['"Here you are."'], keywords: ['here', 'passport'] },
    { ai: 'Do you have any bags to check in?', hints: ['"Yes, one suitcase."', '"No, only hand luggage."'], keywords: ['bag', 'suitcase', 'luggage', 'yes', 'no'] },
    { ai: 'Would you prefer a window or an aisle seat?', hints: ['"I’d prefer…"'], keywords: ['window', 'aisle', 'prefer'] },
  ]),
  sc('doctor', 'Doctor', '🩺', 'A2', 'Décrire un problème de santé', 'a doctor in a clinic', [
    { ai: 'Hello. What seems to be the problem?', hints: ['"I have a…" (headache / sore throat)', '"I don’t feel well."'], keywords: ['have', 'feel', 'pain', 'headache', 'throat'] },
    { ai: 'How long have you had these symptoms?', hints: ['"For two days." / "Since Monday."'], keywords: ['for', 'since', 'days'] },
    { ai: 'Are you taking any medication?', hints: ['"No, nothing." / "Yes, …"'], keywords: ['no', 'yes', 'medication', 'medicine'] },
    { ai: 'I’ll give you a prescription. Take it twice a day.', hints: ['"Thank you. How long should I take it?"'], keywords: ['thank', 'how long'] },
  ]),
  sc('meeting', 'Meeting: give your opinion', '📊', 'B1', 'Donner son avis sur une proposition', 'a project manager in a meeting', [
    { ai: 'What do you think about this proposal?', hints: ['"In my opinion…"', '"I think it’s a good idea, but…"'], keywords: ['think', 'opinion', 'idea', 'but'] },
    { ai: 'Interesting. Do you see any risks?', hints: ['"One risk is…"', '"My concern is…"'], keywords: ['risk', 'concern', 'problem'] },
    { ai: 'How would you solve it?', hints: ['"We could…" / "I suggest…"'], keywords: ['could', 'suggest', 'should'] },
    { ai: 'Great. Can you send us a short summary?', hints: ['"Sure, I’ll send it by…"'], keywords: ['sure', 'send', 'will'] },
  ]),
  sc('disagree', 'Difficult conversation', '🗣️', 'B2', 'Expliquer poliment son désaccord', 'a colleague who proposes a plan you disagree with', [
    { ai: 'I think we should skip the final test to save time. Do you agree?', hints: ['"I see your point, but…"', '"I’m afraid I disagree."'], keywords: ['disagree', 'but', 'afraid', 'point'] },
    { ai: 'Why not? It would save us two days.', hints: ['"Because if… we could…"', 'Talk about risk and quality'], keywords: ['because', 'risk', 'quality', 'if'] },
    { ai: 'Hmm. So what do you suggest instead?', hints: ['"Instead, we could…"', '"What if we…?"'], keywords: ['instead', 'suggest', 'could', 'what if'] },
  ]),
  sc('phone-support', 'Calling customer support', '📞', 'B1', 'Expliquer un problème par téléphone', 'a customer support agent', [
    { ai: 'Hello, customer support. How can I help you?', hints: ['"I’m calling about…"', '"I have a problem with…"'], keywords: ['calling', 'problem', 'about'] },
    { ai: 'Could you describe the problem in more detail?', hints: ['"It doesn’t… / It keeps…"'], keywords: ['doesn', 'keeps', 'stopped', 'when'] },
    { ai: 'Have you tried restarting it?', hints: ['"Yes, I’ve tried, but…"'], keywords: ['tried', 'yes', 'no'] },
    { ai: 'I’ll send a technician. Can I take your address?', hints: ['"Sure. It’s…"'], keywords: ['sure', 'address'] },
  ]),
  sc('hotel', 'Hotel', '🏨', 'A2', 'Réserver / s’enregistrer à l’hôtel', 'a hotel receptionist', [
    { ai: 'Welcome to the Grand Hotel. Do you have a reservation?', hints: ['"Yes, under the name…"', '"No, I’d like to book a room."'], keywords: ['reservation', 'name', 'book', 'room'] },
    { ai: 'How many nights will you stay?', hints: ['"Three nights."'], keywords: ['night', 'three', 'two', 'stay'] },
    { ai: 'Breakfast is from seven to ten. Is there anything else?', hints: ['"What time is check-out?"', '"Is there Wi-Fi?"'], keywords: ['check', 'wifi', 'wi-fi', 'time'] },
  ]),
  sc('smalltalk-work', 'Coffee with colleagues', '🥤', 'B1', 'Faire la conversation entre collègues', 'a friendly colleague at the coffee machine', [
    { ai: 'Hey! How was your weekend?', hints: ['"It was great, thanks. I…"', 'Say one thing you did'], keywords: ['weekend', 'was', 'went', 'did'] },
    { ai: 'Nice! Any plans for the summer?', hints: ['"I’m thinking about…"', '"Not yet."'], keywords: ['plan', 'thinking', 'going', 'not yet'] },
    { ai: 'By the way, did you see the new schedule?', hints: ['"Not yet, what changed?"', '"Yes, I did."'], keywords: ['yes', 'no', 'not yet', 'schedule'] },
  ]),
];

export const FIND_WORDS: FindWordsTask[] = [
  { id: 'fw1', level: 'B1', situation: 'You are at work. Your colleague asks you why the test is delayed.', hints: ['Start with: "The test…"', '"The test has been…"', 'delayed'], model: 'The test has been delayed because we are waiting for a part.', keywords: ['delayed', 'because'] },
  { id: 'fw2', level: 'A2', situation: 'You are in a café. You want to order a coffee with milk.', hints: ['Start with: "I’d like…"', '"I’d like a…"', 'coffee with milk'], model: 'I’d like a coffee with milk, please.', keywords: ['like', 'coffee'] },
  { id: 'fw3', level: 'B1', situation: 'A customer asks if you can finish the report today. You can’t.', hints: ['Start with: "I’m afraid…"', '"I’m afraid I can’t…"', 'by tomorrow'], model: 'I’m afraid I can’t finish it today, but I can send it by tomorrow morning.', keywords: ['afraid', 'tomorrow'] },
  { id: 'fw4', level: 'B1', situation: 'You didn’t understand what your manager said. Ask for clarification.', hints: ['Start with: "Sorry…"', '"Sorry, could you…"', 'repeat / clarify'], model: 'Sorry, could you repeat that or explain it again?', keywords: ['sorry', 'could', 'repeat'] },
  { id: 'fw5', level: 'A2', situation: 'You arrive late to a meeting. Apologise.', hints: ['Start with: "Sorry…"', '"Sorry I’m…"', 'late'], model: 'Sorry I’m late. The traffic was terrible.', keywords: ['sorry', 'late'] },
  { id: 'fw6', level: 'B2', situation: 'You disagree with a colleague’s idea but want to stay polite.', hints: ['Start with: "I see…"', '"I see your point, but…"', 'I’m not sure it will work'], model: 'I see your point, but I’m not sure it will work in practice.', keywords: ['point', 'but'] },
  { id: 'fw7', level: 'B1', situation: 'You are on the phone. The line is bad. Ask the other person to speak up.', hints: ['Start with: "Sorry…"', '"Sorry, the line…"', 'speak up'], model: 'Sorry, the line is bad. Could you speak up a little?', keywords: ['line', 'could'] },
  { id: 'fw8', level: 'B1', situation: 'Tell your boss you will check something and come back to them.', hints: ['Start with: "I’ll…"', '"I’ll check and…"', 'get back to you'], model: 'I’ll check and get back to you this afternoon.', keywords: ['check', 'back'] },
];
