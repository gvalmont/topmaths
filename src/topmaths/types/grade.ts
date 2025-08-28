import { isStrings } from './shared.js'

export const DEFAULT_GRADE = 'tout' // keep in sync with build_prepare.ts

export const stringGradeValidKeys = <const>[
  DEFAULT_GRADE,
  '6e',
  '5e',
  '4e',
  '3e',
]
type StringGradeValidKeysType = typeof stringGradeValidKeys
export type StringGrade = StringGradeValidKeysType[number]

export function isStringGrade(obj: unknown): obj is StringGrade {
  if (obj == null || typeof obj !== 'string') return false
  return stringGradeValidKeys.includes(obj as StringGrade)
}
export function isStringGrades(obj: unknown): obj is StringGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStringGrade)
}
export function isStringRecordStringGrade(
  obj: unknown,
): obj is Record<StringGrade, string> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || typeof value !== 'string') {
      return false
    }
  }
  return true
}
export function isStringRecordStringGrades(
  obj: unknown,
): obj is Record<StringGrade, string>[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStringRecordStringGrade)
}
export const emptyStringRecordStringGrade: Record<StringGrade, string> = {
  tout: '',
  '6e': '',
  '5e': '',
  '4e': '',
  '3e': '',
}
export function isStringArrayRecordStringGrade(
  obj: unknown,
): obj is Record<StringGrade, string[]> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || !isStrings(value)) {
      return false
    }
  }
  return true
}
export const emptyStringArrayRecordStringGrade: Record<StringGrade, string[]> =
  {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
export function isNumberRecordStringGrade(
  obj: unknown,
): obj is Record<StringGrade, number> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || typeof value !== 'number') {
      return false
    }
  }
  return true
}
export function isNumberRecordStringGrades(
  obj: unknown,
): obj is Record<StringGrade, number>[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isNumberRecordStringGrade)
}
export const emptyNumberRecordStringGrade: Record<StringGrade, number> = {
  tout: 0,
  '6e': 0,
  '5e': 0,
  '4e': 0,
  '3e': 0,
}
export function isNumberArrayRecordStringGrade(
  obj: unknown,
): obj is Record<StringGrade, number[]> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (
      !isStringGrade(key) ||
      !Array.isArray(value) ||
      value.some((item) => typeof item !== 'number')
    ) {
      return false
    }
  }
  return true
}
export const emptyNumberArrayRecordStringGrade: Record<StringGrade, number[]> =
  {
    tout: [],
    '6e': [],
    '5e': [],
    '4e': [],
    '3e': [],
  }
