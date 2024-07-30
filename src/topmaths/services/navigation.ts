import { exerciseLinks, view, reference } from './store'
import { isCoopmaths, removeSeed } from './shared'
import type { TopmathsView } from '../types/navigation'

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
  if (isCoopmaths(link)) {
    launchMathaleaExercise(link)
  } else {
    goTo(link)
  }
}

function launchMathaleaExercise (link: string): void {
  exerciseLinks.set([removeSeed(link)])
  view.set('exercices')
}

function goTo (link: string): void {
  window.location.href = link
}
