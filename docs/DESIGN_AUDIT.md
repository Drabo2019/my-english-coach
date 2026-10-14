# Audit design — My English Coach 0.5.2

Référentiel : skill **apple-design** (WWDC « Designing Fluid Interfaces », « The Details of UI Typography », « Principles of Great Design »), installé dans `~/.claude/skills/apple-design` (hash git vérifié : `adf68c51…`).

**Méthode.** Lecture du kit UI (`components/ui.tsx`, `constants/theme.ts`, `(tabs)/_layout.tsx`) et d'un balayage du code (couleurs en dur, animations, haptique, tailles de police), puis captures de l'application (build web, largeur 390 px, thème sombre) : onboarding, test de niveau, Accueil, Learn, Review, Progress, Settings, Sentences.

**Limites.** Le rendu web n'est pas le rendu Android : les polices, les marges système et la barre d'état diffèrent. Je n'ai **pas** vu le thème clair, ni les écrans Speak (conversation, scénarios, pronunciation), Reading, Writing et Grammar. Les remarques « code » sont vérifiées dans le source ; les remarques « capture » viennent du build web.

Légende : **P1** gêne réelle / incohérence visible · **P2** finition · **P3** amélioration.

---

## Ce qui est déjà bon

- **Retour au toucher immédiat** : `Pressable` avec état `pressed` (opacité) sur `Btn` et `Card` → réponse dès le contact (§1).
- **Police système**, interlignage cohérent par variante (`SIZE` dans `ui.tsx`), `label` en capitales avec suivi positif (§15).
- **Échelle de texte** réglable + contraste élevé + thème sombre/clair suivant le système (§14, Flexibilité).
- **Navigation** : chaque sous-écran a un bouton retour / fermer explicite (corrigé en 0.1.2) → « comment en sortir ? » est couvert (§16, Wayfinding).
- **Confirmation seulement pour le destructif** (quitter le test, tout effacer, restaurer une sauvegarde) (§16, Agency).

---

## Constats

### A. Réponse, mouvement, retour sensoriel (§1, 3, 4, 13, 14)

| # | Prio | Constat | Preuve | Correctif proposé |
|---|---|---|---|---|
| A1 | P1 | **Aucun retour au toucher sur les `Chip`** (filtres, niveaux, vitesses, objectifs). Ils changent d'état seulement après le relâchement. | `ui.tsx` : `Chip` utilise un `Pressable` sans fonction `style={({pressed})…}` | Même état `pressed` que `Btn` + légère réduction d'échelle (0,97) |
| A2 | P1 | **Zones de toucher trop petites** : `Btn small` = 36 px, `Chip` ≈ 34 px (7 + 7 + ligne). Recommandé : 44–48 px. Les boutons 🔊 Listen / 🐢 Slow sont les plus utilisés. | `ui.tsx` : `minHeight: small ? 36 : 48`, `Chip` sans `minHeight` | `minHeight` 44 + `hitSlop` 6–8 px, sans agrandir le visuel |
| A3 | P2 | **Aucune animation, nulle part** : la barre `Bar` saute à sa valeur, les cartes de résultat apparaissent d'un coup, le bouton « Update now » bascule en « Downloading 37 % » sans transition. | recherche `Animated`/`reanimated`/`LayoutAnimation` → 0 occurrence | Ressorts amortis à 1,0 (pas de rebond) sur `Bar`, apparition des résultats (opacité + 8 px), bascule des états de bouton ; jamais de rebond hors geste |
| A4 | P2 | **Aucune haptique**, alors que le produit repose sur des moments nets : bonne réponse, mauvaise réponse, fin de session, micro prêt. | recherche `Haptics` → 0 | `expo-haptics` : léger sur bonne réponse / micro prêt, avertissement sur erreur. Rare (§13 « Utility ») |
| A5 | P3 | **Mouvement réduit** : rien à adapter aujourd'hui, mais dès que A3 est fait il faut `AccessibilityInfo.isReduceMotionEnabled` → fondu court sans translation. | — | À prévoir avec A3 |

### B. Typographie (§15)

