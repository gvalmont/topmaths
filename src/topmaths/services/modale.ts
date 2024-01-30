// eslint-disable-next-line camelcase
import { listeDesUrl, urlExercice, vue, vuePrecedente } from './store'
import { estCoopmaths, supprimerGraines } from './outils'
import { get } from 'svelte/store'

export function lancerExercices (lien: string): void {
  listeDesUrl.set([])
  if (estCoopmaths(lien)) {
    lancerExercicesMathalea(lien)
  } else {
    naviguerVers(lien)
  }
}

function lancerExercicesMathalea (lien: string): void {
  vuePrecedente.set(get(vue))
  urlExercice.set(supprimerGraines(lien))
  vue.set('exercices')
}

function naviguerVers (lien: string): void {
  window.location.href = lien
}
