import { isStringGrade, type StringGrade } from '../types/grade.js'

export function buildGradeFromObjectiveReference (reference: string): StringGrade {
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}

/**
 * To be used in Curriculum.svelte and LaTeX export in Coopmaths style
 */
export function buildThemeFromReference (reference: string): 'nombres' | 'gestion' | 'gestionbis' | 'grandeurs' | 'geo' | 'algo' {
  const lettre = reference.slice(1, 2)
  if (lettre === 'C' || lettre === 'N' || lettre === 'X') return 'nombres'
  if (lettre === 'G') return 'geo'
  if (lettre === 'M') return 'grandeurs'
  if (lettre === 'P' || lettre === 'S') return 'gestion'
  console.warn('Thème lié à la référence', reference, 'non trouvé')
  return 'nombres'
}
