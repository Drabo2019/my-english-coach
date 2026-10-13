import type { VocabItem } from '@/types';

import { v } from './vocab-builder';

// Batch 5 (0.5): advanced vocabulary (C1/C2). ids are `category-word`, so existing ids never change.
export const VOCAB_ADVANCED: VocabItem[] = [
  // ---- nuance & argument
  v('advanced', 'nuance', '/ˈnjuːɑːns/', 'n', 'nuance', 'C1', 'The report captures the nuance of the debate.', 'Le rapport rend la nuance du débat.', { collocations: ['subtle nuance', 'lose the nuance'] }),
  v('advanced', 'tangible', '/ˈtændʒəbl/', 'adj', 'concret / tangible', 'C1', 'We need tangible results by June.', 'Il nous faut des résultats concrets d’ici juin.', { synonyms: ['concrete'], collocations: ['tangible benefits', 'tangible evidence'] }),
  v('advanced', 'plausible', '/ˈplɔːzəbl/', 'adj', 'plausible', 'C1', 'That’s a plausible explanation.', 'C’est une explication plausible.', { synonyms: ['credible'] }),
  v('advanced', 'ambiguous', '/æmˈbɪɡjuəs/', 'adj', 'ambigu', 'C1', 'The wording of the contract is ambiguous.', 'La formulation du contrat est ambiguë.', { related: ['ambiguity'] }),
  v('advanced', 'compelling', '/kəmˈpelɪŋ/', 'adj', 'convaincant / captivant', 'C1', 'She made a compelling case for change.', 'Elle a présenté des arguments convaincants en faveur du changement.', { collocations: ['a compelling argument', 'compelling evidence'], mistakes: 'Pas « compelling » = « obligeant » : c’est « convaincant ».' }),
  v('advanced', 'overstate', '/ˌəʊvəˈsteɪt/', 'v', 'exagérer', 'C1', 'It would be hard to overstate its importance.', 'Il serait difficile d’exagérer son importance.', { antonyms: ['understate'] }),
  v('advanced', 'undermine', '/ˌʌndəˈmaɪn/', 'v', 'saper / affaiblir', 'C1', 'Constant delays undermine trust.', 'Les retards constants sapent la confiance.', { collocations: ['undermine confidence', 'undermine authority'] }),
  v('advanced', 'reinforce', '/ˌriːɪnˈfɔːs/', 'v', 'renforcer', 'C1', 'The data reinforce our earlier findings.', 'Les données renforcent nos conclusions précédentes.'),
  v('advanced', 'imply', '/ɪmˈplaɪ/', 'v', 'sous-entendre / impliquer', 'C1', 'Are you implying that I made a mistake?', 'Vous sous-entendez que j’ai fait une erreur ?', { mistakes: 'imply = sous-entendre ; infer = déduire (l’inverse).' }),
  v('advanced', 'infer', '/ɪnˈfɜː/', 'v', 'déduire', 'C1', 'We can infer that sales dropped in March.', 'On peut en déduire que les ventes ont baissé en mars.'),
  v('advanced', 'reconcile', '/ˈrekənsaɪl/', 'v', 'concilier', 'C1', 'It’s hard to reconcile these two figures.', 'Il est difficile de concilier ces deux chiffres.', { collocations: ['reconcile differences', 'reconcile accounts'] }),
  v('advanced', 'scrutiny', '/ˈskruːtəni/', 'n', 'examen minutieux', 'C1', 'The plan did not stand up to scrutiny.', 'Le plan n’a pas résisté à un examen minutieux.', { collocations: ['under scrutiny', 'close scrutiny'] }),
  // ---- work & business
  v('advanced', 'leverage', '/ˈliːvərɪdʒ/', 'v', 'tirer parti de', 'C1', 'We can leverage our existing network.', 'Nous pouvons tirer parti de notre réseau existant.', { register: 'formal', synonyms: ['exploit', 'make use of'] }),
  v('advanced', 'streamline', '/ˈstriːmlaɪn/', 'v', 'rationaliser', 'C1', 'We’re trying to streamline the approval process.', 'Nous essayons de rationaliser le processus de validation.'),
  v('advanced', 'mitigate', '/ˈmɪtɪɡeɪt/', 'v', 'atténuer', 'C1', 'We need to mitigate the risk of delays.', 'Nous devons atténuer le risque de retards.', { collocations: ['mitigate risk', 'mitigate the impact'], mistakes: 'mitigate = atténuer (pas « mitiger » au sens de nuancer).' }),
  v('advanced', 'pivot', '/ˈpɪvət/', 'v', 'réorienter / changer de cap', 'C1', 'The startup had to pivot after the first year.', 'La startup a dû changer de cap après la première année.'),
  v('advanced', 'bottleneck', '/ˈbɒtlnek/', 'n', 'goulot d’étranglement', 'C1', 'Testing has become the main bottleneck.', 'Les tests sont devenus le principal goulot d’étranglement.'),
  v('advanced', 'stakeholder', '/ˈsteɪkhəʊldə/', 'n', 'partie prenante', 'C1', 'We need to keep all stakeholders informed.', 'Il faut tenir toutes les parties prenantes informées.'),
  v('advanced', 'scalable', '/ˈskeɪləbl/', 'adj', 'évolutif / capable de passer à l’échelle', 'C1', 'The solution has to be scalable.', 'La solution doit pouvoir passer à l’échelle.'),
  v('advanced', 'outsource', '/ˈaʊtsɔːs/', 'v', 'externaliser', 'C1', 'They outsource their payroll.', 'Ils externalisent leur paie.'),
  v('advanced', 'liability', '/ˌlaɪəˈbɪləti/', 'n', 'responsabilité (juridique) / passif', 'C1', 'The company accepts no liability for losses.', 'L’entreprise n’accepte aucune responsabilité en cas de perte.', { mistakes: 'liability ≠ « liberté » ni « fiabilité ».' }),
  v('advanced', 'benchmark', '/ˈbentʃmɑːk/', 'n', 'référence / étalon', 'C1', 'We use last year’s figures as a benchmark.', 'Nous utilisons les chiffres de l’an dernier comme référence.'),
  // ---- phrasal verbs and idiomatic verbs
  v('advanced', 'iron out', '/ˈaɪən aʊt/', 'phr v', 'régler (des problèmes)', 'C1', 'We still need to iron out a few details.', 'Il reste quelques détails à régler.', { register: 'informal' }),
  v('advanced', 'chase up', '/tʃeɪs ʌp/', 'phr v', 'relancer', 'C1', 'Could you chase up the supplier?', 'Peux-tu relancer le fournisseur ?', { usUk: 'UK ; US : follow up' }),
  v('advanced', 'rule out', '/ruːl aʊt/', 'phr v', 'exclure', 'C1', 'We can’t rule out a delay.', 'On ne peut pas exclure un retard.'),
  v('advanced', 'come across', '/kʌm əˈkrɒs/', 'phr v', 'tomber sur / donner l’impression', 'C1', 'He comes across as very confident.', 'Il donne l’impression d’être très sûr de lui.', { meanings: ['tomber sur (par hasard)'] }),
  v('advanced', 'fall through', '/fɔːl θruː/', 'phr v', 'tomber à l’eau', 'C1', 'The deal fell through at the last minute.', 'L’accord est tombé à l’eau à la dernière minute.'),
  v('advanced', 'hold up', '/həʊld ʌp/', 'phr v', 'tenir la route / retarder', 'C1', 'Does that argument hold up?', 'Cet argument tient-il la route ?', { meanings: ['retarder', 'braquer'] }),
  v('advanced', 'phase out', '/feɪz aʊt/', 'phr v', 'supprimer progressivement', 'C1', 'The old model will be phased out by 2027.', 'L’ancien modèle sera progressivement supprimé d’ici 2027.'),
  v('advanced', 'bring up', '/brɪŋ ʌp/', 'phr v', 'évoquer / soulever', 'C1', 'Why did you bring that up?', 'Pourquoi as-tu évoqué ça ?', { meanings: ['élever (un enfant)'] }),
  // ---- advanced adjectives / adverbs
  v('advanced', 'reluctant', '/rɪˈlʌktənt/', 'adj', 'réticent', 'C1', 'She was reluctant to sign.', 'Elle était réticente à signer.', { collocations: ['reluctant to + verb'], mistakes: 'Pas « reluctant to + -ing » : reluctant to sign.' }),
  v('advanced', 'meticulous', '/məˈtɪkjələs/', 'adj', 'méticuleux', 'C1', 'He is meticulous about details.', 'Il est méticuleux sur les détails.'),
  v('advanced', 'elusive', '/ɪˈluːsɪv/', 'adj', 'insaisissable', 'C2', 'A solution remains elusive.', 'Une solution reste insaisissable.'),
  v('advanced', 'ubiquitous', '/juːˈbɪkwɪtəs/', 'adj', 'omniprésent', 'C2', 'Smartphones are now ubiquitous.', 'Les smartphones sont désormais omniprésents.'),
  v('advanced', 'ephemeral', '/ɪˈfemərəl/', 'adj', 'éphémère', 'C2', 'Fame can be ephemeral.', 'La célébrité peut être éphémère.', { synonyms: ['short-lived', 'fleeting'] }),
  v('advanced', 'pragmatic', '/præɡˈmætɪk/', 'adj', 'pragmatique', 'C1', 'We need a pragmatic approach.', 'Il nous faut une approche pragmatique.'),
  v('advanced', 'conspicuous', '/kənˈspɪkjuəs/', 'adj', 'voyant / manifeste', 'C2', 'His absence was conspicuous.', 'Son absence était manifeste.', { collocations: ['conspicuous by its absence'] }),
  v('advanced', 'inherently', '/ɪnˈhɪərəntli/', 'adv', 'par nature / intrinsèquement', 'C1', 'Change is inherently uncomfortable.', 'Le changement est par nature inconfortable.'),
  v('advanced', 'arguably', '/ˈɑːɡjuəbli/', 'adv', 'on peut soutenir que', 'C1', 'It’s arguably the best option.', 'C’est sans doute la meilleure option.', { mistakes: 'arguably ≠ « de façon discutable » : il renforce plutôt l’affirmation.' }),
  v('advanced', 'notwithstanding', '/ˌnɒtwɪθˈstændɪŋ/', 'prep', 'malgré / nonobstant', 'C2', 'Notwithstanding the delay, we met the target.', 'Malgré le retard, nous avons atteint l’objectif.', { register: 'formal' }),
  v('advanced', 'albeit', '/ɔːlˈbiːɪt/', 'conj', 'bien que / quoique', 'C2', 'It was a success, albeit a small one.', 'Ce fut un succès, quoique modeste.', { register: 'formal' }),
  // ---- faux amis and traps for French speakers (advanced)
  v('advanced', 'eventually', '/ɪˈventʃuəli/', 'adv', 'finalement / à terme', 'B2', 'Eventually, we found the error.', 'Finalement, nous avons trouvé l’erreur.', { mistakes: 'eventually ≠ éventuellement (= possibly / if necessary).' }),
  v('advanced', 'actually', '/ˈæktʃuəli/', 'adv', 'en fait / en réalité', 'B2', 'Actually, I disagree.', 'En fait, je ne suis pas d’accord.', { mistakes: 'actually ≠ actuellement (= currently / at the moment).' }),
  v('advanced', 'sensible', '/ˈsensəbl/', 'adj', 'raisonnable / sensé', 'B2', 'That’s a sensible decision.', 'C’est une décision raisonnable.', { mistakes: 'sensible ≠ sensible (= sensitive).' }),
  v('advanced', 'prejudice', '/ˈpredʒədɪs/', 'n', 'préjugé', 'C1', 'He faced prejudice because of his accent.', 'Il a subi des préjugés à cause de son accent.', { mistakes: 'prejudice ≠ « préjudice » (= harm, damage).' }),
  v('advanced', 'comprehensive', '/ˌkɒmprɪˈhensɪv/', 'adj', 'complet / exhaustif', 'C1', 'We need a comprehensive review.', 'Il nous faut un examen exhaustif.', { mistakes: 'comprehensive ≠ « compréhensif » (= understanding).' }),
  v('advanced', 'versatile', '/ˈvɜːsətaɪl/', 'adj', 'polyvalent', 'C1', 'She’s a versatile engineer.', 'C’est une ingénieure polyvalente.', { mistakes: 'versatile ≠ « versatile » (= fickle).' }),
];
