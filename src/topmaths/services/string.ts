import { get } from 'svelte/store'
import type { Objective } from '../types/objective.js'
import type { UnitObjective } from '../types/unit.js'
import { isTitleAcademicPreferred } from './store.js'

export function normalize (str: string): string {
  if (str === undefined) return ''
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase()
}

export function getTitle (objective: Objective | UnitObjective): string {
  if (get(isTitleAcademicPreferred) || !objective.title) {
    return objective.titleAcademic
  } else {
    return objective.title
  }
}
