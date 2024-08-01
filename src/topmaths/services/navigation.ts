import { exerciseLinks, view, reference } from './store'
import { isCoopmaths, removeSeed } from './shared'
import type { Reference, View } from '../types/navigation'

export function backToHome (): void {
  view.set('home')
  window.history.pushState({}, '', '/')
}

export function goToView (mouseEvent: MouseEvent, destinationView: View, ref?: Reference): void {
  const isRegularClick = mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey
  if (!isRegularClick) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  reference.set(ref ?? '')
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
