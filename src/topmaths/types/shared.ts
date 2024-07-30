/**
 * Deep copy an object, not only the first level.
 * Does not work with functions, undefined, NaN, Infinity, -Infinity
 */
export function deepCopy<T> (obj: T): T {
  return JSON.parse(JSON.stringify(obj))
}

export function isEmptyRecord (obj: Record<string | number | symbol, string>): boolean {
  return Object.values(obj).every(value => value === '')
}
export function isEmptyArrayRecord (obj: Record<string | number | symbol, string[]>): boolean {
  return Object.values(obj).every(value => value.length === 0)
}

export type Couleur = 'warning' | 'link' | 'info' | 'danger' | 'primary' | 'success' | 'orange' | 'sponsor' | 'fuchsia' | 'black-and-yellow' | 'green' | 'coopmaths' | 'purple' | 'info-darker' | 'violet' | 'blue' | '6e' | '5e' | '4e' | '3e' | 'tout'

export function isStrings (obj: unknown): obj is string[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(item => typeof item === 'string')
}

export type StringGrade = '6e' | '5e' | '4e' | '3e' | 'none'
export const stringGradeValidKeys: StringGrade[] = ['6e', '5e', '4e', '3e', 'none']
export function isStringGrade (obj: unknown): obj is StringGrade {
  if (obj == null || typeof obj !== 'string') return false
  return stringGradeValidKeys.includes(obj as StringGrade)
}
export function isStringGrades (obj: unknown): obj is StringGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStringGrade)
}
export function isStringRecordStringGrade (obj: unknown): obj is Record<StringGrade, string> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || typeof value !== 'string') {
      return false
    }
  }
  return true
}
export function isStringRecordStringGrades (obj: unknown): obj is Record<StringGrade, string>[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStringRecordStringGrade)
}
export const emptyStringRecordStringGrade: Record<StringGrade, string> = {
  none: '',
  '6e': '',
  '5e': '',
  '4e': '',
  '3e': ''
}
export function isStringArrayRecordStringGrade (obj: unknown): obj is Record<StringGrade, string[]> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || !isStrings(value)) {
      return false
    }
  }
  return true
}
export const emptyStringArrayRecordStringGrade: Record<StringGrade, string[]> = {
  none: [],
  '6e': [],
  '5e': [],
  '4e': [],
  '3e': []
}
export function isNumberRecordStringGrade (obj: unknown): obj is Record<StringGrade, number> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || typeof value !== 'number') {
      return false
    }
  }
  return true
}
export function isNumberRecordStringGrades (obj: unknown): obj is Record<StringGrade, number>[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isNumberRecordStringGrade)
}
export const emptyNumberRecordStringGrade: Record<StringGrade, number> = {
  none: 0,
  '6e': 0,
  '5e': 0,
  '4e': 0,
  '3e': 0
}
export function isNumberArrayRecordStringGrade (obj: unknown): obj is Record<StringGrade, number[]> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || !Array.isArray(value) || value.some(item => typeof item !== 'number')) {
      return false
    }
  }
  return true
}
export const emptyNumberArrayRecordStringGrade: Record<StringGrade, number[]> = {
  none: [],
  '6e': [],
  '5e': [],
  '4e': [],
  '3e': []
}

export type LineGrade = StringGrade | 'all' | 'end' | ''
export function isLineGrade (obj: unknown): obj is LineGrade {
  if (obj == null || typeof obj !== 'string') return false
  return isStringGrade(obj) || ['all', 'end', ''].includes(obj)
}
export function isLineGrades (obj: unknown): obj is LineGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isLineGrade)
}
