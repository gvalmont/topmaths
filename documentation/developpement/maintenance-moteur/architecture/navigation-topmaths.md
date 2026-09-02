# Navigation Topmaths

L'application Topmaths est pilotée par les paramètres de l'URL. Le paramètre
`v` sélectionne la vue principale et `ref` sélectionne, lorsqu'il est présent,
une ressource ou une sous-page.

`Topmaths.svelte` délègue la lecture de ces paramètres à
`src/topmaths/services/navigationParams.ts`, puis alimente les stores `view`,
`reference`, `reference2` et `isDoubleView`.

## Progressions

La vue des progressions utilise `v=classroom` et les filtres `grade`, `term` et
`options`. `ItemsSelection.svelte` conserve ces filtres dans l'URL sans ajouter
`ref=curriculum`. La présence d'au moins un de ces filtres avec
`v=classroom` désigne donc implicitement la sous-page `curriculum`, sauf si une
autre sous-page valide est explicitement fournie par `ref`.

Ainsi, les deux formes suivantes ouvrent les progressions :

- `?v=classroom&ref=curriculum` ;
- `?v=classroom&grade=3e&term=0`.

À l'inverse, `?v=classroom` sans filtre ni référence ouvre l'accueil des outils
pour la classe.
