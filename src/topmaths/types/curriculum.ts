import { isStringGrade, type StringGrade } from './grade.js'

export type CurriculumGrade = {
  name: StringGrade
  unitsPerTerm: number[]
}
export function isCurriculumGrade (obj: unknown): obj is CurriculumGrade {
  if (obj == null || typeof obj !== 'object') return false
  return 'name' in obj && isStringGrade(obj.name) &&
    'unitsPerTerm' in obj && Array.isArray(obj.unitsPerTerm) && obj.unitsPerTerm.every(item => typeof item === 'number')
}
export function isCurriculumGrades (obj: unknown): obj is CurriculumGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCurriculumGrade)
}
export const emptyCurriculumGrade: CurriculumGrade = {
  name: 'none',
  unitsPerTerm: []
}

export type Curriculum = CurriculumGrade[]
export function isCurriculum (obj: unknown): obj is Curriculum {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCurriculumGrade)
}
export function isCurriculums (obj: unknown): obj is Curriculum[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCurriculum)
}
