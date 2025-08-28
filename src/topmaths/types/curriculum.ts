import { DEFAULT_GRADE, isStringGrade, type StringGrade } from './grade.js'
import { deepCopy } from './shared.js'

export type CurriculumGrade = {
  name: StringGrade
  unitsPerTerm: number[]
  cumulateUnitsPerTerm: number[]
}
export function isCurriculumGrade(obj: unknown): obj is CurriculumGrade {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'name' in obj &&
    isStringGrade(obj.name) &&
    'unitsPerTerm' in obj &&
    Array.isArray(obj.unitsPerTerm) &&
    obj.unitsPerTerm.every((item) => typeof item === 'number') &&
    'cumulateUnitsPerTerm' in obj &&
    Array.isArray(obj.cumulateUnitsPerTerm) &&
    obj.cumulateUnitsPerTerm.every((item) => typeof item === 'number')
  )
}
export function isCurriculumGrades(obj: unknown): obj is CurriculumGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCurriculumGrade)
}
export const emptyCurriculumGrade: CurriculumGrade = {
  name: DEFAULT_GRADE,
  unitsPerTerm: [],
  cumulateUnitsPerTerm: [],
}

export type CurriculumValue = {
  unitsPerTerm: number[]
  cumulateUnitsPerTerm: number[]
}
export function isCurriculumValue(obj: unknown): obj is CurriculumValue {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'unitsPerTerm' in obj &&
    Array.isArray(obj.unitsPerTerm) &&
    obj.unitsPerTerm.every((item) => typeof item === 'number') &&
    'cumulateUnitsPerTerm' in obj &&
    Array.isArray(obj.cumulateUnitsPerTerm) &&
    obj.cumulateUnitsPerTerm.every((item) => typeof item === 'number')
  )
}
export function isCurriculumValues(obj: unknown): obj is CurriculumValue[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCurriculumValue)
}
export const emptyCurriculumValue: CurriculumValue = {
  // keep in sync with build_prepare.ts
  unitsPerTerm: [],
  cumulateUnitsPerTerm: [],
}

export type Curriculum = {
  // eslint-disable-next-line no-unused-vars
  [K in StringGrade]: CurriculumValue
}
export function isCurriculum(obj: unknown): obj is Curriculum {
  if (obj == null || typeof obj !== 'object') return false
  const entries = Object.entries(obj)
  return entries.every(
    ([key, value]) => isStringGrade(key) && isCurriculumValue(value),
  )
}
export const emptyCurriculum: Curriculum = {
  // keep in sync with build_prepare.ts
  tout: deepCopy(emptyCurriculumValue),
  '6e': deepCopy(emptyCurriculumValue),
  '5e': deepCopy(emptyCurriculumValue),
  '4e': deepCopy(emptyCurriculumValue),
  '3e': deepCopy(emptyCurriculumValue),
}
