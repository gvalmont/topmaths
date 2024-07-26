import { exerciseLinks, exerciseLink, view, reference } from './store'
import { estCoopmaths, supprimerGraines } from './outils'

export function goVue (mouseEvent: MouseEvent, destinationVue: string, ref?: string) {
  if (mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey) {
    mouseEvent.preventDefault()
    if (ref !== undefined) reference.set(ref)
    view.set(destinationVue)
    window.history.pushState({}, '', `?v=${destinationVue}${ref !== undefined ? '&ref=' + ref : ''}`)
  }
}

export function lancerExercices (lien: string): void {
  exerciseLinks.set([])
  if (estCoopmaths(lien)) {
    lancerExercicesMathalea(lien)
  } else {
    naviguerVers(lien)
  }
}

function lancerExercicesMathalea (lien: string): void {
  exerciseLink.set(supprimerGraines(lien))
  view.set('exercices')
}

function naviguerVers (lien: string): void {
  window.location.href = lien
}
