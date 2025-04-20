import { DEFAULT_GRADE, emptyStringArrayRecordStringGrade, isStringArrayRecordStringGrade, isStringGrade, isStringGrades, type StringGrade } from './grade.js'
import { isStrings, type ReplaceReferencesByStrings } from './shared.js'
import { objectivesReferences } from './objectivesReferences.js'
import { isUnitReference, type UnitReference } from './unit.js'

type ObjectivesReferencesValidTypes = typeof objectivesReferences
export type ObjectiveReference = ObjectivesReferencesValidTypes[number]
export function isObjectiveReference (obj: unknown): obj is ObjectiveReference {
  if (obj == null || typeof obj !== 'string') return false
  return objectivesReferences.includes(obj as ObjectiveReference)
}
export function isObjectiveReferences (obj: unknown): obj is ObjectiveReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveReference)
}
export const emptyObjectiveReference: ObjectiveReference = objectivesReferences[0] // keep in sync with build_prepare.ts

export type ObjectiveAncestor = { // keep in sync with ObjectiveAncestorWithStringReference
  reference: ObjectiveReference
  title: string
  titleAcademic: string
  ancestors: ObjectiveAncestor[]
}
export function isObjectiveAncestor (obj: unknown, withStringReference: boolean = false): obj is ObjectiveAncestor {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isObjectiveReference(obj.reference)) &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'ancestors' in obj && isObjectiveAncestors(obj.ancestors, withStringReference)
}
export function isObjectiveAncestors (obj: unknown, withStringReference: boolean = false): obj is ObjectiveAncestor[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjectiveAncestor(obj, withStringReference))
}
export const emptyObjectiveAncestor: ObjectiveAncestor = {
  reference: emptyObjectiveReference,
  title: '',
  titleAcademic: '',
  ancestors: []
}

export type ObjectiveAncestorWithStringReference = { // keep in sync with ObjectiveAncestor (had to do this because ReplaceReferencesByStrings can't handle recursive types)
  reference: string
  title: string
  titleAcademic: string
  ancestors: ObjectiveAncestorWithStringReference[]
}
export function isObjectiveAncestorWithStringReference (obj: unknown): obj is ObjectiveAncestorWithStringReference {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'ancestors' in obj && isObjectiveAncestorsWithStringReference(obj.ancestors)
}
export function isObjectiveAncestorsWithStringReference (obj: unknown): obj is ObjectiveAncestorWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveAncestorWithStringReference)
}

export type ObjectiveDescendant = { // keep in sync with ObjectiveDescendantWithStringReference
  reference: ObjectiveReference
  title: string
  titleAcademic: string
  descendants: ObjectiveDescendant[]
}
export function isObjectiveDescendant (obj: unknown, withStringReference: boolean = false): obj is ObjectiveDescendant {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isObjectiveReference(obj.reference)) &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'descendants' in obj && isObjectiveDescendants(obj.descendants, withStringReference)
}
export function isObjectiveDescendants (obj: unknown, withStringReference: boolean = false): obj is ObjectiveDescendant[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjectiveDescendant(obj, withStringReference))
}
export const emptyObjectiveDescendant: ObjectiveDescendant = {
  reference: emptyObjectiveReference,
  title: '',
  titleAcademic: '',
  descendants: []
}
export type ObjectiveDescendantWithStringReference = { // keep in sync with ObjectiveDescendant (had to do this because ReplaceReferencesByStrings can't handle recursive types)
  reference: string
  title: string
  titleAcademic: string
  descendants: ObjectiveDescendantWithStringReference[]
}
export function isObjectiveDescendantWithStringReference (obj: unknown): obj is ObjectiveDescendantWithStringReference {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && typeof obj.reference === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'descendants' in obj && isObjectiveDescendantsWithStringReference(obj.descendants)
}
export function isObjectiveDescendantsWithStringReference (obj: unknown): obj is ObjectiveDescendantWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveDescendantWithStringReference)
}

