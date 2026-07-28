# Vue Quizz

La vue quizz transforme une sélection d'exercices QCM en quiz animé façon
Kahoot, jouable en solo (un élève, un appareil) ou en projection (classe
entière pilotée par l'enseignant). La logique de déroulement est adaptée de la
plateforme Razzia (licence MIT, voir `NOTICE` à la racine du dépôt).

## Routage et paramètres d'URL

| Paramètre | Rôle |
| --- | --- |
| `v=quizzconf` | Vue de configuration (`src/components/setup/quizz/QuizzConf.svelte`), entrée « Quizz » du menu « Autres exports ». |
| `v=quizz` | Vue d'exécution plein écran (`src/components/display/quizz/Quizz.svelte`). |
| `subject` | Titre du quizz (champ de `InterfaceGlobalOptions`). |
| `quizzParam` | Réglages du quizz en base64 (JSON). |

`subject` et `quizzParam` sont déclarés dans `InterfaceGlobalOptions`
(`src/lib/types.ts`), parsés par `mathaleaUpdateExercicesParamsFromUrl` et
persistés par `updateGlobalOptionsInURL` uniquement quand `v` vaut
`quizzconf` ou `quizz` : l'URL étant reconstruite de zéro à chaque
synchronisation, tout nouveau paramètre doit être enregistré à ces trois
endroits pour survivre.

### Contenu de `quizzParam`

```json
{
  "v": 1,
  "mode": "solo | projection",
  "scoring": "full | simple | none",
  "seedMode": "fixed | random",
  "background": { "mode": "none | fixed | random", "image": "fichier.jpg" },
  "sound": true,
  "cooldown": 5,
  "times": [20, 30]
}
```

- `mode` : `solo` (un élève sur son appareil) ou `projection` (classe
  entière). Dans les deux cas, l'avancement après le résultat est manuel
  (bouton « Suivant » / « Terminer ») pour laisser le temps de lire la
  correction. `multi` est réservé (multi-joueurs temps réel, à venir).
- `scoring` : `full` (points dégressifs selon la rapidité et séries, formules
  Razzia), `simple` (1 point par question entièrement réussie), `none`.
- `seedMode` : `fixed` fige les graines `alea` dans le lien (même quizz
  partout) ; `random` les retire du lien (un tirage différent par ouverture).
- `background` : fond blanc, image fixe ou image aléatoire à chaque question,
  parmi les fichiers de `public/images/quizz/backgrounds/` répertoriés dans
  `src/json/quizzBackgrounds.json` (généré par
  `tasks/updateQuizzBackgrounds.js`, chaîné à `pnpm makeJson`).
- `cooldown` : durée d'affichage de l'énoncé seul (3-15 s).
- `times` : temps de réponse par exercice de la sélection (5-120 s, défaut 20).

Le codec (`src/lib/quizz/quizzParams.ts`) est défensif : toute valeur absente
ou invalide est remplacée par sa valeur par défaut.

## Matériel du quizz

`buildQuizz` (`src/lib/quizz/buildQuizz.ts`) charge les exercices depuis les
paramètres d'URL, les génère (graine appliquée, pattern de la CAN :
`mathaleaHandleExerciceSimple` pour les exercices simples,
`nouvelleVersionWrapper` sinon) et extrait les questions :

- une question est retenue si `autoCorrection[i].propositions` contient
  **2 à 4 propositions** (limite des 4 boutons colorés) ;
- l'énoncé provient de `autoCorrection[i].enonce` (repli : `listeQuestions[i]`
  débarrassée du composant `<mathalea-qcm>`), précédé de la consigne et de
  l'introduction pour la première question de l'exercice ;
- les propositions sont prises dans l'ordre d'affichage (déjà mélangé par la
  graine) ; `statut` vrai marque les bonnes réponses ;
- `options.radio === true` (ou une seule solution) donne une question
  `single`, sinon `multi` ;
- la correction affichée à la révélation est `listeCorrections[i]`.

