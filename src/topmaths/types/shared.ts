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
export function isRecordStringGrade (obj: unknown): obj is Record<StringGrade, string> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || typeof value !== 'string') {
      return false
    }
  }
  return true
}
export const emptyRecordStringGrade: Record<StringGrade, string> = {
  none: '',
  '6e': '',
  '5e': '',
  '4e': '',
  '3e': ''
}
export function isArrayRecordStringGrade (obj: unknown): obj is Record<StringGrade, string[]> {
  if (obj === null || typeof obj !== 'object') return false
  for (const [key, value] of Object.entries(obj)) {
    if (!isStringGrade(key) || !isStrings(value)) {
      return false
    }
  }
  return true
}
export const emptyArrayRecordStringGrade: Record<StringGrade, string[]> = {
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
