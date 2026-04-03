import * as fs from 'fs'
import * as path from 'path'
import calendarSchoolYearMasterJson from '../src/topmaths/json/calendar.json' assert { type: 'json' }
import curriculumJson from '../src/topmaths/json/curriculum.json' assert { type: 'json' }
import definitionsJson from '../src/topmaths/json/glossary/definitions.json' assert { type: 'json' }
import propertiesJson from '../src/topmaths/json/glossary/properties.json' assert { type: 'json' }
import objectivesMasterJson from '../src/topmaths/json/objectives.json' assert { type: 'json' }
import specialUnitsJson from '../src/topmaths/json/special_units.json' assert { type: 'json' }
import unitsMasterJson from '../src/topmaths/json/units.json' assert { type: 'json' }
import {
  isMathalea,
  REGULAR_VIEW_ADDENDUM,
  SLIDESHOW_VIEW_ADDENDUM,
  TOPMATHS_BASE_URL,
} from '../src/topmaths/services/environment.js'
import {
  buildGradeFromObjectiveReference,
  isReferenceIgnored,
} from '../src/topmaths/services/reference.js'
import { getTitle } from '../src/topmaths/services/string.js'
import {
  type CalendarPeriod,
  type CalendarSchoolYear,
  type CalendarSchoolYearMaster,
  isCalendarSchoolYearMasters,
  isCalendarSchoolYears,
} from '../src/topmaths/types/calendar.js'
import {
  type Curriculum,
  type CurriculumGrade,
  type CurriculumValue,
  emptyCurriculumValue,
  isCurriculum,
} from '../src/topmaths/types/curriculum.js'
import type { ExamExerciseWithStringReference } from '../src/topmaths/types/exam-exercise.js'
import {
  emptyGlossaryMasterItem,
  type GlossaryItemWithStringReference,
  type GlossaryMasterItem,
  type GlossaryMasterItemWithStringReference,
  type GlossaryRelatedItem,
  type GlossaryUniteItemWithStringReference,
  isGlossaryMasterItemWithStringReference,
  isGlossaryUniteItemsWithStringReference,
} from '../src/topmaths/types/glossary.js'
import {
  DEFAULT_GRADE,
  emptyStringArrayRecordStringGrade,
  isStringGrade,
  type StringGrade,
  stringGradeValidKeys,
} from '../src/topmaths/types/grade.js'
import {
  emptyObjective,
  emptyObjectiveDownloadLinks,
  emptyObjectiveLessonPlan,
  emptyObjectiveLessonPlanSegment,
  emptyObjectiveVideo,
  isObjectiveExercises,
  isObjectivePrerequisitesWithStringReference,
  isObjectiveWithStringReference,
  type Objective,
  type ObjectiveAncestorWithStringReference,
  type ObjectiveDescendantWithStringReference,
  type ObjectiveExercise,
  type ObjectiveLessonPlan,
  type ObjectivePrerequisiteWithStringReference,
  type ObjectiveReference,
  type ObjectiveUnit,
  type ObjectiveWithStringReference,
} from '../src/topmaths/types/objective.js'
import {
  deepCopy,
  type RecursivePartial,
  type ReplaceReferencesByStrings,
  type TuplesToArraysRecursive,
} from '../src/topmaths/types/shared.js'
import {
  emptyUnitDownloadLinks,
  emptyUnitLessonPlan,
  isUnitLessonPlans,
  isUnitReference,
  isUnitWithStringReference,
  type Unit,
  type UnitLessonPlan,
  type UnitObjective,
  type UnitReference,
  type UnitWithStringReference,
} from '../src/topmaths/types/unit.js'
import { countLessonPlans } from './helpers/lesson_plans.js'

const THIRD_PARTY_WEBSITES = [
  'https://coopmaths.fr',
  'https://mathix.org',
  'https://www.geogebra.org',
  'https://www.clicmaclasse.fr',
]

let warningCount = 0
let exerciseNumber = 1
const ancestorsCache = new Map<string, ObjectiveAncestorWithStringReference[]>()
const descendantsCache = new Map<
  string,
  ObjectiveDescendantWithStringReference[]
>()
const unlinkedAutomaticities: (string | undefined)[] = []
const curriculum = buildCurriculum()
const units: UnitWithStringReference[] = buildUnits()
const objectives: ObjectiveWithStringReference[] = buildObjectives()
updateUnits()
updateObjectives()
updateAncestorsAndDescendants()
const glossary = buildGlossary()
const calendar = buildCalendar()
const examExercises = buildExamExercises(units)
routineCheck()
// synchronise them with build_prepare.ts
writeJson('built_objectives', objectives)
writeJson('built_units', units)
writeJson('built_exam-exercises', examExercises)
writeJson('glossary', glossary)
writeJson('built_calendar', calendar)
writeJson('built_curriculum', curriculum)
writeTs(
  'objectivesReferences',
  objectives.map((objective) => objective.reference),
)
writeTs(
  'unitsReferences',
  units.map((unit) => unit.reference),
)
writeTs(
  'specialUnitsReferences',
  specialUnitsJson.map((specialUnit) => specialUnit.reference),
)
// end of script
writePrerequisitesCsv(objectives)

function buildUnits(): UnitWithStringReference[] {
  const unitsTermsArray = buildUnitsTermsArray()
  type UnitGrade = {
    name: StringGrade
    units: Unit[]
  }
  const formattedUnits: UnitWithStringReference[] = []
  const unitMaster: RecursivePartial<UnitGrade>[] = unitsMasterJson
  for (const grade of unitMaster) {
    if (grade.name === undefined) {
      console.error(grade)
      throw new Error('Grade name is undefined')
    }
    if (!isStringGrade(grade.name)) {
      console.error('grade name', grade.name)
      throw new Error('Grade name incorrect')
    }
    if (grade.units === undefined) {
      console.error(grade)
      throw new Error('Grade units is undefined')
    }
    if (grade.units.length > unitsTermsArray[grade.name].length) {
      console.error(grade.units.length, unitsTermsArray[grade.name].length)
      throw new Error('Grade units length is greater than term record length')
    }
    let unitIndex = 0
    for (const unit of grade.units) {
      if (unit === undefined) {
        console.error(grade.units)
        throw new Error('Unit is undefined')
      }
      unit.assessmentExamSlug = unit.assessmentExamSlug ?? ''
      unit.assessmentExamLink = unit.assessmentExamSlug
        ? TOPMATHS_BASE_URL + unit.assessmentExamSlug + REGULAR_VIEW_ADDENDUM
        : ''
      unit.assessmentLink = unit.assessmentLink ?? ''
      unit.downloadLinks = deepCopy(emptyUnitDownloadLinks)
      unit.grade = grade.name
      unit.number = unitIndex + 1
      unit.objectives = unit.objectives
        ? unit.objectives.map((objective) =>
            Object.assign(deepCopy(emptyObjective), objective),
          )
        : []
      unit.term = unitsTermsArray[grade.name][unitIndex]
      unit.reference = buildUnitReference(unit)
      unit.title = unit.title ?? ''
      unitIndex++
      if (!isUnitWithStringReference(unit)) {
        console.error(unit)
        throw new Error('Unit is not a Unit')
      }
      formattedUnits.push(unit)
    }
  }
  return formattedUnits
}

