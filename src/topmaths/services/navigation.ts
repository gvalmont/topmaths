import { listeDesUrl, urlExercice, vue, vuePrecedente, reference } from './store'
import { estCoopmaths, supprimerGraines } from './outils'
import { get } from 'svelte/store'

export function goVue (mouseEvent: MouseEvent, destinationVue: string, ref?: string) {
  if (mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey) {
    mouseEvent.preventDefault()
    if (ref !== undefined) reference.set(ref)
    vue.set(destinationVue)
    window.history.pushState({}, '', `?v=${destinationVue}${ref !== undefined ? '&ref=' + ref : ''}`)
  }
}

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
