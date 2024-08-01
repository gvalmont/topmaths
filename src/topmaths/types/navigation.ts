const topmathsViewValidKeys = <const>['exercices', 'sequence', 'sequences', 'objectifs', 'objectif', 'revisions', 'outils', 'mathador', 'generateur-de-portraits', 'eleves', 'lexique', 'tutos', 'telechargements', 'progressions', 'panier', 'perso', 'home', 'info']
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
