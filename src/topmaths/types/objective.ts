import { emptyRecordStringGrade, isRecordStringGrade, isStringGrade, isStringGrades, isStrings, type StringGrade } from './shared.js'

export type ObjectiveVideo = {
  title: string,
  videoLink: string,
  authorName: string,
  authorLink: string
}
export function isObjectiveVideo (obj: unknown): obj is ObjectiveVideo {
  if (obj == null || typeof obj !== 'object') return false
  return 'title' in obj && typeof obj.title === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'authorName' in obj && typeof obj.authorName === 'string' &&
    'authorLink' in obj && typeof obj.authorLink === 'string'
}
export function isObjectiveVideos (obj: unknown): obj is ObjectiveVideo[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveVideo)
}
export const emptyObjectiveVideo: ObjectiveVideo = {
  title: '',
  videoLink: '',
  authorName: '',
  authorLink: ''
}

export type ObjectiveExercise = {
  id: string,
  slug: string,
  link: string,
  isInteractive: boolean,
  description: string,
  isInCart: boolean
}
export function isObjectiveExercise (obj: unknown): obj is ObjectiveExercise {
  if (obj == null || typeof obj !== 'object') return false
  return 'id' in obj && typeof obj.id === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'link' in obj && typeof obj.link === 'string' &&
    'isInteractive' in obj && typeof obj.isInteractive === 'boolean' &&
    'description' in obj && typeof obj.description === 'string' &&
    'isInCart' in obj && typeof obj.isInCart === 'boolean'
}
export function isObjectiveExercises (obj: unknown): obj is ObjectiveExercise[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveExercise)
}
export const emptyObjectiveExercise: ObjectiveExercise = {
  id: '',
  slug: '',
  link: '',
  isInteractive: false,
  description: '',
  isInCart: false
}

export type ObjectiveLessonPlan = {
  startSteps: string[],
  lessonSteps: string[],
  homeworks: string[],
  closureSteps: string[],
  studentMaterialsNeeded: string[],
  teacherMaterialsNeeded: string[],
  grades: StringGrade[],
  comments: string[],
  nextSessionSteps: string[],
  reference: string
}
export function isObjectiveLessonPlan (obj: unknown): obj is ObjectiveLessonPlan {
  if (obj == null || typeof obj !== 'object') return false
  return 'startSteps' in obj && isStrings(obj.startSteps) &&
    'lessonSteps' in obj && isStrings(obj.lessonSteps) &&
    'homeworks' in obj && isStrings(obj.homeworks) &&
    'closureSteps' in obj && isStrings(obj.closureSteps) &&
    'studentMaterialsNeeded' in obj && isStrings(obj.studentMaterialsNeeded) &&
    'teacherMaterialsNeeded' in obj && isStrings(obj.teacherMaterialsNeeded) &&
    'grades' in obj && isStringGrades(obj.grades) &&
    'comments' in obj && isStrings(obj.comments) &&
    'nextSessionSteps' in obj && isStrings(obj.nextSessionSteps) &&
    'reference' in obj && typeof obj.reference === 'string'
}
export function isObjectiveLessonPlans (obj: unknown): obj is ObjectiveLessonPlan[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveLessonPlan)
}
export const emptyObjectiveLessonPlan: ObjectiveLessonPlan = {
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

export type ObjectiveUnit = {
  reference: string,
  title: string
}
export function isObjectiveUnit (obj: unknown): obj is ObjectiveUnit {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'title' in obj && typeof obj.title === 'string'
}
export function isObjectiveUnits (obj: unknown): obj is ObjectiveUnit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveUnit)
}
export const emptyObjectiveUnit: ObjectiveUnit = {
  reference: '',
  title: ''
}

export type ObjectiveDownloadLinks = {
  practiceSheetLink: string,
  testSheetLink: string,
  lessonPlanLinks: Record<StringGrade, string>
}
export function isObjectiveDownloadLinks (obj: unknown): obj is ObjectiveDownloadLinks {
  if (obj == null || typeof obj !== 'object') return false
  return 'practiceSheetLink' in obj && typeof obj.practiceSheetLink === 'string' &&
    'testSheetLink' in obj && typeof obj.testSheetLink === 'string' &&
    'lessonPlanLinks' in obj && isRecordStringGrade(obj.lessonPlanLinks)
}
export const emptyObjectiveDownloadLinks: ObjectiveDownloadLinks = {
  practiceSheetLink: '',
  testSheetLink: '',
  lessonPlanLinks: emptyRecordStringGrade
}

export type Objective = {
  downloadLinks: ObjectiveDownloadLinks,
  examExercises: ObjectiveExercise[],
  examExercisesLink: string,
  exercises: ObjectiveExercise[],
  exercisesLink: string,
  grade: StringGrade
  lessonPlans: ObjectiveLessonPlan[],
  lessonSummaryHTML: string,
  lessonSummaryImage: string,
  lessonSummaryInstrumenpoche: string,
  period: number,
  reference: string,
  subTheme: string,
  theme: string
  title: string,
  titleAcademic: string,
  units: ObjectiveUnit[],
  videos: ObjectiveVideo[],
}
export function isObjective (obj: unknown): obj is Objective {
  if (obj == null || typeof obj !== 'object') return false
  return 'downloadLinks' in obj && isObjectiveDownloadLinks(obj.downloadLinks) &&
    'examExercises' in obj && isObjectiveExercises(obj.examExercises) &&
    'examExercisesLink' in obj && typeof obj.examExercisesLink === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'exercisesLink' in obj && typeof obj.exercisesLink === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'lessonPlans' in obj && isObjectiveLessonPlans(obj.lessonPlans) &&
    'lessonSummaryHTML' in obj && typeof obj.lessonSummaryHTML === 'string' &&
    'lessonSummaryImage' in obj && typeof obj.lessonSummaryImage === 'string' &&
    'lessonSummaryInstrumenpoche' in obj && typeof obj.lessonSummaryInstrumenpoche === 'string' &&
    'period' in obj && typeof obj.period === 'number' &&
    'reference' in obj && typeof obj.reference === 'string' &&
    'subTheme' in obj && typeof obj.subTheme === 'string' &&
    'theme' in obj && typeof obj.theme === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'units' in obj && isObjectiveUnits(obj.units) &&
    'videos' in obj && isObjectiveVideos(obj.videos)
}
export function isObjectives (obj: unknown): obj is Objective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjective)
}
export const emptyObjective: Objective = {
  downloadLinks: emptyObjectiveDownloadLinks,
  examExercises: [],
  examExercisesLink: '',
  exercises: [],
  exercisesLink: '',
  grade: 'none',
  lessonPlans: [],
  lessonSummaryHTML: '',
  lessonSummaryImage: '',
  lessonSummaryInstrumenpoche: '',
  period: 0,
  reference: '',
  subTheme: '',
  theme: '',
  title: '',
  titleAcademic: '',
  units: [],
  videos: []
}
