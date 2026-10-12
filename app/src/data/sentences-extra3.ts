import type { Level, Register, Sentence } from '@/types';

// Batch 4. Own id space (v0001…). Targets gaps in: French-speaker traps, spontaneous speech, fillers.
let n = 0;
function s(situation: string, level: Level, en: string, fr: string, grammar?: string, register: Register = 'neutral', alt?: string): Sentence {
  n += 1;
  return { id: `v${String(n).padStart(4, '0')}`, en, fr, level, situation, register, grammar, alt };
}

export const SENTENCES_EXTRA3: Sentence[] = [
  // Natural fillers and gaining time (key for "I can't find my words")
  s('fluency', 'A2', 'Let me think for a second.', 'Laisse-moi réfléchir une seconde.', 'modal'),
  s('fluency', 'A2', 'How can I put it?', 'Comment dire ?', 'questions'),
  s('fluency', 'B1', 'What I mean is, we need more time.', 'Ce que je veux dire, c’est qu’il nous faut plus de temps.', 'relative clauses'),
  s('fluency', 'B1', 'Let me rephrase that.', 'Laissez-moi reformuler.', 'modal'),
  s('fluency', 'B1', 'It’s hard to explain, but I’ll try.', 'C’est difficile à expliquer, mais je vais essayer.', 'linking words'),
  s('fluency', 'B1', 'Sorry, what was the word? It’s on the tip of my tongue.', 'Désolé, c’était quoi le mot ? Je l’ai sur le bout de la langue.', 'idiom'),
  s('fluency', 'B1', 'Well, to be honest, I’m not really sure.', 'Eh bien, pour être honnête, je ne suis pas vraiment sûr.', 'fillers'),
  s('fluency', 'B1', 'You know what I mean?', 'Tu vois ce que je veux dire ?', 'questions', 'informal'),
  s('fluency', 'B1', 'In other words, it’s too risky.', 'Autrement dit, c’est trop risqué.', 'linking words'),
  s('fluency', 'B2', 'Let me get back to that in a moment.', 'Je reviens là-dessus dans un instant.', 'modal'),
  s('fluency', 'B2', 'That’s a good question. Let me think about how to answer.', 'C’est une bonne question. Je réfléchis à la façon de répondre.', 'indirect questions'),
  s('fluency', 'B2', 'What I’m trying to say is that we can’t rush this.', 'Ce que j’essaie de dire, c’est qu’on ne peut pas précipiter ça.', 'relative clauses'),
  // French-speaker traps, shown as correct models
  s('traps', 'A2', 'I’m 40 years old.', 'J’ai 40 ans.', 'be vs have'),
  s('traps', 'A2', 'I agree with you.', 'Je suis d’accord avec toi.', 'verb'),
  s('traps', 'A2', 'I’ve been working here for two years.', 'Je travaille ici depuis deux ans.', 'for / since'),
  s('traps', 'A2', 'She’s an engineer.', 'Elle est ingénieure.', 'articles'),
  s('traps', 'B1', 'Could you give me some information?', 'Pourriez-vous me donner des informations ?', 'uncountable'),
  s('traps', 'B1', 'I’m waiting for the bus.', 'J’attends le bus.', 'wait for'),
  s('traps', 'B1', 'Can you explain it to me?', 'Peux-tu me l’expliquer ?', 'prepositions'),
  s('traps', 'B1', 'It depends on the weather.', 'Ça dépend de la météo.', 'prepositions'),
  s('traps', 'B1', 'I’m currently working on a new project.', 'Je travaille actuellement sur un nouveau projet.', 'false friends'),
  s('traps', 'B1', 'Actually, I think you’re right.', 'En fait, je pense que tu as raison.', 'false friends'),
  s('traps', 'B1', 'He told me that he was tired.', 'Il m’a dit qu’il était fatigué.', 'reported speech'),
  s('traps', 'B1', 'I want you to come with me.', 'Je veux que tu viennes avec moi.', 'want + object'),
  s('traps', 'B1', 'I’m used to getting up early.', 'J’ai l’habitude de me lever tôt.', 'be used to'),
  s('traps', 'B1', 'I’m looking forward to seeing you.', 'J’ai hâte de te voir.', 'look forward to'),
  s('traps', 'B1', 'We discussed the problem.', 'Nous avons discuté du problème.', 'transitive verbs'),
  s('traps', 'B1', 'I made a mistake.', 'J’ai fait une erreur.', 'collocations'),
  s('traps', 'B2', 'The people here are very friendly.', 'Les gens d’ici sont très sympathiques.', 'plural'),
  s('traps', 'B2', 'My work is going well.', 'Mon travail se passe bien.', 'uncountable'),
  // Daily-life situations still thin
  s('housing', 'A2', 'The heating doesn’t work.', 'Le chauffage ne marche pas.', 'present simple'),
  s('housing', 'B1', 'When is the rent due?', 'Quand le loyer est-il dû ?', 'questions'),
  s('housing', 'B1', 'Who do I call if there’s a problem?', 'Qui dois-je appeler en cas de problème ?', 'questions'),
  s('housing', 'B1', 'Are bills included in the rent?', 'Les charges sont-elles incluses dans le loyer ?', 'passive'),
  s('bank', 'A2', 'I’d like to withdraw some money.', 'Je voudrais retirer de l’argent.', 'would like'),
  s('bank', 'B1', 'My card has been blocked. What should I do?', 'Ma carte a été bloquée. Que dois-je faire ?', 'passive'),
  s('bank', 'B1', 'I’d like to make a transfer to this account.', 'Je voudrais faire un virement sur ce compte.', 'would like'),
  s('bank', 'B1', 'What’s the exchange rate today?', 'Quel est le taux de change aujourd’hui ?', 'questions'),
  s('post', 'A2', 'I’d like to send this parcel to France.', 'Je voudrais envoyer ce colis en France.', 'would like'),
  s('post', 'B1', 'How long will it take to arrive?', 'Combien de temps mettra-t-il à arriver ?', 'questions'),
  s('post', 'B1', 'Can I get a tracking number?', 'Puis-je avoir un numéro de suivi ?', 'modal'),
  s('transport', 'A2', 'Does this bus go to the city centre?', 'Ce bus va-t-il au centre-ville ?', 'questions'),
  s('transport', 'A2', 'Where do I get off?', 'Où dois-je descendre ?', 'questions'),
  s('transport', 'B1', 'Could you let me know when we get there?', 'Pourriez-vous me prévenir quand nous arrivons ?', 'modal'),
  s('transport', 'B1', 'The train is running about ten minutes late.', 'Le train a environ dix minutes de retard.', 'present continuous'),
  // Work: soft skills and routines
  s('work', 'B1', 'I’d like to give you some feedback on the report.', 'Je voudrais te faire un retour sur le rapport.', 'would'),
  s('work', 'B1', 'Thanks for the feedback. That’s really helpful.', 'Merci pour le retour. C’est vraiment utile.', 'basic'),
  s('work', 'B1', 'I’m not sure I’m the right person for this.', 'Je ne suis pas sûr d’être la bonne personne pour ça.', 'be'),
  s('work', 'B1', 'Could you introduce me to the team?', 'Pourrais-tu me présenter à l’équipe ?', 'modal'),
  s('work', 'B1', 'I’ll circulate the notes after the meeting.', 'Je diffuserai le compte rendu après la réunion.', 'future'),
  s('work', 'B2', 'I’ll make sure everyone is aware of the change.', 'Je m’assurerai que tout le monde est au courant du changement.', 'future'),
  s('work', 'B2', 'I’d like to take a day off next Friday, if that’s all right.', 'Je voudrais prendre un jour de congé vendredi prochain, si ça vous va.', 'would'),
  s('work', 'B2', 'We should loop in the supplier before making a decision.', 'Nous devrions impliquer le fournisseur avant de décider.', 'phrasal verbs'),
  s('work', 'B2', 'It’s outside my area, but I can find out who to ask.', 'Ce n’est pas mon domaine, mais je peux trouver à qui demander.', 'linking words'),
  // Social / emotions
  s('feelings', 'A2', 'I’m really happy for you.', 'Je suis vraiment content pour toi.', 'be'),
  s('feelings', 'A2', 'I’m a bit nervous about tomorrow.', 'Je suis un peu stressé pour demain.', 'be'),
  s('feelings', 'B1', 'I was really disappointed with the result.', 'J’ai été vraiment déçu par le résultat.', 'past simple'),
  s('feelings', 'B1', 'That must have been difficult.', 'Ça a dû être difficile.', 'must have'),
  s('feelings', 'B1', 'I’m sorry to hear that. Is there anything I can do?', 'Je suis désolé de l’apprendre. Puis-je faire quelque chose ?', 'infinitive'),
  s('feelings', 'B1', 'Don’t be so hard on yourself.', 'Ne sois pas si dur avec toi-même.', 'imperative'),
  s('feelings', 'B2', 'I couldn’t be happier with how it turned out.', 'Je ne pourrais pas être plus content du résultat.', 'idiom'),
  // Opinions and everyday argument
  s('opinion', 'B1', 'In my experience, simple solutions work best.', 'D’après mon expérience, les solutions simples marchent le mieux.', 'superlatives'),
  s('opinion', 'B1', 'It’s a matter of priorities.', 'C’est une question de priorités.', 'be'),
  s('opinion', 'B2', 'There are pros and cons to both options.', 'Il y a des avantages et des inconvénients aux deux options.', 'there is'),
  s('opinion', 'B2', 'Looking back, I would have done it differently.', 'Avec le recul, je l’aurais fait autrement.', 'conditionals'),
  s('opinion', 'B2', 'The main advantage is that it’s faster, but it costs more.', 'Le principal avantage est que c’est plus rapide, mais ça coûte plus cher.', 'linking words'),
  // Learning
  s('learning', 'A2', 'Could you give me an example, please?', 'Pourriez-vous me donner un exemple, s’il vous plaît ?', 'modal'),
  s('learning', 'B1', 'I’d like to practise speaking more.', 'Je voudrais pratiquer davantage l’oral.', 'would like'),
  s('learning', 'B1', 'I understand the grammar, but I freeze when I speak.', 'Je comprends la grammaire, mais je bloque quand je parle.', 'linking words'),
  s('learning', 'B1', 'Every day, I try to learn five new expressions.', 'Chaque jour, j’essaie d’apprendre cinq nouvelles expressions.', 'present simple'),
];
