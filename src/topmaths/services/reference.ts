import { isStringGrade, type StringGrade } from '../types/grade.js'

export function buildGradeFromObjectiveReference (reference: string): StringGrade {
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}

export function buildPdfThemeFromReference (reference: string): 'nombres' | 'gestion' | 'gestionbis' | 'grandeurs' | 'geo' | 'algo' {
  const lettre = reference.slice(1, 2)
  if (lettre === 'C' || lettre === 'N') return 'nombres'
  if (lettre === 'G') return 'geo'
  if (lettre === 'M') return 'grandeurs'
  if (lettre === 'P' || lettre === 'S') return 'gestion'
  console.warn('Thème lié à la référence ' + reference + ' non trouvé')
  return 'nombres'
}
