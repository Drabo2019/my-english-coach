import type { Level, Register, Sentence } from '@/types';

import { SENTENCES_EXTRA } from './sentences-extra';
import { SENTENCES_EXTRA2 } from './sentences-extra2';
import { SENTENCES_ADVANCED } from './sentences-advanced';
import { SENTENCES_EXTRA3 } from './sentences-extra3';

let n = 0;
export function s(situation: string, level: Level, en: string, fr: string, grammar?: string, register: Register = 'neutral', alt?: string): Sentence {
  n += 1;
  return { id: `s${String(n).padStart(4, '0')}`, en, fr, level, situation, register, grammar, alt };
}

export const SITUATIONS = [
  'everyday', 'work', 'meetings', 'phone', 'travel', 'shopping', 'restaurant', 'doctor', 'colleagues',
  'friends', 'family', 'disagreement', 'questions', 'problem', 'clarification', 'opinion', 'apology',
  'request', 'refusal', 'presenting', 'interview', 'technical', 'smalltalk', 'negotiating', 'email', 'learning', 'complaint', 'emergencies', 'fluency', 'traps', 'bank', 'post', 'transport', 'feelings',
] as const;

const SENTENCES_CORE: Sentence[] = [
  // everyday
  s('everyday', 'A1', 'I bought some apples yesterday.', 'J’ai acheté des pommes hier.', 'past simple'),
  s('everyday', 'A1', 'I usually get up at seven.', 'Je me lève généralement à sept heures.', 'present simple'),
  s('everyday', 'A1', 'What time is it?', 'Quelle heure est-il ?', 'questions'),
  s('everyday', 'A1', 'I’m tired. I need a coffee.', 'Je suis fatigué. J’ai besoin d’un café.', 'be'),
  s('everyday', 'A2', 'I forgot to buy milk on my way home.', 'J’ai oublié d’acheter du lait en rentrant.', 'past simple'),
  s('everyday', 'A2', 'I’m going to cook dinner tonight.', 'Je vais cuisiner ce soir.', 'future', 'neutral', 'I’m gonna cook tonight. (informal)'),
  s('everyday', 'A2', 'Could you turn the music down a bit?', 'Tu pourrais baisser un peu la musique ?', 'modal'),
  s('everyday', 'B1', 'I’ve been trying to call you all morning.', 'J’essaie de t’appeler toute la matinée.', 'present perfect continuous'),
  s('everyday', 'B1', 'I’m not used to waking up this early.', 'Je n’ai pas l’habitude de me lever si tôt.', 'be used to'),
  s('everyday', 'A2', 'I’ve lost my keys. Have you seen them?', 'J’ai perdu mes clés. Tu les as vues ?', 'present perfect'),
  // work
  s('work', 'A2', 'I have a lot of work to do today.', 'J’ai beaucoup de travail aujourd’hui.', 'have'),
  s('work', 'B1', 'I’m currently working on a new project.', 'Je travaille actuellement sur un nouveau projet.', 'present continuous'),
  s('work', 'B1', 'The test has been delayed because of a hardware issue.', 'Le test a été retardé à cause d’un problème matériel.', 'passive'),
  s('work', 'B1', 'I’ll finish it by the end of the day.', 'Je le termine d’ici la fin de la journée.', 'future'),
  s('work', 'B1', 'Could you send me the report by Friday?', 'Pourrais-tu m’envoyer le rapport d’ici vendredi ?', 'modal'),
  s('work', 'B2', 'We’re a bit behind schedule, but we should catch up next week.', 'Nous avons un peu de retard, mais nous devrions rattraper la semaine prochaine.', 'modal'),
  s('work', 'B1', 'I’ll check and get back to you.', 'Je vérifie et je te tiens au courant.', 'future', 'neutral', 'Let me look into it and I’ll come back to you.'),
  s('work', 'A2', 'I work as an engineer.', 'Je travaille comme ingénieur.', 'present simple'),
  s('work', 'B1', 'I’m responsible for testing the new boards.', 'Je suis responsable du test des nouvelles cartes.', 'be responsible for'),
  s('work', 'B2', 'I’ll take care of it as soon as I get back to the office.', 'Je m’en occupe dès que je suis de retour au bureau.', 'time clauses'),
  // meetings
  s('meetings', 'A2', 'Let’s start the meeting.', 'Commençons la réunion.', 'imperative'),
  s('meetings', 'B1', 'Could you clarify what you mean by that?', 'Pourriez-vous préciser ce que vous voulez dire ?', 'modal', 'formal'),
  s('meetings', 'B1', 'I’d like to add something, if I may.', 'Je voudrais ajouter quelque chose, si vous me le permettez.', 'would', 'formal'),
  s('meetings', 'B1', 'What do you think about this proposal?', 'Que pensez-vous de cette proposition ?', 'questions'),
  s('meetings', 'B2', 'I see your point, but I’m not sure it will work.', 'Je comprends votre point de vue, mais je ne suis pas sûr que ça marche.', 'linking words'),
  s('meetings', 'B1', 'Let’s move on to the next item.', 'Passons au point suivant.', 'imperative'),
  s('meetings', 'B1', 'To sum up, we need more time and more resources.', 'En résumé, nous avons besoin de plus de temps et de ressources.', 'linking words'),
  s('meetings', 'B2', 'Sorry to interrupt, but can I ask a quick question?', 'Désolé de vous interrompre, mais puis-je poser une question rapide ?', 'modal'),
  // phone
  s('phone', 'A2', 'Hello, this is Marc speaking.', 'Allô, ici Marc.', 'phone'),
  s('phone', 'A2', 'Could I speak to Ms Brown, please?', 'Puis-je parler à Mme Brown, s’il vous plaît ?', 'modal'),
  s('phone', 'A2', 'Sorry, I didn’t catch that. Could you repeat it?', 'Désolé, je n’ai pas saisi. Pouvez-vous répéter ?', 'modal'),
  s('phone', 'B1', 'Could you speak a little more slowly, please?', 'Pourriez-vous parler un peu plus lentement ?', 'comparatives'),
  s('phone', 'B1', 'I’m calling about the invoice you sent.', 'J’appelle au sujet de la facture que vous avez envoyée.', 'relative clauses'),
  s('phone', 'B1', 'Can I take a message?', 'Puis-je prendre un message ?', 'modal'),
  s('phone', 'A2', 'The line is bad. Can you hear me?', 'La ligne est mauvaise. Vous m’entendez ?', 'questions'),
  // travel
  s('travel', 'A1', 'Where is the train station?', 'Où est la gare ?', 'questions'),
  s('travel', 'A2', 'I’d like a ticket to Manchester, please.', 'Je voudrais un billet pour Manchester, s’il vous plaît.', 'would like'),
  s('travel', 'A2', 'How long does it take to get to the airport?', 'Combien de temps faut-il pour aller à l’aéroport ?', 'questions'),
  s('travel', 'A2', 'I have a reservation under the name Dupont.', 'J’ai une réservation au nom de Dupont.', 'present simple'),
  s('travel', 'B1', 'My flight has been cancelled. What are my options?', 'Mon vol a été annulé. Quelles sont mes options ?', 'passive'),
  s('travel', 'B1', 'Excuse me, which gate is the flight to Dublin?', 'Excusez-moi, quelle est la porte du vol pour Dublin ?', 'questions'),
  s('travel', 'A2', 'Is breakfast included?', 'Le petit-déjeuner est-il inclus ?', 'passive'),
  // shopping
  s('shopping', 'A1', 'How much is this?', 'Combien ça coûte ?', 'questions'),
  s('shopping', 'A2', 'Do you have this in a bigger size?', 'Vous avez ça en plus grand ?', 'questions'),
  s('shopping', 'A2', 'I’m just looking, thanks.', 'Je regarde seulement, merci.', 'present continuous'),
  s('shopping', 'B1', 'I’d like to return this. It doesn’t fit.', 'Je voudrais rendre ceci. Ça ne va pas.', 'would like'),
  s('shopping', 'B1', 'Can I pay by card?', 'Je peux payer par carte ?', 'modal'),
  // restaurant
  s('restaurant', 'A1', 'A table for two, please.', 'Une table pour deux, s’il vous plaît.', 'basic'),
  s('restaurant', 'A2', 'I’d like the chicken, please.', 'Je voudrais le poulet, s’il vous plaît.', 'would like'),
  s('restaurant', 'A2', 'What do you recommend?', 'Qu’est-ce que vous recommandez ?', 'questions'),
  s('restaurant', 'B1', 'Could we have the bill, please?', 'Pourrions-nous avoir l’addition ?', 'modal'),
  s('restaurant', 'B1', 'I’m allergic to nuts. Does this dish contain any?', 'Je suis allergique aux noix. Ce plat en contient-il ?', 'questions'),
  s('restaurant', 'B1', 'Excuse me, this isn’t what I ordered.', 'Excusez-moi, ce n’est pas ce que j’ai commandé.', 'relative clauses'),
  // doctor
  s('doctor', 'A2', 'I don’t feel well.', 'Je ne me sens pas bien.', 'present simple'),
  s('doctor', 'A2', 'I’ve had a headache since yesterday.', 'J’ai mal à la tête depuis hier.', 'present perfect'),
  s('doctor', 'B1', 'It hurts when I breathe in.', 'Ça fait mal quand j’inspire.', 'time clauses'),
  s('doctor', 'B1', 'How often should I take this medicine?', 'À quelle fréquence dois-je prendre ce médicament ?', 'modal'),
  s('doctor', 'A2', 'I need to make an appointment.', 'J’ai besoin de prendre rendez-vous.', 'infinitive'),
  // colleagues / friends / family / smalltalk
  s('colleagues', 'A2', 'How was your weekend?', 'C’était comment, ton week-end ?', 'questions'),
  s('colleagues', 'B1', 'Do you want to grab a coffee?', 'Tu veux aller prendre un café ?', 'questions', 'informal'),
  s('colleagues', 'B1', 'Thanks for your help earlier. I really appreciate it.', 'Merci pour ton aide tout à l’heure. J’apprécie vraiment.', 'present simple'),
  s('colleagues', 'B1', 'Do you mind if I open the window?', 'Ça vous dérange si j’ouvre la fenêtre ?', 'do you mind'),
  s('friends', 'A2', 'Do you want to go out this weekend?', 'Tu veux sortir ce week-end ?', 'questions'),
  s('friends', 'B1', 'I haven’t seen you for ages!', 'Ça fait une éternité que je ne t’ai pas vu !', 'present perfect', 'informal'),
  s('friends', 'B1', 'Let’s catch up soon.', 'On se rappelle vite pour se donner des nouvelles.', 'imperative', 'informal'),
  s('friends', 'A2', 'I’m sorry I’m late. I missed the bus.', 'Désolé d’être en retard. J’ai raté le bus.', 'past simple'),
  s('family', 'A1', 'I have two brothers and a sister.', 'J’ai deux frères et une sœur.', 'have'),
  s('family', 'A2', 'My parents live in a small town near Lyon.', 'Mes parents vivent dans une petite ville près de Lyon.', 'present simple'),
  s('family', 'B1', 'I grew up in the countryside.', 'J’ai grandi à la campagne.', 'past simple'),
  s('smalltalk', 'A2', 'Nice weather today, isn’t it?', 'Il fait beau aujourd’hui, non ?', 'question tags'),
  s('smalltalk', 'A2', 'What do you do for a living?', 'Que faites-vous dans la vie ?', 'questions'),
  s('smalltalk', 'B1', 'Have you been here before?', 'Vous êtes déjà venu ici ?', 'present perfect'),
  s('smalltalk', 'B1', 'What are you up to this weekend?', 'Tu fais quoi ce week-end ?', 'questions', 'informal'),
  // disagreement / opinion / clarification / questions
  s('disagreement', 'B1', 'I’m afraid I don’t agree.', 'Je crains de ne pas être d’accord.', 'opinion', 'formal'),
  s('disagreement', 'B2', 'I see where you’re coming from, but I think we should wait.', 'Je vois d’où tu viens, mais je pense qu’on devrait attendre.', 'opinion'),
  s('disagreement', 'B1', 'That’s not quite how I see it.', 'Ce n’est pas tout à fait comme ça que je vois les choses.', 'opinion'),
  s('opinion', 'A2', 'I think it’s a good idea.', 'Je pense que c’est une bonne idée.', 'opinion'),
  s('opinion', 'B1', 'In my opinion, we should test it again.', 'À mon avis, nous devrions le retester.', 'opinion'),
  s('opinion', 'B1', 'To be honest, I’m not convinced.', 'Pour être honnête, je ne suis pas convaincu.', 'opinion'),
  s('clarification', 'A2', 'Sorry, what do you mean?', 'Pardon, qu’est-ce que vous voulez dire ?', 'questions'),
  s('clarification', 'B1', 'So, if I understand correctly, you want me to redo the test?', 'Donc, si je comprends bien, vous voulez que je refasse le test ?', 'conditionals'),
  s('clarification', 'B1', 'Could you give me an example?', 'Pourriez-vous me donner un exemple ?', 'modal'),
  s('clarification', 'A2', 'How do you say this in English?', 'Comment dit-on ça en anglais ?', 'questions'),
  s('questions', 'A2', 'Where do you live?', 'Où habitez-vous ?', 'questions'),
  s('questions', 'B1', 'Do you know how this works?', 'Sais-tu comment ça marche ?', 'indirect questions'),
  s('questions', 'B1', 'Could you tell me where the meeting room is?', 'Pourriez-vous me dire où est la salle de réunion ?', 'indirect questions'),
  s('questions', 'B2', 'I was wondering if you could help me with something.', 'Je me demandais si tu pouvais m’aider.', 'indirect questions'),
  // problem / apology / request / refusal
  s('problem', 'B1', 'There’s a problem with the software.', 'Il y a un problème avec le logiciel.', 'there is'),
  s('problem', 'B1', 'It doesn’t work and I don’t know why.', 'Ça ne marche pas et je ne sais pas pourquoi.', 'negatives'),
  s('problem', 'B1', 'The screen went black and nothing happens.', 'L’écran est devenu noir et rien ne se passe.', 'past simple'),
  s('problem', 'B2', 'I’ve tried restarting it, but it didn’t help.', 'J’ai essayé de le redémarrer, mais ça n’a pas aidé.', 'present perfect'),
  s('apology', 'A2', 'I’m really sorry about that.', 'Je suis vraiment désolé pour ça.', 'be'),
  s('apology', 'B1', 'Sorry for the delay. I was in a meeting.', 'Désolé pour le retard. J’étais en réunion.', 'past continuous'),
  s('apology', 'B1', 'My mistake. I should have checked.', 'Mon erreur. J’aurais dû vérifier.', 'should have'),
  s('request', 'A2', 'Can you help me, please?', 'Pouvez-vous m’aider, s’il vous plaît ?', 'modal'),
  s('request', 'B1', 'Would you mind sending me the file?', 'Pourriez-vous m’envoyer le fichier ?', 'would you mind'),
  s('request', 'B1', 'I was wondering whether you could extend the deadline.', 'Je me demandais si vous pouviez repousser la date limite.', 'indirect questions', 'formal'),
  s('refusal', 'B1', 'I’m afraid I can’t make it on Friday.', 'Je crains de ne pas pouvoir venir vendredi.', 'modal', 'neutral'),
  s('refusal', 'B1', 'Thanks for the offer, but I’d rather not.', 'Merci pour la proposition, mais je préfère pas.', 'would rather'),
  s('refusal', 'B2', 'Unfortunately, we’re not able to do that at the moment.', 'Malheureusement, nous ne pouvons pas le faire pour le moment.', 'modal', 'formal'),
  // presenting / interview / technical
  s('presenting', 'B1', 'Today I’m going to talk about our test results.', 'Aujourd’hui, je vais parler de nos résultats de test.', 'future'),
  s('presenting', 'B1', 'As you can see on this slide, the error rate dropped.', 'Comme vous pouvez le voir sur cette diapositive, le taux d’erreur a baissé.', 'linking words'),
  s('presenting', 'B1', 'Let me move on to the next point.', 'Laissez-moi passer au point suivant.', 'modal'),
  s('presenting', 'B2', 'Thank you for listening. Any questions?', 'Merci de votre attention. Des questions ?', 'basic'),
  s('interview', 'B1', 'Let me tell you a little about myself.', 'Laissez-moi vous parler un peu de moi.', 'modal'),
  s('interview', 'B1', 'My greatest strength is that I’m very organised.', 'Ma plus grande qualité est d’être très organisé.', 'superlatives'),
  s('interview', 'B1', 'I’ve been working in this field for ten years.', 'Je travaille dans ce domaine depuis dix ans.', 'present perfect continuous'),
  s('interview', 'B2', 'I’m looking for a role where I can keep learning.', 'Je cherche un poste où je peux continuer à apprendre.', 'relative clauses'),
  s('technical', 'B1', 'The signal is too noisy.', 'Le signal est trop bruité.', 'adverbs'),
  s('technical', 'B1', 'We need to measure the current under load.', 'Nous devons mesurer le courant en charge.', 'infinitive'),
  s('technical', 'B2', 'The test passes at room temperature but fails at high temperature.', 'Le test passe à température ambiante mais échoue à haute température.', 'linking words'),
  s('technical', 'B2', 'It seems that the root cause is a faulty connector.', 'Il semble que la cause première soit un connecteur défectueux.', 'it seems that'),
  s('technical', 'B1', 'Could you share your screen, please?', 'Pourriez-vous partager votre écran ?', 'modal'),
  s('technical', 'B1', 'I’ll run the test again and let you know.', 'Je relance le test et je te dis.', 'future'),
];

// Core ids (s0001…) are frozen: user progress references them. New sentences live in sentences-extra.ts (ids t0001…).
export const SENTENCES: Sentence[] = [...SENTENCES_CORE, ...SENTENCES_EXTRA, ...SENTENCES_EXTRA2, ...SENTENCES_EXTRA3, ...SENTENCES_ADVANCED];
