import * as fs from 'fs'
import * as path from 'path'
import definitionsJson from '../src/topmaths/json/glossary/definitions.json' assert { type: 'json' }
import propertiesJson from '../src/topmaths/json/glossary/properties.json' assert { type: 'json' }
import objectivesMasterJson from '../src/topmaths/json/objectives.json' assert { type: 'json' }
import unitsMasterJson from '../src/topmaths/json/units.json' assert { type: 'json' }
import type { RecursivePartial } from '../src/lib/types.js'
import { emptyArrayRecordStringGrade, isStringGrade, stringGradeValidKeys, type StringGrade } from '../src/topmaths/types/shared.js'
import { emptyObjective, emptyObjectiveVideo, isObjective, isObjectiveExercises, isObjectiveLessonPlans, type ObjectiveExercise, type ObjectiveUnit, type Objective, type ObjectiveLessonPlan, emptyObjectiveExercise } from '../src/topmaths/types/objective.js'
import { isUnit, isUnitMentalCalculations, type UnitMentalCalculation, type Unit, type UnitObjective, emptyUnitDownloadLinks, emptyUnitMentalCalculation, type UnitFlashQuestion, isUnitFlashQuestions } from '../src/topmaths/types/unit.js'
import { emptyGlossaryMasterItem, type GlossaryItem, type GlossaryMasterItem, type GlossaryRelatedItem, type GlossaryUniteItem, isGlossaryMasterItem } from '../src/topmaths/types/glossary.js'
import { countLessonPlans } from './helpers/lesson_plans.js'

const COOPMATHS_BASE_URL = 'https://coopmaths.fr/alea/?'
const EXERCISE_PARAM_ADDENDUM = '&i=0'
const REGULAR_VIEW_ADDENDUM = '&v=eleve'
const SLIDESHOW_VIEW_ADDENDUM = '&v=diaporama'
const THIRD_PARTY_WEBSITES = [
  'https://coopmaths.fr/',
  'https://mathsmentales.net/',
  'https://mathix.org/',
  'https://www.geogebra.org/',
  'https://www.clicmaclasse.fr/'
]

let warningCount = 0
let exerciseNumber = 1
const units: Unit[] = buildUnits()
const objectives: Objective[] = buildObjectives()
updateUnits()
const glossary = buildGlossary()
routineCheck()
console.warn(warningCount + ' warning' + (warningCount > 1 ? 's' : ''))
ecrireJson('objectifs_modifies', objectives)
ecrireJson('sequences_modifiees', units)
ecrireJson('lexique', glossary)

function buildUnits (): Unit[] {
  type UnitGrade = {
    name: string, // StringGrade serait mieux mais ça demanderait beaucoup de travail pour pas grand chose car dans tous les cas on vérifie le vérifie dans isUnit avant le return
    units: Unit[]
  }
  const formattedUnits: Unit[] = []
  const unitMaster: RecursivePartial<UnitGrade>[] = unitsMasterJson
  for (const grade of unitMaster) {
    if (grade.name === undefined) { console.error(grade); throw new Error('Grade name is undefined') }
    if (!isStringGrade(grade.name)) { console.error('grade name', grade.name); throw new Error('Grade name incorrect') }
    if (grade.units === undefined) { console.error(grade); throw new Error('Grade units is undefined') }
    let unitNumber = 1
    for (const unit of grade.units) {
      if (unit === undefined) { console.error(grade.units); throw new Error('Unit is undefined') }
      unit.assessmentExamSlug = formatSlug(unit.assessmentExamSlug)
      unit.assessmentExamLink = unit.assessmentExamSlug ? COOPMATHS_BASE_URL + unit.assessmentExamSlug + REGULAR_VIEW_ADDENDUM : ''
      unit.assessmentLink = unit.assessmentLink ?? ''
      unit.downloadLinks = emptyUnitDownloadLinks
      unit.flashQuestions = buildFlashQuestions(unit)
      unit.flashQuestionsLink = buildFlashQuestionsLink(unit)
      unit.grade = grade.name
      unit.mentalCalculations = formatUnitMentalCalculations(unit.mentalCalculations)
      unit.number = unitNumber
      unit.objectives = unit.objectives ? unit.objectives.map(objective => Object.assign({}, emptyObjective, objective)) : []
      unit.term = unit.term ?? 0
      unit.reference = buildUnitReference(unit)
      unit.title = unit.title ?? ''
      unitNumber++
      if (!isUnit(unit)) {
        console.error(unit)
        throw new Error('Unit is not a Unit')
      }
      formattedUnits.push(unit)
    }
  }
  return formattedUnits
}

