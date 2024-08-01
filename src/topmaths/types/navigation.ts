const viewValidKeys = <const>['exercices', 'sequence', 'sequences', 'objectifs', 'objectif', 'revisions', 'outils', 'mathador', 'generateur-de-portraits', 'eleves', 'lexique', 'tutos', 'telechargements', 'progressions', 'panier', 'perso', 'home', 'info']
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

const referenceValidKeys = referenceInfoValidKeys
type ReferenceValidKeysType = typeof referenceValidKeys
export type Reference = ReferenceValidKeysType[number]
export function isReference (obj: unknown): obj is Reference {
  if (obj == null || typeof obj !== 'string') return false
  return referenceValidKeys.includes(obj as Reference)
}
export function isReferences (obj: unknown): obj is Reference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isReference)
}
