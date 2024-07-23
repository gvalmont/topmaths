export type Couleur = 'warning' | 'link' | 'info' | 'danger' | 'primary' | 'success' | 'orange' | 'sponsor' | 'fuchsia' | 'black-and-yellow' | 'green' | 'coopmaths' | 'purple' | 'info-darker' | 'violet' | 'blue' | '6e' | '5e' | '4e' | '3e' | 'tout'

export function isStrings (obj: unknown): obj is string[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(item => typeof item === 'string')
}

export type StringGrade = '6e' | '5e' | '4e' | '3e' | 'none'
export function isStringGrade (obj: unknown): obj is StringGrade {
  if (obj == null || typeof obj !== 'string') return false
  return ['6e', '5e', '4e', '3e', 'none'].includes(obj)
}
export function isStringGrades (obj: unknown): obj is StringGrade[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isStringGrade)
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