function buildObjectives (): Objective[] {
  type ObjectiveSubTheme = {
    name: string,
    objectives: Objective[]
  }
  type ObjectiveTheme = {
    name: string,
    subThemes: ObjectiveSubTheme[]
  }
  type ObjectiveGrade = {
    name: string, // StringGrade serait mieux mais ça demanderait beaucoup de travail pour pas grand chose car dans tous les cas on vérifie le vérifie dans isObjective avant le return
    themes: ObjectiveTheme[]
  }
  const formattedObjectives: Objective[] = []
  const objectivesMaster: RecursivePartial<ObjectiveGrade>[] = objectivesMasterJson
  for (const grade of objectivesMaster) {
    if (grade.name === undefined) { console.error(grade); throw new Error('Grade name is undefined') }
    if (!isStringGrade(grade.name)) { console.error('grade name', grade.name); throw new Error('Grade name incorrect') }
    if (grade.themes === undefined) { console.error(grade); throw new Error('Grade themes are undefined') }
    for (const theme of grade.themes) {
      if (theme === undefined) { console.error(theme); throw new Error('Theme is undefined') }
      if (theme.name === undefined) { console.error(theme); throw new Error('Theme name is undefined') }
      if (theme.subThemes === undefined) { console.error(theme); throw new Error('Theme subThemes are undefined') }
      for (const subTheme of theme.subThemes) {
        if (subTheme === undefined) { console.error(subTheme); throw new Error('SubTheme is undefined') }
        if (subTheme.name === undefined) { console.error(subTheme); throw new Error('SubTheme name is undefined') }
        if (subTheme.objectives === undefined) { console.error(subTheme); throw new Error('SubTheme objectives are undefined') }
        for (const objective of subTheme.objectives) {
          if (objective === undefined) { console.error(objective); throw new Error('Objective is undefined') }
          if (objective.reference === undefined) { console.error(objective); throw new Error('Objective reference is undefined') }
          exerciseNumber = 1
          objective.lessonPlans = buildObjectiveLessonPlans(objective.lessonPlans)
          objective.downloadLinks = {
            practiceSheetLink: buildDownloadLink('entrainement', objective.reference, grade.name),
            testSheetLink: buildDownloadLink('test', objective.reference, grade.name),
            lessonPlanLinks: buildLessonPlanDownloadLinks(objective, grade.name)
          }
          objective.examExercises = buildExercises(objective.reference, objective.examExercises)
          objective.examExercisesLink = buildExercisesLink(objective.examExercises)
          objective.exercises = buildExercises(objective.reference, objective.exercises)
          objective.exercisesLink = buildExercisesLink(objective.exercises)
          objective.grade = grade.name
          objective.lessonSummaryHTML = objective.lessonSummaryHTML ?? ''
          objective.lessonSummaryImage = objective.lessonSummaryImage ? '../topmaths/img/' + objective.lessonSummaryImage : ''
          objective.lessonSummaryInstrumenpoche = objective.lessonSummaryInstrumenpoche ?? ''
          objective.term = findTerm(objective)
          objective.reference = objective.reference ?? '0'
          objective.subTheme = subTheme.name
          objective.theme = theme.name
          objective.title = objective.title ?? ''
          objective.titleAcademic = objective.titleAcademic ?? ''
          objective.units = buildObjectiveUnits(objective)
          objective.videos = objective.videos ? objective.videos.map(video => Object.assign({}, emptyObjectiveVideo, video)) : []
          if (!isObjective(objective)) {
            console.error(objective)
            throw new Error('Objective is not an Objective')
          }
          formattedObjectives.push(objective)
        }
      }
    }
  }
  return formattedObjectives
}

function updateUnits (): void {
  for (const unit of units) {
    updateUnitObjective(unit)
    updateUnitMentalCalculations(unit)
    updateUnitFlashQuestions(unit)
    updateUnitAssessmentLink(unit)
    unit.mentalCalculations = buildMentalCalculations(unit)
    unit.downloadLinks = {
      lessonLink: buildDownloadLink('cours', unit.reference, unit.grade),
      lessonSummaryLink: buildDownloadLink('resume', unit.reference, unit.grade),
      missionLink: buildDownloadLink('mission', unit.reference, unit.grade),
      lessonPlanLink: buildDownloadLink('fiche', unit.reference, unit.grade)
    }
  }
}

