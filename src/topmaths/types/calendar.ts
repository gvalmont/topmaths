export type CalendarPeriod = {
  number: number,
  startDayOfYear: number,
  endDayOfYear: number,
  isHoliday: boolean
}
export function isCalendarPeriod (obj: unknown): obj is CalendarPeriod {
  if (obj == null || typeof obj !== 'object') return false
  return 'number' in obj && typeof obj.number === 'number' &&
    'startDayOfYear' in obj && typeof obj.startDayOfYear === 'number' &&
    'endDayOfYear' in obj && typeof obj.endDayOfYear === 'number' &&
    'isHoliday' in obj && typeof obj.isHoliday === 'boolean'
}
export function isCalendarPeriods (obj: unknown): obj is CalendarPeriod[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarPeriod)
}
export const emptyCalendarPeriod: CalendarPeriod = {
  number: 0,
  startDayOfYear: 0,
  endDayOfYear: 0,
  isHoliday: false
}

export type CalendarYear = {
  year: number,
  periods: CalendarPeriod[]
}
export function isCalendarYear (obj: unknown): obj is CalendarYear {
  if (obj == null || typeof obj !== 'object') return false
  return 'year' in obj && typeof obj.year === 'number' &&
    'periods' in obj && isCalendarPeriods(obj.periods)
}
export function isCalendarYears (obj: unknown): obj is CalendarYear[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarYear)
}
export const emptyCalendarYear: CalendarYear = {
  year: 0,
  periods: []
}

export type CalendarCurrentYear = {
  year: number,
  dayOfYear: number,
  periodNumber: number,
  weekInPeriod: number,
  isHoliday: boolean
}
export function isCalendarCurrentYear (obj: unknown): obj is CalendarCurrentYear {
  if (obj == null || typeof obj !== 'object') return false
  return 'year' in obj && typeof obj.year === 'number' &&
    'dayOfYear' in obj && typeof obj.dayOfYear === 'number' &&
    'periodNumber' in obj && typeof obj.periodNumber === 'number' &&
    'weekInPeriod' in obj && typeof obj.weekInPeriod === 'number' &&
    'isHoliday' in obj && typeof obj.isHoliday === 'boolean'
}
export function isCalendarCurrentYears (obj: unknown): obj is CalendarCurrentYear[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isCalendarCurrentYear)
}
export const emptyCalendarCurrentYear: CalendarCurrentYear = {
  year: 0,
  dayOfYear: 0,
  periodNumber: 0,
  weekInPeriod: 0,
  isHoliday: false
}
