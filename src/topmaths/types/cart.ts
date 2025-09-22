import {
  emptyObjectiveExercise,
  emptyObjectiveReference,
  isObjectiveExercise,
  isObjectiveReference,
  type ObjectiveExercise,
  type ObjectiveReference,
} from './objective'
import { emptyUnitReference, isUnitReference, type UnitReference } from './unit'

export type CartItem = {
  exercise: ObjectiveExercise
  label: string
  objectiveReference: ObjectiveReference | ''
  unitReference: UnitReference | ''
}
export function isCartItem(obj: unknown): obj is CartItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'exercise' in obj &&
    isObjectiveExercise(obj.exercise) &&
    'label' in obj &&
    typeof obj.label === 'string' &&
    'objectiveReference' in obj &&
    (isObjectiveReference(obj.objectiveReference) ||
      obj.objectiveReference === '') &&
    'unitReference' in obj &&
    (isUnitReference(obj.unitReference) || obj.unitReference === '')
  )
}
export function isCartItems(obj: unknown): obj is CartItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every(isCartItem)
}
export const emptyCartItem: CartItem = {
  exercise: emptyObjectiveExercise,
  label: '',
  objectiveReference: emptyObjectiveReference,
  unitReference: emptyUnitReference,
}
