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