function buildUnitsTermsArray(): Record<StringGrade, number[]> {
  return {
    tout: buildTermNumbers(curriculum, DEFAULT_GRADE),
    '6e': buildTermNumbers(curriculum, '6e'),
    '5e': buildTermNumbers(curriculum, '5e'),
    '4e': buildTermNumbers(curriculum, '4e'),
    '3e': buildTermNumbers(curriculum, '3e'),
  }
}

function buildTermNumbers(
  curriculum: Curriculum,
  grade: StringGrade,
): number[] {
  const unitsPerTerms = curriculum[grade].unitsPerTerm
  if (!unitsPerTerms) return []
  const termNumbers: number[] = []
  let termNumber = 1
  for (const unitsPerTerm of unitsPerTerms) {
    for (let i = 0; i < unitsPerTerm; i++) {
      termNumbers.push(termNumber)
    }
    termNumber++
  }
  return termNumbers
}

function buildObjectives(): ObjectiveWithStringReference[] {
  type ObjectiveSubTheme = {
    name: string
    objectives: Objective[]
  }
  type ObjectiveTheme = {
    name: string
    subThemes: ObjectiveSubTheme[]
  }
  type ObjectiveGrade = {
    name: StringGrade
    themes: ObjectiveTheme[]
  }
  const formattedObjectives: ObjectiveWithStringReference[] = []
  const objectivesMaster: RecursivePartial<
    TuplesToArraysRecursive<ObjectiveGrade>
  >[] = objectivesMasterJson
  for (const grade of objectivesMaster) {
    if (grade.name === undefined) {
      console.error(grade)
      throw new Error('Grade name is undefined')
    }
    if (!isStringGrade(grade.name)) {
      console.error('grade name', grade.name)
      throw new Error('Grade name incorrect')
    }
    if (grade.themes === undefined) {
      console.error(grade)
      throw new Error('Grade themes are undefined')
    }
    for (const theme of grade.themes) {
      if (theme === undefined) {
        console.error(theme)
        throw new Error('Theme is undefined')
      }
      if (theme.name === undefined) {
        console.error(theme)
        throw new Error('Theme name is undefined')
      }
      if (theme.subThemes === undefined) {
        console.error(theme)
        throw new Error('Theme subThemes are undefined')
      }
      for (const subTheme of theme.subThemes) {
        if (subTheme === undefined) {
          console.error(subTheme)
          throw new Error('SubTheme is undefined')
        }
        if (subTheme.name === undefined) {
          console.error(subTheme)
          throw new Error('SubTheme name is undefined')
        }
        if (subTheme.objectives === undefined) {
          console.error(subTheme)
          throw new Error('SubTheme objectives are undefined')
        }
        for (const objective of subTheme.objectives) {
          if (objective === undefined) {
            console.error(objective)
            throw new Error('Objective is undefined')
          }
          if (objective.reference === undefined) {
            console.error(objective)
            throw new Error('Objective reference is undefined')
          }
          exerciseNumber = 1
          objective.ancestors = []
          objective.ancestorsCount = 0
          objective.descendants = []
          objective.descendantsCount = 0
          objective.downloadLinks = deepCopy(emptyObjectiveDownloadLinks)
          objective.examExercises = buildExercises(
            objective.reference,
            objective.examExercises,
          )
          objective.examExercisesLink = buildLinkFromSlugs(
            objective.reference,
            objective.examExercises.map((exercise) => exercise?.slug),
          )
          objective.exercises = buildExercises(
            objective.reference,
            objective.exercises,
          )
          objective.exercisesLink = buildLinkFromSlugs(
            objective.reference,
            objective.exercises.map((exercise) => exercise?.slug),
          )
          objective.grade = grade.name
          objective.isAutomaticity = objective.isAutomaticity ?? false
          objective.lessonImages = buildObjectiveLessonImages(objective)
          objective.lessonPlans = objective.lessonPlans
            ? objective.lessonPlans.map((lessonPlan) =>
                buildObjectiveLessonPlan(lessonPlan),
              )
            : []
          objective.lessonSummaryHTML = objective.lessonSummaryHTML ?? ''
          objective.lessonSummaryImage = objective.lessonSummaryImage
            ? '../topmaths/img/' + objective.lessonSummaryImage
            : ''
          objective.lessonSummaryImageAlt =
            objective.lessonSummaryImageAlt ?? ''
          objective.lessonSummaryInstrumenpoche =
            objective.lessonSummaryInstrumenpoche ?? ''
          objective.lessonVideos = buildObjectiveLessonVideos(objective)
          objective.prerequisites = buildObjectivePrerequisites(objective)
          objective.term = findTerm(objective)
          objective.reference = objective.reference ?? '0'
          objective.subTheme = subTheme.name
          objective.theme = theme.name
          objective.title = objective.title ?? ''
          objective.titleAcademic = objective.titleAcademic ?? ''
          objective.units = buildObjectiveUnits(objective)
          objective.videos = objective.videos
            ? objective.videos.map((video) =>
                Object.assign(deepCopy(emptyObjectiveVideo), video),
              )
            : []
          if (!isObjectiveWithStringReference(objective)) {
            console.error(
              ...objective.lessonPlans.map(
                (lessonPlan) => lessonPlan?.segments,
              ),
            )
            throw new Error('Objective is not an Objective')
          }
          formattedObjectives.push(objective)
        }
      }
    }
  }
  return formattedObjectives
}

