import { specialUnitsReferences } from './specialUnitsReferences.js'

type SpecialUnitsReferencesValidTypes = typeof specialUnitsReferences
export type SpecialUnitReference = SpecialUnitsReferencesValidTypes[number]
export function isSpecialUnitReference(
  obj: unknown,
): obj is SpecialUnitReference {
  if (obj == null || typeof obj !== 'string') return false
  return specialUnitsReferences.includes(obj as SpecialUnitReference)
}
export function isSpecialUnitReferences(
  obj: unknown,
): obj is SpecialUnitReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isSpecialUnitReference)
}
export const emptySpecialUnitReference: SpecialUnitReference =
  specialUnitsReferences[0]

export type SpecialUnit = {
  reference: SpecialUnitReference
  title: string
}
export function isSpecialUnit(obj: unknown): obj is SpecialUnit {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'reference' in obj &&
    isSpecialUnitReference(obj.reference) &&
    'title' in obj &&
    typeof obj.title === 'string'
  )
}
export function isSpecialUnits(obj: unknown): obj is SpecialUnit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isSpecialUnit)
}
export const emptySpecialUnit: SpecialUnit = {
  reference: emptySpecialUnitReference,
  title: '',
}
