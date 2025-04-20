import type { ObjectiveReference } from './objective.js'
import { objectivesReferences } from './objectivesReferences.js'
import type { UnitReference } from './unit.js'
import { unitsReferences } from './unitsReferences.js'
import { specialUnitsReferences } from './specialUnitsReferences.js'
import type { SpecialUnitReference } from './specialUnit'

const viewValidKeys = <const>['home', 'unit', 'objective', 'exercise', 'practice', 'student', 'classroom', 'cart', 'perso', 'info', 'latex']
type ViewValidKeysType = typeof viewValidKeys
export type View = ViewValidKeysType[number]
export function isView (obj: unknown): obj is View {
  if (obj == null || typeof obj !== 'string') return false
  return viewValidKeys.includes(obj as View)
}
export function isViews (obj: unknown): obj is View[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isView)
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

const referenceStudentValidKeys = <const>['glossary', 'tuto', 'download']
type ReferenceStudentValidKeysType = typeof referenceStudentValidKeys
export type ReferenceStudent = ReferenceStudentValidKeysType[number]
export function isStudentReference (obj: unknown): obj is ReferenceStudent {
  if (obj == null || typeof obj !== 'string') return false
  return referenceStudentValidKeys.includes(obj as ReferenceStudent)
}
export function isStudentReferences (obj: unknown): obj is ReferenceStudent[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStudentReference)
}

const referenceClassroomValidKeys = <const>['mathador', 'curriculum', 'prerequisites']
type ReferenceClassroomValidKeysType = typeof referenceClassroomValidKeys
export type ReferenceClassroom = ReferenceClassroomValidKeysType[number]
export function isClassroomReference (obj: unknown): obj is ReferenceClassroom {
  if (obj == null || typeof obj !== 'string') return false
  return referenceClassroomValidKeys.includes(obj as ReferenceClassroom)
}
export function isClassroomReferences (obj: unknown): obj is ReferenceClassroom[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isClassroomReference)
}

const referenceValidKeys = ['', ...referenceInfoValidKeys, ...referenceStudentValidKeys, ...referenceClassroomValidKeys, ...objectivesReferences, ...unitsReferences, ...specialUnitsReferences]
export type Reference = '' | ReferenceInfo | ReferenceStudent | ReferenceClassroom | ObjectiveReference | UnitReference | SpecialUnitReference
export function isReference (obj: unknown): obj is Reference {
  if (obj == null || typeof obj !== 'string') return false
  return referenceValidKeys.includes(obj as Reference)
}
export function isReferences (obj: unknown): obj is Reference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isReference)
}