export type ObjectiveVideo = {
  title: string,
  videoLink: string,
  authorName: string,
  authorLink: string
}
export function isObjectiveVideo (obj: unknown): obj is ObjectiveVideo {
  if (obj == null || typeof obj !== 'object') return false
  return 'title' in obj && typeof obj.title === 'string' &&
    'videoLink' in obj && typeof obj.videoLink === 'string' &&
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
  description: string
}
export function isObjectiveExercise (obj: unknown): obj is ObjectiveExercise {
  if (obj == null || typeof obj !== 'object') return false
  return 'id' in obj && typeof obj.id === 'string' &&
    'slug' in obj && typeof obj.slug === 'string' &&
    'link' in obj && typeof obj.link === 'string' &&
    'isInteractive' in obj && typeof obj.isInteractive === 'boolean' &&
    'description' in obj && typeof obj.description === 'string'
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
  description: ''
}

export type ObjectiveLessonPlanSegment = {
  steps: string[]
  title: string
}
export function isObjectiveLessonPlanSegment (obj: unknown): obj is ObjectiveLessonPlanSegment {
  if (obj == null || typeof obj !== 'object') return false
  return 'steps' in obj && isStrings(obj.steps) &&
    'title' in obj && typeof obj.title === 'string'
}
export function isObjectiveLessonPlanSegments (obj: unknown): obj is ObjectiveLessonPlanSegment[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveLessonPlanSegment)
}
export const emptyObjectiveLessonPlanSegment: ObjectiveLessonPlanSegment = {
  steps: [],
  title: ''
}

export type ObjectiveLessonPlan = {
  objectivePrerequisites: ObjectivePrerequisite[]
  startSteps: string[],
  segments: ObjectiveLessonPlanSegment[],
  closureSteps: string[],
  studentMaterialsNeeded: string[],
  teacherMaterialsNeeded: string[],
  grades: StringGrade[],
  comments: string[]
}
export function isObjectiveLessonPlan (obj: unknown, withStringReference: boolean = false): obj is ObjectiveLessonPlan {
  if (obj == null || typeof obj !== 'object') return false
  return 'objectivePrerequisites' in obj && (withStringReference ? isObjectivePrerequisitesWithStringReference(obj.objectivePrerequisites) : isObjectivePrerequisites(obj.objectivePrerequisites)) &&
    'startSteps' in obj && isStrings(obj.startSteps) &&
    'segments' in obj && isObjectiveLessonPlanSegments(obj.segments) &&
    'closureSteps' in obj && isStrings(obj.closureSteps) &&
    'studentMaterialsNeeded' in obj && isStrings(obj.studentMaterialsNeeded) &&
    'teacherMaterialsNeeded' in obj && isStrings(obj.teacherMaterialsNeeded) &&
    'grades' in obj && isStringGrades(obj.grades) &&
    'comments' in obj && isStrings(obj.comments)
}
export function isObjectiveLessonPlans (obj: unknown, withStringReference: boolean = false): obj is ObjectiveLessonPlan[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjectiveLessonPlan(obj, withStringReference))
}
export const emptyObjectiveLessonPlan: ObjectiveLessonPlan = {
  objectivePrerequisites: [],
  startSteps: [],
  segments: [],
  closureSteps: [],
  studentMaterialsNeeded: [],
  teacherMaterialsNeeded: [],
  grades: [],
  comments: []
}

export type ObjectiveLessonPlanWithStringReference = ReplaceReferencesByStrings<UnitReference, ReplaceReferencesByStrings<ObjectiveReference, ObjectiveLessonPlan>>
export function isObjectiveLessonPlanWithStringReference (obj: unknown): obj is ObjectiveLessonPlanWithStringReference {
  return isObjectiveLessonPlan(obj, true)
}
export function isObjectiveLessonPlansWithStringReference (obj: unknown): obj is ObjectiveLessonPlanWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveLessonPlanWithStringReference)
}

