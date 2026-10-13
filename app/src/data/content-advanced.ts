import type { FindWordsTask, ListeningItem, ReadingText } from '@/types';

// Batch 5 (0.5): advanced reading / listening / speaking tasks (C1-C2). ids continue the sequences.

export const READING_ADVANCED: ReadingText[] = [
  {
    id: 'r21', title: 'The paradox of choice at work', level: 'C1',
    text: 'Organisations often assume that giving employees more options leads to better decisions. Research suggests otherwise: when faced with an abundance of alternatives, people tend to postpone choosing, or regret what they chose. This is not to say that autonomy is unwelcome; rather, it implies that structure matters. Teams that narrow the field to three or four well-defined options, and set a clear deadline, typically decide faster and report greater satisfaction with the outcome.',
    questions: [
      { q: 'What does the research suggest?', options: ['More options always improve decisions', 'Too many options can delay or spoil decisions', 'Employees dislike autonomy'], answer: 1 },
      { q: 'What does the author conclude about autonomy?', options: ['It should be removed', 'It is fine, but needs structure', 'It has no effect'], answer: 1 },
      { q: 'What do effective teams do?', options: ['Offer unlimited choices', 'Limit the options and set a deadline', 'Avoid deadlines'], answer: 1 },
    ],
  },
  {
    id: 'r22', title: 'A cautious forecast', level: 'C1',
    text: 'The central bank has stopped short of promising rate cuts, noting that inflation, while easing, remains stubbornly above target in services. Officials were at pains to stress that decisions would be data-dependent. Analysts, for their part, read the statement as a mild signal that a cut is more likely than not by autumn, provided energy prices do not rebound. Markets reacted calmly, which suggests that the message was largely anticipated.',
    questions: [
      { q: 'What did the central bank do?', options: ['Promised rate cuts', 'Avoided committing to cuts', 'Raised rates'], answer: 1 },
      { q: 'What is the condition for a cut by autumn, according to analysts?', options: ['Energy prices not rebounding', 'Higher services prices', 'A change of officials'], answer: 0 },
      { q: 'Why did markets react calmly?', options: ['The statement was largely expected', 'They ignored it', 'Rates were cut'], answer: 0 },
    ],
  },
  {
    id: 'r23', title: 'On being understood', level: 'C2',
    text: 'It is a curious feature of expertise that those who possess it are often the worst placed to convey it. Having long since internalised the steps, the specialist skips them, so that an explanation which feels exhaustive to her reads, to the novice, as a series of leaps. Hence the paradox: the more fluent one becomes, the greater the effort required to remember what it was like not to be. Good teachers, it would seem, are not those who know the most, but those who have kept the memory of their own confusion within reach.',
    questions: [
      { q: 'Why do experts explain badly, according to the text?', options: ['They do not know enough', 'They have forgotten what it is like to be a beginner', 'They dislike teaching'], answer: 1 },
      { q: 'What is the “paradox”?', options: ['Fluency makes empathy with beginners harder', 'Novices learn faster than experts', 'Teaching requires no expertise'], answer: 0 },
      { q: 'What marks a good teacher?', options: ['The most knowledge', 'Remembering their own confusion', 'Skipping steps'], answer: 1 },
    ],
  },
  {
    id: 'r24', title: 'Remote work: the second-order effects', level: 'C1',
    text: 'The immediate benefits of remote work are well documented: no commute, greater flexibility, a wider hiring pool. Less attention has been paid to the second-order effects. Informal knowledge-sharing, which used to happen by chance at the coffee machine, now has to be engineered deliberately. Junior staff, in particular, miss the opportunity to learn by observation. Companies that thrive in this model tend to over-invest in documentation and in regular, structured check-ins, rather than assuming that goodwill will fill the gap.',
    questions: [
      { q: 'What is the text mainly about?', options: ['Why remote work should be abolished', 'Less obvious consequences of remote work', 'How to reduce commuting costs'], answer: 1 },
      { q: 'Who is especially affected, according to the text?', options: ['Senior managers', 'Junior staff', 'Customers'], answer: 1 },
      { q: 'What do successful companies do?', options: ['Rely on goodwill', 'Invest in documentation and structured check-ins', 'Stop hiring'], answer: 1 },
    ],
  },
  {
    id: 'r25', title: 'A measured reply', level: 'C1',
    text: 'Thank you for your detailed feedback, which we have read with interest. While we recognise the concerns you raise regarding the delivery schedule, we would respectfully point out that the delays stemmed from a supplier failure beyond our control. That said, we accept that our communication could have been clearer, and we have since put in place a weekly status update to ensure that such situations are flagged earlier.',
    questions: [
      { q: 'How does the writer treat the delays?', options: ['Accepts full responsibility', 'Explains they were caused by a supplier', 'Denies there were delays'], answer: 1 },
      { q: 'What does the writer admit?', options: ['Nothing', 'Communication could have been better', 'The supplier was chosen badly'], answer: 1 },
      { q: 'What has changed?', options: ['A new supplier', 'A weekly status update', 'A refund policy'], answer: 1 },
    ],
  },
];

