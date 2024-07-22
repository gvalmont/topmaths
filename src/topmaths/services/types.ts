export type StringGrade = '6e' | '5e' | '4e' | '3e' | 'none'
export function isStringGrade (obj: unknown): obj is StringGrade {
  if (obj == null || typeof obj !== 'string') return false
  return ['6e', '5e', '4e', '3e', 'none'].includes(obj)
}

export type Couleur = 'warning' | 'link' | 'info' | 'danger' | 'primary' | 'success' | 'orange' | 'sponsor' | 'fuchsia' | 'black-and-yellow' | 'green' | 'coopmaths' | 'purple' | 'info-darker' | 'violet' | 'blue' | '6e' | '5e' | '4e' | '3e' | 'tout'

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
  return 'startSteps' in obj && Array.isArray(obj.startSteps) && obj.startSteps.every(step => typeof step === 'string') &&
    'lessonSteps' in obj && Array.isArray(obj.lessonSteps) && obj.lessonSteps.every(step => typeof step === 'string') &&
    'homeworks' in obj && Array.isArray(obj.homeworks) && obj.homeworks.every(homework => typeof homework === 'string') &&
    'closureSteps' in obj && Array.isArray(obj.closureSteps) && obj.closureSteps.every(step => typeof step === 'string') &&
    'studentMaterialsNeeded' in obj && Array.isArray(obj.studentMaterialsNeeded) && obj.studentMaterialsNeeded.every(material => typeof material === 'string') &&
    'teacherMaterialsNeeded' in obj && Array.isArray(obj.teacherMaterialsNeeded) && obj.teacherMaterialsNeeded.every(material => typeof material === 'string') &&
    'grades' in obj && Array.isArray(obj.grades) && obj.grades.every(isStringGrade) &&
    'comments' in obj && Array.isArray(obj.comments) && obj.comments.every(comment => typeof comment === 'string') &&
    'nextSessionSteps' in obj && Array.isArray(obj.nextSessionSteps) && obj.nextSessionSteps.every(step => typeof step === 'string') &&
    'reference' in obj && typeof obj.reference === 'string'
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

export type ObjectiveAvailableDownloads = {
  isPracticeSheetAvailable: boolean,
  isTestSheetAvailable: boolean,
  isLessonPlanAvailable: boolean,
  availableLessonPlanGrades: StringGrade[]
}
export function isObjectiveAvailableDownloads (obj: unknown): obj is ObjectiveAvailableDownloads {
  if (obj == null || typeof obj !== 'object') return false
  return 'isPracticeSheetAvailable' in obj && typeof obj.isPracticeSheetAvailable === 'boolean' &&
    'isTestSheetAvailable' in obj && typeof obj.isTestSheetAvailable === 'boolean' &&
    'isLessonPlanAvailable' in obj && typeof obj.isLessonPlanAvailable === 'boolean' &&
    'availableLessonPlanGrades' in obj && Array.isArray(obj.availableLessonPlanGrades) && obj.availableLessonPlanGrades.every(isStringGrade)
}

export type Objective = {
  availableDownloads: ObjectiveAvailableDownloads,
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
  return 'availableDownloads' in obj && isObjectiveAvailableDownloads(obj.availableDownloads) &&
    'examExercises' in obj && Array.isArray(obj.examExercises) && obj.examExercises.every(isObjectiveExercise) &&
    'examExercisesLink' in obj && typeof obj.examExercisesLink === 'string' &&
    'exercises' in obj && Array.isArray(obj.exercises) && obj.exercises.every(isObjectiveExercise) &&
    'exercisesLink' in obj && typeof obj.exercisesLink === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'lessonPlans' in obj && Array.isArray(obj.lessonPlans) && obj.lessonPlans.every(isObjectiveLessonPlan) &&
    'lessonSummaryHTML' in obj && typeof obj.lessonSummaryHTML === 'string' &&
    'lessonSummaryImage' in obj && typeof obj.lessonSummaryImage === 'string' &&
    'lessonSummaryInstrumenpoche' in obj && typeof obj.lessonSummaryInstrumenpoche === 'string' &&
    'period' in obj && typeof obj.period === 'number' &&
    'reference' in obj && typeof obj.reference === 'string' &&
    'subTheme' in obj && typeof obj.subTheme === 'string' &&
    'theme' in obj && typeof obj.theme === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'units' in obj && Array.isArray(obj.units) && obj.units.every(isObjectiveUnit) &&
    'videos' in obj && Array.isArray(obj.videos) && obj.videos.every(isObjectiveVideo)
}
export const emptyObjective: Objective = {
  availableDownloads: {
    isPracticeSheetAvailable: false,
    isTestSheetAvailable: false,
    isLessonPlanAvailable: false,
    availableLessonPlanGrades: []
  },
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

export function isObjectives (obj: unknown): obj is Objective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjective)
}

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

export type UnitMentalCalculation = {
  reference: string,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}

export type UnitFlashQuestions = {
  reference: string,
  titleAcademic: string,
  title: string,
  slug: string,
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}

export type UnitAvailableDownloads = {
  isLessonAvailable: boolean,
  isLessonSummaryAvailable: boolean,
  isMissionAvailable: boolean,
  isLessonPlanAvailable: boolean
}

export type UnitSpecialUnit = {
  reference: string,
  title: string
}

export type UnitUnit = {
  grade: StringGrade,
  number: number,
  reference: string,
  title: string,
  period: number,
  objectives: UnitObjective[],
  mentalCalculations: UnitMentalCalculation[],
  flashQuestions: UnitFlashQuestions[],
  flashQuestionsLink: string,
  assessmentExamSlug: string,
  assessmentLink: string,
  assessmentExamLink: string,
  availableDownloads: UnitAvailableDownloads
}

export type UnitGrade = {
  name: StringGrade,
  units: UnitUnit[]
}

export type LineGrade = StringGrade | 'all' | 'fin' | ''
export function isLineGrade (obj: unknown): obj is LineGrade {
  if (obj == null || typeof obj !== 'string') return false
  return isStringGrade(obj) || ['all', 'fin', ''].includes(obj)
}

export type LineObjective = {
  grade: LineGrade,
  period: number,
  theme: string,
  subTheme: string,
  reference: string,
  titleAcademic: string,
  title: string
}

export type CalendarPeriod = {
  number: number,
  startDayOfYear: number,
  endDayOfYear: number,
  isHoliday: boolean
}

export type CalendarYear = {
  year: number,
  periods: CalendarPeriod[]
}

export type CalendarCurrentYear = {
  year: number,
  dayOfYear: number,
  periodNumber: number,
  weekInPeriod: number,
  isHoliday: boolean
}

export type CartItem = {
  id: string,
  label: string,
  description: string,
  slug: string,
  objectiveReference: string
}
