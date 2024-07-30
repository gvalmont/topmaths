import { exerciseLinks, exerciseLink, view, reference } from './store'
import { estCoopmaths, supprimerGraines } from './outils'
import type { TopmathsView } from '../types/shared'

export function goToView (mouseEvent: MouseEvent, destinationView: TopmathsView, ref?: string): void {
  const isRegularClick = mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey
  if (!isRegularClick) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  if (ref) reference.set(ref)
  view.set(destinationView)
  window.history.pushState({}, '', `?v=${destinationView}${ref ? `&ref=${ref}` : ''}`)
}

export function launchExercise (link: string): void {
  exerciseLinks.set([])
  if (estCoopmaths(link)) {
    launchMathaleaExercise(link)
  } else {
    goTo(link)
  }
}

function launchMathaleaExercise (link: string): void {
  exerciseLink.set(supprimerGraines(link))
  view.set('exercices')
}

function goTo (link: string): void {
  window.location.href = link
}
