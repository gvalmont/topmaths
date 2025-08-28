export const TOPMATHS_BASE_URL = 'https://topmaths.fr/?'
export const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'
export const EXERCISE_PARAM_ADDENDUM = '&i=0'
export const REGULAR_VIEW_ADDENDUM = '&v=exercise'
export const SLIDESHOW_VIEW_ADDENDUM = '&v=diaporama&ds=1000101'

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