`analyseExerciceQuizz` produit le rapport de compatibilité utilisé par
`quizzconf` (pastilles ok / partiel / incompatible grisé). Les
`ExerciceSimple` avec `versionQcmDisponible` sont détectés comme
« convertibles » : un bouton active `qcm=1` dans les paramètres de l'exercice.

Le lien de partage est construit par `buildQuizzUrl`
(`src/lib/quizz/buildQuizzUrl.ts`) : sélection d'exercices + `v=quizz` +
`subject` + `quizzParam`, avec retrait des graines si `seedMode === 'random'`.

## Architecture du moteur

Le moteur (`src/modules/quizz/`) est du TypeScript pur, sans DOM ni Svelte,
exécutable tel quel côté serveur :

- `engine/QuizzEngine.ts` : machine à états portée du `RoundManager` de
  Razzia — `SHOW_START` → (`SHOW_PREPARED` → `SHOW_QUESTION` →
  `SELECT_ANSWER` → `SHOW_RESULT` + `SHOW_RESPONSES` → [`SHOW_LEADERBOARD`])
  → `FINISHED`. Les réponses ne sont acceptées qu'en phase `SELECT_ANSWER`,
  la première seule compte, et la phase se termine dès que tous les joueurs
  ont répondu.
- `engine/scoring.ts` : `timeToPoint` (décroissance linéaire), `orderToPoint`,
  ratios `single`/`multi` (`strict`/`balanced`/`lenient`), conversion selon
  `scoring` (`full`/`simple`/`none`).
- `transport/QuizzTransport.ts` : interface `broadcast`/`send`/`emit` — la
  surface exacte que Razzia injecte dans son moteur. `LocalTransport` la
  remplit en mémoire (V1) ; un `SocketTransport` la remplira avec socket.io
  en multi-joueurs (V2) sans changer le moteur ni les écrans.
- La vue `Quizz.svelte` alimente les stores de `src/lib/stores/quizzStore.ts`
  (équivalent Svelte de l'événement `game:status`) et filtre les statuts par
  rôle : le parcours « joueur » en solo (`SHOW_RESULT`), le parcours
  « manager » en projection (`SHOW_RESPONSES`, `SHOW_LEADERBOARD`).

Les écrans sont dans `src/components/display/quizz/layouts/` (un composant
par statut) et `presentationalComponents/` (boutons de réponse A-D aux
couleurs Okabe-Ito `--color-quizz-1..4` déclarées dans `src/app.css`, minuteur,
fond, contrôles, panneau de correction). La lisibilité en vidéoprojection est
assurée par une typographie fluide : le `<main>` de la vue est un conteneur
(`.quizz-container`, `container-type: inline-size`) et les classes
`.quizz-text-*` de `src/app.css` dimensionnent les textes en `cqw` bornées par
`clamp()`. Attention : `mathaleaRenderDiv` pose un `font-size` inline via
`resizeContent` (voir `src/lib/components/sizeTools.ts`) qui écraserait ces
classes — la vue utilise donc `quizzRenderDiv`
(`src/components/display/quizz/quizzRender.ts`), qui retire ce style inline
après le rendu KaTeX/figures. Les sons (`public/assets/sounds/quizz/`, adaptés de Razzia) suivent
le mapping statut → son de Razzia et sont coupables à la volée.

## Vers le multi-joueurs temps réel (V2)

Déjà en place : noms de statuts et événements Razzia, moteur isomorphe,
interface de transport, statuts « manager-only », score calculé par le moteur.
Restera : héberger un service Node (moteur + socket.io + rooms à PIN),
écrire `SocketTransport` et les écrans de jointure (PIN/pseudo), sans toucher
au moteur ni aux layouts.

## Tests

`tests/unit/quizzScoring.test.ts`, `quizzParams.test.ts`, `quizzEngine.test.ts`
(machine à états sous faux timers vitest, compatibilité QCM, gel des graines).