function updateUnits(): void {
  for (const unit of units) {
    updateUnitObjectives(unit)
    updateUnitAssessmentLink(unit)
    unit.downloadLinks = {
      lessonLink: buildDownloadLink('cours', unit.reference, unit.grade),
      lessonSummaryLink: buildDownloadLink(
        'resume',
        unit.reference,
        unit.grade,
      ),
      missionLink: buildDownloadLink('mission', unit.reference, unit.grade),
      lessonPlanLink: buildDownloadLink('fiche', unit.reference, unit.grade),
    }
  }
}

function updateObjectives(): void {
  objectives.forEach((objective) => {
    objective.downloadLinks = {
      practiceSheetLink: buildDownloadLink(
        'entrainement',
        objective.reference,
        objective.grade,
      ),
      testSheetLink: buildDownloadLink(
        'test',
        objective.reference,
        objective.grade,
      ),
      lessonPlanLinks: buildLessonPlanDownloadLinks(objective, objective.grade),
    }
    objective.prerequisites.forEach((prerequisite) => {
      const prerequisiteObjective = objectives.find(
        (objective) => objective.reference === prerequisite.objectiveReference,
      )
      if (!prerequisiteObjective) {
        console.error(prerequisite.objectiveReference)
        throw new Error('Prerequisite ObjectiveReference not found')
      }
      prerequisite.title = prerequisiteObjective.title
      prerequisite.titleAcademic = prerequisiteObjective.titleAcademic
      prerequisite.isAutomaticity = prerequisiteObjective.isAutomaticity
    })
  })
}

function updateAncestorsAndDescendants(): void {
  objectives.forEach((objective) => {
    buildObjectiveAncestors(objective)
    objective.ancestorsCount = countAncestors(objective)
    buildObjectiveDescendants(objective)
    objective.descendantsCount = countDescendants(objective)
  })
  units.forEach((unit) => {
    unit.objectives.forEach((unitObjective) => {
      const objective = objectives.find(
        (obj) => obj.reference === unitObjective.reference,
      )
      if (!objective) {
        console.error(unitObjective.reference)
        throw new Error('Objective not found')
      }
      unitObjective.descendantsCount = objective.descendantsCount
    })
  })
}

function buildGlossary(): GlossaryUniteItemWithStringReference[] {
  const definitions: RecursivePartial<GlossaryMasterItemWithStringReference>[] =
    definitionsJson
  const properties: Partial<GlossaryMasterItemWithStringReference>[] =
    propertiesJson
  const formattedMasterDefinitions = definitions.map((item) =>
    formatItem(item, 'définition'),
  )
  const formattedMasterProperties = properties.map((item) =>
    formatItem(item, 'propriété'),
  )
  const glossaryMasterItems = formattedMasterDefinitions.concat(
    formattedMasterProperties,
  )
  const glossaryUniteItems = glossaryMasterItems
    .map(buildGlossaryUniteItems)
    .flat()
  updateRelatedItems(glossaryUniteItems)
  checkRelatedObjectives(glossaryUniteItems)
  glossaryUniteItems.forEach((item) => item.relatedItems.sort(comparerTitres))
  glossaryUniteItems.sort(comparerTitres)
  if (!isGlossaryUniteItemsWithStringReference(glossaryUniteItems)) {
    console.error(glossaryUniteItems)
    throw new Error('Glossary items are not GlossaryUniteItems')
  }
  return glossaryUniteItems
}

function formatItem(
  item: RecursivePartial<GlossaryMasterItem>,
  type: 'définition' | 'propriété',
): GlossaryMasterItemWithStringReference {
  item.type = type
  if (item.titles === undefined) return deepCopy(emptyGlossaryMasterItem)
  item.comments = item.comments ?? []
  item.content = item.content ?? ''
  item.examples = item.examples ?? []
  item.includesImage = item.includesImage ?? false
  item.keywords = item.keywords ?? []
  item.relatedObjectives = item.relatedObjectives ?? []
  item.reference = item.reference ?? ''
  item.titles = item.titles ?? []
  item.comments = interpreterMarkupArray(item.comments)
  item.content = interpreterMarkupPerso(item.content)
  item.examples = interpreterMarkupArray(item.examples)
  const gradeCandidates = item.relatedObjectives
    .filter((relatedObjective) => relatedObjective !== undefined)
    .map((relatedObjective) => {
      return buildGradeFromObjectiveReference(
        relatedObjective as ObjectiveReference,
      ) // objectiveReferences.ts is not populated yet
    })
  item.grades = gradeCandidates.filter(isStringGrade)
  item.relatedItems = item.relatedItems ?? []
  item.relatedItems = item.relatedItems
    .filter((relatedItem) => relatedItem !== undefined)
    .map((relatedItem) => {
      if (relatedItem === undefined)
        throw new Error('Related item is undefined')
      relatedItem.reference = relatedItem.reference ?? ''
      relatedItem.title = relatedItem.title ?? ''
      return relatedItem
    })
  if (!isGlossaryMasterItemWithStringReference(item)) {
    console.error(item)
    throw new Error('Item is not a GlossaryItem')
  }
  return item
}

