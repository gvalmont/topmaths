import { get } from 'svelte/store'
import type { ObjectivePrerequisite, ObjectiveReference, ObjectiveWithStringReference } from '../types/objective.js'
import type { UnitObjective } from '../types/unit.js'
import { isTitleAcademicPreferred } from './store.js'
import type { ReplaceReferencesByStrings } from '../types/shared'

export function normalize (str: string): string {
  if (str === undefined) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

export function getTitle (objective: ObjectiveWithStringReference | ReplaceReferencesByStrings<ObjectiveReference, UnitObjective> | ObjectivePrerequisite): string {
  if (get(isTitleAcademicPreferred) || !objective.title) {
    return objective.titleAcademic
  } else {
    return objective.title
  }
}
