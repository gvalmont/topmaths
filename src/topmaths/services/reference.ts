import { get } from 'svelte/store'
import {
  DEFAULT_GRADE,
  isStringGrade,
  type StringGrade,
} from '../types/grade.js'
import type { ObjectiveReference } from '../types/objective'
import type { UnitReference } from '../types/unit'
import { examExercises } from './store.js'

export function buildGradeFromObjectiveReference(
  reference: ObjectiveReference | '',
): StringGrade {
  if (reference === '') return DEFAULT_GRADE
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}

/**
 * To be used in Curriculum.svelte and LaTeX export in Coopmaths style
 */
export function buildThemeFromReference(
  reference: string,
): 'nombres' | 'gestion' | 'gestionbis' | 'grandeurs' | 'geo' | 'algo' {
  const lettre = reference.slice(1, 2)
  if (lettre === 'C' || lettre === 'N') return 'nombres'
  if (lettre === 'G') return 'geo'
  if (lettre === 'M') return 'grandeurs'
  if (lettre === 'P' || lettre === 'S') return 'gestion'
  if (lettre === 'I') return 'algo'
  console.warn('Thème lié à la référence', reference, 'non trouvé')
  return 'nombres'
}

export function isReferenceIgnored(reference: string): boolean {
  return reference.slice(1, 2) === 'X'
}

export function getUnitReferenceFromExamUuid(
  examUuid: string,
): UnitReference | undefined {
  return get(examExercises).find(
    (examExercise) => examExercise.uuid === examUuid,
  )?.unitReference
}
