import type { FindWordsTask, Level, Scenario } from '@/types';

type Turn = { ai: string; hints: string[]; keywords?: string[] };
const sc = (id: string, title: string, icon: string, level: Level, goal: string, persona: string, script: Turn[]): Scenario => ({
  id, title, icon, level, goal, persona, opening: script[0].ai, script,
});

export const SCENARIOS_EXTRA: Scenario[] = [
  sc('first-day', 'First day at work', '🆕', 'A2', 'Se présenter à une nouvelle équipe', 'a friendly new teammate showing you around', [
    { ai: 'Hi, you must be the new person! I’m Chris. What’s your name?', hints: ['"Hi Chris, I’m…"', '"Nice to meet you."'], keywords: ['name', 'nice', 'meet'] },
    { ai: 'Welcome! What will you be working on?', hints: ['"I’ll be working on…"', 'Say your role or project'], keywords: ['working', 'test', 'project', 'engineer'] },
    { ai: 'Great. Have you found the coffee machine yet?', hints: ['"Not yet. Where is it?"', '"Yes, thanks."'], keywords: ['where', 'not yet', 'yes'] },
    { ai: 'It’s next to the kitchen. Let me know if you need anything!', hints: ['"Thanks, that’s very kind."', '"I will, thank you."'], keywords: ['thanks', 'thank', 'kind'] },
  ]),
  sc('bank', 'At the bank', '🏦', 'B1', 'Ouvrir un compte / poser une question', 'a bank adviser', [
    { ai: 'Good morning. How can I help you today?', hints: ['"I’d like to open a bank account."', '"I have a question about…"'], keywords: ['open', 'account', 'question', 'like'] },
    { ai: 'Of course. Do you have proof of address with you?', hints: ['"Yes, here you are."', '"I have an electricity bill."'], keywords: ['yes', 'here', 'bill', 'proof'] },
    { ai: 'Thank you. Would you like a debit card with it?', hints: ['"Yes, please."', '"What are the fees?"'], keywords: ['yes', 'fees', 'card', 'please'] },
    { ai: 'There’s no monthly fee. Is there anything else I can do for you?', hints: ['"No, that’s all, thank you."', '"How long will the card take?"'], keywords: ['no', 'thank', 'how long'] },
  ]),
  sc('rent-flat', 'Renting an apartment', '🏠', 'B1', 'Visiter et poser des questions sur un logement', 'a landlord showing a flat', [
    { ai: 'Hello! Welcome. Shall I show you around?', hints: ['"Yes, please."', '"Thanks for meeting me."'], keywords: ['yes', 'please', 'thanks'] },
    { ai: 'This is the living room. Do you have any questions so far?', hints: ['"How much is the rent?"', '"Is it furnished?"'], keywords: ['rent', 'furnished', 'how much'] },
    { ai: 'The rent is nine hundred a month, bills not included. Is that okay?', hints: ['"It’s a bit above my budget."', '"That sounds fine."'], keywords: ['budget', 'fine', 'above', 'bills'] },
    { ai: 'We could discuss the price. When would you like to move in?', hints: ['"As soon as possible."', '"At the beginning of next month."'], keywords: ['soon', 'month', 'move'] },
  ]),
  sc('conference', 'Networking at a conference', '🎤', 'B1', 'Faire connaissance lors d’un événement pro', 'a professional you meet at a conference coffee break', [
    { ai: 'Hi there! Is this your first time at this conference?', hints: ['"Yes, it is."', '"No, I came last year."'], keywords: ['yes', 'first', 'last year'] },
    { ai: 'So, what do you do?', hints: ['"I work as… in the field of…"', 'Say your job and company type'], keywords: ['work', 'engineer', 'field', 'company'] },
    { ai: 'That sounds interesting. What’s the biggest challenge in your job right now?', hints: ['"One challenge is…"', '"We’re struggling with…"'], keywords: ['challenge', 'time', 'struggling', 'problem'] },
    { ai: 'I see. Here’s my card. We should stay in touch!', hints: ['"Thanks, I’ll send you an email."', '"Let’s connect on LinkedIn."'], keywords: ['thanks', 'email', 'connect', 'touch'] },
  ]),
  sc('tech-meeting', 'Technical meeting', '🔧', 'B2', 'Expliquer un problème technique à l’équipe', 'an engineering lead in a troubleshooting meeting', [
    { ai: 'Can you summarise where we are with the failing unit?', hints: ['"So far, we’ve found that…"', '"The unit fails when…"'], keywords: ['found', 'fails', 'when', 'unit'] },
    { ai: 'What have you tried so far?', hints: ['"We’ve tried replacing…"', '"I checked the… and the…"'], keywords: ['tried', 'replaced', 'checked'] },
    { ai: 'And what do you think the root cause is?', hints: ['"I suspect that…"', '"It could be caused by…"'], keywords: ['suspect', 'caused', 'could', 'because'] },
    { ai: 'What do you need from us to move forward?', hints: ['"I’d need access to…"', '"Could someone help me with…?"'], keywords: ['need', 'access', 'help', 'could'] },
  ]),
  sc('presentation', 'Giving a presentation', '📽️', 'B2', 'Présenter des résultats devant un groupe', 'an audience member asking questions after your talk', [
    { ai: 'Thank you for the presentation. Could you explain the second graph again?', hints: ['"Of course. This graph shows…"', '"As you can see…"'], keywords: ['shows', 'graph', 'see', 'course'] },
    { ai: 'How reliable are these numbers?', hints: ['"We measured it ten times."', '"The margin of error is about…"'], keywords: ['measured', 'times', 'error', 'reliable'] },
    { ai: 'What would be the next step?', hints: ['"The next step is to…"', '"We plan to…"'], keywords: ['next', 'plan', 'step'] },
  ]),
  sc('return-item', 'Returning an item', '↩️', 'A2', 'Rendre un article défectueux', 'a shop assistant at the returns desk', [
    { ai: 'Hello, can I help you?', hints: ['"I’d like to return this."', '"This doesn’t work."'], keywords: ['return', 'doesn', 'work'] },
    { ai: 'Of course. Do you have the receipt?', hints: ['"Yes, here it is."', '"I’m afraid I lost it."'], keywords: ['yes', 'here', 'lost', 'receipt'] },
    { ai: 'What’s the problem with it?', hints: ['"It stopped working after…"', '"The screen is broken."'], keywords: ['stopped', 'broken', 'screen', 'working'] },
    { ai: 'Would you like a refund or an exchange?', hints: ['"A refund, please."', '"An exchange, please."'], keywords: ['refund', 'exchange', 'please'] },
  ]),
  sc('pharmacy', 'At the pharmacy', '💊', 'A2', 'Demander un médicament', 'a pharmacist', [
    { ai: 'Hello. What can I get for you?', hints: ['"I’ve got a headache."', '"Do you have something for a cold?"'], keywords: ['headache', 'cold', 'something', 'cough'] },
    { ai: 'How long have you had it?', hints: ['"Since yesterday."', '"For two days."'], keywords: ['since', 'for', 'days', 'yesterday'] },
    { ai: 'Are you allergic to anything?', hints: ['"No, nothing."', '"Yes, I’m allergic to…"'], keywords: ['no', 'yes', 'allergic'] },
    { ai: 'Take one tablet twice a day, after meals. Anything else?', hints: ['"No, that’s all. Thank you."', '"How much is it?"'], keywords: ['thank', 'how much', 'no'] },
  ]),
  sc('hotel-problem', 'Hotel: a problem in the room', '🛎️', 'B1', 'Signaler un problème à la réception', 'a hotel receptionist', [
    { ai: 'Reception, good evening. How can I help?', hints: ['"I’m calling from room 204."', '"There’s a problem with…"'], keywords: ['room', 'problem', 'calling'] },
    { ai: 'I’m sorry to hear that. What exactly is the problem?', hints: ['"The air conditioning doesn’t work."', '"There’s no hot water."'], keywords: ['air', 'water', 'work', 'hot'] },
    { ai: 'I’ll send someone right away. Would you like to move to another room?', hints: ['"Yes, if possible."', '"No, thanks, I’ll wait."'], keywords: ['yes', 'no', 'possible', 'wait'] },
  ]),
  sc('gym', 'At the gym', '🏋️', 'A2', 'S’inscrire et poser des questions', 'a gym receptionist', [
    { ai: 'Hi! Are you interested in a membership?', hints: ['"Yes, I’d like to join."', '"Could I try it first?"'], keywords: ['join', 'try', 'yes', 'membership'] },
    { ai: 'We have monthly and yearly plans. Which one would you prefer?', hints: ['"What’s the difference?"', '"The monthly one, please."'], keywords: ['monthly', 'yearly', 'difference', 'prefer'] },
    { ai: 'Monthly is thirty euros. Do you want to start today?', hints: ['"Yes, I’ll start today."', '"I’ll think about it."'], keywords: ['start', 'today', 'think'] },
  ]),
];

