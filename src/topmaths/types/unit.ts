import { isObjectiveExercises, isObjectiveLessonPlan, isObjectiveReference, type ObjectiveExercise, type ObjectiveLessonPlan, type ObjectiveReference } from './objective.js'
import { isStringGrade, type StringGrade } from './grade.js'
import { unitsReferences } from './unitsReferences.js'
import type { ReplaceReferencesByStrings } from './shared'

type UnitsReferencesValidTypes = typeof unitsReferences
export type UnitReference = UnitsReferencesValidTypes[number]
export function isUnitReference (obj: unknown): obj is UnitReference {
  if (obj == null || typeof obj !== 'string') return false
  return unitsReferences.includes(obj as UnitReference)
}
export function isUnitReferences (obj: unknown): obj is UnitReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitReference)
}
export const emptyUnitReference: UnitReference = unitsReferences[0]

export type UnitLessonPlan = ObjectiveLessonPlan & {
  reference: string
}
export function isUnitLessonPlan (obj: unknown): obj is UnitLessonPlan {
  if (obj == null || typeof obj !== 'object') return false
  return isObjectiveLessonPlan(obj) &&
    'reference' in obj && typeof obj.reference === 'string'
}
export function isUnitLessonPlans (obj: unknown): obj is UnitLessonPlan[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitLessonPlan)
}
export const emptyUnitLessonPlan: UnitLessonPlan = { // Cannot access 'emptyObjectiveLessonPlan' before initialization
  startSteps: [],
  lessonSteps: [],
  homeworks: [],
  closureSteps: [],
  studentMaterialsNeeded: [],
  teacherMaterialsNeeded: [],
  grades: [],
  comments: [],
  nextSessionSteps: [],
  reference: ''
}

export type UnitObjective = {
  reference: ObjectiveReference,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  examExercises: ObjectiveExercise[],
  theme: string,
  grade: StringGrade,
  lessonPlans: UnitLessonPlan[]
}
export function isUnitObjective (obj: unknown, withStringReference: boolean = false): obj is UnitObjective {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isObjectiveReference(obj.reference)) &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'examExercises' in obj && isObjectiveExercises(obj.examExercises) &&
    'theme' in obj && typeof obj.theme === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'lessonPlans' in obj && isUnitLessonPlans(obj.lessonPlans)
}
export function isUnitObjectives (obj: unknown, withStringReference: boolean = false): obj is UnitObjective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isUnitObjective(obj, withStringReference))
}
export const emptyUnitObjective: UnitObjective = {
  reference: '6C10', // Cannot access 'emptyObjectiveReference' before initialization
  titleAcademic: '',
  title: '',
  exercises: [],
  examExercises: [],
  theme: '',
  grade: 'tout',
  lessonPlans: []
}

export type UnitMentalCalculation = {
  reference: ObjectiveReference | '',
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}
export function isUnitMentalCalculation (obj: unknown, withStringReference: boolean = false): obj is UnitMentalCalculation {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : (isObjectiveReference(obj.reference) || obj.reference === '')) &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'isRelatedObjectivePageAvailable' in obj && typeof obj.isRelatedObjectivePageAvailable === 'boolean' &&
    'theme' in obj && typeof obj.theme === 'string'
}
export function isUnitMentalCalculations (obj: unknown, withStringReference: boolean = false): obj is UnitMentalCalculation[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isUnitMentalCalculation(obj, withStringReference))
}
export const emptyUnitMentalCalculation: UnitMentalCalculation = {
  reference: '',
  titleAcademic: '',
  title: '',
  exercises: [],
  isRelatedObjectivePageAvailable: false,
  theme: ''
}

export type UnitFlashQuestion = {
  reference: ObjectiveReference,
  titleAcademic: string,
  title: string,
  slug: string,
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}
export function isUnitFlashQuestion (obj: unknown, withStringReference: boolean = false): obj is UnitFlashQuestion {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isObjectiveReference(obj.reference)) &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'isRelatedObjectivePageAvailable' in obj && typeof obj.isRelatedObjectivePageAvailable === 'boolean' &&
    'theme' in obj && typeof obj.theme === 'string'
}
export function isUnitFlashQuestions (obj: unknown, withStringReference: boolean = false): obj is UnitFlashQuestion[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isUnitFlashQuestion(obj, withStringReference))
}
export const emptyUnitFlashQuestion: UnitFlashQuestion = {
  reference: '6C10', // Cannot access 'emptyObjectiveReference' before initialization
  titleAcademic: '',
  title: '',
  slug: '',
  isRelatedObjectivePageAvailable: false,
  theme: ''
}

