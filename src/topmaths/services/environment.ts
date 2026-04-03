export const TOPMATHS_BASE_URL = 'https://topmaths.fr/?'
export const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'
export const REGULAR_VIEW_ADDENDUM = '&v=exercise'
export const SLIDESHOW_VIEW_ADDENDUM = '&v=diaporama&ds=1000101'
export const DEFAULT_LINE_HEIGHT = 1.6 // em
export const SPACING_MARGIN_RATIO = 0.8 // margin = line height * ratio

export function isTopmaths(link: string): boolean {
  return link.slice(0, TOPMATHS_BASE_URL.length) === TOPMATHS_BASE_URL
}
export function isCoopmaths(link: string): boolean {
  return link.slice(0, COOPMATHS_BASE_URL.length) === COOPMATHS_BASE_URL
}
export function isMathalea(link: string): boolean {
  return isTopmaths(link) || isCoopmaths(link)
}
export function isDevMode(): boolean {
  return (
    window.location.href.slice(0, 'http://localhost'.length) ===
    'http://localhost'
  )
}