export const FIND_WORDS_EXTRA: FindWordsTask[] = [
  { id: 'fw9', level: 'A2', situation: 'You are in a shop. You want to know if they have a bigger size.', hints: ['Start with: "Do you have…"', '"Do you have this in…"', 'a bigger size'], model: 'Do you have this in a bigger size?', keywords: ['have', 'bigger'] },
  { id: 'fw10', level: 'B1', situation: 'Your colleague asks how the project is going. It is going well but you are a bit late.', hints: ['Start with: "It’s going…"', '"It’s going well, but…"', 'a bit behind schedule'], model: 'It’s going well, but we’re a bit behind schedule.', keywords: ['well', 'behind'] },
  { id: 'fw11', level: 'B1', situation: 'You need to ask a colleague to send you a file today.', hints: ['Start with: "Could you…"', '"Could you send me…"', 'by the end of the day'], model: 'Could you send me the file by the end of the day?', keywords: ['could', 'send'] },
  { id: 'fw12', level: 'B1', situation: 'The waiter brought you the wrong dish. Tell him politely.', hints: ['Start with: "Excuse me…"', '"Excuse me, I think…"', 'this isn’t what I ordered'], model: 'Excuse me, I think this isn’t what I ordered.', keywords: ['excuse', 'ordered'] },
  { id: 'fw13', level: 'B2', situation: 'In a meeting, you want to politely disagree with the schedule.', hints: ['Start with: "I’m afraid…"', '"I’m afraid I’m not sure…"', 'realistic'], model: 'I’m afraid I’m not sure that schedule is realistic.', keywords: ['afraid', 'realistic'] },
  { id: 'fw14', level: 'A2', situation: 'You don’t understand a word. Ask what it means.', hints: ['Start with: "Sorry…"', '"Sorry, what does…"', 'mean'], model: 'Sorry, what does this word mean?', keywords: ['sorry', 'mean'] },
  { id: 'fw15', level: 'B1', situation: 'You want to postpone a meeting by one day.', hints: ['Start with: "Would it be possible…"', '"Would it be possible to…"', 'move it to tomorrow'], model: 'Would it be possible to move the meeting to tomorrow?', keywords: ['possible', 'move'] },
  { id: 'fw16', level: 'B2', situation: 'Explain to a customer that the product will be delivered late because of a supplier problem.', hints: ['Start with: "Unfortunately…"', '"Unfortunately, the delivery…"', 'because of a problem with our supplier'], model: 'Unfortunately, the delivery will be late because of a problem with our supplier.', keywords: ['unfortunately', 'because'] },
];
