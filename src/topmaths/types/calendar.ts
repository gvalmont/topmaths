export type SchoolYearString = string & {
  __brand: 'SchoolYearString'
}
export function isSchoolYearString(str: unknown): str is SchoolYearString {
  if (typeof str !== 'string') return false
  const yearRegex = /^(?:(?:20)\d{2})-(?:(?:20)\d{2})$/
  return yearRegex.test(str)
}
export function isSchoolYearStrings(obj: unknown): obj is SchoolYearString[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isSchoolYearString)
}
export function toSchoolYearString(year: string): SchoolYearString {
  if (!isSchoolYearString(year)) {
    throw new Error(`Invalid school year string: ${year}`)
  }
  return year
}
export const emptySchoolYearString: SchoolYearString =
  toSchoolYearString('2000-2001') // keep in sync with build_prepare.ts

export type ISO8601DateString = string & {
  // YYYY-MM-DD
  __brand: 'ISO8601DateString'
}
export function isISO8601DateString(str: unknown): str is ISO8601DateString {
  if (typeof str !== 'string') {
    return false
  }
  const iso8601Regex =
    /^(?:(?:19|20)\d{2})-(?:(?:0[1-9]|1[0-2]))-(?:(?:0[1-9]|[12]\d|3[01]))$/
  return iso8601Regex.test(str)
}
export function toISO8601DateString(date: string): ISO8601DateString {
  if (!isISO8601DateString(date)) {
    throw new Error(`Invalid ISO 8601 date string: ${date}`)
  }
  return date
}

export type CalendarTerm = {
  start: ISO8601DateString
  end: ISO8601DateString
}
export function isCalendarTerm(obj: unknown): obj is CalendarTerm {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'start' in obj &&
    isISO8601DateString(obj.start) &&
    'end' in obj &&
    isISO8601DateString(obj.end)
  )
}
export function isCalendarTerms(obj: unknown): obj is CalendarTerm[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarTerm)
}
export const emptyCalendarTerm: CalendarTerm = {
  start: toISO8601DateString('2000-01-01'),
  end: toISO8601DateString('2000-01-01'),
}

export type CalendarSchoolYearMaster = {
  schoolYear: SchoolYearString
  terms: CalendarTerm[]
}
export function isCalendarSchoolYearMaster(
  obj: unknown,
): obj is CalendarSchoolYearMaster {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'schoolYear' in obj &&
    isSchoolYearString(obj.schoolYear) &&
    'terms' in obj &&
    isCalendarTerms(obj.terms)
  )
}
export function isCalendarSchoolYearMasters(
  obj: unknown,
): obj is CalendarSchoolYearMaster[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarSchoolYearMaster)
}
export const emptyCalendarMaster: CalendarSchoolYearMaster = {
  schoolYear: emptySchoolYearString,
  terms: [],
}

export type CalendarPeriod = {
  termIndex: number
  start: Date
  end: Date
  type: 'term' | 'break'
}
export function isCalendarPeriod(obj: unknown): obj is CalendarPeriod {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'termIndex' in obj &&
    typeof obj.termIndex === 'number' &&
    'start' in obj &&
    obj.start instanceof Date &&
    'end' in obj &&
    obj.end instanceof Date &&
    'type' in obj &&
    (obj.type === 'term' || obj.type === 'break')
  )
}
export function isCalendarPeriods(obj: unknown): obj is CalendarPeriod[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarPeriod)
}
export const emptyCalendarPeriod: CalendarPeriod = {
  termIndex: 0,
  start: new Date(),
  end: new Date(),
  type: 'term',
}

export type CalendarSchoolYear = {
  schoolYearString: SchoolYearString
  start: Date
  end: Date
  periods: CalendarPeriod[]
}
export function isCalendarSchoolYear(obj: unknown): obj is CalendarSchoolYear {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'schoolYearString' in obj &&
    isSchoolYearString(obj.schoolYearString) &&
    'start' in obj &&
    obj.start instanceof Date &&
    'end' in obj &&
    obj.end instanceof Date &&
    'periods' in obj &&
    isCalendarPeriods(obj.periods)
  )
}
export function isCalendarSchoolYears(
  obj: unknown,
): obj is CalendarSchoolYear[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarSchoolYear)
}
export const emptyCalendarSchoolYear: CalendarSchoolYear = {
  // keep in sync with build_prepare.ts
  schoolYearString: emptySchoolYearString,
  start: new Date(),
  end: new Date(),
  periods: [],
}
