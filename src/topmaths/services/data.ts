import { objectives as storeObjectives, units as storeUnits, specialUnits as storeSpecialUnits, calendar as storeCalendar, glossary as storeGlossary } from './store'
import unitsJson from '../../topmaths/json/built_units.json'
import objectivesJson from '../../topmaths/json/built_objectives.json'
import glossaryJson from '../../topmaths/json/glossary.json'
import specialUnitsJson from '../../topmaths/json/special_units.json'
import calendarJson from '../../topmaths/json/built_calendar.json'
import { isGlossaryUniteItems } from '../types/glossary'
import { isUnits, isUnitSpecials } from '../types/unit'
import { isObjectives } from '../types/objective'
import { isCalendarSchoolYear, type CalendarPeriod, type CalendarSchoolYear } from '../types/calendar'
import type { ReplaceDateWithString } from '../../lib/types'

export function cacheData (): void {
  cacheUnits()
  cacheObjectives()
  cacheSpecialUnits()
  cacheGlossary()
  cacheCalendar()
}

function cacheUnits (): void {
  if (!isUnits(unitsJson)) {
    console.error(unitsJson)
    throw new Error('built_units.json is not an array of Unit')
  }
  storeUnits.set(unitsJson)
}

function cacheObjectives (): void {
  if (!isObjectives(objectivesJson)) {
    console.error(objectivesJson)
    throw new Error('built_objectives.json is not an array of Objective')
  }
  storeObjectives.set(objectivesJson)
}

function cacheSpecialUnits (): void {
  const sequencesParticulieres = specialUnitsJson
  if (!isUnitSpecials(sequencesParticulieres)) {
    console.error(sequencesParticulieres)
    throw new Error('special_units.json is not an array of UnitSpecial')
  }
  storeSpecialUnits.set(sequencesParticulieres)
}

function cacheGlossary (): void {
  if (!isGlossaryUniteItems(glossaryJson)) {
    console.error(glossaryJson)
    throw new Error('glossary.json is not an array of GlossaryUniteItem')
  }
  storeGlossary.set(glossaryJson)
}

function cacheCalendar (): void {
  const parsedCalendar = calendarJson.map(parseSchoolYear)
  const now = new Date()
  const currentYear: CalendarSchoolYear = parsedCalendar.find(schoolYear => schoolYear.start <= now && schoolYear.end >= now) ?? parsedCalendar[0]
  storeCalendar.set(currentYear)
}

function parseSchoolYear (schoolYear: ReplaceDateWithString<CalendarSchoolYear>): CalendarSchoolYear {
  const schoolYearCandidate = {
    schoolYearString: schoolYear.schoolYearString,
    start: new Date(schoolYear.start),
    end: new Date(schoolYear.end),
    periods: schoolYear.periods.map((period: ReplaceDateWithString<CalendarPeriod>) => ({
      termIndex: period.termIndex,
      start: new Date(period.start),
      end: new Date(period.end),
      type: period.type
    }))
  }
  if (!isCalendarSchoolYear(schoolYearCandidate)) {
    console.error(schoolYearCandidate)
    throw new Error('built_calendar.json contains an invalid CalendarSchoolYear')
  }
  return schoolYearCandidate
}
