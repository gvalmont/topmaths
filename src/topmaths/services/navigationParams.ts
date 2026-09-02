import {
  isReference,
  isView,
  type Reference,
  type View,
} from '../types/navigation'

export type NavigationParams = {
  view: View
  reference: Reference
  reference2: string
  isDoubleView: boolean
}

export function getNavigationParamsFromUrl(url: URL): NavigationParams {
  let view: View = 'home'
  let reference: Reference = ''
  let reference2 = ''
  let isDoubleView = false

  for (const [key, value] of url.searchParams.entries()) {
    if (key === 'v' && isView(value)) view = value
    if (key === 'ref' && isReference(value)) reference = value
    if (key === 'ref2') reference2 = value
    if (key === 'dv') isDoubleView = !!value
  }

  // Les filtres sont écrits dans l'URL par la page des progressions sans
  // paramètre `ref`. Ils identifient donc implicitement cette sous-page.
  if (
    view === 'classroom' &&
    reference === '' &&
    ['grade', 'term', 'options'].some((param) => url.searchParams.has(param))
  ) {
    reference = 'curriculum'
  }

  return {
    view,
    reference,
    reference2,
    isDoubleView,
  }
}
