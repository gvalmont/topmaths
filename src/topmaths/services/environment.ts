export const TOPMATHS_BASE_URL = 'https://topmaths.fr/?'
export function isTopmaths (link: string): boolean {
  return link.slice(0, TOPMATHS_BASE_URL.length) === TOPMATHS_BASE_URL
}

export const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'

export function isDevMode (): boolean {
  return window.location.href.slice(0, 'http://localhost'.length) === 'http://localhost'
}

export const UNLISTED_THEMES = ['Extra']
