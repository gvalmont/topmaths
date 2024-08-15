import { get } from 'svelte/store'
import type { ObjectiveWithStringReference } from '../types/objective.js'
import type { UnitObjective } from '../types/unit.js'
import { isTitleAcademicPreferred } from './store.js'

export function normalize (str: string): string {
  if (str === undefined) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

export function getTitle (objective: ObjectiveWithStringReference | UnitObjective): string {
  if (get(isTitleAcademicPreferred) || !objective.title) {
    return objective.titleAcademic
  } else {
    return objective.title
  }
}