function buildGlossary (): GlossaryUniteItem[] {
  const definitions: RecursivePartial<GlossaryMasterItem>[] = definitionsJson
  const properties: Partial<GlossaryMasterItem>[] = propertiesJson
  const formattedMasterDefinitions = definitions.map(item => formatItem(item, 'définition'))
  const formattedMasterProperties = properties.map(item => formatItem(item, 'propriété'))
  const glossaryMasterItems = formattedMasterDefinitions.concat(formattedMasterProperties)
  const glossaryUniteItems = glossaryMasterItems.map(buildGlossaryUniteItems).flat()
  updateRelatedItems(glossaryUniteItems)
  glossaryUniteItems.forEach(item => item.relatedItems.sort(comparerTitres))
  glossaryUniteItems.sort(comparerTitres)
  return glossaryUniteItems
}

function formatItem (item: RecursivePartial<GlossaryMasterItem>, type: 'définition' | 'propriété'): GlossaryMasterItem {
  item.type = type
  if (item.titles === undefined) return emptyGlossaryMasterItem
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
    .filter(relatedObjective => relatedObjective !== undefined)
    .map(relatedObjective => buildGradeFromObjectiveReference(relatedObjective))
  item.grades = gradeCandidates.filter(isStringGrade)
  item.relatedItems = item.relatedItems ?? []
  item.relatedItems = item.relatedItems
    .filter(relatedItem => relatedItem !== undefined)
    .map(relatedItem => {
      relatedItem.reference = relatedItem.reference ?? ''
      relatedItem.title = relatedItem.title ?? ''
      return relatedItem
    })
  if (!isGlossaryMasterItem(item)) {
    console.error(item)
    throw new Error('Item is not a GlossaryItem')
  }
  return item
}

