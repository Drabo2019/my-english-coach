# My English Coach — Guide du testeur (version 0.6.4)

Merci d'accepter de tester l'application. C'est une **version de test entre personnes de confiance** : elle n'est pas sur le Play Store, et vos retours servent à décider ce qu'on améliore. Vous êtes déjà à l'aise en anglais : c'est justement ce qui nous intéresse. La question centrale est **« est-ce que cette application m'aide encore à progresser à mon niveau (B2, C1, C2) ? »**

> Durée recommandée : **10 à 15 minutes par jour pendant 5 à 7 jours**. Un premier tour de 30 minutes suffit déjà pour donner un avis utile.

---

## 1. Ce qu'est l'application

My English Coach est un entraîneur d'anglais pour francophones. Il suit une logique simple :

**Comprendre → Retenir → Construire des phrases → Parler → Recevoir un retour → Reparler.**

- **Sans compte, sans publicité, sans suivi.** Tout reste sur votre téléphone.
- **Fonctionne hors ligne** (sauf la vérification des mises à jour et l'IA optionnelle).
- **Priorité à l'oral** : conversation, « Find the words », shadowing, prononciation.
- **Un plan du jour** calculé d'après vos erreurs et vos faiblesses réelles, pas un parcours figé.
- **Interface en anglais** : le français n'est utilisé que pour les explications de grammaire et les traductions.

### Pour les niveaux avancés (nouveau dans la 0.5.0)

- Le **test de niveau monte jusqu'à C2** (vocabulaire, grammaire, lecture, écoute, une phrase à répéter).
- **Contenu C1/C2** : plus de 60 phrases (nuance, diplomatie, négociation, structures comme l'inversion, les conditionnels mixtes, le subjonctif), 45 mots avancés, 6 sujets de grammaire, 5 textes de lecture, 3 écoutes, 5 situations « Find the words ».
- **Shadowing** jusqu'au niveau C2.

> Soyons honnêtes : le gros du contenu reste entre A2 et B2 (le public de départ). Le contenu C1/C2 est **récent et plus petit** : dites-nous précisément où il vous manque quelque chose.

---

## 2. Installer l'application (Android)

1. **Touchez ce lien depuis votre téléphone** pour télécharger l'application (environ 70 Mo) :
   [**⬇ Télécharger My English Coach (APK)**](https://github.com/Drabo2019/my-english-coach/releases/latest/download/my-english-coach.apk)
   Ce lien donne toujours la **dernière version** (actuellement la 0.6.4). Notes de version : [page des versions](https://github.com/Drabo2019/my-english-coach/releases/latest). Vous pouvez aussi recevoir le fichier par WhatsApp / Drive / clé USB.
2. Touchez le fichier. Android demande d'**autoriser l'installation d'applications inconnues** pour l'application que vous utilisez (Chrome, Fichiers, WhatsApp…) : autorisez.
3. **Google Play Protect** peut afficher « application non reconnue » : choisissez **Installer quand même**. C'est normal pour une version de test.
4. Ouvrez **My English Coach**.

### Téléphones compatibles

- **Android 7.0 ou plus récent**, **64 bits** (c'est le cas de presque tous les téléphones depuis 2017). Pour vérifier : Réglages → À propos du téléphone → Version d'Android.
- **iPhone : non disponible pour le moment.** Une version iPhone demande un compte développeur Apple. Si vous êtes sur iPhone, vous pouvez quand même relire ce guide et nous dire ce que vous en attendez.

### Mises à jour

En bas de l'écran **Today**, touchez **Check for updates**. Si une nouvelle version existe, une ligne « Version X is available » apparaît avec le bouton **Update** : l'application la télécharge et ouvre l'installateur Android (il faut confirmer ; votre progression est conservée). L'application vérifie aussi automatiquement une fois par jour.

---

## 3. Premier lancement : le test de niveau

1. Répondez aux questions d'**objectifs** (pourquoi, combien de minutes par jour, domaine).
2. Passez le **test de niveau** (environ 10 minutes, 31 questions, de A1 à C2) : questions à choix, écoute, et phrases à répéter à voix haute.
3. Vous obtenez un **niveau par compétence** (vocabulaire, grammaire, lecture, écoute, prononciation, expression) et vos points faibles.

**Conseils :**
- Répondez honnêtement ; **ne devinez pas** si vous ne savez pas, c'est la seule façon d'obtenir un niveau fiable.
- Autorisez le **micro** quand on vous le demande (une seule fois).
- Vous pouvez le refaire à tout moment : **Settings → Learning → Retake the level test**.

**À nous dire :** le niveau obtenu vous paraît-il juste ? Trop bas ? Trop haut ? Pour quelle compétence ?

---

## 4. Ce qu'il faut essayer (checklist)

Cochez au fur et à mesure. Pour chaque point, notez : **ça marche / ça ne marche pas / ce n'est pas clair**.

### Today (accueil)
- [ ] Le **plan du jour** est-il cohérent avec votre niveau et votre temps disponible ?
- [ ] Les trois icônes en haut à droite (**recherche**, **How do I say…?**, **réglages**) s'ouvrent correctement.
- [ ] **Learn → 5-Minute English** et **Learn → My English** (éléments sauvegardés) fonctionnent.

### Parler (l'onglet le plus important)
- [ ] **🎙 Talk to me (free talk)** : parlez 2 à 3 minutes. L'application vous comprend-elle ? Les réponses sont-elles naturelles ? Posez-lui une question (« what do you mean? », « how are you? ») : répond-elle ?
- [ ] **Vraie conversation (optionnel)** : touchez le message « Connect a free AI » dans la conversation, puis **Option A** (Google Gemini ou Groq : compte gratuit, clé à créer et à coller). Touchez **Use …**, collez la clé, puis **Test connection** : l'application choisit toute seule un modèle qui répond. La conversation devient-elle naturelle ? Les réponses arrivent-elles assez vite ? Pas à pas détaillé : fiche « Connecter Gemini en 5 minutes » (`docs/guides/guide-gemini.pdf`).
- [ ] À la fin, **❌/✅ corrections** : sont-elles justes ? Y a-t-il de **fausses corrections** ?
- [ ] **Find the words** : l'indice progressif vous aide-t-il ? Le **temps avant vos premiers mots** s'affiche-t-il ?
- [ ] **Shadowing** (niveau C1 ou C2) : la phrase est lue, puis le micro s'ouvre. Le micro **capte-t-il la voix de synthèse** (ce qui fausserait le score) ?
- [ ] **Pronunciation** : le résultat vous semble-t-il juste ? Mots marqués faux à tort ?
- [ ] **Scenarios** et **Small talk** : réalistes ?
- [ ] **Speak without fear** : la progression en 10 étapes a-t-elle du sens à votre niveau ?

### Apprendre
- [ ] **Sentences**, **Vocabulary**, **Grammar** : trouvez-vous du **C1/C2** ? Est-ce **utile** ou trop scolaire ?
- [ ] **Reading** / **Listening** : niveau des textes ? Questions trop faciles ?
- [ ] **Writing** : le retour sur vos phrases est-il pertinent ?
- [ ] **Modern English** (expressions actuelles) : intéressant ?

### Réviser et progresser
- [ ] **Review** : les cartes arrivent-elles au bon rythme ? Trop de répétitions ?
- [ ] **Progress** : le niveau affiché et les statistiques vous semblent-ils justes ?
- [ ] **My English Mistakes** : vos erreurs récurrentes sont-elles bien repérées ?
- [ ] **How do I say…?** (icône en forme de bulle, en haut à droite) : donnez une phrase en français, vérifiez la traduction.

### Réglages
- [ ] **Settings → Audio and accessibility → Appearance** : System / Light / Dark. Le thème change-t-il partout, sans zone illisible ?
- [ ] **Icône de partage** (en haut à droite) : le message avec le lien de téléchargement s'ouvre-t-il dans WhatsApp ?
- [ ] **Backup** : exporter la progression en fichier JSON puis la **restaurer** (idéalement après réinstallation).
- [ ] **Settings → App → Advanced → AI conversation partner** : optionnel, uniquement si vous avez Ollama sur un ordinateur (voir « Setup guide and connection test »).

---

## 5. Ce que nous voulons surtout savoir (niveaux avancés)

1. **Difficulté** : le contenu est-il trop facile ? À partir de quel niveau l'application cesse-t-elle de vous apprendre quelque chose ?
2. **Pertinence** : le vocabulaire et les phrases C1/C2 sont-ils ceux dont on a vraiment besoin (travail, réunions, négociation, e-mails) ?
3. **Justesse du correcteur** : donnez les cas où il **corrige à tort** ou **laisse passer** une vraie erreur.
4. **Reconnaissance vocale** : comprend-elle votre accent ? Votre téléphone ? Dans le bruit ?
5. **Conversation** : le partenaire hors ligne est simple. Est-ce un frein à votre niveau ? Avec une IA gratuite connectée, est-ce plus naturel ?
6. **Habitude** : revenez-vous le lendemain ? Qu'est-ce qui vous fait décrocher ?
7. **Ce qui manque** : une fonction, un type d'exercice, un sujet.

---

## 6. Envoyer vos retours

**Dans l'application (le plus simple) : bouton « Send feedback »**
1. Ouvrez **Settings → App → Send feedback** (ou **Progress → Send feedback / report an issue**, ou le bouton **💬 Feedback on this screen** présent sur plusieurs écrans : il indique automatiquement l'écran concerné).
2. Choisissez le **type** : *Something is broken*, *This correction is wrong*, *Too easy*, *Too hard*, *Too academic*, *Suggestion*…
3. **Décrivez** en quelques mots : ce que vous faisiez, ce qui s'est passé, ce que vous attendiez. Pour un problème, la description est demandée.
4. Touchez **Send feedback** : le message s'ouvre dans **WhatsApp** (ou l'application de votre choix : e-mail, SMS…), déjà rempli avec la **version de l'application, le modèle de téléphone, la version d'Android, l'écran et votre niveau**. Il ne reste qu'à l'envoyer.
5. Pour un problème d'affichage, **ajoutez une capture d'écran** dans la même conversation.

Vos retours sont aussi gardés sur le téléphone ; **Send feedback → Share the whole list** les envoie tous d'un coup.

**Hors de l'application :** envoyez-nous un message avec l'écran, ce que vous avez fait, ce qui s'est passé, une capture d'écran, votre modèle de téléphone et la version d'Android.

---

## 7. Vie privée

| Donnée | Où | Quitte le téléphone ? |
|---|---|---|
| Progression, erreurs, cartes, notes, retours | Stockage privé de l'application | **Non.** Pas de compte, pas d'analytics. |
| Audio | **Jamais enregistré ni envoyé par l'application** | Android traite la voix pour la reconnaissance (voir ci-dessous). |
| Vérification des mises à jour | GitHub, une fois par jour (désactivable) | Requête HTTPS ; GitHub voit votre adresse IP. |
| Sauvegarde / retours exportés | Seulement quand vous touchez Export | Le fichier est à vous. |
| IA optionnelle | Seulement si vous l'activez et saisissez une adresse | Vers **votre** serveur. |

**Reconnaissance vocale.** L'application utilise celle d'Android. Selon le téléphone et le **pack anglais hors ligne** installé, l'audio peut être traité **sur le téléphone ou par les serveurs de Google**. L'application ne peut pas garantir le traitement local. Pour rester en local : Réglages Android → Google → Reconnaissance vocale hors ligne → installer l'anglais.

**Supprimer ses données :** Settings → Your data → *Delete conversation history* ou *Delete all my data*. Désinstaller l'application efface tout.

---

## 8. Limites connues (à savoir avant de juger)

- **Voix de synthèse** : celles d'Android (qualité variable selon le téléphone). Des voix plus naturelles sont à l'étude ; votre retour compte pour décider.
- **Partenaire de conversation hors ligne** : sans modèle de langage, il écoute quelques intentions (« what do you mean ? », « how are you ? », réponses très courtes) mais reste limité. Pour une vraie conversation : un compte gratuit Groq ou Google Gemini (clé à coller dans l'application, voir « Connect a free AI »), ou Ollama sur un ordinateur. Les offres gratuites et les noms de modèles dépendent de ces services et peuvent changer.
- **Prononciation** : mesure l'**intelligibilité** (le mot est-il reconnu ?), pas les phonèmes.
- **Correcteur** : règles pour les erreurs typiques des francophones ; il ne comprend pas tout et peut se tromper.
- **Pas de version iPhone** pour l'instant. Pas de synchronisation entre appareils (utiliser Backup).
- **Contenu C1/C2** : nouveau et encore limité en volume.

---

## 9. Dépannage

| Problème | Solution |
|---|---|
| « Application non installée » | Désinstallez l'ancienne version puis réinstallez (vous perdrez la progression : faites d'abord un **Backup**). |
| Le micro ne répond pas | Réglages Android → Applications → My English Coach → Autorisations → Micro : autoriser. Vérifiez qu'une reconnaissance vocale Google est installée. |
| « No speech detected » | Parlez après le signal, rapprochez le téléphone, réduisez le bruit. |
| Pas de voix | Réglages Android → Synthèse vocale : vérifier qu'une voix **anglaise** est installée. |
| Bouton Retour qui ferme l'application | Signalez-le avec l'écran concerné (c'était un bug corrigé en 0.1.2). |
| L'application plante | Notez ce que vous faisiez, envoyez une capture d'écran + modèle de téléphone. |

---

*Merci ! Chaque retour précis (« sur cet écran, à ce moment, ceci ») vaut dix remarques générales.*
