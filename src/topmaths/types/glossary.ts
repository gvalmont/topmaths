import { isStringGrade, type StringGrade } from '../services/types.js'

export type GlossaryRelatedItem = {
  slug: string,
  title: string
}
export function isGlossaryRelatedItems (obj: unknown): obj is GlossaryRelatedItem {
  if (obj == null || typeof obj !== 'object') return false
  return 'slug' in obj && typeof obj.slug === 'string' &&
    'title' in obj && typeof obj.title === 'string'
}

export type GlossaryItem = {
  comments: string[],
  content: string,
  examples: string[],
  grades: StringGrade[],
  includesImage: boolean,
  keywords: string[],
  relatedObjectives: string[],
  relatedItems: GlossaryRelatedItem[],
  slug: string,
  type: 'définition' | 'propriété'
}
export function isGlossaryItem (obj: unknown): obj is GlossaryItem {
  if (obj == null || typeof obj !== 'object') return false
  return 'comments' in obj && Array.isArray(obj.comments) && obj.comments.every(comment => typeof comment === 'string') &&
    'content' in obj && typeof obj.content === 'string' &&
    'examples' in obj && Array.isArray(obj.examples) && obj.examples.every(example => typeof example === 'string') &&
    'grades' in obj && Array.isArray(obj.grades) && obj.grades.every(isStringGrade) &&
    'includesImage' in obj && typeof obj.includesImage === 'boolean' &&
    'keywords' in obj && Array.isArray(obj.keywords) && obj.keywords.every(keyword => typeof keyword === 'string') &&
    'relatedObjectives' in obj && Array.isArray(obj.relatedObjectives) && obj.relatedObjectives.every(relatedObjective => typeof relatedObjective === 'string') &&
    'relatedItems' in obj && Array.isArray(obj.relatedItems) && obj.relatedItems.every(isGlossaryRelatedItems) &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'type' in obj && (obj.type === 'définition' || obj.type === 'propriété')
}

export type GlossaryMasterItem = GlossaryItem & {
  titles: string[]
}
export function isGlossaryMasterItem (obj: unknown): obj is GlossaryMasterItem {
  if (obj == null || typeof obj !== 'object') return false
  return isGlossaryItem(obj) &&
  'titles' in obj && Array.isArray(obj.titles) && obj.titles.every(title => typeof title === 'string')
}

export type GlossaryUniteItem = GlossaryItem & {
  title: string
}
export function isGlossaryUniteItem (obj: unknown): obj is GlossaryUniteItem {
  if (obj == null || typeof obj !== 'object') return false
  return isGlossaryItem(obj) &&
  'title' in obj && typeof obj.title === 'string'
}
