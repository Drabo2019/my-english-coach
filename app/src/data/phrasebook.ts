export interface PhraseEntry {
  fr: string;
  natural: string;
  alternatives: string[];
  formal: string;
  informal: string;
  explain: string;
}

const p = (fr: string, natural: string, alternatives: string[], formal: string, informal: string, explain: string): PhraseEntry => ({
  fr, natural, alternatives, formal, informal, explain,
});

export const PHRASEBOOK: PhraseEntry[] = [
  p('Je vais vérifier et je te tiens au courant.', 'I’ll check and get back to you.', ['Let me look into it and I’ll let you know.', 'I’ll check and keep you posted.'], 'I will look into this and revert to you shortly.', 'I’ll check and let you know.', '« get back to » = revenir vers quelqu’un. Naturel au travail.'),
  p('Je ne comprends pas.', 'I don’t understand.', ['I don’t get it.', 'I’m not sure I follow.'], 'I’m afraid I don’t follow.', 'I don’t get it.', '« I don’t follow » = je ne suis pas votre raisonnement.'),
  p('Pouvez-vous répéter ?', 'Could you repeat that, please?', ['Sorry, could you say that again?', 'Sorry, I didn’t catch that.'], 'Would you mind repeating that, please?', 'Say that again?', '« I didn’t catch that » = je n’ai pas bien entendu.'),
  p('Je suis en retard.', 'I’m running late.', ['Sorry I’m late.', 'I’ll be a bit late.'], 'I apologise for the delay.', 'I’m running late!', '« running late » = en train d’être en retard (prévenir à l’avance).'),
  p('Je suis d’accord.', 'I agree.', ['That’s true.', 'Exactly.', 'I think so too.'], 'I fully agree with you.', 'Totally!', 'Jamais « I am agree ».'),
  p('Je ne suis pas d’accord.', 'I don’t agree.', ['I see it differently.', 'I’m not so sure.'], 'I’m afraid I don’t agree.', 'Hmm, not really.', 'Adoucir avec « I’m afraid » ou « I see your point, but ».'),
  p('Ça ne marche pas.', 'It doesn’t work.', ['It’s not working.', 'It’s broken.'], 'The system is not functioning properly.', 'It’s not working.', '« it’s not working » = en panne en ce moment.'),
  p('Ça m’est égal.', 'I don’t mind.', ['Either is fine.', 'I’m easy.'], 'I have no preference.', 'Whatever works for you.', '« I don’t care » peut sembler impoli.'),
  p('Je n’ai pas le temps.', 'I don’t have time.', ['I’m too busy right now.', 'I’m pushed for time.'], 'I’m afraid I’m unable to make time.', 'No time, sorry!', 'Pour refuser poliment.'),
  p('J’ai hâte de te voir.', 'I’m looking forward to seeing you.', ['Can’t wait to see you!'], 'I look forward to meeting you.', 'Can’t wait to see you!', 'look forward to + -ing.'),
  p('Qu’est-ce que tu veux dire ?', 'What do you mean?', ['Sorry, what do you mean by that?', 'Could you explain?'], 'Could you clarify what you mean?', 'What do you mean?', ''),
  p('Comment dit-on ça en anglais ?', 'How do you say this in English?', ['What’s this called in English?'], 'How would you say this in English?', 'How do you say this in English?', ''),
  p('Je me suis trompé.', 'I made a mistake.', ['My mistake.', 'I got it wrong.'], 'I apologise, that was my mistake.', 'Oops, my bad.', 'On « makes » une erreur (pas « do »).'),
  p('Pas de problème.', 'No problem.', ['No worries.', 'That’s fine.', 'Don’t worry about it.'], 'That’s perfectly all right.', 'No worries!', ''),
  p('Je n’ai pas encore fini.', 'I haven’t finished yet.', ['I’m still working on it.', 'It’s not done yet.'], 'I have not yet completed it.', 'Not done yet.', 'yet = encore (négatif/question).'),
  p('Ça dépend.', 'It depends.', ['It depends on…', 'That depends.'], 'It depends on several factors.', 'Depends.', ''),
  p('Qu’en penses-tu ?', 'What do you think?', ['What’s your opinion?', 'How do you feel about it?'], 'What are your thoughts on this?', 'What do you think?', ''),
  p('Je voudrais réserver une table.', 'I’d like to book a table.', ['Could I reserve a table?'], 'I would like to make a reservation.', 'Can I book a table?', 'book (UK) / reserve (US).'),
  p('Pouvez-vous m’aider ?', 'Could you help me, please?', ['Can you give me a hand?', 'I need some help.'], 'I would appreciate your assistance.', 'Can you give me a hand?', ''),
  p('Je suis fatigué.', 'I’m tired.', ['I’m exhausted.', 'I’m wiped out.'], 'I’m rather fatigued.', 'I’m wiped out.', ''),
  p('J’ai faim.', 'I’m hungry.', ['I’m starving.'], 'I’d like something to eat.', 'I’m starving!', 'be hungry (pas « have hunger »).'),
  p('J’ai 40 ans.', 'I’m 40 years old.', ['I’m 40.'], 'I am forty years of age.', 'I’m 40.', 'L’âge se dit avec « be ».'),
  p('Je travaille depuis trois ans ici.', 'I’ve worked here for three years.', ['I’ve been working here for three years.'], 'I have been employed here for three years.', 'I’ve been here three years.', 'present perfect + for.'),
  p('Désolé pour le retard.', 'Sorry for the delay.', ['Sorry to keep you waiting.', 'Apologies for the delay.'], 'I apologise for the delay.', 'Sorry I took so long!', ''),
  p('Merci de votre patience.', 'Thank you for your patience.', ['Thanks for bearing with me.'], 'I appreciate your patience.', 'Thanks for waiting!', ''),
  p('Pouvez-vous parler plus lentement ?', 'Could you speak more slowly, please?', ['Could you slow down a bit?'], 'Would you mind speaking a little more slowly?', 'Slow down a bit?', ''),
  p('Je n’ai pas bien entendu.', 'Sorry, I didn’t catch that.', ['Sorry, I missed that.'], 'I beg your pardon?', 'Sorry, what?', ''),
  p('À quelle heure ça commence ?', 'What time does it start?', ['When does it start?'], 'At what time does it begin?', 'What time’s it start?', ''),
  p('Je suis en réunion.', 'I’m in a meeting.', ['I’m tied up at the moment.'], 'I am currently in a meeting.', 'I’m in a meeting.', ''),
  p('Je vais prendre un café.', 'I’ll have a coffee.', ['Could I have a coffee, please?'], 'I would like a coffee, please.', 'Coffee for me.', 'Au restaurant : I’ll have…'),
  p('On se voit demain.', 'See you tomorrow.', ['Talk to you tomorrow.'], 'I look forward to seeing you tomorrow.', 'See ya tomorrow!', ''),
  p('Ça fait longtemps !', 'It’s been a while!', ['Long time no see!', 'It’s been ages!'], 'It has been some time since we last met.', 'Long time no see!', 'present perfect.'),
  p('Je ne sais pas.', 'I don’t know.', ['I have no idea.', 'I’m not sure.'], 'I’m afraid I don’t know.', 'No idea.', ''),
  p('Je suis perdu.', 'I’m lost.', ['I think I’m lost.'], 'Excuse me, I seem to have lost my way.', 'I’m totally lost.', ''),
  p('Où sont les toilettes ?', 'Where is the bathroom?', ['Where are the restrooms?', 'Where’s the toilet?'], 'Could you tell me where the restroom is?', 'Where’s the bathroom?', 'US : bathroom/restroom ; UK : toilet/loo.'),
  p('Je voudrais un remboursement.', 'I’d like a refund, please.', ['Could I get my money back?'], 'I would like to request a refund.', 'Can I get my money back?', ''),
  p('Il faut que j’y aille.', 'I have to go.', ['I need to get going.', 'I should get going.'], 'I’m afraid I must leave now.', 'Gotta go!', ''),
  p('Tu peux me rappeler ?', 'Can you call me back?', ['Could you ring me back?'], 'Could you please return my call?', 'Call me back?', 'call back (US) / ring back (UK).'),
  p('Laisse-moi réfléchir.', 'Let me think about it.', ['Give me a minute to think.'], 'Allow me some time to consider.', 'Let me think.', ''),
  p('Je suis content de te voir.', 'It’s good to see you.', ['Nice to see you.'], 'It is a pleasure to see you.', 'Great to see you!', ''),
  p('Qu’est-ce qui se passe ?', 'What’s going on?', ['What’s happening?', 'What’s up?'], 'What seems to be the matter?', 'What’s up?', ''),
];

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2);

export function findPhrase(frQuery: string): { entry: PhraseEntry; score: number } | null {
  const q = new Set(norm(frQuery));
  if (q.size === 0) return null;
  let best: { entry: PhraseEntry; score: number } | null = null;
  for (const entry of PHRASEBOOK) {
    const t = new Set(norm(entry.fr));
    let hit = 0;
    q.forEach((w) => t.has(w) && hit++);
    const score = hit / Math.max(q.size, t.size);
    if (!best || score > best.score) best = { entry, score };
  }
  return best && best.score >= 0.4 ? best : null;
}