type SlugsWithSeed = [string, string, string] // for reviews 4 lessons before, 2 lessons before and the new objective day
export function isSlugsWithSeed (obj: unknown): obj is SlugsWithSeed {
  if (obj == null || !Array.isArray(obj) || obj.length !== 3) return false
  return obj.every(link => typeof link === 'string')
}
export const emptySlugsWithSeedType: SlugsWithSeed = ['', '', '']

export type ObjectivePrerequisite = {
  title: string,
  titleAcademic: string,
  objectiveReference: ObjectiveReference
}
export function isObjectivePrerequisite (obj: unknown, withStringReference: boolean = false): obj is ObjectivePrerequisite {
  if (obj == null || typeof obj !== 'object') return false
  return 'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'objectiveReference' in obj && (withStringReference ? typeof obj.objectiveReference === 'string' : isObjectiveReference(obj.objectiveReference))
}
export function isObjectivePrerequisites (obj: unknown, withStringReference: boolean = false): obj is ObjectivePrerequisite[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjectivePrerequisite(obj, withStringReference))
}
export const emptyObjectivePrerequisite: ObjectivePrerequisite = {
  title: '',
  titleAcademic: '',
  objectiveReference: emptyObjectiveReference
}

export type ObjectivePrerequisiteWithStringReference = ReplaceReferencesByStrings<UnitReference, ReplaceReferencesByStrings<ObjectiveReference, ObjectivePrerequisite>>
export function isObjectivePrerequisiteWithStringReference (obj: unknown): obj is ObjectivePrerequisiteWithStringReference {
  return isObjectivePrerequisite(obj, true)
}
export function isObjectivePrerequisitesWithStringReference (obj: unknown): obj is ObjectivePrerequisiteWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectivePrerequisiteWithStringReference)
}

export type ObjectiveUnit = {
  reference: UnitReference,
  title: string,
  grade: StringGrade
}
export function isObjectiveUnit (obj: unknown, withStringReference: boolean = false): obj is ObjectiveUnit {
  if (obj == null || typeof obj !== 'object') return false
  return 'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isUnitReference(obj.reference)) &&
    'title' in obj && typeof obj.title === 'string' &&
    'grade' in obj && isStringGrade(obj.grade)
}
export function isObjectiveUnits (obj: unknown, withStringReference: boolean = false): obj is ObjectiveUnit[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjectiveUnit(obj, withStringReference))
}
export const emptyObjectiveUnit: ObjectiveUnit = {
  reference: 'S6S1', // can't access lexical declaration 'emptyUnitReference' before initialization
  title: '',
  grade: DEFAULT_GRADE
}

export type ObjectiveDownloadLinks = {
  practiceSheetLink: string,
  testSheetLink: string,
  lessonPlanLinks: Record<StringGrade, string[]>
}
export function isObjectiveDownloadLinks (obj: unknown): obj is ObjectiveDownloadLinks {
  if (obj == null || typeof obj !== 'object') return false
  return 'practiceSheetLink' in obj && typeof obj.practiceSheetLink === 'string' &&
    'testSheetLink' in obj && typeof obj.testSheetLink === 'string' &&
    'lessonPlanLinks' in obj && isStringArrayRecordStringGrade(obj.lessonPlanLinks)
}
export const emptyObjectiveDownloadLinks: ObjectiveDownloadLinks = { // keep in sync with build_prepare.ts
  practiceSheetLink: '',
  testSheetLink: '',
  lessonPlanLinks: emptyStringArrayRecordStringGrade
}