export const LISTENING_ADVANCED: ListeningItem[] = [
  {
    id: 'l21', level: 'C1', accent: 'uk',
    text: 'I take your point about the timeline, but I’d be wary of cutting the testing phase. We did that last year, and it came back to bite us. If anything, I’d argue we should add a week.',
    questions: [
      { q: 'What does the speaker want?', options: ['To cut testing', 'To keep or extend testing', 'To drop the project'], answer: 1 },
      { q: 'What happened last year?', options: ['Cutting testing caused problems', 'The team added a week', 'The project was cancelled'], answer: 0 },
    ],
  },
  {
    id: 'l22', level: 'C1', accent: 'us',
    text: 'So the upshot is, we’re not going to hit the target this quarter, but we’re not far off either. Provided the supplier delivers on the fifteenth, we should be back on track by the end of next month.',
    questions: [
      { q: 'What is the situation?', options: ['The target was met', 'Slightly behind, recoverable', 'The project is cancelled'], answer: 1 },
      { q: 'What does recovery depend on?', options: ['The supplier delivering on the fifteenth', 'A budget increase', 'A new manager'], answer: 0 },
    ],
  },
  {
    id: 'l23', level: 'C2', accent: 'uk',
    text: 'Well, it isn’t that I’m opposed to the idea as such; it’s rather that I can’t see how it squares with what we told the board in March. Had we not made those commitments, I’d be the first to back it.',
    questions: [
      { q: 'What is the speaker’s position?', options: ['Totally opposed', 'Reluctant because of earlier commitments', 'Enthusiastic supporter'], answer: 1 },
      { q: 'When would the speaker support it?', options: ['If they had not made commitments to the board', 'If the board agreed', 'If it were cheaper'], answer: 0 },
    ],
  },
];

export const FIND_WORDS_ADVANCED: FindWordsTask[] = [
  { id: 'fw17', level: 'C1', situation: 'A client asks for a discount. You want to decline politely but keep the door open.', hints: ['Start with: "I’m afraid…"', '"I’m afraid we can’t…" then offer something', 'in return for…'], model: 'I’m afraid we can’t lower the price, but we could extend the contract in return for a longer commitment.', keywords: ['afraid', 'could', 'in return'] },
  { id: 'fw18', level: 'C1', situation: 'You disagree with your manager’s plan in a meeting, diplomatically.', hints: ['Start with: "I take your point…"', '"I take your point, but…"', 'a concern about the timeline'], model: 'I take your point, but I have a concern about the timeline; I’m not sure it leaves enough room for testing.', keywords: ['point', 'concern', 'timeline'] },
  { id: 'fw19', level: 'C1', situation: 'You need to summarise a long discussion in one sentence at the end of a meeting.', hints: ['Start with: "To sum up…"', '"To sum up, we agreed…"', 'who will confirm what, by when'], model: 'To sum up, we agreed to freeze the scope, and Sarah will confirm the owners by Friday.', keywords: ['sum up', 'agreed'] },
  { id: 'fw20', level: 'C2', situation: 'A colleague presents a risky idea. Express reservations without sounding negative.', hints: ['Start with: "I can see the appeal…"', '"…but I wonder whether…"', 'the implications'], model: 'I can see the appeal, but I wonder whether we’ve fully considered the implications for the team.', keywords: ['appeal', 'wonder', 'implications'] },
  { id: 'fw21', level: 'C2', situation: 'You were misquoted in an article and want to correct it politely but firmly.', hints: ['Start with: "I’d like to clarify…"', '"What I actually said was…"', 'out of context'], model: 'I’d like to clarify that what I actually said was taken out of context; my point was quite the opposite.', keywords: ['clarify', 'actually', 'context'] },
];