| # | Prio | Constat | Preuve | Correctif |
|---|---|---|---|---|
| B1 | P2 | **Suivi (letter-spacing) uniforme** : seul `label` en a un. Le titre 26 px/700 n'est pas resserré ; les petits textes (13 px) ne sont pas ouverts. | `ui.tsx` `SIZE` sans `letterSpacing` | `title` −0,3 ; `h2` −0,1 ; `small` +0,1 ; `body` 0 |
| B2 | P2 | **Double échelle de texte** : `T` multiplie par `settings.fontScale` **et** React Native applique déjà la taille de police du système. À 130 % système × 125 % app, le texte atteint ~160 %, alors que les marges restent fixes. | `T` : `fontSize: s.fontSize * settings.fontScale`, pas de `maxFontSizeMultiplier` | Plafonner (`maxFontSizeMultiplier={1.4}`) et documenter l'échelle de l'app comme complément, ou la supprimer au profit de la taille système |
| B3 | P3 | Hiérarchie par taille seulement sur plusieurs écrans (Progress : libellés, minutes et niveau au même poids). | capture Progress | Niveau en `600`, minutes en `textSecondary`, chiffres tabulaires (`fontVariant: ['tabular-nums']`) |
| B4 | P3 | Noms de compétences en minuscules (« vocabulary », « grammar ») dans Progress, titres en casse de phrase ailleurs. | capture Progress | Casse cohérente (« Vocabulary ») |

### C. Cohérence et familiarité (§16)

| # | Prio | Constat | Preuve | Correctif |
|---|---|---|---|---|
| C1 | **P1** | **Deux langues mélangées dans la même interface** : titres et boutons en anglais, explications en français (« Test de niveau », « Quitter », « Je ne sais pas » à côté de « Start review », « Check »). 31 fichiers d'écran/fonctionnalité contiennent du français. Le mélange est en partie voulu (aide en français), mais le **cadre de l'interface** n'a pas de langue unique. | captures onboarding, placement, Review, Progress ; `grep` | **Décision à prendre** : (a) interface 100 % anglais, aide française clairement signalée ; ou (b) interface française, contenu d'apprentissage en anglais. Pour des amis avancés : (a) |
| C2 | P1 | **Notes de version en Markdown brut** dans la carte de mise à jour : « - Home: a visible "Check for updates" … ». | capture Accueil | Retirer `- `, `*`, `##` ; première phrase en gras ; « Voir les nouveautés » vers la page de la release |
| C3 | P2 | **Couleur d'erreur en dur** `#C2312B` (3 écrans), qui ignore le thème sombre et le contraste élevé. | `placement.tsx:127`, `fearless.tsx:76`, `find-words.tsx:72` | Utiliser `th.bad` |
| C4 | P2 | **Onglet « Home »** : libellé générique (§16 « nommer par le contenu »). Et l'écran a trois titres empilés : « Home » (barre), « Today's English », « Level A2 ». | capture Accueil | Onglet « Today », barre sans titre dupliqué (ou titre seul) |
| C5 | P2 | **Icônes d'onglets en émojis** : rendu différent selon le constructeur, couleurs vives incompatibles avec le teint actif/inactif ; en inactif (opacité 0,55) elles sont ternes et peu lisibles en sombre. | `(tabs)/_layout.tsx` `TabIcon` ; capture | Icônes vectorielles monochromes (`@expo/vector-icons`, ex. Ionicons), teintées par `tabBarActiveTintColor` |
| C6 | P2 | Mêmes émojis comme icônes de cartes (Learn, Speak) : cohérent entre eux mais hétérogène (aplat, 3D, dégradé). | capture Learn | Un jeu d'icônes unique, ou aucun |

### D. Simplicité et hiérarchie (§16)

