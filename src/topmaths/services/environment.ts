import * as packageJson from '../../../package.json' assert { type: 'json' }
import { isStringGrade, type StringGrade } from '../types/shared.js'

export const environment = {
  appVersion: packageJson.version,
  annee: 2024,
  devOrigine: 'http://localhost:4200',
  prodOrigine: 'https://topmaths.fr',
  baseUrl: 'https://coopmaths.fr/',
  V2: 'mathalea.html?',
  V3: 'alea/?',
  production: false,
  perso: false
}

export function buildGradeFromObjectiveReference (reference: string): StringGrade {
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}
