# My English Coach — Connecter Gemini en 5 minutes

Sans clé, le partenaire de conversation reste simple (réponses limitées). Avec une **clé Gemini gratuite**, il répond vraiment à ce que vous dites. Cette fiche vous évite les pièges que nous avons rencontrés.

> **Avant de commencer : version 0.6.4 ou plus récente.** Les versions plus anciennes avaient des défauts (adresse remise à zéro, modèle disparu) qui faisaient échouer la connexion. Vérifiez en bas de l'écran **Today** (« Version 0.6.4 »). Sinon, touchez **Check for updates**, ou retéléchargez l'application avec le lien reçu.

---

## 1. Créer la clé (sur le téléphone ou l'ordinateur)

1. Ouvrez **https://aistudio.google.com/apikey** et connectez-vous avec votre compte Google.
2. Touchez **Create API key**. Si l'écran demande un projet, choisissez d'en créer un nouveau ; le nom n'a pas d'importance.
3. **Copiez la clé en entier** (une longue suite de lettres et de chiffres, souvent commençant par `AIza`). Touchez l'icône « copier » plutôt que de recopier à la main.

**Pièges à éviter**
- La clé vient d'**AI Studio**, pas de l'application Gemini ni d'un abonnement Google One : ceux-ci ne donnent pas de clé.
- Ne copiez pas d'espace avant ou après. L'application les retire, mais une clé coupée à la fin ne marchera pas.
- **Ne postez jamais la clé** dans un groupe WhatsApp ni sur une capture d'écran : quiconque la voit peut s'en servir à votre nom. Si cela arrive, supprimez-la dans AI Studio et créez-en une autre.

---

## 2. La mettre dans l'application

1. Dans l'application : **Settings → App → Advanced → Setup guide and connection test**.
   (Raccourci : dans **Speak → Talk to me**, touchez le message bleu « Connect a free AI ».)
2. Dans la carte **Option A**, touchez **Use Google Gemini**.
3. Vérifiez la ligne **« Currently set : https://generativelanguage.googleapis.com/v1beta/openai · model gemini-… »**. Si elle affiche une autre adresse (par exemple `10.0.2.2`), recommencez l'étape 2.
4. Dans le champ **API key**, **collez** la clé.
5. Descendez et touchez **Test connection**. Attendez jusqu'à 20 secondes.

**Résultats possibles**
| Ce que vous voyez | Ce que ça veut dire | Quoi faire |
|---|---|---|
| ✅ « Connected » (et éventuellement « Switched to gemini-… ») | Tout fonctionne. Si le modèle a changé, c'est normal : Google retire des modèles et l'application en choisit un autre. | Passez à l'étape 3. |
| ❌ « fetch failed » + « address tried » | L'application n'a pas pu joindre Internet ou l'adresse est fausse. | Vérifiez le Wi-Fi ou la 4G, puis refaites **Use Google Gemini**. |
| ❌ HTTP 400 ou 403 | Clé fausse, incomplète ou sans accès. | Recopiez la clé depuis AI Studio ; au besoin créez-en une nouvelle. |
| ❌ HTTP 429 | Limite gratuite atteinte. | Attendez quelques minutes. |
| ❌ HTTP 503 « high demand » | Le service de Google est saturé un instant. | Réessayez dans une minute ; l'application réessaie aussi toute seule. |

---

## 3. Vérifier que la conversation est en ligne

1. Allez dans **Speak → Talk to me**.
2. En haut, la ligne **« Partner : llm:gemini-… »** doit apparaître dès l'ouverture. Si elle indique « offline », l'IA est éteinte : retournez à l'étape 2 et touchez **Use Google Gemini**.
3. Écrivez ou dites une phrase. Une vraie réponse arrive en quelques secondes (la première peut prendre jusqu'à 15 secondes).

**Si une réponse tarde ou si le message jaune « AI service is busy » apparaît** : c'est la saturation de Google, pas un défaut de la clé. L'application a utilisé le partenaire hors ligne pour ce tour ; renvoyez une phrase.

---

## 4. À savoir

- **Gratuit, avec des limites.** L'offre gratuite de Google a un quota par minute et par jour, fixé par Google et qui peut changer. Pour un usage d'entraînement personnel, c'est largement suffisant.
- **Confidentialité.** Seul le **texte** de vos messages est envoyé à Google, jamais votre voix. Les conditions de l'offre gratuite peuvent permettre à Google d'utiliser ces textes pour améliorer ses services : n'y écrivez rien de confidentiel.
- **La clé reste sur votre téléphone.** Elle n'est pas dans l'application, pas dans le lien de partage, pas dans la sauvegarde. Si vous réinstallez l'application, il faudra la remettre.
- **Un modèle disparaît ?** Refaites **Test connection** : l'application en choisit un nouveau toute seule.
- **Pour arrêter l'IA** : Settings → App → Advanced → désactivez « Use a language model ». L'application repasse en mode hors ligne.

---

## 5. En cas de problème : que nous envoyer

Dans l'application, **Settings → App → Send feedback**, type **Something is broken**, puis décrivez : à quelle étape ça bloque et **le message exact** affiché (sans la clé). Une capture d'écran de l'écran « AI partner setup » aide beaucoup, **à condition de masquer le champ de la clé**.
