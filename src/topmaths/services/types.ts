export type StringGrade = '6e' | '5e' | '4e' | '3e' | 'none'
export function isStringGrade (str: string): str is StringGrade {
  return ['6e', '5e', '4e', '3e', 'none'].includes(str)
}

export type Couleur = 'warning' | 'link' | 'info' | 'danger' | 'primary' | 'success' | 'orange' | 'sponsor' | 'fuchsia' | 'black-and-yellow' | 'green' | 'coopmaths' | 'purple' | 'info-darker' | 'violet' | 'blue' | '6e' | '5e' | '4e' | '3e' | 'tout'

export interface ObjectiveVideo {
  title: string,
  slug: string,
  authorName: string,
  authorLink: string,
  videoLink: string
}

export interface ObjectiveExercise {
  uuid: string,
  slug: string,
  link: string,
  isInteractive: boolean,
  description: string,
  isInCart: boolean
}

export interface ObjectiveLessonPlan {
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

export interface ObjectiveUnit {
  reference: string,
  title: string
}

export interface ObjectiveAvailableDownloads {
  isPracticeSheetAvailable: boolean,
  isTestSheetAvailable: boolean,
  isLessonPlanAvailable: boolean,
  availableLessonPlanGrades: StringGrade[]
}

export interface ObjectiveObjective {
  reference: string,
  titleAcademic: string,
  title: string,
  period: number,
  lessonSummaryHTML: string,
  lessonSummaryImage: string,
  lessonSummaryInstrumenpoche: string,
  videos: ObjectiveVideo[],
  exercises: ObjectiveExercise[],
  lessonPlans: ObjectiveLessonPlan[],
  examExercises: ObjectiveExercise[],
  exercisesLink: string,
  examExercisesLink: string,
  units: ObjectiveUnit[],
  availableDownloads: ObjectiveAvailableDownloads,
  theme: string,
  grade: StringGrade
}

export interface ObjectiveSubTheme {
  name: string,
  objectives: ObjectiveObjective[],
  objectivesPerPeriodCount: number[]
}

export interface ObjectiveTheme {
  name: string,
  subThemes: ObjectiveSubTheme[],
  objectivesPerPeriodCount: number[]
}

export interface ObjectiveGrade {
  name: StringGrade,
  themes: ObjectiveTheme[]
}

export interface UnitObjective {
  reference: string,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  examExercises: ObjectiveExercise[],
  theme: string,
  grade: StringGrade,
  lessonPlans: ObjectiveLessonPlan[]
}

export interface UnitMentalCalculation {
  reference: string,
  titleAcademic: string,
  title: string,
  exercises: ObjectiveExercise[],
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}

export interface UnitFlashQuestions {
  reference: string,
  titleAcademic: string,
  title: string,
  slug: string,
  isRelatedObjectivePageAvailable: boolean,
  theme: string
}

export interface UnitAvailableDownloads {
  isLessonAvailable: boolean,
  isLessonSummaryAvailable: boolean,
  isMissionAvailable: boolean,
  isLessonPlanAvailable: boolean
}

export interface UnitSpecialUnit {
  reference: string,
  title: string
}

export interface UnitUnit {
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

export interface UnitGrade {
  name: StringGrade,
  units: UnitUnit[]
}

export interface LineTheme {
  name: string,
  objectivesPerPeriodCount: number[]
}

export type LineGrade = StringGrade | 'all' | 'fin' | ''

export interface LineObjective {
  grade: LineGrade,
  period: number,
  theme: LineTheme,
  subTheme: LineTheme,
  reference: string,
  titleAcademic: string,
  title: string
}

export interface CalendarPeriod {
  number: number,
  startDayOfYear: number,
  endDayOfYear: number,
  isHoliday: boolean
}

export interface CalendarYear {
  year: number,
  periods: CalendarPeriod[]
}

export interface CalendarCurrentYear {
  year: number,
  dayOfYear: number,
  periodNumber: number,
  weekInPeriod: number,
  isHoliday: boolean
}

export interface CartItem {
  id: string,
  label: string,
  description: string,
  slug: string,
  objectiveReference: string
}
