import {
  emptyObjectiveExercise,
  emptyObjectiveReference,
  isObjectiveExercise,
  isObjectiveReference,
  type ObjectiveExercise,
  type ObjectiveReference,
} from './objective'

export type CartItem = {
  exercise: ObjectiveExercise
  label: string
  reference: ObjectiveReference
}
export function isCartItem(obj: unknown): obj is CartItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'exercise' in obj &&
    isObjectiveExercise(obj.exercise) &&
    'label' in obj &&
    typeof obj.label === 'string' &&
    'reference' in obj &&
    isObjectiveReference(obj.reference)
  )
}
export function isCartItems(obj: unknown): obj is CartItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every(isCartItem)
}
export const emptyCartItem: CartItem = {
  exercise: emptyObjectiveExercise,
  label: '',
  reference: emptyObjectiveReference,
}