export type Objective = {
  ancestors: ObjectiveAncestor[],
  descendants: ObjectiveDescendant[],
  downloadLinks: ObjectiveDownloadLinks,
  examExercises: ObjectiveExercise[],
  examExercisesLink: string,
  exercises: ObjectiveExercise[],
  exercisesLink: string,
  grade: StringGrade,
  isKey: boolean,
  lessonPlans: ObjectiveLessonPlan[],
  lessonSummaryHTML: string,
  lessonSummaryImage: string,
  lessonSummaryImageAlt: string,
  lessonSummaryInstrumenpoche: string,
  prerequisites: ObjectivePrerequisite[],
  term: number,
  reference: ObjectiveReference,
  subTheme: string,
  theme: string
  title: string,
  titleAcademic: string,
  units: ObjectiveUnit[],
  videos: ObjectiveVideo[],
}
export function isObjective (obj: unknown, withStringReference: boolean = false): obj is Objective {
  if (obj == null || typeof obj !== 'object') return false
  return 'ancestors' in obj && isObjectiveAncestors(obj.ancestors, withStringReference) &&
    'descendants' in obj && isObjectiveDescendants(obj.descendants, withStringReference) &&
    'downloadLinks' in obj && isObjectiveDownloadLinks(obj.downloadLinks) &&
    'examExercises' in obj && isObjectiveExercises(obj.examExercises) &&
    'examExercisesLink' in obj && typeof obj.examExercisesLink === 'string' &&
    'exercises' in obj && isObjectiveExercises(obj.exercises) &&
    'exercisesLink' in obj && typeof obj.exercisesLink === 'string' &&
    'grade' in obj && isStringGrade(obj.grade) &&
    'isKey' in obj && typeof obj.isKey === 'boolean' &&
    'lessonPlans' in obj && isObjectiveLessonPlans(obj.lessonPlans) &&
    'lessonSummaryHTML' in obj && typeof obj.lessonSummaryHTML === 'string' &&
    'lessonSummaryImage' in obj && typeof obj.lessonSummaryImage === 'string' &&
    'lessonSummaryImageAlt' in obj && typeof obj.lessonSummaryImageAlt === 'string' &&
    'lessonSummaryInstrumenpoche' in obj && typeof obj.lessonSummaryInstrumenpoche === 'string' &&
    'prerequisites' in obj && isObjectivePrerequisites(obj.prerequisites, withStringReference) &&
    'term' in obj && typeof obj.term === 'number' &&
    'reference' in obj && (withStringReference ? typeof obj.reference === 'string' : isObjectiveReference(obj.reference)) &&
    'subTheme' in obj && typeof obj.subTheme === 'string' &&
    'theme' in obj && typeof obj.theme === 'string' &&
    'title' in obj && typeof obj.title === 'string' &&
    'titleAcademic' in obj && typeof obj.titleAcademic === 'string' &&
    'units' in obj && isObjectiveUnits(obj.units, withStringReference) &&
    'videos' in obj && isObjectiveVideos(obj.videos)
}
export function isObjectives (obj: unknown, withStringReference: boolean = false): obj is Objective[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(obj => isObjective(obj, withStringReference))
}
export const emptyObjective: Objective = { // keep in sync with build_prepare.ts
  ancestors: [],
  descendants: [],
  downloadLinks: emptyObjectiveDownloadLinks,
  examExercises: [],
  examExercisesLink: '',
  exercises: [],
  exercisesLink: '',
  grade: DEFAULT_GRADE,
  isKey: false,
  lessonPlans: [],
  lessonSummaryHTML: '',
  lessonSummaryImage: '',
  lessonSummaryImageAlt: '',
  lessonSummaryInstrumenpoche: '',
  prerequisites: [],
  term: 0,
  reference: emptyObjectiveReference,
  subTheme: '',
  theme: '',
  title: '',
  titleAcademic: '',
  units: [],
  videos: []
}

export type ObjectiveWithStringReference = ReplaceReferencesByStrings<UnitReference, ReplaceReferencesByStrings<ObjectiveReference, Objective>>
export function isObjectiveWithStringReference (obj: unknown): obj is ObjectiveWithStringReference {
  return isObjective(obj, true)
}
export function isObjectivesWithStringReference (obj: unknown): obj is ObjectiveWithStringReference[] {
  if (obj == null || !Array.isArray(obj)) return false
  return obj.every(isObjectiveWithStringReference)
}
