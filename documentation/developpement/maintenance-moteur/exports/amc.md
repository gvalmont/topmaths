# Moteur d'export AMC

Cette page décrit le pipeline partagé d'Auto Multiple Choice. Pour déclarer AMC
dans un exercice, consultez le
[guide auteur](../../auteurs-exercices/complements/export-amc.md).

## Entrées

Le moteur traite principalement :

- les métadonnées `amcReady` et `amcType` ;
- `autoCorrectionAMC`, structure canonique des nouveaux développements ;
- `autoCorrection`, réutilisée par certains QCM et chemins d'inférence ;
- `questionsAMC`, structure historique encore présente dans des exercices.

Les types sont définis dans `src/lib/amc/amcTypes.ts`.

## Pipeline

1. `amcInference.ts` déduit une structure AMC lorsque le format interactif
   fournit assez d'informations.
2. `amcNormalize.ts` transforme les variantes acceptées en une représentation
   cohérente.
3. `amcRender.ts` produit le contenu consommé par l'export LaTeX AMC.
4. Les anciens exercices peuvent encore utiliser `amcConvert()` pour alimenter
   `questionsAMC`.

La preview HTML conserve les contenus mathématiques délimités par `$...$` ou
`\[...\]` avant d'y convertir les sauts de ligne textuels. Les séparateurs
`\\` des environnements KaTeX comme `array`, `aligned` ou les matrices ne
doivent jamais devenir des balises `<br>`.

L'inférence est une aide, pas un remplacement pour une déclaration explicite
quand la question contient plusieurs sous-réponses ou un format ambigu.

## Politique d'inférence par `formatInteractif`

La décision se prend d'abord sur `autoCorrection[i].formatInteractif`, plus
précis que `interactifType` au niveau de l'exercice. Les alias historiques et
les custom elements modernes doivent conduire au même contrat AMC.

| Formats observés                                                                                | Inférence automatique                                      | Condition                                                                                                                                      |
| ----------------------------------------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `qcm`, `mathalea-qcm`                                                                           | `qcmMono` ou `qcmMult`                                     | au moins deux propositions ; `qcmMult` dès qu'une question possède plusieurs réponses vraies                                                   |
| `mathlive`, `mathalea-mathfield`, ancien `calcul`                                               | `AMCNum`                                                   | une seule valeur finie, numérique ou fractionnaire, sans réponses alternatives                                                                 |
| `fillInTheBlank`, `fill-in-the-blank`, `multi-mathfield`, `tableauMathlive`, `tableau-mathlive` | `AMCNum` pour un champ, `AMCHybride` pour plusieurs champs | tous les champs doivent être numériques et indépendants                                                                                        |
| `liste-deroulante`                                                                              | `AMCOpen`                                                  | la correction interactive ne contient pas toujours la liste complète des choix ; un QCM n'est sûr que si l'exercice le construit explicitement |
| formats texte, construction, clic, glisser-déposer, tableur, éditeurs et composants graphiques  | `AMCOpen`                                                  | l'énoncé LaTeX statique et la correction restent imprimables, mais la réponse ne peut pas être transposée fidèlement                           |
| format absent ou inconnu                                                                        | `AMCOpen`                                                  | aucun exercice ne doit disparaître silencieusement de la page d'export                                                                         |

Une réponse contenant plusieurs valeurs acceptées ne doit pas être réduite
arbitrairement à la première valeur : elle bascule en `AMCOpen` tant qu'une
représentation AMC équivalente n'est pas démontrée.

### Différence entre `setReponse()` et `handleAnswers()`

Le `formatInteractif` passé à l'ancien `setReponse()` décrit parfois une
comparaison (`fractionEgale`, `Num`, `Den`, `unites`, `puissance`, etc.). Le
wrapper transmet ensuite à `handleAnswers()` un format de composant normalisé,
souvent `mathlive`. Il ne faut donc pas interpréter ces deux vocabulaires comme
s'ils portaient la même information.

Pendant la passe AMC, `setReponse()` normalise notamment `fractionEgale` : la
fraction est réduite avant le dimensionnement des cases et une fraction entière
devient un entier (`100/25` devient `4`). Cela évite de dimensionner une grille
à partir du développement décimal flottant de `1/14`, par exemple.

## Invariants

- une entrée `AMCNum` décrit une réponse numérique unique ;
- `AMCHybride` contient plusieurs blocs indépendants ;
- un QCM conserve le même statut des propositions en HTML et en AMC ;
- un format dynamique doit fournir une alternative imprimable ;
- la correction AMC ne doit pas dépendre du DOM ou d'un état JavaScript.

Toute évolution des structures doit préserver les exercices historiques ou
prévoir une migration ciblée.

## Validation

Les rapports `AMCNum` et les tests d'exercices sont décrits dans
[Rapports d'exercices](../../../tests/rapports-exercices.md). Vérifiez également
les sorties LaTeX pour chaque type AMC modifié.