function interpreterMarkupPerso(contenu: string): string {
  contenu = contenu.replace(/rouge\[\[/g, "<span class='rouge'>")
  contenu = contenu.replace(/vert\[\[/g, "<span class='vert'>")
  contenu = contenu.replace(/noir\[\[/g, "<span class='noir'>")
  contenu = contenu.replace(/bleu\[\[/g, "<span class='bleu'>")
  contenu = contenu.replace(/\[\[/g, "<span class='mot-defini'>")
  contenu = contenu.replace(/\]\]/g, '</span>')
  return contenu
}

function interpreterMarkupArray(array: (string | undefined)[]): string[] {
  if (array === undefined || array.length === 0) {
    return []
  } else {
    return array
      .filter((str) => str !== undefined)
      .map((str) => {
        if (str === undefined) throw new Error('str is undefined')
        return interpreterMarkupPerso(str)
      })
  }
}

function buildGlossaryUniteItems(
  masterItem: GlossaryMasterItemWithStringReference,
): GlossaryUniteItemWithStringReference[] {
  const uniteItems: GlossaryUniteItemWithStringReference[] = []
  const slugsSousItemsDejaCrees: string[] = []
  for (const title of masterItem.titles) {
    const uniteItem: GlossaryUniteItemWithStringReference = {
      ...masterItem,
      title,
    }
    uniteItem.reference = creerSlug(title)
    uniteItem.includesImage = fs.existsSync(
      `public/topmaths/img/lexique/${uniteItem.reference}.png`,
    )
    uniteItem.relatedItems = ajouterSlugsSousItemsDejaCrees(
      masterItem,
      slugsSousItemsDejaCrees,
    )
    slugsSousItemsDejaCrees.push(uniteItem.reference)
    uniteItems.push(uniteItem)
  }
  return uniteItems
}

function creerSlug(titre: string): string {
  const normalizedStr = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const slug = normalizedStr
    .replace(/\s+/g, '-')
    .replace(/'+/g, '')
    .toLowerCase()

  return slug
}

function ajouterSlugsSousItemsDejaCrees(
  item: GlossaryMasterItemWithStringReference,
  references: string[],
): GlossaryRelatedItem[] {
  return item.relatedItems.concat(
    references.map((reference) => ({ title: '', reference })),
  )
}

function updateRelatedItems(
  items: GlossaryUniteItemWithStringReference[],
): void {
  items.forEach((item1) =>
    item1.relatedItems.forEach((relatedItem1) => {
      const item2 = items.find(
        (item2) => item2.reference === relatedItem1.reference,
      )
      if (!item2) {
        throw new Error(`Glossary item ${relatedItem1.reference} not found`)
      }
      relatedItem1.title = item2.title
      if (
        !item2.relatedItems.find(
          (relatedItem2) => relatedItem2.reference === item1.reference,
        )
      ) {
        item2.relatedItems.push({
          reference: item1.reference,
          title: item1.title,
        })
      }
    }),
  )
}

function checkRelatedObjectives(
  items: GlossaryUniteItemWithStringReference[],
): void {
  items.forEach((item) =>
    item.relatedObjectives.forEach((relatedObjective) => {
      const objective = objectives.find(
        (objective) => objective.reference === relatedObjective,
      )
      if (!objective) {
        throw new Error(
          `Glossary ${item.type} related objective ${relatedObjective} not found in objectives`,
        )
      }
    }),
  )
}

function comparerTitres(
  a: GlossaryRelatedItem,
  b: GlossaryRelatedItem,
): number {
  const titleA = a.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
  const titleB = b.title
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()

  if (titleA < titleB) {
    return -1
  }
  if (titleA > titleB) {
    return 1
  }
  return 0
}

function buildCalendar(): CalendarSchoolYear[] {
  const calendarMaster: RecursivePartial<CalendarSchoolYearMaster>[] =
    calendarSchoolYearMasterJson
  if (!isCalendarSchoolYearMasters(calendarMaster)) {
    console.error(calendarMaster)
    throw new Error('Calendar master is not a CalendarSchoolYearMasters')
  }
  const formattedCalendar: CalendarSchoolYear[] = []
  for (
    let schoolYearIndex = 0;
    schoolYearIndex < calendarMaster.length;
    schoolYearIndex++
  ) {
    const schoolYearMaster = calendarMaster[schoolYearIndex]
    const startYear = schoolYearMaster.schoolYear.slice(0, 4)
    const startTermYear = schoolYearMaster.terms[0].start.slice(0, 4)
    const endYear = schoolYearMaster.schoolYear.slice(5, 9)
    const endTermYear = schoolYearMaster.terms[
      schoolYearMaster.terms.length - 1
    ].end.slice(0, 4)
    if (startYear !== startTermYear || endYear !== endTermYear) {
      console.error(schoolYearMaster)
      throw new Error('School year and term years do not match')
    }
    const nextSchoolYearMaster = calendarMaster[schoolYearIndex + 1] ?? {
      schoolYear: '2098-2099',
      terms: [{ start: '2098-01-01', end: '2099-01-01' }],
    }
    const periods = buildPeriods(schoolYearMaster, nextSchoolYearMaster)
    formattedCalendar.push({
      schoolYearString: schoolYearMaster.schoolYear,
      start: periods[0].start,
      end: periods[periods.length - 1].end,
      periods,
    })
  }
  if (!isCalendarSchoolYears(formattedCalendar)) {
    console.error(formattedCalendar)
    throw new Error('Formatted calendar is not a CalendarSchoolYears')
  }
  return formattedCalendar
}

function buildPeriods(
  schoolYearMaster: CalendarSchoolYearMaster,
  nextSchoolYearMaster: CalendarSchoolYearMaster,
): CalendarPeriod[] {
  const periods: CalendarPeriod[] = []
  for (
    let termIndex = 0;
    termIndex < schoolYearMaster.terms.length;
    termIndex++
  ) {
    const term = schoolYearMaster.terms[termIndex]
    const nextTerm =
      termIndex === schoolYearMaster.terms.length - 1
        ? nextSchoolYearMaster.terms[0]
        : schoolYearMaster.terms[termIndex + 1]
    const start = new Date(term.start)
    const end = new Date(term.end)
    const nextTermStart = new Date(nextTerm.start)
    const breakStart = new Date(end)
    const breakEnd = new Date(nextTermStart)
    if (end < start) {
      console.error(term)
      throw new Error('Term end is before term start')
    }
    if (breakEnd < breakStart) {
      console.error(term)
      throw new Error('Break end is before break start')
    }
    periods.push({ termIndex, start, end, type: 'term' })
    periods.push({ termIndex, start: breakStart, end: breakEnd, type: 'break' })
  }
  return periods
}

function buildCurriculum(): Curriculum {
  const curriculumGradeArray: RecursivePartial<CurriculumGrade[]> =
    curriculumJson
  const formattedGradeArray: CurriculumGrade[] = curriculumGradeArray.map(
    (grade) => {
      if (grade === undefined) {
        console.error(grade)
        throw new Error('Grade is undefined')
      }
      if (!isStringGrade(grade.name)) {
        console.error('grade name', grade.name)
        throw new Error('Grade name incorrect')
      }
      const unitsPerTerm = grade.unitsPerTerm?.map((units) => units ?? 0) ?? []
      return {
        name: grade.name,
        unitsPerTerm,
        cumulateUnitsPerTerm: unitsPerTerm
          ? unitsPerTerm.map((_nbUnits, index) => {
              return unitsPerTerm
                .slice(0, index + 1)
                .reduce((sum, nbUnits) => sum + nbUnits)
            })
          : [],
      }
    },
  )
  const curriculumCandidate: Curriculum = {
    tout: deepCopy(emptyCurriculumValue),
    '6e': buildCurriculumValue(formattedGradeArray, '6e'),
    '5e': buildCurriculumValue(formattedGradeArray, '5e'),
    '4e': buildCurriculumValue(formattedGradeArray, '4e'),
    '3e': buildCurriculumValue(formattedGradeArray, '3e'),
  }
  const maxTermCount = Math.max(
    curriculumCandidate['6e'].unitsPerTerm.length,
    curriculumCandidate['5e'].unitsPerTerm.length,
    curriculumCandidate['4e'].unitsPerTerm.length,
    curriculumCandidate['3e'].unitsPerTerm.length,
  )
  const allUnitsPerTerm: number[] = []
  const allCumulateUnitsPerTerm: number[] = []
  for (let termIndex = 0; termIndex < maxTermCount; termIndex++) {
    const unitsPerTerm = [
      curriculumCandidate['6e'].unitsPerTerm[termIndex] ?? 0,
      curriculumCandidate['5e'].unitsPerTerm[termIndex] ?? 0,
      curriculumCandidate['4e'].unitsPerTerm[termIndex] ?? 0,
      curriculumCandidate['3e'].unitsPerTerm[termIndex] ?? 0,
    ]
    allUnitsPerTerm.push(unitsPerTerm.reduce((sum, nbUnits) => sum + nbUnits))
    allCumulateUnitsPerTerm.push(
      allUnitsPerTerm[termIndex] +
        (termIndex > 0 ? allCumulateUnitsPerTerm[termIndex - 1] : 0),
    )
  }
  curriculumCandidate.tout = {
    unitsPerTerm: allUnitsPerTerm,
    cumulateUnitsPerTerm: allCumulateUnitsPerTerm,
  }
  if (!isCurriculum(curriculumCandidate)) {
    console.error(curriculumCandidate)
    throw new Error('Curriculum is not a Curriculum')
  }
  return curriculumCandidate
}

function buildCurriculumValue(
  formattedGradeArray: CurriculumGrade[],
  grade: StringGrade,
): CurriculumValue {
  const curriculumGrade = formattedGradeArray.find(
    (curriculumGrade) => curriculumGrade.name === grade,
  )
  if (!curriculumGrade) {
    console.error(grade)
    throw new Error('Curriculum grade not found')
  }
  return {
    unitsPerTerm: curriculumGrade.unitsPerTerm,
    cumulateUnitsPerTerm: curriculumGrade.cumulateUnitsPerTerm,
  }
}

function buildExamExercises(
  units: UnitWithStringReference[],
): ExamExerciseWithStringReference[] {
  return units
    .filter((unit) => unit.assessmentExamLink !== '')
    .map((unit) => {
      const entries = new URL(unit.assessmentExamLink).searchParams.entries()
      const references: ExamExerciseWithStringReference[] = []
      for (const entry of entries) {
        if (entry[0] === 'uuid') {
          references.push({
            uuid: entry[1],
            unitReference: unit.reference,
          })
        }
      }
      return references
    })
    .flat()
}

function routineCheck(): void {
  checkDuplicateReferences(objectives)
  checkDuplicateReferences(units)
  checkDuplicateReferences(glossary)
  checkDuplicateUuids(examExercises)
  checkImageAlt()
  checkPrivacyPolicyThirdPartyWebsites()
  checkDuplicatesExamExercises()
  checkMathaleaFullLinks()
  console.warn(warningCount + ' warning' + (warningCount > 1 ? 's' : ''))
  console.warn(
    unlinkedAutomaticities.length + ' automaticities not linked to a unit',
  )
  console.warn(unlinkedAutomaticities)
}

function buildUnitReference(unit: RecursivePartial<Unit>): string {
  if (unit.grade === undefined) {
    console.error(unit)
    throw new Error('Unit grade is undefined')
  }
  return `S${unit.grade.slice(0, 1)}S${unit.number}`
}

function buildObjectiveLessonImages(
  objective: RecursivePartial<Objective>,
): string[] {
  const objectiveReference = objective.reference
  if (!objectiveReference) return []
  const directory = 'topmaths/cours-image/'
  // Match files like "6N1A-1.png", "6N1A-2.png", etc.
  const pattern = new RegExp(`^${objectiveReference}-\\d+\\.png$`)
  return getFilesWithPattern(directory, pattern)
}

function buildObjectiveLessonVideos(
  objective: RecursivePartial<Objective>,
): string[] {
  const objectiveReference = objective.reference
  if (!objectiveReference) return []
  const directory = 'topmaths/cours-video/'
  // Match files like "6N1A-1.mp4", "6N1A-2.mp4", etc.
  const pattern = new RegExp(`^${objectiveReference}-\\d+\\.mp4$`)
  return getFilesWithPattern(directory, pattern)
}

function getFilesWithPattern(directory: string, pattern: RegExp): string[] {
  const publicDirectory = './public/'
  if (!fs.existsSync(publicDirectory + directory)) {
    return []
  }
  const files = fs.readdirSync(publicDirectory + directory)
  const filesWithPattern = files.filter((file) => pattern.test(file))
  return filesWithPattern.map((file) => directory + file)
}

function buildObjectiveLessonPlan(
  lessonPlan: undefined | RecursivePartial<ObjectiveLessonPlan>,
): ObjectiveLessonPlan {
  const filledLessonPlan = Object.assign(
    deepCopy(emptyObjectiveLessonPlan),
    lessonPlan,
  )
  filledLessonPlan.segments = filledLessonPlan.segments.map((segment) =>
    Object.assign(deepCopy(emptyObjectiveLessonPlanSegment), segment),
  )
  return filledLessonPlan
}

function buildObjectivePrerequisites(
  objective: RecursivePartial<TuplesToArraysRecursive<Objective>>,
): ObjectivePrerequisiteWithStringReference[] {
  if (objective.prerequisites === undefined) return []
  objective.prerequisites = objective.prerequisites
    .filter((prerequisite) => prerequisite !== undefined)
    .map((prerequisite) => {
      if (prerequisite === undefined)
        throw new Error('Prerequisite is undefined')
      prerequisite.title = ''
      prerequisite.titleAcademic = ''
      prerequisite.isAutomaticity = false
      return prerequisite
    })
  if (!isObjectivePrerequisitesWithStringReference(objective.prerequisites)) {
    console.error(objective.prerequisites)
    throw new Error('Objective Prerequisites are not ObjectivePrerequisites')
  }
  return objective.prerequisites
}

function findTerm(
  objective: RecursivePartial<TuplesToArraysRecursive<UnitObjective>>,
): number {
  const unit = units.find((unit) =>
    unit.objectives.find(
      (unitObjective) => unitObjective.reference === objective.reference,
    ),
  )
  if (!unit) {
    if (objective.isAutomaticity) {
      unlinkedAutomaticities.push(objective.reference)
      return 0
    } else {
      console.error(objective.reference)
      throw new Error('Unit corresponding to objective not found')
    }
  }
  return unit.term
}

function buildLinkFromSlugs(
  objectiveReference: string,
  slugs: (string | undefined)[] | undefined,
  isSlideshow: boolean = false,
): string {
  if (slugs === undefined || slugs.length === 0) return ''
  let link = TOPMATHS_BASE_URL
  let exerciseCount = 0
  slugs.forEach((slug) => {
    if (slug === undefined || slug === '') {
      return
    }
    link += slug
    if (objectiveReference !== '') {
      link += `&o=${objectiveReference}`
    }
    link += '&'
    exerciseCount++
  })
  link = link.slice(0, -1)
  if (isSlideshow) {
    link += SLIDESHOW_VIEW_ADDENDUM
  } else {
    link += REGULAR_VIEW_ADDENDUM
  }
  if (exerciseCount === 0) link = ''
  return link
}

function buildExercises(
  reference: string,
  exercises: (RecursivePartial<ObjectiveExercise> | undefined)[] | undefined,
): ObjectiveExercise[] {
  if (exercises === undefined || exercises.length === 0) return []
  exercises = exercises
    .filter((exercise) => exercise !== undefined)
    .map((exercise) => {
      if (exercise === undefined) throw new Error('Exercise is undefined')
      exercise.id = reference + '-' + exerciseNumber
      exercise.slug = formatSlug(exercise.slug)
      exercise.link = buildExerciseLink(exercise.slug, reference, false)
      exercise.isInteractive = exercise.isInteractive ?? false
      exercise.description = exercise.description ?? ''
      exerciseNumber++
      return exercise
    })
  if (!isObjectiveExercises(exercises)) {
    console.error(exercises)
    throw new Error('Exercises are not ObjectiveExercises')
  }
  return exercises
}

function buildUnitLessonPlans(
  objective: ObjectiveWithStringReference,
  unitGrade: StringGrade,
): UnitLessonPlan[] {
  if (objective.lessonPlans.length === 0) {
    return [
      Object.assign(deepCopy(emptyUnitLessonPlan), {
        objectiveReference: objective.reference,
        objectiveTitle: getTitle(objective),
        reference: objective.reference,
      }),
    ]
  }
  const lessonPlanTotalCount = countLessonPlans(objective, unitGrade)
  const isMultipleLessonPlans = lessonPlanTotalCount > 1
  let lessonPlanNumber = 1
  const unitLessonPlans: Partial<
    ReplaceReferencesByStrings<ObjectiveReference, UnitLessonPlan>
  >[] = deepCopy(objective.lessonPlans)
    .filter((lessonPlan) => lessonPlan !== undefined)
    .filter(
      (lessonPlan) =>
        lessonPlan.grades.length === 0 || lessonPlan.grades.includes(unitGrade),
    )
    .map((lessonPlan) => {
      const unitLessonPlan: Partial<
        ReplaceReferencesByStrings<ObjectiveReference, UnitLessonPlan>
      > = lessonPlan
      unitLessonPlan.startSteps = lessonPlan.startSteps ?? []
      unitLessonPlan.segments = lessonPlan.segments ?? []
      unitLessonPlan.closureSteps = lessonPlan.closureSteps ?? []
      unitLessonPlan.studentMaterialsNeeded =
        lessonPlan.studentMaterialsNeeded ?? []
      unitLessonPlan.teacherMaterialsNeeded =
        lessonPlan.teacherMaterialsNeeded ?? []
      unitLessonPlan.grades = lessonPlan.grades ?? []
      unitLessonPlan.comments = lessonPlan.comments ?? []
      unitLessonPlan.objectivePrerequisites = objective.prerequisites
      unitLessonPlan.objectiveReference = objective.reference
      unitLessonPlan.objectiveTitle = getTitle(objective)
      unitLessonPlan.reference = `${objective.reference}${isMultipleLessonPlans ? `-${lessonPlanNumber}` : ''}`
      lessonPlanNumber++
      return unitLessonPlan
    })
  if (!isUnitLessonPlans(unitLessonPlans, true)) {
    console.error(unitLessonPlans)
    throw new Error('unitLessonPlans is not UnitLessonPlan[]')
  }
  return unitLessonPlans
}

function buildObjectiveUnits(
  objective: RecursivePartial<TuplesToArraysRecursive<Objective>>,
): ReplaceReferencesByStrings<UnitReference, ObjectiveUnit>[] {
  const unitsFound = units.filter((unit) =>
    unit.objectives.find(
      (unitObjective) => unitObjective.reference === objective.reference,
    ),
  )
  const objectiveUnits: ReplaceReferencesByStrings<
    UnitReference,
    ObjectiveUnit
  >[] = unitsFound.map((unit) => {
    return {
      reference: unit.reference,
      title: unit.title,
      grade: unit.grade,
    }
  })
  return objectiveUnits
}

function updateUnitObjectives(unit: UnitWithStringReference): void {
  unit.objectives.forEach((unitObjective) => {
    const objective = objectives.find(
      (objective) => objective.reference === unitObjective.reference,
    )
    if (!objective) {
      throw new Error(
        'Objective ' +
          unitObjective.reference +
          ' of unit ' +
          unit.title +
          ' not found.',
      )
    }
    unitObjective.reference = objective.reference
    unitObjective.titleAcademic = objective.titleAcademic
    unitObjective.title = objective.title
    unitObjective.exercises = objective.exercises
    unitObjective.examExercises = objective.examExercises
    unitObjective.isAutomaticity = objective.isAutomaticity
    unitObjective.theme = objective.theme
    unitObjective.grade = objective.grade
    unitObjective.lessonImages = objective.lessonImages
    unitObjective.lessonPlans = buildUnitLessonPlans(objective, unit.grade)
    unitObjective.prerequisites = objective.prerequisites
    unitObjective.descendantsCount = objective.descendantsCount
  })
}

function updateUnitAssessmentLink(unit: UnitWithStringReference): void {
  const objectivesSlugs = getUnitObjectivesSlugs(unit)
  if (objectivesSlugs.length === 0) {
    unit.assessmentLink = ''
    return
  }
  unit.assessmentLink = TOPMATHS_BASE_URL
  for (const objectiveSlug of objectivesSlugs) {
    unit.assessmentLink += `${objectiveSlug.slug}&o=${objectiveSlug.objectiveReference}&u=${unit.reference}&`
  }
  unit.assessmentLink = unit.assessmentLink.slice(0, -1)
  unit.assessmentLink += REGULAR_VIEW_ADDENDUM
}

function checkDuplicatesExamExercises(): void {
  const examExercisesFound: string[] = []
  units
    .filter((unit) => unit.assessmentExamSlug !== '')
    .map((unit) => unit.assessmentExamSlug)
    .forEach((assessmentExamSlug) => {
      const examExerciseSlugs = assessmentExamSlug.split('&')
      examExerciseSlugs.forEach((examExerciseSlug) => {
        if (examExercisesFound.includes(examExerciseSlug)) {
          console.warn(examExerciseSlug, 'found twice')
          warningCount++
        }
        examExercisesFound.push(examExerciseSlug)
      })
    })
}

function buildObjectiveAncestors(
  objective: ObjectiveWithStringReference,
): void {
  // Check if the ancestors for this objective are already cached
  if (ancestorsCache.has(objective.reference)) {
    objective.ancestors = ancestorsCache.get(objective.reference)!
    return
  }

  // Initialize the ancestors array for the current objective
  objective.ancestors = objective.prerequisites.map((prerequisite) => {
    return {
      reference: prerequisite.objectiveReference,
      title: prerequisite.title,
      titleAcademic: prerequisite.titleAcademic,
      ancestors: [],
    }
  })

  // Recursively find ancestors for each prerequisite
  objective.ancestors.forEach((ancestor) => {
    const ancestorObjective = objectives.find(
      (obj) => obj.reference === ancestor.reference,
    )
    if (!ancestorObjective) return // Skip if the ancestor is not found

    // Ensure the ancestor has its ancestors populated
    buildObjectiveAncestors(ancestorObjective)

    // Append the ancestors of the ancestor to the current ancestor
    ancestor.ancestors = [
      ...ancestor.ancestors,
      ...ancestorObjective.ancestors.map((ancestorOfAncestor) => ({
        reference: ancestorOfAncestor.reference,
        title: ancestorOfAncestor.title,
        titleAcademic: ancestorOfAncestor.titleAcademic,
        ancestors: ancestorOfAncestor.ancestors,
      })),
    ]
  })

  // Cache the result for this objective
  ancestorsCache.set(objective.reference, objective.ancestors)
}

function buildObjectiveDescendants(
  objective: ObjectiveWithStringReference,
): void {
  // Check if the descendants for this objective are already cached
  if (descendantsCache.has(objective.reference)) {
    objective.descendants = descendantsCache.get(objective.reference)!
    return
  }

  // Initialize the descendants array for the current objective
  objective.descendants = objectives
    .filter((obj) =>
      obj.prerequisites.some(
        (prerequisite) =>
          prerequisite.objectiveReference === objective.reference,
      ),
    )
    .map((descendant) => ({
      reference: descendant.reference,
      title: descendant.title,
      titleAcademic: descendant.titleAcademic,
      descendants: [],
    }))

  // Recursively find descendants for each descendant
  objective.descendants.forEach((descendant) => {
    const descendantObjective = objectives.find(
      (obj) => obj.reference === descendant.reference,
    )
    if (!descendantObjective) return // Skip if the descendant is not found

    // Ensure the descendant has its descendants populated
    buildObjectiveDescendants(descendantObjective)

    // Append the descendants of the descendant to the current descendant
    descendant.descendants = [
      ...descendant.descendants,
      ...descendantObjective.descendants.map((descendantOfDescendant) => ({
        reference: descendantOfDescendant.reference,
        title: descendantOfDescendant.title,
        titleAcademic: descendantOfDescendant.titleAcademic,
        descendants: descendantOfDescendant.descendants,
      })),
    ]
  })

  // Cache the result for this objective
  descendantsCache.set(objective.reference, objective.descendants)
}

function countAncestors(
  ancestor: ObjectiveAncestorWithStringReference,
): number {
  if (!ancestor.ancestors || ancestor.ancestors.length === 0) {
    return 0 // Base case: no ancestors
  }
  // Count the current level of ancestors and recursively count their ancestors
  return (
    ancestor.ancestors.length +
    ancestor.ancestors.reduce(
      (count, child) => count + countAncestors(child),
      0,
    )
  )
}

function countDescendants(
  descendant: ObjectiveDescendantWithStringReference,
): number {
  if (!descendant.descendants || descendant.descendants.length === 0) {
    return 0 // Base case: no descendants
  }
  // Count the current level of descendants and recursively count their descendants
  return (
    descendant.descendants.length +
    descendant.descendants.reduce(
      (count, child) => count + countDescendants(child),
      0,
    )
  )
}

function checkPrivacyPolicyThirdPartyWebsites(): void {
  const fullLinks: string[] = objectives
    .map((objective) =>
      objective.exercises
        .map((exercise) => exercise.slug)
        .filter((slug) => slug.slice(0, 4) === 'http'),
    )
    .flat()
  const websites = fullLinks.map((link) => link.slice(0, link.indexOf('/', 8)))
  websites.forEach((website) => {
    if (!THIRD_PARTY_WEBSITES.includes(website)) {
      console.warn(website + ' not in privacy policy')
      warningCount++
    }
  })
}

function checkDuplicateReferences(
  array:
    | ObjectiveWithStringReference[]
    | UnitWithStringReference[]
    | GlossaryItemWithStringReference[],
): void {
  const foundReferences: string[] = []
  array.forEach(
    (
      item:
        | ObjectiveWithStringReference
        | UnitWithStringReference
        | GlossaryItemWithStringReference,
    ) => {
      if (foundReferences.includes(item.reference)) {
        throw new Error(item.reference + ' found twice')
      }
      foundReferences.push(item.reference)
    },
  )
}

function checkDuplicateUuids(array: ExamExerciseWithStringReference[]): void {
  const foundUuids: string[] = []
  array.forEach((item: ExamExerciseWithStringReference) => {
    if (foundUuids.includes(item.uuid)) {
      throw new Error(item.uuid + ' found twice')
    }
    foundUuids.push(item.uuid)
  })
}

function checkImageAlt(): void {
  objectives
    .filter((objective) => objective.lessonSummaryImage !== '')
    .filter((objective) => objective.lessonSummaryImageAlt === '')
    .forEach((objective) => {
      console.warn(objective.reference + ' missing image alt')
      warningCount++
    })
}

function checkMathaleaFullLinks(): void {
  objectives.forEach((objective) => {
    objective.exercises.forEach((exercise) => {
      if (isFullLink(exercise.slug) && isMathalea(exercise.slug)) {
        console.error(objective.reference)
        throw new Error(
          'Mathalea exercises should not be full links to allow manipulation',
        )
      }
    })
  })
}

function buildExerciseLink(
  slug: string | undefined,
  objectiveReference: string,
  isSlideshow: boolean = false,
): string {
  if (!slug) return ''
  if (isFullLink(slug)) return slug
  let link = TOPMATHS_BASE_URL + slug
  if (objectiveReference !== '') {
    link += `&o=${objectiveReference}`
  }
  if (isSlideshow) {
    link += SLIDESHOW_VIEW_ADDENDUM
  } else {
    link += REGULAR_VIEW_ADDENDUM
  }
  return link
}

function isV3Slug(slug: string): boolean {
  return slug.slice(0, 4) === 'uuid'
}

function isFullLink(link: string): boolean {
  return link.slice(0, 4) === 'http'
}

function convertV2ToV3(link: string): string {
  link = link.replace(/mathalea\.html/g, 'alea/')
  link = link.replace(/ex=dnb/g, 'uuid=dnb')
  link = link.replace(/ex=/g, 'id=')
  link = link.replace(/,i=/g, '&i=')
  link = link.replace(/,n=/g, '&n=')
  link = link.replace(/,v=/g, '&v=')
  link = link.replace(/,s=/g, '&s=')
  link = link.replace(/,s2=/g, '&s2=')
  link = link.replace(/,s3=/g, '&s3=')
  link = link.replace(/,s4=/g, '&s4=')
  link = link.replace(/,cd=/g, '&cd=')
  return link
}

function getUnitObjectivesSlugs(
  unit: UnitWithStringReference,
): { slug: string; objectiveReference: string }[] {
  return unit.objectives
    .map((objective) =>
      objective.exercises.map((exercise) => {
        return { slug: exercise.slug, objectiveReference: objective.reference }
      }),
    )
    .flat()
}

function formatSlug(slug: string | undefined): string {
  if (slug === undefined || slug === '') return ''
  if (isV3Slug(slug) || isFullLink(slug)) return addAddendum(slug)
  return addAddendum(convertV2ToV3('ex=' + slug))
}

function addAddendum(slug: string): string {
  if (slug === '') return slug
  if (isFullLink(slug) && !isMathalea(slug)) return slug
  return slug
}

function buildLessonPlanDownloadLinks(
  objective: RecursivePartial<Objective>,
  objectiveGrade: StringGrade,
): Record<StringGrade, string[]> {
  const downloadLinks: Record<StringGrade, string[]> = Object.assign(
    deepCopy(emptyStringArrayRecordStringGrade),
  )
  stringGradeValidKeys.forEach((grade) => {
    downloadLinks[grade] = []
  })
  if (!objective.lessonPlans || objective.lessonPlans.length === 0)
    return downloadLinks
  stringGradeValidKeys.forEach((grade) => {
    if (!objective.lessonPlans) {
      console.error(objective)
      throw new Error('Objective lesson plans is undefined')
    }
    const lessonPlanCount = countLessonPlans(objective, grade)
    const isMultipleLessonPlans = lessonPlanCount > 1
    let lessonPlanNumber = 1
    objective.lessonPlans.forEach((lessonPlan) => {
      if (!objective.reference) {
        console.error(objective)
        throw new Error('Objective reference is undefined')
      }
      if (!lessonPlan) {
        console.error(objective)
        throw new Error('Lesson plan is undefined')
      }
      if (!lessonPlan.grades) {
        console.error(objective)
        throw new Error('Lesson plan grades is undefined')
      }
      if (lessonPlan.grades.length === 0 || lessonPlan.grades.includes(grade)) {
        const downloadLink = buildDownloadLink(
          'fiche',
          `${grade}_${objective.reference}`,
          objectiveGrade,
          isMultipleLessonPlans ? `-${lessonPlanNumber}` : '',
        )
        if (downloadLink !== '') {
          downloadLinks[grade].push(downloadLink)
        }
        lessonPlanNumber++
      }
    })
  })
  return downloadLinks
}

function buildDownloadLink(
  type: 'cours' | 'entrainement' | 'test' | 'resume' | 'mission' | 'fiche',
  reference: string,
  grade: StringGrade,
  addendum: string = '',
): string {
  let basePath = `./public/topmaths/${type}${type === 'cours' ? '' : 's'}/`
  if (type === 'fiche') {
    if (isUnitReference(reference)) {
      basePath += 'sequences/'
    } else {
      basePath += 'objectifs/'
    }
  }
  basePath += `${grade}/`
  const currentPath =
    basePath + `${reference}_${upperFirstChar(type)}${addendum}.pdf`
  const legacyPath =
    basePath + `${upperFirstChar(type)}_${reference}${addendum}.pdf`
  if (fs.existsSync(currentPath)) {
    return currentPath.replace('./public/', '')
  } else if (fs.existsSync(legacyPath)) {
    return legacyPath.replace('./public/', '')
  } else {
    return ''
  }
}

function upperFirstChar(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function writeJson(fileName: string, data: unknown): void {
  fs.writeFileSync(
    path.join('./src', 'topmaths', 'json', fileName + '.json'),
    JSON.stringify(data, null, 2),
  )
}

function writeTs(fileName: string, data: unknown): void {
  fs.writeFileSync(
    path.join('./src', 'topmaths', 'types', fileName + '.ts'),
    `export const ${fileName} = <const> ${JSON.stringify(data, null, 2).replace(/"/g, "'")}
`,
  )
}

function writePrerequisitesCsv(
  objectives: ObjectiveWithStringReference[],
): void {
  const csvFolderPath = path.join('public', 'topmaths', 'csv')

  if (!fs.existsSync(csvFolderPath)) {
    fs.mkdirSync(csvFolderPath, { recursive: true })
  }

  fs.writeFileSync(
    path.join(csvFolderPath, 'prerequis.csv'),
    generateCSV(objectives),
  )
}

function generateCSV(objectives: ObjectiveWithStringReference[]) {
  const header = "Référence,Titre,Nombre de parents,Nombre d'enfants\n"

  const rows = objectives
    .filter((objective) => {
      return !isReferenceIgnored(objective.reference)
    })
    .map((objective) => {
      return `${objective.reference},"${getTitle(objective)}",${objective.ancestorsCount},${objective.descendantsCount}`
    })

  return header + rows.join('\n')
}