| # | Prio | Constat | Preuve | Correctif |
|---|---|---|---|---|
| D1 | **P1** | **Écran d'accueil trop chargé** : bandeau de mise à jour (grande carte), barre de progression, « Talk to me », plan (4 cartes imbriquées), « Recommended for you » (qui **répète** le plan), puis 4 boutons fantômes. L'action principale (« Talk to me ») est repoussée sous la carte de mise à jour. | capture Accueil | Mise à jour = une ligne discrète (bouton « Update », notes sur demande) ; supprimer « Recommended for you » ou le fusionner avec le plan ; une seule action principale visible sans défiler |
| D2 | P1 | **Réglages enterrés** : accessibles uniquement par un bouton fantôme en bas de l'accueil (avec Search, My English). Aucun accès depuis les autres onglets. | `(tabs)/index.tsx` ; `grep '/settings'` | Icône ⚙︎ dans la barre d'en-tête (ou onglet), comme « How do I say… » |
| D3 | P2 | **Cartes dans des cartes** (plan du jour) : bordures doublées, rythme lourd. | capture Accueil | Lignes séparées par un filet dans une seule carte |
| D4 | P2 | **Settings commence par le dépôt GitHub et l'URL du serveur d'IA** (`http://10.0.2.2:11434/v1`, adresse d'émulateur). Les réglages de tous les jours (minutes, aide française, variante) viennent après. | capture Settings | Ordre : Learning → Audio/Accessibilité → Sauvegarde → **Avancé** (dépôt, IA) replié |
| D5 | P2 | **Progress** : une liste de lettres sans visuel ; « Streak: 0 day(s) » (pluriel bricolé) ; états vides sans consigne (« 0 words learned »). | capture Progress | Barres fines par compétence, pluriels corrects, état vide qui dit quoi faire en premier |
| D6 | P3 | Pied de page « Version 0.0.0 » sur le web et dans la carte de mise à jour (« you have 0.0.0 »). | capture | Masquer hors Android |

### E. Parcours d'entrée (§16 Wayfinding / Craft)

| # | Prio | Constat | Preuve | Correctif |
|---|---|---|---|---|
| E1 | P1 | **Aucune indication d'étape** dans l'onboarding (3 écrans identiques, même titre « My English Coach »). | captures | Pastilles « 1 / 3 » ou barre de progression |
| E2 | P1 | **Test de niveau : 31 questions sans barre de progression**, seulement « QUESTION 1 / 31 · GRAMMAR ». Les questions sont triées par compétence (toutes les grammaires, puis la lecture, l'écoute, le vocabulaire), donc la **difficulté remonte de A1 à C2 puis retombe à A1** à chaque changement de compétence. | `placement.tsx:46`; capture | Barre fine ; ordre par difficulté croissante, intercalé par compétence |
| E3 | P2 | **Bouton « Quitter » collé au bord droit** de la barre d'en-tête du test (pas de marge). | capture placement | Marge droite d'en-tête comme sur « How do I say… » |
| E4 | P2 | Onboarding : boutons « ← Retour » et « Continuer » côte à côte, de largeurs inégales ; primaire non aligné sur le reste de l'application (pleine largeur). | capture | Primaire pleine largeur, « Retour » en lien texte au-dessus |
| E5 | P2 | « Je ne sais pas » (français) plus petit que les réponses (anglais), sous la même pile. | capture placement | Même taille, en anglais (« I don't know ») ou libellé commun |
| E6 | P3 | Le test est passé de 21 à 31 questions en 0.5.0 mais l'écran d'accueil du test annonce toujours « ≈ 8 min ». | capture ; `onboarding.tsx` | Mesurer la durée réelle et corriger l'annonce |

### F. Matériaux et profondeur (§12)

| # | Prio | Constat | Correctif |
|---|---|---|---|
| F1 | P3 | Barre d'onglets et en-têtes opaques, séparés par un filet. Le skill recommande des surfaces translucides avec défilement dessous. Sur Android, `BlurView` (`expo-blur`) est coûteux et inégal. | **Ne pas faire** pour l'instant : gain faible, risque de performance sur téléphones modestes. À reconsidérer sur iOS |

---

## Plan proposé (ordre conseillé)

**Lot 1 — rapide, sans risque (≈ 1 session, release 0.5.3)**
A1, A2, C2, C3, E3, E5, D6, B4.

**Lot 2 — hiérarchie et navigation**
D1, D2, D4, C4, C5, E1, E2, E4, D3.

**Lot 3 — finition et mouvement**
A3, A4, A5, B1, B2, B3, D5.

**Décision à prendre avant le lot 2 : C1 (langue de l'interface).** C'est le plus visible pour des testeurs avancés. Recommandation : interface en anglais, avec l'aide française limitée aux explications de grammaire et aux traductions.

## Statut

- **Lot 1 : fait en 0.5.3** (A1, A2, C2, C3, E3, E5, D6, B4). Décision C1 : **interface en anglais** ; la traduction des textes français de l'interface se fait avec le lot 2.
- **Lot 2 : fait en 0.5.3** (D1, D2, D3, D4, C1, C4, C5, E1, E2, E4). « 5-Minute English » et « My English » déplacés dans l'onglet Learn.
- **Lot 3 : fait en 0.5.4** (A3, A4, A5, B1, B2, B3, D5). Reste volontairement non traité : F1 (matériaux translucides), C6 (jeu d'icônes des cartes Learn/Speak).
