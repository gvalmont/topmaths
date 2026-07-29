# Éditeur Instrumenpoche

Le custom element `alea-iep-editeur` affiche un éditeur de programme de
construction aux instruments. Il sert notamment pour les exercices où l'élève
doit compléter une suite d'étapes puis tester l'animation avec Instrumenpoche.

## Utilisation dans un exercice

Utiliser le helper `addEditeurIep()` depuis
`src/lib/customElements/ElementIepEditeur.ts`.

```ts
import {
  addEditeurIep,
  type InstructionIep,
  type InstructionsDisponiblesIep,
} from '../../lib/customElements/ElementIepEditeur'

const programmeInitial: InstructionIep[] = [
  { type: 'point', nom: 'A', x: 0, y: 0, protege: true },
  { type: 'point', nom: 'B', x: 5, y: 0, protege: true },
  { type: 'segment', p1: 'A', p2: 'B' },
]
const instructionsDisponibles: InstructionsDisponiblesIep = [
  'parallele',
  'intersection',
]

texte += addEditeurIep(this, i, {
  programmeInitial,
  instructionsDisponibles,
})
```

Le helper :

- retourne une chaîne vide hors HTML ;
- construit l'id avec la convention des `MathaleaCustomElement` si aucun `id`
  n'est fourni ;
- renseigne `autoCorrection[questionIndex].formatInteractif` avec
  `alea-iep-editeur`.

## Programme initial

L'option `programmeInitial` reçoit un tableau d'`InstructionIep`. Ces
instructions sont chargées au premier affichage de l'éditeur et sont incluses
dans l'animation comme dans la valeur sauvegardée.

Si l'exercice est régénéré avec un autre `programmeInitial` mais le même id
d'éditeur, l'éditeur abandonne le programme sauvegardé précédent et repart du
nouveau programme initial. Cela évite de conserver les étapes d'une ancienne
version après un changement de paramétrage de l'exercice.

Chaque instruction peut porter `protege: true`. Ces instructions restent
visibles, mais l'élève ne peut pas les modifier, les supprimer ni les déplacer.
Les autres instructions du programme initial peuvent donc servir d'erreurs à
corriger.

L'option `instructionsInitialesProtegees` reste disponible pour verrouiller une
liste d'indices en dehors des instructions, en commençant à `0`. Le raccourci
`programmeInitialProtege: true` verrouille tout le programme initial.

## Instructions disponibles

L'option `instructionsDisponibles` limite les types proposés dans le menu
« Ajouter une instruction ». Elle reçoit des valeurs de type
`TypeInstructionIep`, ou directement une liste typée
`InstructionsDisponiblesIep`.

Cette configuration convient par exemple pour faire construire un
parallélogramme avec les côtés opposés parallèles :

```ts
texte += addEditeurIep(this, i, {
  programmeInitial,
  instructionsDisponibles: ['parallele', 'intersection'],
})
```

Pour une construction par cercles de centre `O`, on peut proposer une palette
différente :

```ts
texte += addEditeurIep(this, i, {
  programmeInitial,
  instructionsDisponibles: ['cercle', 'intersection'],
})
```

Les instructions `polygone` et `polygoneRapide` tracent un polygone fermé avec
les méthodes Alea2iep correspondantes :

- `polygone` appelle `Alea2iep.polygoneTracer` ;
- `polygoneRapide` appelle `Alea2iep.polygoneRapide`.

Elles reçoivent les sommets sous forme de chaîne, séparés par des virgules,
espaces ou points-virgules :

```ts
const programmeInitial: InstructionIep[] = [
  { type: 'point', nom: 'A', x: 0, y: 0 },
  { type: 'point', nom: 'B', x: 5, y: 0 },
  { type: 'point', nom: 'C', x: 2, y: 3 },
  { type: 'polygone', sommets: 'A,B,C' },
]
```

L'instruction `milieu` place un point nommé au milieu de deux points déjà
construits, avec la macro `Alea2iep.milieuALaRegle()`.

## Options utiles

| Option | Rôle |
| --- | --- |
| `programmeInitial` | Instructions déjà présentes dans l'éditeur. |
| `instructionsDisponibles` | Types d'instructions proposés dans le menu d'ajout. |
| `protege` | Propriété d'une instruction initiale qui la protège contre l'édition, la suppression et le déplacement. |
| `instructionsInitialesProtegees` | Indices des instructions initiales à protéger. |
| `programmeInitialProtege` | Raccourci pour protéger tout le programme initial. |
| `loadSaveButtons` | Affiche les boutons de sauvegarde et chargement JSON. |
| `allowFullscreen` | Ajoute le bouton de test de l'animation en plein écran. |
| `interactivityOn` | Désactive l'édition quand la valeur vaut `false` : la zone d'ajout et les boutons de modification des lignes sont masqués, mais le bouton « Tester l'animation » reste disponible. |
| `verifyCallbackName` | Nom d'une callback de vérification enregistrée avec `ElementIepEditeur.registerVerificationCallback()`. |

## Vérification interactive

`ElementIepEditeur.verifQuestion(exercice, i)` enregistre la réponse élève dans
`exercice.answers`, désactive l'éditeur, puis vérifie la construction.

Par défaut, la vérification compare le programme élève à la réponse attendue
déclarée avec `handleAnswers()`, après normalisation des clés et sans tenir
compte de `protege`.

Pour les constructions qui acceptent plusieurs procédures équivalentes, utiliser
un callback nommé :

```ts
ElementIepEditeur.registerVerificationCallback('mon-verificateur', ({
  studentProgram,
  expectedRaw,
}) => {
  // Rejouer ou analyser studentProgram, puis comparer les objets finaux utiles.
  return { isOk: true, feedback: 'Bravo !' }
})

texte += addEditeurIep(this, i, {
  programmeInitial,
  verifyCallbackName: 'mon-verificateur',
})
```

La callback reçoit `exercice`, `questionIndex`, `editor`, `studentProgram` et
`expectedRaw`, puis retourne `{ isOk, feedback?, score? }`.
