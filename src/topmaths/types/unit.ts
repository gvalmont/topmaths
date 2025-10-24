import { DEFAULT_GRADE, isStringGrade, type StringGrade } from './grade.js'
import {
  isObjectiveExercises,
  isObjectiveLessonPlan,
  isObjectivePrerequisites,
  isObjectiveReference,
  type ObjectiveExercise,
  type ObjectiveLessonPlan,
  type ObjectivePrerequisite,
  type ObjectiveReference,
} from './objective.js'
import { isStrings, type ReplaceReferencesByStrings } from './shared.js'
import { unitsReferences } from './unitsReferences.js'

type UnitsReferencesValidTypes = typeof unitsReferences
export type UnitReference = UnitsReferencesValidTypes[number]
export function isUnitReference(obj: unknown): obj is UnitReference {
  if (obj == null || typeof obj !== 'string') return false
  return unitsReferences.includes(obj as UnitReference)
}
export function isUnitReferences(obj: unknown): obj is UnitReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitReference)
}
export const emptyUnitReference: UnitReference = unitsReferences[0] // keep in sync with build_prepare.ts

export type UnitLessonPlan = ObjectiveLessonPlan & {
  objectiveReference: ObjectiveReference
  objectiveTitle: string
  reference: string
}
export function isUnitLessonPlan(
  obj: unknown,
  withStringReference: boolean = false,
): obj is UnitLessonPlan {
  if (obj == null || typeof obj !== 'object') return false
  return (
    isObjectiveLessonPlan(obj, withStringReference) &&
    'objectiveReference' in obj &&
    (withStringReference
      ? typeof obj.objectiveReference === 'string'
      : isObjectiveReference(obj.objectiveReference)) &&
    'objectiveTitle' in obj &&
    typeof obj.objectiveTitle === 'string' &&
    'reference' in obj &&
    typeof obj.reference === 'string'
  )
}
export function isUnitLessonPlans(
  obj: unknown,
  withStringReference: boolean = false,
): obj is UnitLessonPlan[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((unit) => isUnitLessonPlan(unit, withStringReference))
}
export const emptyUnitLessonPlan: UnitLessonPlan = {
  // Cannot access 'emptyObjectiveLessonPlan' before initialization
  objectivePrerequisites: [],
  startSteps: [],
  segments: [],
  closureSteps: [],
  studentMaterialsNeeded: [],
  teacherMaterialsNeeded: [],
  grades: [],
  comments: [],
  objectiveReference: '6N1A1', // Cannot access 'emptyObjectiveReference' before initialization
  objectiveTitle: '',
  reference: '',
}

export type UnitObjective = {
  descendantsCount: number
  examExercises: ObjectiveExercise[]
  exercises: ObjectiveExercise[]
  grade: StringGrade
  isAutomaticity: boolean
  lessonImages: string[]
  lessonPlans: UnitLessonPlan[]
  prerequisites: ObjectivePrerequisite[]
  reference: ObjectiveReference
  theme: string
  title: string
  titleAcademic: string
}
export function isUnitObjective(
  obj: unknown,
  withStringReference: boolean = false,
): obj is UnitObjective {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'descendantsCount' in obj &&
    typeof obj.descendantsCount === 'number' &&
    'examExercises' in obj &&
    isObjectiveExercises(obj.examExercises) &&
    'exercises' in obj &&
    isObjectiveExercises(obj.exercises) &&
    'grade' in obj &&
    isStringGrade(obj.grade) &&
    'isAutomaticity' in obj &&
    typeof obj.isAutomaticity === 'boolean' &&
    'lessonImages' in obj &&
    isStrings(obj.lessonImages) &&
    'lessonPlans' in obj &&
    isUnitLessonPlans(obj.lessonPlans) &&
    'prerequisites' in obj &&
    isObjectivePrerequisites(obj.prerequisites) &&
    'reference' in obj &&
    (withStringReference
      ? typeof obj.reference === 'string'
      : isObjectiveReference(obj.reference)) &&
    'theme' in obj &&
    typeof obj.theme === 'string' &&
    'title' in obj &&
    typeof obj.title === 'string' &&
    'titleAcademic' in obj &&
    typeof obj.titleAcademic === 'string'
  )
}
export function isUnitObjectives(
  obj: unknown,
  withStringReference: boolean = false,
): obj is UnitObjective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((obj) => isUnitObjective(obj, withStringReference))
}
export const emptyUnitObjective: UnitObjective = {
  descendantsCount: 0,
  examExercises: [],
  exercises: [],
  grade: DEFAULT_GRADE,
  isAutomaticity: false,
  lessonImages: [],
  lessonPlans: [],
  prerequisites: [],
  reference: '6N1A1', // Cannot access 'emptyObjectiveReference' before initialization
  theme: '',
  title: '',
  titleAcademic: '',
}