export type UnitDownloadLinks = {
  lessonLink: string,
  lessonSummaryLink: string,
  missionLink: string,
  lessonPlanLink: string
}
export function isUnitDownloadLinks (obj: unknown): obj is UnitDownloadLinks {
  if (obj == null || typeof obj !== 'object') return false
  return 'lessonLink' in obj && typeof obj.lessonLink === 'string' &&
    'lessonSummaryLink' in obj && typeof obj.lessonSummaryLink === 'string' &&
    'missionLink' in obj && typeof obj.missionLink === 'string' &&
    'lessonPlanLink' in obj && typeof obj.lessonPlanLink === 'string'
}
export const emptyUnitDownloadLinks: UnitDownloadLinks = {
  lessonLink: '',
  lessonSummaryLink: '',
  missionLink: '',
  lessonPlanLink: ''
}

export type UnitSpecial = {
  reference: string,
  title: string
}
export function isUnitSpecial (obj: unknown): obj is UnitSpecial {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'title' in obj && typeof obj.title === 'string'
}
export function isUnitSpecials (obj: unknown): obj is UnitSpecial[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitSpecial)
}
export const emptyUnitSpecial: UnitSpecial = {
  reference: '',
  title: ''
}

export type Unit = {
  assessmentExamLink: string,
  assessmentExamSlug: string,
  assessmentLink: string,
  downloadLinks: UnitDownloadLinks,
  flashQuestions: UnitFlashQuestion[],
  flashQuestionsLink: string,
  grade: StringGrade,
  mentalCalculations: UnitMentalCalculation[],
  number: number,
  objectives: UnitObjective[],
  term: number,
  reference: UnitReference,
  title: string,
}
export function isUnit (obj: unknown, withStringReference: boolean = false): obj is Unit {
  if (obj == null || typeof obj !== 'object') return false
  return 'assessmentExamLink' in obj && typeof obj.assessmentExamLink === 'string' &&
    'assessmentExamSlug' in obj && typeof obj.assessmentExamSlug === 'string' &&
    'assessmentLink' in obj && typeof obj.assessmentLink === 'string' &&
    'downloadLinks' in obj && isUnitDownloadLinks(obj.downloadLinks) &&
    'flashQuestions' in obj && isUnitFlashQuestions(obj.flashQuestions, withStringReference) &&
    'flashQuestionsLink' in obj && typeof obj.flashQuestionsLink === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'mentalCalculations' in obj && isUnitMentalCalculations(obj.mentalCalculations, withStringReference) &&
    'number' in obj && typeof obj.number === 'number' &&
    'objectives' in obj && isUnitObjectives(obj.objectives, withStringReference) &&
    'term' in obj && typeof obj.term === 'number' &&
    'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isUnitReference(obj.reference)) &&
    'title' in obj && typeof obj.title === 'string'
}
export function isUnits (obj: unknown, withStringReference: boolean = false): obj is Unit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isUnit(obj, withStringReference))
}
export const emptyUnit: Unit = {
  assessmentExamLink: '',
  assessmentExamSlug: '',
  assessmentLink: '',
  downloadLinks: emptyUnitDownloadLinks,
  flashQuestions: [],
  flashQuestionsLink: '',
  grade: 'tout',
  mentalCalculations: [],
  number: 0,
  objectives: [],
  term: 0,
  reference: emptyUnitReference,
  title: ''
}

export type UnitWithStringReference = ReplaceReferencesByStrings<UnitReference, ReplaceReferencesByStrings<ObjectiveReference, Unit>>
export function isUnitWithStringReference (obj: unknown): obj is UnitWithStringReference {
  return isUnit(obj, true)
}
export function isUnitsWithStringReference (obj: unknown): obj is UnitWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitWithStringReference)
}
