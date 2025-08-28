import type { ReplaceReferencesByStrings } from './shared'
import { isUnitReference, type UnitReference } from './unit'

export type ExamExercise = {
  uuid: string
  unitReference: UnitReference
}
export function isExamExercise(
  obj: unknown,
  withStringReference: boolean = false,
): obj is ExamExercise {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'uuid' in obj &&
    typeof obj.uuid === 'string' &&
    'unitReference' in obj &&
    (withStringReference
      ? typeof obj.unitReference === 'string'
      : isUnitReference(obj.unitReference))
  )
}
export function isExamExercises(
  obj: unknown,
  withStringReference: boolean = false,
): obj is ExamExercise[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((obj) => isExamExercise(obj))
}
export const emptyExamExercise: ExamExercise = {
  uuid: '',
  unitReference: 'S6S1',
}

export type ExamExerciseWithStringReference = ReplaceReferencesByStrings<
  UnitReference,
  ExamExercise
>
export function isExamExerciseWithStringReference(
  obj: unknown,
): obj is ExamExerciseWithStringReference {
  return isExamExercise(obj, true)
}
export function isExamExercisesWithStringReference(
  obj: unknown,
): obj is ExamExerciseWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((obj) => isExamExerciseWithStringReference(obj))
}
export const emptyExamExerciseWithStringReference: ExamExerciseWithStringReference =
  {
    uuid: '',
    unitReference: 'S6S1',
  }
