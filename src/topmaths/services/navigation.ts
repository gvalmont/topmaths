import { get } from 'svelte/store'
import type { VueType } from '../../lib/VueType'
import type { Reference, View } from '../types/navigation'
import { isTopmaths } from './environment'
import { buildParamsFromUrl, updateUrlFromParams } from './mathalea'
import {
  exerciseLinks,
  isDoubleView,
  isTeacherMode,
  reference,
  reference2,
  view,
} from './store'
import { normalizeExerciseInteractivity, removeSeed } from './url'

export function backToHome(): void {
  view.set('home')
  window.history.pushState({}, '', '/')
}

export function goToView(
  mouseEvent: MouseEvent,
  destinationView: View,
  ref?: Reference,
  ref2?: string,
): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  reference.set(ref ?? '')
  reference2.set(ref2 ?? '')
  view.set(destinationView)
  window.history.pushState(
    {},
    '',
    `?v=${destinationView}${ref ? `&ref=${ref}` : ''}${ref2 ? `&ref2=${ref2}` : ''}`,
  )
}

export function goToCoopmathsView(
  mouseEvent: MouseEvent,
  exercisesLink: string,
  coopmathsView: VueType,
): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  const params = buildParamsFromUrl(exercisesLink)
  updateUrlFromParams(coopmathsView, params)
}

export function launchExercise(
  mouseEvent: MouseEvent,
  link: string,
  isDoubleView: boolean = false,
): void {
  if (!isRegularClick(mouseEvent)) {
    return // to allow right clicks and opening in new tabs
  }
  mouseEvent.preventDefault()
  exerciseLinks.set([])
  if (isTopmaths(link)) {
    if (link.includes('&v=diaporama')) {
      goTo(link)
    } else {
      launchMathaleaExercise(link, isDoubleView)
    }
  } else {
    goTo(link)
  }
}

export function isRegularClick(mouseEvent: MouseEvent): boolean {
  return mouseEvent.button === 0 && !mouseEvent.ctrlKey && !mouseEvent.metaKey
}

function launchMathaleaExercise(link: string, doubleView: boolean): void {
  const normalizedLink = normalizeExerciseInteractivity(
    link,
    get(isTeacherMode) ? '0' : '1',
  )
  exerciseLinks.set([removeSeed(normalizedLink)])
  isDoubleView.set(doubleView)
  view.set('exercise')
}

function goTo(link: string): void {
  window.location.href = link
}
