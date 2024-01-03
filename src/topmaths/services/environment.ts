import * as packageJson from '../../../package.json'

export const environment = {
  appVersion: packageJson.version,
  annee: 2023,
  devOrigine: 'http://localhost:4200',
  prodOrigine: 'https://topmaths.fr',
  baseUrl: 'https://coopmaths.fr/',
  V2: 'mathalea.html?',
  V3: 'alea/?',
  production: false,
  perso: false
}
