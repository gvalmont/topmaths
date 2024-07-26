import { isStringGrade, type StringGrade } from '../types/shared.js'

export const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'

export function buildGradeFromObjectiveReference (reference: string): StringGrade {
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}
