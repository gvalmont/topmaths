import { isObjectiveExercises, isObjectiveLessonPlans, type ObjectiveExercise, type ObjectiveLessonPlan } from './objective.js'
import { isStringGrade, type StringGrade } from './shared.js'

export type UnitObjective = {
  reference: string,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  examExercises: ObjectiveExercise[],
  theme: string,
  grade: StringGrade,
  lessonPlans: ObjectiveLessonPlan[]
}
export function isUnitObjective (obj: unknown): obj is UnitObjective {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'examExercises' in obj && isObjectiveExercises(obj.examExercises) &&
    'theme' in obj && typeof obj.theme === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'lessonPlans' in obj && isObjectiveLessonPlans(obj.lessonPlans)
}
export function isUnitObjectives (obj: unknown): obj is UnitObjective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitObjective)
}
export const emptyUnitObjective: UnitObjective = {
  reference: '',
  titleAcademic: '',
  title: '',
  exercises: [],
  examExercises: [],
  theme: '',
  grade: 'none',
  lessonPlans: []
}

export type UnitMentalCalculation = {
  reference: string,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}
export function isUnitMentalCalculation (obj: unknown): obj is UnitMentalCalculation {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'isRelatedObjectivePageAvailable' in obj && typeof obj.isRelatedObjectivePageAvailable === 'boolean' &&
    'theme' in obj && typeof obj.theme === 'string'
}
export function isUnitMentalCalculations (obj: unknown): obj is UnitMentalCalculation[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitMentalCalculation)
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
  reference: string,
  titleAcademic: string,
  title: string,
  slug: string,
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}
export function isUnitFlashQuestion (obj: unknown): obj is UnitFlashQuestion {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'isRelatedObjectivePageAvailable' in obj && typeof obj.isRelatedObjectivePageAvailable === 'boolean' &&
    'theme' in obj && typeof obj.theme === 'string'
}
export function isUnitFlashQuestions (obj: unknown): obj is UnitFlashQuestion[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnitFlashQuestion)
}
export const emptyUnitFlashQuestion: UnitFlashQuestion = {
  reference: '',
  titleAcademic: '',
  title: '',
  slug: '',
  isRelatedObjectivePageAvailable: false,
  theme: ''
}

export type UnitAvailableDownloads = {
  isLessonAvailable: boolean,
  isLessonSummaryAvailable: boolean,
  isMissionAvailable: boolean,
  isLessonPlanAvailable: boolean
}
export function isUnitAvailableDownloads (obj: unknown): obj is UnitAvailableDownloads {
  if (obj == null || typeof obj !== 'object') return false
  return 'isLessonAvailable' in obj && typeof obj.isLessonAvailable === 'boolean' &&
    'isLessonSummaryAvailable' in obj && typeof obj.isLessonSummaryAvailable === 'boolean' &&
    'isMissionAvailable' in obj && typeof obj.isMissionAvailable === 'boolean' &&
    'isLessonPlanAvailable' in obj && typeof obj.isLessonPlanAvailable === 'boolean'
}
export const emptyUnitAvailableDownloads: UnitAvailableDownloads = {
  isLessonAvailable: false,
  isLessonSummaryAvailable: false,
  isMissionAvailable: false,
  isLessonPlanAvailable: false
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
  availableDownloads: UnitAvailableDownloads
  flashQuestions: UnitFlashQuestion[],
  flashQuestionsLink: string,
  grade: StringGrade,
  mentalCalculations: UnitMentalCalculation[],
  number: number,
  objectives: UnitObjective[],
  period: number,
  reference: string,
  title: string,
}
export function isUnit (obj: unknown): obj is Unit {
  if (obj == null || typeof obj !== 'object') return false
  return 'assessmentExamLink' in obj && typeof obj.assessmentExamLink === 'string' &&
    'assessmentExamSlug' in obj && typeof obj.assessmentExamSlug === 'string' &&
    'assessmentLink' in obj && typeof obj.assessmentLink === 'string' &&
    'availableDownloads' in obj && isUnitAvailableDownloads(obj.availableDownloads) &&
    'flashQuestions' in obj && isUnitFlashQuestions(obj.flashQuestions) &&
    'flashQuestionsLink' in obj && typeof obj.flashQuestionsLink === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'mentalCalculations' in obj && isUnitMentalCalculations(obj.mentalCalculations) &&
    'number' in obj && typeof obj.number === 'number' &&
    'objectives' in obj && isUnitObjectives(obj.objectives) &&
    'period' in obj && typeof obj.period === 'number' &&
    'reference' in obj && typeof obj.reference === 'string' &&
    'title' in obj && typeof obj.title === 'string'
}
export function isUnits (obj: unknown): obj is Unit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isUnit)
}
export const emptyUnit: Unit = {
  assessmentExamLink: '',
  assessmentExamSlug: '',
  assessmentLink: '',
  availableDownloads: emptyUnitAvailableDownloads,
  flashQuestions: [],
  flashQuestionsLink: '',
  grade: 'none',
  mentalCalculations: [],
  number: 0,
  objectives: [],
  period: 0,
  reference: '',
  title: ''
}
