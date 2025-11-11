import type { Prefs } from './types'

/**
 * Préférences par défaut
 */
const prefs: Prefs = {
  browserInstance: null,
  browserOptions: {},
  browsers: ['chromium'],
  contextOptions: {},
  pauseOnError: true,
  debug: true,
  headless: true,
  silent: false,
  slowMo: 0,
  verbose: true,
  nbExosParLot: 50,
}

export default prefs
