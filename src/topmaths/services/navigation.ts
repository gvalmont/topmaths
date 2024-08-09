import { exerciseLinks, view, reference, reference2 } from './store'
import { removeSeed } from './shared'
import type { Reference, View } from '../types/navigation'
import { isTopmaths } from './environment'
import { getParamsFromUrl, updateUrlFromParams } from './mathalea'

export function backToHome (): void {
  view.set('home')
  window.history.pushState({}, '', '/')
}

export function goToView (mouseEvent: MouseEvent, destinationView: View, ref?: Reference, ref2?: string): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  reference.set(ref ?? '')
  reference2.set(ref2 ?? '')
  view.set(destinationView)
  window.history.pushState({}, '', `?v=${destinationView}${ref ? `&ref=${ref}` : ''}${ref2 ? `&ref2=${ref2}` : ''}`)
}

export function GoToLatex (mouseEvent: MouseEvent, exercisesLink: string): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  const params = getParamsFromUrl(exercisesLink)
  updateUrlFromParams('latex', params)
}

export function launchExercise (mouseEvent: MouseEvent, link: string): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  exerciseLinks.set([])
  if (isTopmaths(link)) {
    launchMathaleaExercise(link)
  } else {
    goTo(link)
  }
}

export function isRegularClick (mouseEvent: MouseEvent): boolean {
  return mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey
}

function launchMathaleaExercise (link: string): void {
  exerciseLinks.set([removeSeed(link)])
  view.set('exercise')
}

function goTo (link: string): void {
  window.location.href = link
}
