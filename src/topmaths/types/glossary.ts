import { isStringGrade, type StringGrade } from './grade.js'
import { isObjectiveReferences, type ObjectiveReference } from './objective.js'
import { isStrings, type ReplaceReferencesByStrings } from './shared.js'

export type GlossaryRelatedItem = {
  reference: string
  title: string
}
export function isGlossaryRelatedItem(
  obj: unknown,
): obj is GlossaryRelatedItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'reference' in obj &&
    typeof obj.reference === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string'
  )
}
export function isGlossaryRelatedItems(
  obj: unknown,
): obj is GlossaryRelatedItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every(isGlossaryRelatedItem)
}
export const emptyGlossaryRelatedItem: GlossaryRelatedItem = {
  reference: '',
  title: '',
}

export type GlossaryItem = {
  comments: string[]
  content: string
  examples: string[]
  grades: StringGrade[]
  includesImage: boolean
  keywords: string[]
  reference: string
  relatedObjectives: ObjectiveReference[]
  relatedItems: GlossaryRelatedItem[]
  type: 'définition' | 'propriété'
}
export function isGlossaryItem(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'comments' in obj &&
    Array.isArray(obj.comments) &&
    obj.comments.every((comment) => typeof comment === 'string') &&
    'content' in obj &&
    typeof obj.content === 'string' &&
    'examples' in obj &&
    Array.isArray(obj.examples) &&
    obj.examples.every((example) => typeof example === 'string') &&
    'grades' in obj &&
    Array.isArray(obj.grades) &&
    obj.grades.every(isStringGrade) &&
    'includesImage' in obj &&
    typeof obj.includesImage === 'boolean' &&
    'keywords' in obj &&
    Array.isArray(obj.keywords) &&
    obj.keywords.every((keyword) => typeof keyword === 'string') &&
    'reference' in obj &&
    typeof obj.reference === 'string' &&
    'relatedObjectives' in obj &&
    (withStringReference
      ? isStrings(obj.relatedObjectives)
      : isObjectiveReferences(obj.relatedObjectives)) &&
    'relatedItems' in obj &&
    Array.isArray(obj.relatedItems) &&
    obj.relatedItems.every(isGlossaryRelatedItem) &&
    'type' in obj &&
    (obj.type === 'définition' || obj.type === 'propriété')
  )
}
export function isGlossaryItems(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every((obj) => isGlossaryItem(obj, withStringReference))
}
export const emptyGlossaryItem: GlossaryItem = {
  comments: [],
  content: '',
  examples: [],
  grades: [],
  includesImage: false,
  keywords: [],
  reference: '',
  relatedObjectives: [],
  relatedItems: [],
  type: 'définition',
}

export type GlossaryItemWithStringReference = ReplaceReferencesByStrings<
  ObjectiveReference,
  GlossaryItem
>
export function isGlossaryItemWithStringReference(
  obj: unknown,
): obj is GlossaryItemWithStringReference {
  return isGlossaryItems(obj, true)
}
export function isGlossaryItemsWithStringReference(
  obj: unknown,
): obj is GlossaryItemWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isGlossaryItemWithStringReference)
}

export type GlossaryMasterItem = GlossaryItem & {
  titles: string[]
}
export function isGlossaryMasterItem(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryMasterItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    isGlossaryItem(obj, withStringReference) &&
    'titles' in obj &&
    Array.isArray(obj.titles) &&
    obj.titles.every((title) => typeof title === 'string')
  )
}
export function isGlossaryMasterItems(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryMasterItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every((obj) => isGlossaryMasterItem(obj, withStringReference))
}
export const emptyGlossaryMasterItem: GlossaryMasterItem = {
  comments: [],
  content: '',
  examples: [],
  grades: [],
  includesImage: false,
  keywords: [],
  relatedObjectives: [],
  relatedItems: [],
  reference: '',
  titles: [],
  type: 'définition',
}

export type GlossaryMasterItemWithStringReference = ReplaceReferencesByStrings<
  ObjectiveReference,
  GlossaryMasterItem
>
export function isGlossaryMasterItemWithStringReference(
  obj: unknown,
): obj is GlossaryMasterItemWithStringReference {
  return isGlossaryMasterItem(obj, true)
}
export function isGlossaryMasterItemsWithStringReference(
  obj: unknown,
): obj is GlossaryMasterItemWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isGlossaryMasterItemWithStringReference)
}

export type GlossaryUniteItem = GlossaryItem & {
  title: string
}
export function isGlossaryUniteItem(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryUniteItem {
  if (obj == null || typeof obj !== 'object') return false
  return (
    isGlossaryItem(obj, withStringReference) &&
    'title' in obj &&
    typeof obj.title === 'string'
  )
}
export function isGlossaryUniteItems(
  obj: unknown,
  withStringReference = false,
): obj is GlossaryUniteItem[] {
  if (!Array.isArray(obj)) return false
  return obj.every((obj) => isGlossaryUniteItem(obj, withStringReference))
}
export const emptyGlossaryUniteItem: GlossaryUniteItem = {
  // keep in sync with build_prepare.ts
  comments: [],
  content: '',
  examples: [],
  grades: [],
  includesImage: false,
  keywords: [],
  relatedObjectives: [],
  relatedItems: [],
  reference: '',
  title: '',
  type: 'définition',
}

export type GlossaryUniteItemWithStringReference = ReplaceReferencesByStrings<
  ObjectiveReference,
  GlossaryUniteItem
>
export function isGlossaryUniteItemWithStringReference(
  obj: unknown,
): obj is GlossaryUniteItemWithStringReference {
  return isGlossaryUniteItem(obj, true)
}
export function isGlossaryUniteItemsWithStringReference(
  obj: unknown,
): obj is GlossaryUniteItemWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isGlossaryUniteItemWithStringReference)
}
