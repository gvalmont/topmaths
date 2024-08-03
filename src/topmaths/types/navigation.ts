import type { ObjectiveReference } from './objective.js'
import { objectivesReferences } from './objectivesReferences.js'
import type { UnitReference } from './unit.js'
import { unitsReferences } from './unitsReferences.js'

const viewValidKeys = <const>['home', 'unit', 'objective', 'exercise', 'practice', 'student', 'classroom', 'cart', 'perso', 'info']
type ViewValidKeysType = typeof viewValidKeys
export type View = ViewValidKeysType[number]
export function isTopmathsView (obj: unknown): obj is View {
  if (obj == null || typeof obj !== 'string') return false
  return viewValidKeys.includes(obj as View)
}
export function isTopmathsViews (obj: unknown): obj is View[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isTopmathsView)
}

const referenceInfoValidKeys = <const>['site-info', 'legal-notice', 'privacy-policy', 'terms-of-use']
type ReferenceInfoValidKeysType = typeof referenceInfoValidKeys
export type ReferenceInfo = ReferenceInfoValidKeysType[number]
export function isInfoReference (obj: unknown): obj is ReferenceInfo {
  if (obj == null || typeof obj !== 'string') return false
  return referenceInfoValidKeys.includes(obj as ReferenceInfo)
}
export function isInfoReferences (obj: unknown): obj is ReferenceInfo[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isInfoReference)
}
const referenceValidKeys = ['', ...referenceInfoValidKeys, ...objectivesReferences, ...unitsReferences]
export type Reference = ReferenceInfo | ObjectiveReference | UnitReference
export function isReference (obj: unknown): obj is Reference {
  if (obj == null || typeof obj !== 'string') return false
  return referenceValidKeys.includes(obj as Reference)
}
export function isReferences (obj: unknown): obj is Reference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isReference)
}