function interpreterMarkupPerso (contenu: string): string {
  contenu = contenu.replace(/rouge\[\[/g, '<span class=\'rouge\'>')
  contenu = contenu.replace(/vert\[\[/g, '<span class=\'vert\'>')
  contenu = contenu.replace(/noir\[\[/g, '<span class=\'noir\'>')
  contenu = contenu.replace(/bleu\[\[/g, '<span class=\'bleu\'>')
  contenu = contenu.replace(/\[\[/g, '<span class=\'mot-defini\'>')
  contenu = contenu.replace(/\]\]/g, '</span>')
  return contenu
}

function interpreterMarkupArray (array: (string | undefined)[]): string[] {
  if (array === undefined || array.length === 0) {
    return []
  } else {
    return array
      .filter(str => str !== undefined)
      .map(item => interpreterMarkupPerso(item))
  }
}

function buildGradeFromObjectiveReference (reference: string): StringGrade {
  const grade = reference.slice(0, 1) + 'e'
  if (!isStringGrade(grade)) {
    console.error(reference)
    throw new Error('Grade built from objective reference is incorrect')
  }
  return grade
}

function buildGlossaryUniteItems (masterItem: GlossaryMasterItem): GlossaryUniteItem[] {
  const uniteItems: GlossaryUniteItem[] = []
  const slugsSousItemsDejaCrees: string[] = []
  for (const title of masterItem.titles) {
    const uniteItem: GlossaryUniteItem = { ...masterItem, title }
    uniteItem.reference = creerSlug(title)
    uniteItem.includesImage = fs.existsSync(`public/topmaths/img/lexique/${uniteItem.reference}.png`)
    uniteItem.relatedItems = ajouterSlugsSousItemsDejaCrees(masterItem, slugsSousItemsDejaCrees)
    slugsSousItemsDejaCrees.push(uniteItem.reference)
    uniteItems.push(uniteItem)
  }
  return uniteItems
}

function creerSlug (titre: string): string {
  const normalizedStr = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const slug = normalizedStr
    .replace(/\s+/g, '-')
    .replace(/'+/g, '')
    .toLowerCase()

  return slug
}

function ajouterSlugsSousItemsDejaCrees (item: GlossaryMasterItem, references: string[]): GlossaryRelatedItem[] {
  return item.relatedItems.concat(references.map(reference => ({ title: '', reference })))
}

function updateRelatedItems (items: GlossaryUniteItem[]): void {
  items.forEach(item1 => item1.relatedItems.forEach(relatedItem1 => {
    const item2 = items.find(item2 => item2.reference === relatedItem1.reference)
    if (!item2) {
      throw new Error(`Glossary item ${relatedItem1.reference} not found`)
    }
    relatedItem1.title = item2.title
    if (!item2.relatedItems.find(relatedItem2 => relatedItem2.reference === item1.reference)) {
      item2.relatedItems.push({ reference: item1.reference, title: item1.title })
    }
  }))
}

function comparerTitres (a: GlossaryRelatedItem, b: GlossaryRelatedItem): number {
  const titleA = a.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
  const titleB = b.title.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

  if (titleA < titleB) {
    return -1
  }
  if (titleA > titleB) {
    return 1
  }
  return 0
}

function routineCheck (): void {
  checkDuplicates(objectives)
  checkDuplicates(units)
  checkDuplicates(glossary)
  checkSitesAbsentsPolitiqueDeConfidentialite()
  checkDuplicatesExamExercises()
}

function formatUnitMentalCalculations (mentalCalculations: (RecursivePartial<UnitMentalCalculation> | undefined)[] | undefined): UnitMentalCalculation[] {
  if (!mentalCalculations) return []
  return mentalCalculations
    .filter(mentalCalculation => mentalCalculation !== undefined)
    .map(mentalCalculation => {
      let exercises: ObjectiveExercise[] = []
      if (mentalCalculation.exercises) {
        exercises = mentalCalculation.exercises.map(exercise => Object.assign({}, emptyObjectiveExercise, exercise))
      }
      mentalCalculation.exercises = exercises
      return Object.assign({}, emptyUnitMentalCalculation, mentalCalculation)
    })
}

function buildMentalCalculations (unit: RecursivePartial<Unit>): UnitMentalCalculation[] {
  if (unit.mentalCalculations === undefined) return []
  let exerciseNumber = 1
  for (const mentalCalculation of unit.mentalCalculations) {
    if (mentalCalculation !== undefined) {
      mentalCalculation.exercises = mentalCalculation.exercises ?? []
      const exercises = mentalCalculation.exercises.filter(exercise => exercise !== undefined)
      for (const exercice of exercises) {
        exercice.slug = formatSlug(exercice.slug)
        exercice.link = buildExerciseLink(exercice.slug, true)
        exercice.id = unit.reference + '-' + exerciseNumber
        exercice.isInteractive = exercice.isInteractive ?? false
        exercice.description = exercice.description ?? ''
        exercice.isInCart = exercice.isInCart ?? false
        exerciseNumber++
      }
      mentalCalculation.exercises = exercises
      mentalCalculation.reference = mentalCalculation.reference ?? ''
      mentalCalculation.titleAcademic = mentalCalculation.titleAcademic ?? ''
      mentalCalculation.title = mentalCalculation.title ?? ''
      mentalCalculation.isRelatedObjectivePageAvailable = mentalCalculation.isRelatedObjectivePageAvailable ?? false
      mentalCalculation.theme = mentalCalculation.theme ?? ''
    }
  }
  const mentalCalculationsCandidate = unit.mentalCalculations.filter(mentalCalculation => mentalCalculation !== undefined)
  if (!isUnitMentalCalculations(mentalCalculationsCandidate)) {
    console.error(mentalCalculationsCandidate)
    throw new Error('Mental calculations are not UnitMentalCalculations')
  }
  return mentalCalculationsCandidate
}

function buildUnitReference (unit: RecursivePartial<Unit>): string {
  if (unit.grade === undefined) {
    console.error(unit)
    throw new Error('Unit grade is undefined')
  }
  return `S${unit.grade.slice(0, 1)}S${unit.number}`
}

function buildFlashQuestions (unit: RecursivePartial<Unit>): UnitFlashQuestion[] {
  if (unit.flashQuestions === undefined) return []
  const flashQuestions = unit.flashQuestions
    .filter(flashQuestion => flashQuestion !== undefined)
    .map(flashQuestion => {
      flashQuestion.title = flashQuestion.title ?? ''
      flashQuestion.titleAcademic = flashQuestion.titleAcademic ?? ''
      flashQuestion.reference = flashQuestion.reference ?? ''
      flashQuestion.slug = flashQuestion.slug ? formatSlug(flashQuestion.slug) : ''
      flashQuestion.isRelatedObjectivePageAvailable = flashQuestion.isRelatedObjectivePageAvailable ?? false
      flashQuestion.theme = flashQuestion.theme ?? ''
      return flashQuestion
    })
  if (!isUnitFlashQuestions(flashQuestions)) {
    console.error(flashQuestions)
    throw new Error('Flash questions are not UnitFlashQuestions')
  }
  return flashQuestions
}

function buildFlashQuestionsLink (unit: RecursivePartial<Unit>): string {
  if (!unit.flashQuestions) return ''
  let flashQuestionsLink = COOPMATHS_BASE_URL
  unit.flashQuestions.forEach(flashQuestion => {
    if (flashQuestion !== undefined && flashQuestion.slug !== '') {
      flashQuestionsLink += flashQuestion.slug + '&'
    }
  })
  return flashQuestionsLink.slice(0, -1)
}

function findTerm (objective: RecursivePartial<UnitObjective>): number {
  const unit = units
    .find(unit => unit.objectives
      .find(unitObjective => unitObjective.reference === objective.reference))
  if (!unit) {
    console.error(objective.reference)
    throw new Error('Unit corresponding to objective not found')
  }
  return unit.term
}

function buildExercisesLink (exercises: (RecursivePartial<ObjectiveExercise> | undefined)[] | undefined): string {
  if (exercises === undefined || exercises.length === 0) return ''
  let exerciseLink = COOPMATHS_BASE_URL
  let exerciseCount = 0
  exercises
    .filter(exercice => exercice !== undefined)
    .forEach(exercice => {
      if (exercice.slug) {
        exerciseLink = exerciseLink.concat(exercice.slug, EXERCISE_PARAM_ADDENDUM + '&')
        exerciseCount++
      }
    })
  exerciseLink = exerciseLink.slice(0, -1)
  if (exerciseCount === 0) exerciseLink = ''
  return exerciseLink
}

function buildExercises (reference: string, exercises: (RecursivePartial<ObjectiveExercise> | undefined)[] | undefined): ObjectiveExercise[] {
  if (exercises === undefined || exercises.length === 0) return []
  exercises = exercises
    .filter(exercise => exercise !== undefined)
    .map(exercise => {
      exercise.id = reference + '-' + exerciseNumber
      exercise.slug = formatSlug(exercise.slug)
      exercise.link = buildExerciseLink(exercise.slug)
      exercise.isInteractive = exercise.isInteractive ?? false
      exercise.description = exercise.description ?? ''
      exercise.isInCart = exercise.isInCart ?? false
      exerciseNumber++
      return exercise
    })
  if (!isObjectiveExercises(exercises)) {
    console.error(exercises)
    throw new Error('Exercises are not ObjectiveExercises')
  }
  return exercises
}

function buildObjectiveLessonPlans (lessonPlans: (RecursivePartial<ObjectiveLessonPlan> | undefined)[] | undefined): ObjectiveLessonPlan[] {
  if (lessonPlans === undefined || lessonPlans.length === 0) return []
  lessonPlans = lessonPlans
    .filter(lessonPlan => lessonPlan !== undefined)
    .map(lessonPlan => {
      lessonPlan.startSteps = lessonPlan.startSteps ?? []
      lessonPlan.lessonSteps = lessonPlan.lessonSteps ?? []
      lessonPlan.homeworks = lessonPlan.homeworks ?? []
      lessonPlan.closureSteps = lessonPlan.closureSteps ?? []
      lessonPlan.studentMaterialsNeeded = lessonPlan.studentMaterialsNeeded ?? []
      lessonPlan.teacherMaterialsNeeded = lessonPlan.teacherMaterialsNeeded ?? []
      lessonPlan.grades = lessonPlan.grades ?? []
      lessonPlan.comments = lessonPlan.comments ?? []
      lessonPlan.nextSessionSteps = lessonPlan.nextSessionSteps ?? []
      lessonPlan.reference = lessonPlan.reference ?? '0'
      return lessonPlan
    })
  if (!isObjectiveLessonPlans(lessonPlans)) {
    console.error(lessonPlans)
    throw new Error('Lesson plans are not ObjectiveLessonPlans')
  }
  return lessonPlans
}

function buildObjectiveUnits (objective: RecursivePartial<Objective>): ObjectiveUnit[] {
  const unitsFound = units
    .filter(unit => unit.objectives
      .find(unitObjective => unitObjective.reference === objective.reference))
  const objectiveUnits: ObjectiveUnit[] = unitsFound.map(unit => {
    return {
      reference: unit.reference,
      title: unit.title
    }
  })
  return objectiveUnits
}

function updateUnitObjective (unit: Unit): void {
  unit.objectives.forEach(unitObjective => {
    const objective = objectives.find(objective => objective.reference === unitObjective.reference)
    if (!objective) {
      console.warn('Objective ' + unitObjective.reference + ' of unit ' + unit.title + ' not found.')
      warningCount++
      return
    }
    unitObjective.reference = objective.reference
    unitObjective.titleAcademic = objective.titleAcademic
    unitObjective.title = objective.title
    unitObjective.exercises = objective.exercises
    unitObjective.examExercises = objective.examExercises
    unitObjective.theme = objective.theme
    unitObjective.grade = objective.grade
    unitObjective.lessonPlans = objective.lessonPlans
  })
}

function updateUnitMentalCalculations (unit: Unit): void {
  unit.mentalCalculations
    .filter(mentalCalculation => mentalCalculation.reference !== '')
    .forEach(mentalCalculation => {
      const relatedObjective = objectives.find(objective => objective.reference === mentalCalculation.reference)
      if (!relatedObjective) {
        console.warn('Objective ' + mentalCalculation.reference + ' of mental calculation ' + mentalCalculation.title + ' not found.')
        warningCount++
        return
      }
      mentalCalculation.isRelatedObjectivePageAvailable = true
      mentalCalculation.theme = relatedObjective.theme
      mentalCalculation.titleAcademic = relatedObjective.titleAcademic
      mentalCalculation.title = relatedObjective.title
    })
}

function updateUnitFlashQuestions (unit: Unit): void {
  unit.flashQuestions.forEach(flashQuestion => {
    const relatedObjective = objectives.find(objective => objective.reference === flashQuestion.reference)
    if (!relatedObjective) {
      console.error('Objective ' + flashQuestion.reference + ' of flash question ' + flashQuestion.title + ' not found.')
      warningCount++
      return
    }
    flashQuestion.titleAcademic = relatedObjective.titleAcademic
    flashQuestion.title = relatedObjective.title
    flashQuestion.slug = flashQuestion.slug ?? ''
    flashQuestion.isRelatedObjectivePageAvailable = true
    flashQuestion.theme = relatedObjective.theme
  })
}

function updateUnitAssessmentLink (unit: Unit): void {
  const objectivesSlugs = getUnitObjectivesSlugs(unit)
  if (objectivesSlugs.length === 0) {
    unit.assessmentLink = ''
    return
  }
  unit.assessmentLink = COOPMATHS_BASE_URL
  for (const objectiveSlug of objectivesSlugs) {
    unit.assessmentLink += objectiveSlug + '&'
  }
  unit.assessmentLink.slice(0, -1)
}

function checkDuplicatesExamExercises (): void {
  const examExercises: string[] = []
  units
    .filter(unit => unit.assessmentExamSlug !== '')
    .map(unit => unit.assessmentExamSlug)
    .forEach(assessmentExamSlug => {
      const examExerciseSlugs = assessmentExamSlug.split('&')
      examExerciseSlugs.forEach(examExerciseSlug => {
        if (examExercises.includes(examExerciseSlug)) {
          console.warn(examExerciseSlug + ' found twice')
          warningCount++
        }
        examExercises.push(examExerciseSlug)
      })
    })
}

function checkSitesAbsentsPolitiqueDeConfidentialite (): void {
  const listeHTTP: string[] = objectives
    .map(objective => objective.exercises
      .map(exercise => exercise.slug)
      .filter(slug => slug.slice(0, 4) === 'http')).flat()
  const listeAbsents: string[] = []
  for (const site of listeHTTP) {
    let trouve = false
    for (const sitePresent of THIRD_PARTY_WEBSITES) {
      if (site.slice(0, sitePresent.length) === sitePresent) {
        trouve = true
        break
      }
    }
    if (!trouve) listeAbsents.push(site)
  }
  if (listeAbsents.length > 0) {
    console.warn(
      'Sites absents de la politique de confidentialité :',
      ...listeAbsents
    )
    warningCount += listeAbsents.length
  }
}

function checkDuplicates (array: Objective[] | Unit[] | GlossaryItem[]): void {
  const foundReferences: string[] = []
  array.forEach((item: Objective | Unit | GlossaryItem) => {
    if (foundReferences.includes(item.reference)) {
      throw new Error(item.reference + ' found twice')
    }
    foundReferences.push(item.reference)
  })
}

function buildExerciseLink (slug: string | undefined, isSlideshow = false): string {
  if (!slug) return ''
  if (isFullLink(slug)) return slug
  let link = COOPMATHS_BASE_URL + slug + EXERCISE_PARAM_ADDENDUM
  link = link.replace(/&uuid=/g, EXERCISE_PARAM_ADDENDUM + '&uuid=') // dans le cas où il y aurait plusieurs exercices dans le même slug
  if (isSlideshow) {
    link += SLIDESHOW_VIEW_ADDENDUM
  } else {
    link += REGULAR_VIEW_ADDENDUM
  }
  return link
}

function isV3Slug (slug: string): boolean {
  return slug.slice(0, 4) === 'uuid'
}

function isFullLink (link: string): boolean {
  return link.slice(0, 4) === 'http'
}

function convertV2ToV3 (link: string): string {
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

function getUnitObjectivesSlugs (unit: Unit): string[] {
  return unit.objectives
    .map(objective => objective.exercises
      .map(exercise => exercise.slug))
    .flat()
}

function formatSlug (slug: string | undefined): string {
  if (slug === undefined || slug === '') return ''
  if (isV3Slug(slug) || isFullLink(slug)) return slug
  return convertV2ToV3('ex=' + slug)
}

function buildLessonPlanDownloadLinks (objective: RecursivePartial<Objective>, objectiveGrade: StringGrade): Record<StringGrade, string[]> {
  const downloadLinks: Record<StringGrade, string[]> = Object.assign({}, emptyArrayRecordStringGrade)
  stringGradeValidKeys.forEach(grade => {
    downloadLinks[grade] = []
  })
  if (!objective.lessonPlans || objective.lessonPlans.length === 0) return downloadLinks
  stringGradeValidKeys.forEach(grade => {
    if (!objective.lessonPlans) { console.error(objective); throw new Error('Objective lesson plans is undefined') }
    const lessonPlanCount = countLessonPlans(objective, grade)
    const isMultipleLessonPlans = lessonPlanCount > 1
    let lessonPlanNumber = 1
    objective.lessonPlans.forEach(lessonPlan => {
      if (!objective.reference) { console.error(objective); throw new Error('Objective reference is undefined') }
      if (!lessonPlan) { console.error(objective); throw new Error('Lesson plan is undefined') }
      if (!lessonPlan.grades) { console.error(objective); throw new Error('Lesson plan grades is undefined') }
      if (lessonPlan.grades.length === 0 || lessonPlan.grades.includes(grade)) {
        const downloadLink = buildDownloadLink('fiche', `${grade}_${objective.reference}`, objectiveGrade, isMultipleLessonPlans ? `-${lessonPlanNumber}` : '')
        if (downloadLink !== '') {
          downloadLinks[grade].push(downloadLink)
        }
        lessonPlanNumber++
      }
    })
  })
  return downloadLinks
}

function buildDownloadLink (type: 'cours' | 'entrainement' | 'test' | 'resume' | 'mission' | 'fiche', reference: string, grade: StringGrade, addendum: string = ''): string {
  let basePath = `./public/topmaths/${type}${type === 'cours' ? '' : 's'}/`
  if (type === 'fiche') {
    const isLessonReference = reference.charAt(0) === 'S'
    if (isLessonReference) {
      basePath += 'sequences/'
    } else {
      basePath += 'objectifs/'
    }
  }
  basePath += `${grade}/`
  const currentPath = basePath + `${reference}_${upperFirstChar(type)}${addendum}.pdf`
  const legacyPath = basePath + `${upperFirstChar(type)}_${reference}${addendum}.pdf`
  if (fs.existsSync(currentPath)) {
    return currentPath.replace('./public/', '')
  } else if (fs.existsSync(legacyPath)) {
    return legacyPath.replace('./public/', '')
  } else {
    return ''
  }
}

function upperFirstChar (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function ecrireJson (nomDuFichier: string, fichier: unknown): void {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', nomDuFichier + '.json'), JSON.stringify(fichier, null, 2))
}
