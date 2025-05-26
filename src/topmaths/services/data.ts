import { objectives as storeObjectives, units as storeUnits, specialUnits as storeSpecialUnits, calendar as storeCalendar, glossary as storeGlossary, curriculum as storeCurriculum, examExercises as storeExamExercises } from './store'
import unitsJson from '../../topmaths/json/built_units.json'
import objectivesJson from '../../topmaths/json/built_objectives.json'
import glossaryJson from '../../topmaths/json/glossary.json'
import specialUnitsJson from '../../topmaths/json/special_units.json'
import calendarJson from '../../topmaths/json/built_calendar.json'
import curriculumJson from '../../topmaths/json/built_curriculum.json'
import examExercisesJson from '../../topmaths/json/built_exam-exercises.json'
import { isGlossaryUniteItems } from '../types/glossary'
import { isUnits } from '../types/unit'
import { isObjectives } from '../types/objective'
import { parseSchoolYear } from './calendar'
import { isCurriculum } from '../types/curriculum'
import { isSpecialUnits } from '../types/specialUnit'
import { isExamExercises } from '../types/exam-exercise'

export function cacheData (): void {
  cacheUnits()
  cacheObjectives()
  cacheSpecialUnits()
  cacheGlossary()
  cacheCalendar()
  cacheCurriculum()
  cacheExamExercises()
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
  if (!isSpecialUnits(sequencesParticulieres)) {
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
  const currentYear = parsedCalendar.find(schoolYear => schoolYear.start <= now && schoolYear.end >= now) ?? parsedCalendar[0]
  storeCalendar.set(currentYear)
}

function cacheCurriculum (): void {
  const curriculum = curriculumJson
  if (!isCurriculum(curriculum)) {
    console.error(curriculum)
    throw new Error('curriculum.json is not a Curriculum')
  }
  storeCurriculum.set(curriculum)
}

function cacheExamExercises (): void {
  const examExercises = examExercisesJson
  if (!isExamExercises(examExercises)) {
    console.error(examExercises)
    throw new Error('exam-exercises.json is not an array of ExamExercise')
  }
  storeExamExercises.set(examExercises)
}