export type UnitDownloadLinks = {
  lessonLink: string
  lessonSummaryLink: string
  missionLink: string
  lessonPlanLink: string
}
export function isUnitDownloadLinks(obj: unknown): obj is UnitDownloadLinks {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'lessonLink' in obj &&
    typeof obj.lessonLink === 'string' &&
    'lessonSummaryLink' in obj &&
    typeof obj.lessonSummaryLink === 'string' &&
    'missionLink' in obj &&
    typeof obj.missionLink === 'string' &&
    'lessonPlanLink' in obj &&
    typeof obj.lessonPlanLink === 'string'
  )
}
export const emptyUnitDownloadLinks: UnitDownloadLinks = {
  // keep in sync with build_prepare.ts
  lessonLink: '',
  lessonSummaryLink: '',
  missionLink: '',
  lessonPlanLink: '',
}

export type Unit = {
  assessmentExamLink: string
  assessmentExamSlug: string
  assessmentLink: string
  downloadLinks: UnitDownloadLinks
  grade: StringGrade
  number: number
  objectives: UnitObjective[]
  term: number
  reference: UnitReference
  title: string
}
export function isUnit(
  obj: unknown,
  withStringReference: boolean = false,
): obj is Unit {
  if (obj == null || typeof obj !== 'object') return false
  return (
    'assessmentExamLink' in obj &&
    typeof obj.assessmentExamLink === 'string' &&
    'assessmentExamSlug' in obj &&
    typeof obj.assessmentExamSlug === 'string' &&
    'assessmentLink' in obj &&
    typeof obj.assessmentLink === 'string' &&
    'downloadLinks' in obj &&
    isUnitDownloadLinks(obj.downloadLinks) &&
    'grade' in obj &&
    isStringGrade(obj.grade) &&
    'number' in obj &&
    typeof obj.number === 'number' &&
    'objectives' in obj &&
    isUnitObjectives(obj.objectives, withStringReference) &&
    'term' in obj &&
    typeof obj.term === 'number' &&
    'reference' in obj &&
    (withStringReference
      ? typeof obj.reference === 'string'
      : isUnitReference(obj.reference)) &&
    'title' in obj &&
    typeof obj.title === 'string'
  )
}
export function isUnits(
  obj: unknown,
  withStringReference: boolean = false,
): obj is Unit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every((obj) => isUnit(obj, withStringReference))
}
export const emptyUnit: Unit = {
  // keep in sync with build_prepare.ts
  assessmentExamLink: '',
  assessmentExamSlug: '',
  assessmentLink: '',
  downloadLinks: emptyUnitDownloadLinks,
  grade: DEFAULT_GRADE,
  number: 0,
  objectives: [],
  term: 0,
  reference: emptyUnitReference,
  title: '',
}

export type UnitWithStringReference = ReplaceReferencesByStrings<
  UnitReference,
  ReplaceReferencesByStrings<ObjectiveReference, Unit>
>
export function isUnitWithStringReference(
  obj: unknown,
): obj is UnitWithStringReference {
  return isUnit(obj, true)
}
export function isUnitsWithStringReference(
  obj: unknown,
): obj is UnitWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitWithStringReference)
}
