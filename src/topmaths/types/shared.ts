/**
 * Deep copy an object, not only the first level.
 * Does not work with functions, undefined, NaN, Infinity, -Infinity
 */
export function deepCopy<T> (obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function isEmptyRecord (obj: Record<string | number | symbol, unknown>): boolean {
  return Object.values(obj).every(value => !!value)
}
export function isEmptyArrayRecord (obj: Record<string | number | symbol, unknown[]>): boolean {
  return Object.values(obj).every(value => value.length === 0)
}

export type ThemeColor = 'warning' | 'link' | 'info' | 'danger' | 'primary' | 'success' | 'orange' | 'sponsor' | 'fuchsia' | 'black-and-yellow' | 'green' | 'coopmaths' | 'purple' | 'info-darker' | 'violet' | 'blue' | '6e' | '5e' | '4e' | '3e' | 'tout'

export function isStrings (obj: unknown): obj is string[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(item => typeof item === 'string')
}

const topmathsViewValidKeys = <const>['exercices', 'sequence', 'sequences', 'objectifs', 'objectif', 'revisions', 'outils', 'mathador', 'generateur-de-portraits', 'eleves', 'lexique', 'tutos', 'telechargements', 'progressions', 'informations', 'panier', 'mentions-legales', 'politique-de-confidentialite', 'cgu', 'perso']
type TopmathsViewValidKeysType = typeof topmathsViewValidKeys
export type TopmathsView = TopmathsViewValidKeysType[number]
export function isTopmathsView (obj: unknown): obj is TopmathsView {
  if (obj == null || typeof obj !== 'string') return false
  return topmathsViewValidKeys.includes(obj as TopmathsView)
}
export function isTopmathsViews (obj: unknown): obj is TopmathsView[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isTopmathsView)
}
