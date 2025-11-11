import { get } from 'svelte/store'
import {
  isCalendarSchoolYear,
  type CalendarPeriod,
  type CalendarSchoolYear,
} from '../types/calendar'
import type { ReplaceDateWithString } from '../types/shared'
import { calendar } from './store'

export function parseSchoolYear(
  schoolYear: ReplaceDateWithString<CalendarSchoolYear>,
): CalendarSchoolYear {
  const schoolYearCandidate = {
    schoolYearString: schoolYear.schoolYearString,
    start: new Date(schoolYear.start),
    end: new Date(schoolYear.end),
    periods: schoolYear.periods.map(
      (period: ReplaceDateWithString<CalendarPeriod>) => ({
        termIndex: period.termIndex,
        start: new Date(period.start),
        end: new Date(period.end),
        type: period.type,
      }),
    ),
  }
  if (!isCalendarSchoolYear(schoolYearCandidate)) {
    console.error(schoolYearCandidate)
    throw new Error(
      'built_calendar.json contains an invalid CalendarSchoolYear',
    )
  }
  return schoolYearCandidate
}

export function getCurrentTerm(): CalendarPeriod {
  const now = new Date()
  const currentTerm = get(calendar).periods.find(
    (period) => period.start <= now && period.end >= now,
  )
  if (!currentTerm) {
    console.error('Current term not found')
  }
  return currentTerm ?? get(calendar).periods[0]
}

export function getWeekIndexInCurrentTerm(): number {
  const currentTerm = getCurrentTerm()
  const now = new Date()
  const weekIndex = Math.floor(
    (now.getTime() - currentTerm.start.getTime()) / (1000 * 60 * 60 * 24 * 7),
  )
  return Math.max(weekIndex, 0)
}
