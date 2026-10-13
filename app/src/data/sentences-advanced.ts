import type { Level, Register, Sentence } from '@/types';

// Batch 5 (0.5): advanced content (C1/C2) for learners who are already fluent. Own id space (w0001…).
let n = 0;
function s(situation: string, level: Level, en: string, fr: string, grammar?: string, register: Register = 'neutral', alt?: string): Sentence {
  n += 1;
  return { id: `w${String(n).padStart(4, '0')}`, en, fr, level, situation, register, grammar, alt };
}

export const SENTENCES_ADVANCED: Sentence[] = [
  // opinion and nuance
  s('opinion', 'C1', 'I’m inclined to think the problem lies elsewhere.', 'J’ai tendance à penser que le problème vient d’ailleurs.', 'hedging'),
  s('opinion', 'C1', 'That said, it would be unfair to blame the whole team.', 'Cela dit, il serait injuste d’en vouloir à toute l’équipe.', 'concession'),
  s('opinion', 'C1', 'By and large, the results are encouraging.', 'Dans l’ensemble, les résultats sont encourageants.', 'discourse markers'),
  s('opinion', 'C1', 'It’s fair to say that expectations were not met.', 'On peut dire que les attentes n’ont pas été satisfaites.', 'hedging', 'formal'),
  s('opinion', 'C1', 'I wouldn’t go as far as to call it a failure.', 'Je n’irais pas jusqu’à appeler ça un échec.', 'hedging'),
  s('opinion', 'C2', 'To my mind, the argument rests on a rather shaky premise.', 'À mon sens, l’argument repose sur une prémisse assez fragile.', 'academic register', 'formal'),
  s('opinion', 'C2', 'Frankly, I find that claim hard to square with the evidence.', 'Franchement, j’ai du mal à concilier cette affirmation avec les preuves.', 'collocations'),
  s('opinion', 'C1', 'On the one hand it’s cheaper; on the other, it’s far less reliable.', 'D’un côté c’est moins cher ; de l’autre, c’est bien moins fiable.', 'contrast'),
  // disagreement, diplomacy
  s('disagreement', 'C1', 'With respect, I see it somewhat differently.', 'Avec respect, je vois les choses un peu différemment.', 'diplomacy', 'formal'),
  s('disagreement', 'C1', 'I take your point, but I’m not entirely convinced.', 'Je comprends votre point de vue, mais je ne suis pas tout à fait convaincu.', 'diplomacy'),
  s('disagreement', 'C1', 'I hate to be the one to say it, but this won’t work.', 'Je déteste être celui qui le dit, mais ça ne marchera pas.', 'diplomacy'),
  s('disagreement', 'C2', 'I’m afraid I must take issue with that characterisation.', 'Je suis navré, mais je dois contester cette description.', 'formal disagreement', 'formal'),
  s('disagreement', 'C1', 'Let’s agree to disagree on this one.', 'Convenons que nous ne sommes pas d’accord sur ce point.', 'idiom'),
  s('disagreement', 'C1', 'You’re missing the point; the issue isn’t cost, it’s timing.', 'Vous passez à côté du sujet : le problème n’est pas le coût, c’est le calendrier.', 'contrast', 'informal'),
  // meetings and negotiation
  s('negotiating', 'C1', 'We’d be prepared to meet you halfway on the price.', 'Nous serions prêts à faire la moitié du chemin sur le prix.', 'conditional'),
  s('negotiating', 'C1', 'That’s a non-starter for us, I’m afraid.', 'C’est hors de question pour nous, je le crains.', 'idiom'),
  s('negotiating', 'C1', 'Could we park that for now and circle back later?', 'Pouvons-nous mettre ça de côté et y revenir plus tard ?', 'business idiom', 'informal'),
  s('negotiating', 'C2', 'We’re open to a degree of flexibility, provided the timeline holds.', 'Nous sommes ouverts à une certaine souplesse, à condition que le calendrier soit respecté.', 'provided that', 'formal'),
  s('meetings', 'C1', 'Let me play devil’s advocate for a moment.', 'Laissez-moi jouer l’avocat du diable un instant.', 'idiom'),
  s('meetings', 'C1', 'Just to make sure we’re all on the same page, the deadline is Friday.', 'Pour être certain que nous sommes tous d’accord, l’échéance est vendredi.', 'idiom'),
  s('meetings', 'C1', 'I’d like to build on what Sarah just said.', 'Je voudrais rebondir sur ce que Sarah vient de dire.', 'discourse markers'),
  s('meetings', 'C1', 'Can we take this offline? It’s a bit of a tangent.', 'On peut en parler en dehors de la réunion ? On s’éloigne un peu du sujet.', 'business idiom'),
  s('meetings', 'C1', 'The upshot is that we need to cut scope or add resources.', 'En résumé, il faut réduire le périmètre ou ajouter des ressources.', 'discourse markers'),
  // presenting
  s('presenting', 'C1', 'What I’d like to do this morning is walk you through the main findings.', 'Ce que je voudrais faire ce matin, c’est vous présenter les principaux résultats.', 'cleft sentences'),
  s('presenting', 'C1', 'Let me zoom out for a second and look at the bigger picture.', 'Laissez-moi prendre du recul et regarder la vue d’ensemble.', 'metaphor'),
  s('presenting', 'C2', 'The data point to a trend which, if left unchecked, will erode margins.', 'Les données indiquent une tendance qui, si on la laisse faire, érodera les marges.', 'non-defining relative clauses', 'formal'),
  s('presenting', 'C1', 'To put this into perspective, that’s roughly a third of our revenue.', 'Pour mettre cela en perspective, c’est environ un tiers de notre chiffre d’affaires.', 'discourse markers'),
  // grammar showcases: inversion, mixed conditionals, subjunctive, cleft
  s('work', 'C1', 'Never have I seen such a chaotic launch.', 'Jamais je n’ai vu un lancement aussi chaotique.', 'inversion'),
  s('work', 'C1', 'Not only did they miss the deadline, they also blew the budget.', 'Non seulement ils ont raté l’échéance, mais ils ont aussi explosé le budget.', 'inversion'),
  s('work', 'C1', 'Had I known about the delay, I would have rescheduled.', 'Si j’avais su pour le retard, j’aurais reprogrammé.', 'inverted conditional', 'formal'),
  s('work', 'C1', 'Should you need any further information, please don’t hesitate to contact me.', 'Si vous avez besoin de plus d’informations, n’hésitez pas à me contacter.', 'inverted conditional', 'formal'),
  s('work', 'C1', 'If I had taken that job, I’d be living in Singapore now.', 'Si j’avais accepté ce poste, je vivrais à Singapour maintenant.', 'mixed conditional'),
  s('work', 'C1', 'I insist that he be given a chance to explain.', 'J’insiste pour qu’on lui donne la possibilité de s’expliquer.', 'subjunctive', 'formal'),
  s('work', 'C1', 'It’s high time we made a decision.', 'Il est grand temps que nous prenions une décision.', 'it’s time + past'),
  s('work', 'C1', 'It was the lack of communication that caused the problem.', 'C’est le manque de communication qui a causé le problème.', 'cleft sentences'),
  s('work', 'C2', 'Seldom does a project of this scale come in on budget.', 'Il est rare qu’un projet de cette ampleur respecte son budget.', 'inversion', 'formal'),
  s('work', 'C2', 'Were it not for their support, the project would have collapsed.', 'Sans leur soutien, le projet se serait effondré.', 'inverted conditional', 'formal'),
  // fluency and idiom
  s('fluency', 'C1', 'I’ve got a lot on my plate at the moment.', 'J’ai beaucoup de choses à gérer en ce moment.', 'idiom', 'informal'),
  s('fluency', 'C1', 'It slipped my mind; I’m so sorry.', 'Ça m’est complètement sorti de l’esprit ; je suis désolé.', 'idiom'),
  s('fluency', 'C1', 'He’s a safe pair of hands, so I’d trust him with it.', 'C’est quelqu’un de fiable, donc je lui confierais ça.', 'idiom', 'informal'),
  s('fluency', 'C1', 'We’re running out of steam; let’s call it a day.', 'On s’essouffle ; arrêtons-nous là pour aujourd’hui.', 'idiom', 'informal'),
  s('fluency', 'C1', 'It’s not rocket science, but it does take patience.', 'Ce n’est pas sorcier, mais ça demande de la patience.', 'idiom', 'informal'),
  s('fluency', 'C2', 'It goes without saying that this stays between us.', 'Il va sans dire que cela reste entre nous.', 'idiom'),
  s('fluency', 'C2', 'I wouldn’t put it past him to change his mind at the last minute.', 'Ça ne m’étonnerait pas qu’il change d’avis à la dernière minute.', 'idiom'),
  s('fluency', 'C2', 'The whole thing has taken on a life of its own.', 'Toute l’affaire a pris une dimension qui nous échappe.', 'idiom'),
  // feelings, nuance, tone
  s('feelings', 'C1', 'I can’t help feeling that we’re being rushed.', 'Je ne peux m’empêcher de sentir qu’on nous presse.', 'can’t help + -ing'),
  s('feelings', 'C1', 'I was taken aback by how blunt the feedback was.', 'J’ai été pris au dépourvu par la franchise des retours.', 'phrasal / collocation'),
  s('feelings', 'C1', 'It’s a bit of a mixed bag: some good news, some less so.', 'C’est un peu mitigé : de bonnes nouvelles, d’autres moins.', 'idiom'),
  s('feelings', 'C2', 'I’m torn between loyalty to the team and my own ambitions.', 'Je suis déchiré entre ma loyauté envers l’équipe et mes propres ambitions.', 'collocations'),
  // email and writing
  s('email', 'C1', 'I’m writing to follow up on our conversation of last Tuesday.', 'Je vous écris pour faire suite à notre conversation de mardi dernier.', 'formal email', 'formal'),
  s('email', 'C1', 'I would be grateful if you could confirm receipt of this message.', 'Je vous serais reconnaissant de bien vouloir accuser réception de ce message.', 'formal email', 'formal'),
  s('email', 'C1', 'Apologies for the delay in getting back to you.', 'Toutes mes excuses pour le délai de ma réponse.', 'formal email', 'formal'),
  s('email', 'C2', 'Please be advised that the offices will be closed on the 24th.', 'Veuillez noter que les bureaux seront fermés le 24.', 'formal notices', 'formal'),
  // interview and career
  s('interview', 'C1', 'What sets me apart is my ability to bridge technical and commercial teams.', 'Ce qui me distingue, c’est ma capacité à faire le lien entre équipes techniques et commerciales.', 'cleft sentences'),
  s('interview', 'C1', 'I thrive under pressure, but I also value a sustainable pace.', 'Je m’épanouis sous pression, mais j’apprécie aussi un rythme tenable.', 'collocations'),
  s('interview', 'C1', 'In hindsight, I should have escalated the issue sooner.', 'Avec le recul, j’aurais dû faire remonter le problème plus tôt.', 'should have'),
  // technical and clarification
  s('technical', 'C1', 'The root cause turned out to be a race condition in the scheduler.', 'La cause profonde s’est révélée être une condition de concurrence dans l’ordonnanceur.', 'turn out'),
  s('technical', 'C1', 'It works as intended, barring a few edge cases.', 'Cela fonctionne comme prévu, hormis quelques cas limites.', 'barring'),
  s('clarification', 'C1', 'When you say “soon”, do you mean this week or this quarter?', 'Quand vous dites « bientôt », vous entendez cette semaine ou ce trimestre ?', 'clarification'),
  s('clarification', 'C1', 'Correct me if I’m wrong, but I thought the deadline had moved.', 'Corrigez-moi si je me trompe, mais je croyais que l’échéance avait changé.', 'clarification'),
  s('clarification', 'C2', 'If I’m reading you correctly, you’re suggesting we defer the rollout.', 'Si je vous comprends bien, vous suggérez de repousser le déploiement.', 'clarification', 'formal'),
];
