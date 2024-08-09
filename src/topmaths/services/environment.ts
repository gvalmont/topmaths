export const TOPMATHS_BASE_URL = 'https://topmaths.fr/?'
export const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'
export const EXERCISE_PARAM_ADDENDUM = '&i=0'
export const REGULAR_VIEW_ADDENDUM = '&v=exercise'
export const SLIDESHOW_VIEW_ADDENDUM = '&v=diaporama'
export const UNLISTED_THEMES = ['Extra']

export function isTopmaths (link: string): boolean {
  return link.slice(0, TOPMATHS_BASE_URL.length) === TOPMATHS_BASE_URL
}
export function isDevMode (): boolean {
  return window.location.href.slice(0, 'http://localhost'.length) === 'http://localhost'
}
