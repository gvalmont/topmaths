import * as fs from 'fs'
import * as path from 'path'
import refToUuidJson from '../src/json/refToUuidFR.json' assert { type: 'json' }
import definitionsJson from '../src/topmaths/json/glossary/definitions.json' assert { type: 'json' }
import propertiesJson from '../src/topmaths/json/glossary/properties.json' assert { type: 'json' }
import objectivesMasterJson from '../src/topmaths/json/objectives.json' assert { type: 'json' }
import unitsMasterJson from '../src/topmaths/json/units.json' assert { type: 'json' }
import type { RecursivePartial } from '../src/lib/types.js'
import { isStringGrade, type StringGrade } from '../src/topmaths/types/shared.js'
import { emptyObjective, emptyObjectiveVideo, isObjective, isObjectiveExercises, isObjectiveLessonPlans, type ObjectiveExercise, type ObjectiveUnit, type Objective, type ObjectiveLessonPlan } from '../src/topmaths/types/objective.js'
import { emptyUnitFlashQuestion, isUnit, isUnitMentalCalculations, type UnitMentalCalculation, type Unit, type UnitObjective, emptyUnitDownloadLinks } from '../src/topmaths/types/unit.js'
import { emptyGlossaryMasterItem, type GlossaryItem, type GlossaryMasterItem, type GlossaryRelatedItem, type GlossaryUniteItem, isGlossaryMasterItem } from '../src/topmaths/types/glossary.js'

const ORIGIN = 'https://topmaths.fr'
const COOPMATHS_URL = 'https://coopmaths.fr/'
const V2_ADDENDUM = 'mathalea.html?'
const V3_ADDENDUM = 'alea/?'
const VIEW_ADDENDUM = '&v=eleve'
const THIRD_PARTY_WEBSITES = [
  'https://coopmaths.fr/',
  'https://mathsmentales.net/',
  'https://mathix.org/',
  'https://www.geogebra.org/',
  'https://www.clicmaclasse.fr/'
]

let warningCount = 0
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
    if (grade.units === undefined) { console.error(grade); throw new Error('Grade units is undefined') }
    let unitNumber = 1
    for (const unit of grade.units) {
      if (unit === undefined) { console.error(grade.units); throw new Error('Unit is undefined') }
      unit.assessmentExamLink = buildAssessmentExamLink(unit)
      unit.assessmentExamSlug = unit.assessmentExamSlug ?? ''
      unit.assessmentLink = unit.assessmentLink ?? ''
      unit.downloadLinks = emptyUnitDownloadLinks
      unit.flashQuestions = unit.flashQuestions ? unit.flashQuestions.map(flashQuestion => Object.assign({}, emptyUnitFlashQuestion, flashQuestion)) : []
      unit.flashQuestionsLink = buildFlashQuestionsLink(unit)
      const unitGradeCandidate = grade.name
      if (!isStringGrade(unitGradeCandidate)) { console.error('grade name', grade.name); throw new Error('Grade name incorrect') }
      unit.grade = unitGradeCandidate
      unit.mentalCalculations = buildMentalCalculations(unit)
      unit.number = unitNumber
      unit.objectives = unit.objectives ? unit.objectives.map(objective => Object.assign({}, emptyObjective, objective)) : []
      unit.period = unit.period ?? 0
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
          objective.downloadLinks = {
            practiceSheetLink: buildDownloadLink('entrainement', objective.reference),
            testSheetLink: buildDownloadLink('test', objective.reference),
            lessonPlanLinks: buildLessonPlanDownloadLinks(objective.reference)
          }
          objective.examExercises = getExercicesAvecLienEtId(objective.reference, objective.examExercises)
          objective.examExercisesLink = getLienExercices(objective.examExercises)
          objective.exercises = getExercicesAvecLienEtId(objective.reference, objective.exercises)
          objective.exercisesLink = getLienExercices(objective.exercises)
          const stringGradeCandidate = objective.reference.slice(0, 1) + 'e'
          objective.grade = isStringGrade(stringGradeCandidate) ? stringGradeCandidate : 'none'
          objective.lessonPlans = getFiches(objective.lessonPlans)
          objective.lessonSummaryHTML = objective.lessonSummaryHTML ?? ''
          objective.lessonSummaryImage = getRappelDuCoursImage(objective)
          objective.lessonSummaryInstrumenpoche = objective.lessonSummaryInstrumenpoche ?? ''
          objective.period = trouverPeriode(objective)
          objective.reference = objective.reference ?? '0'
          objective.subTheme = subTheme.name
          objective.theme = theme.name
          objective.title = objective.title ?? ''
          objective.titleAcademic = objective.titleAcademic ?? ''
          objective.units = getSequences(objective)
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
    updateUnitObjective(unit, objectives)
    updateUnitMentalCalculations(unit, objectives)
    updateUnitFlashQuestions(unit, objectives)
    updateUnitAssessmentLink(unit, objectives)
    updateUnitLessonPlans(unit)
    unit.downloadLinks = {
      lessonLink: buildDownloadLink('cours', unit.reference),
      lessonSummaryLink: buildDownloadLink('resume', unit.reference),
      missionLink: buildDownloadLink('mission', unit.reference),
      lessonPlanLink: buildDownloadLink('fiche', unit.reference)
    }
  }
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
    .map(relatedObjective => relatedObjective.slice(0, 1) + 'e')
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

function postTraitementItems (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  items = updateRelatedItems(items)
  items = ajouterTitresAuxNotions(items)
  items = rangerNotionsLiees(items)
  items = items.sort(comparerTitres)
  return items
}

function updateRelatedItems (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
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
  return items
}

function ajouterTitresAuxNotions (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  for (const item1 of items) {
    for (const notionLieeItem1 of item1.relatedItems) {
      for (const item2 of items) {
        if (item2.reference === notionLieeItem1.reference) {
          notionLieeItem1.title = item2.title
          break
        }
      }
    }
  }
  return items
}

function rangerNotionsLiees (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  for (const item of items) {
    if (item.relatedItems === undefined || item.relatedItems.length === 0) {
      item.relatedItems = []
    } else {
      item.relatedItems = item.relatedItems.sort(comparerTitres)
    }
  }
  return items
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

function buildMentalCalculations (unit: RecursivePartial<Unit>): UnitMentalCalculation[] {
  if (unit.mentalCalculations === undefined) return []
  let numeroExercice = 1
  for (const mentalCalculation of unit.mentalCalculations) {
    if (mentalCalculation !== undefined) {
      mentalCalculation.exercises = mentalCalculation.exercises ?? []
      const exercises = mentalCalculation.exercises.filter(exercise => exercise !== undefined)
      for (const exercice of exercises) {
        exercice.link = getLienExercice(exercice.slug, true)
        exercice.id = unit.reference + '-' + numeroExercice
        exercice.slug = exercice.slug ?? ''
        exercice.isInteractive = exercice.isInteractive ?? false
        exercice.description = exercice.description ?? ''
        exercice.isInCart = exercice.isInCart ?? false
        numeroExercice++
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

function buildFlashQuestionsLink (unit: RecursivePartial<Unit>): string {
  if (!unit.flashQuestions) return ''
  let flashQuestionsLink = COOPMATHS_URL + V3_ADDENDUM
  unit.flashQuestions.forEach(flashQuestion => {
    if (flashQuestion !== undefined && flashQuestion.slug !== '') {
      flashQuestionsLink += formaterSlug(flashQuestion.slug) + '&'
    }
  })
  return flashQuestionsLink.slice(0, -1)
}

function buildAssessmentExamLink (unit: RecursivePartial<Unit>): string {
  let assessmentExamLink = ''
  if (unit.assessmentExamSlug === undefined || unit.assessmentExamSlug === '') {
    return assessmentExamLink
  }
  if (isV2Slug(unit.assessmentExamSlug)) {
    assessmentExamLink = COOPMATHS_URL + V2_ADDENDUM
    assessmentExamLink += unit.assessmentExamSlug
    assessmentExamLink = convertV2ToV3(assessmentExamLink)
  } else if (isV3Slug(unit.assessmentExamSlug)) {
    assessmentExamLink = COOPMATHS_URL + V3_ADDENDUM
    assessmentExamLink += unit.assessmentExamSlug
  } else {
    assessmentExamLink = unit.assessmentExamSlug
  }
  assessmentExamLink = assessmentExamLink.concat(VIEW_ADDENDUM)
  return assessmentExamLink
}

function trouverPeriode (objectif: RecursivePartial<UnitObjective>): number {
  for (const unit of units) {
    for (const unitObjectif of unit.objectives) {
      if (unitObjectif.reference === objectif.reference) {
        return unit.period
      }
    }
  }
  return 0
}

function getRappelDuCoursImage (objectif: RecursivePartial<Objective>): string {
  if (objectif.lessonSummaryImage === '' || objectif.lessonSummaryImage === undefined) {
    return ''
  } else {
    return '../topmaths/img/' + objectif.lessonSummaryImage
  }
}

function getLienExercices (exercises: (RecursivePartial<ObjectiveExercise> | undefined)[] | undefined): string {
  if (exercises === undefined || exercises.length === 0) return ''
  let lienExercices = COOPMATHS_URL + V3_ADDENDUM
  let nbExercices = 0
  exercises
    .filter(exercice => exercice !== undefined)
    .forEach(exercice => {
      const slug = formaterSlug(exercice.slug)
      if (slug !== '') {
        lienExercices = lienExercices.concat(slug, '&i=0&')
        nbExercices++
      }
    })
  lienExercices = lienExercices.slice(0, -1)
  if (nbExercices === 0) lienExercices = ''
  return lienExercices
}

function getExercicesAvecLienEtId (reference: string, exercices: (RecursivePartial<ObjectiveExercise> | undefined)[] | undefined): ObjectiveExercise[] {
  if (exercices === undefined || exercices.length === 0) return []
  let numeroExercice = 1
  exercices
    .filter(exercice => exercice !== undefined)
    .map(exercice => {
      exercice.id = reference + '-' + numeroExercice
      exercice.slug = formaterSlug(exercice.slug)
      exercice.link = getLienExercice(exercice.slug)
      exercice.isInteractive = exercice.isInteractive ?? false
      exercice.description = exercice.description ?? ''
      exercice.isInCart = exercice.isInCart ?? false
      numeroExercice++
      return exercice
    })
  if (!isObjectiveExercises(exercices)) {
    console.error(exercices)
    throw new Error('Exercises are not ObjectiveExercises')
  }
  return exercices
}

function getFiches (fiches: (RecursivePartial<ObjectiveLessonPlan> | undefined)[] | undefined): ObjectiveLessonPlan[] {
  if (fiches === undefined || fiches.length === 0) return []
  fiches
    .filter(fiche => fiche !== undefined)
    .map(fiche => {
      fiche.startSteps = fiche.startSteps ?? []
      fiche.lessonSteps = fiche.lessonSteps ?? []
      fiche.homeworks = fiche.homeworks ?? []
      fiche.closureSteps = fiche.closureSteps ?? []
      fiche.studentMaterialsNeeded = fiche.studentMaterialsNeeded ?? []
      fiche.teacherMaterialsNeeded = fiche.teacherMaterialsNeeded ?? []
      fiche.grades = fiche.grades ?? []
      fiche.comments = fiche.comments ?? []
      fiche.nextSessionSteps = fiche.nextSessionSteps ?? []
      fiche.reference = fiche.reference ?? '0'
      return fiche
    })
  if (!isObjectiveLessonPlans(fiches)) {
    console.error(fiches)
    throw new Error('Lesson plans are not ObjectiveLessonPlans')
  }
  return fiches
}

function getSequences (objectif: RecursivePartial<Objective>): ObjectiveUnit[] {
  const listeDesSequences: ObjectiveUnit[] = []
  for (const unit of units) {
    for (const sequenceObjectif of unit.objectives) {
      if (objectif.reference === sequenceObjectif.reference) {
        listeDesSequences.push({
          reference: unit.reference,
          title: unit.title
        })
      }
    }
  }
  return listeDesSequences
}

function updateUnitObjective (unit: Unit, objectives: Objective[]): void {
  unit.objectives.map(unitObjective => {
    const objective = objectives.find(objective => objective.reference === unitObjective.reference)
    if (!objective) {
      console.warn('Objective ' + unitObjective.reference + ' of unit ' + unit.title + ' not found.')
      warningCount++
      return unitObjective
    }
    unitObjective.reference = objective.reference
    unitObjective.titleAcademic = objective.titleAcademic
    unitObjective.title = objective.title
    unitObjective.exercises = objective.exercises
    unitObjective.examExercises = objective.examExercises
    unitObjective.theme = objective.theme
    unitObjective.grade = objective.grade
    unitObjective.lessonPlans = objective.lessonPlans
    return unitObjective
  })
}

function updateUnitMentalCalculations (unit: Unit, objectives: Objective[]): void {
  unit.mentalCalculations.map(mentalCalculation => {
    if (mentalCalculation.reference === '') return mentalCalculation
    const relatedObjective = objectives.find(objective => objective.reference === mentalCalculation.reference)
    if (!relatedObjective) {
      console.warn('Objective ' + mentalCalculation.reference + ' of mental calculation ' + mentalCalculation.title + ' not found.')
      warningCount++
      return mentalCalculation
    }
    mentalCalculation.titleAcademic = relatedObjective.titleAcademic
    mentalCalculation.title = relatedObjective.title
    mentalCalculation.isRelatedObjectivePageAvailable = true
    mentalCalculation.theme = relatedObjective.theme
    return mentalCalculation
  })
}

function updateUnitFlashQuestions (unit: Unit, objectives: Objective[]): void {
  unit.flashQuestions.map(flashQuestion => {
    const relatedObjective = objectives.find(objective => objective.reference === flashQuestion.reference)
    if (!relatedObjective) {
      console.error('Objective ' + flashQuestion.reference + ' of flash question ' + flashQuestion.title + ' not found.')
      warningCount++
      return flashQuestion
    }
    flashQuestion.titleAcademic = relatedObjective.titleAcademic
    flashQuestion.title = relatedObjective.title
    flashQuestion.slug = flashQuestion.slug ?? ''
    flashQuestion.isRelatedObjectivePageAvailable = true
    flashQuestion.theme = relatedObjective.theme
    return flashQuestion
  })
}

function updateUnitAssessmentLink (unit: Unit, objectives: Objective[]): void {
  const slugsObjectif = getSlugsObjectifsSequence(unit, objectives)
  if (slugsObjectif.length === 0) {
    unit.assessmentLink = ''
    return
  }
  let lienEval = COOPMATHS_URL + V3_ADDENDUM
  for (const slug of slugsObjectif) {
    lienEval = lienEval.concat(slug, '&')
  }
  lienEval.slice(0, -1)
  unit.assessmentLink = lienEval
}

function updateUnitLessonPlans (sequence: Unit): void {
  for (const objectifSequence of sequence.objectives) {
    if (objectifSequence.lessonPlans.length > 0) {
      let numeroFiche = 1
      for (const fiche of objectifSequence.lessonPlans) {
        if (fiche.grades.length === 0 || fiche.grades.includes(sequence.grade)) {
          const nbFiches = getNbFiches(objectifSequence, sequence.grade)
          fiche.reference = objectifSequence.reference + (nbFiches > 1 ? '-' + numeroFiche : '')
          numeroFiche++
        }
      }
    }
  }
}

function getNbFiches (objectif: UnitObjective, niveauSequence: string): number {
  let nbFiches = 0
  for (const fiche of objectif.lessonPlans) {
    if (fiche.grades.length === 0) nbFiches++
    else {
      for (const niveauFiche of fiche.grades) {
        if (niveauFiche === niveauSequence) nbFiches++
      }
    }
  }
  return nbFiches
}

function buildGlossary (): GlossaryUniteItem[] {
  const definitions: RecursivePartial<GlossaryMasterItem>[] = definitionsJson
  const properties: Partial<GlossaryMasterItem>[] = propertiesJson
  const formattedMasterDefinitions = definitions.map(item => formatItem(item, 'définition')).filter(isGlossaryMasterItem)
  const formattedMasterProperties = properties.map(item => formatItem(item, 'propriété')).filter(isGlossaryMasterItem)
  const glossaryMasterItems = formattedMasterDefinitions.concat(formattedMasterProperties)
  const glossaryUniteItems = glossaryMasterItems.map(buildGlossaryUniteItems).flat()
  return postTraitementItems(glossaryUniteItems)
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

/**
   * Construit le lien d'un exercice à partir de son slug
   * @param slug version raccourcie de l'url dans le cas de MathALEA, lien complet sinon
   * @param calculMental true si utilisation dans un calcul mental pour afficher le diaporama des exercices de MathALEA
   * @returns {string}
   */
function getLienExercice (slug: string | undefined, calculMental = false): string {
  if (slug === undefined) return ''
  let lien = ''
  if (slug !== undefined) {
    if (estMathsMentales(slug)) {
      lien = slug + '&embed=' + ORIGIN
    } else if (slug.slice(0, 4) !== 'http') { // c'est un slug
      if (slug.includes(',')) { // c'est un slug V2
        if (!slug.startsWith('id=')) slug = 'ex=' + slug
        lien = `${COOPMATHS_URL + V2_ADDENDUM}${slug},i=0`
        lien = convertV2ToV3(lien)
      } else { // c'est un slug v3
        lien = COOPMATHS_URL + V3_ADDENDUM + formaterSlug(slug) + '&i=0'
      }
      lien = lien.replace(/&uuid=/g, '&i=0&uuid=') // dans le cas où il y aurait plusieurs exercices dans le même slug
      if (calculMental) {
        lien += '&v=diaporama'
      }
    } else if (estCoopmaths(slug)) {
      lien = slug
      if (calculMental) {
        lien += '&v=diaporama'
      }
    } else {
      lien = slug
    }
  }
  return lien
}

function estMathsMentales (url: string): boolean {
  return url.slice(0, 25) === 'https://mathsmentales.net'
}

function estCoopmaths (url: string): boolean {
  const urlCoopmaths = COOPMATHS_URL
  return url.slice(0, urlCoopmaths.length) === COOPMATHS_URL
}

function isV2Slug (slug: string): boolean {
  return slug.slice(0, 2) === 'ex'
}
function isV2Link (url: string): boolean {
  const V2BaseUrl = COOPMATHS_URL + V2_ADDENDUM
  return url.slice(0, V2BaseUrl.length) === V2BaseUrl
}

function isV3Slug (slug: string): boolean {
  return slug.slice(0, 4) === 'uuid'
}
function isV3Link (url: string): boolean {
  const V3BaseUrl = COOPMATHS_URL + V3_ADDENDUM
  return url.slice(0, V3BaseUrl.length) === V3BaseUrl
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

function getSlugsObjectifsSequence (sequence: Unit, objectives: Objective[]): string[] {
  return objectives
    .filter(objective => sequence.objectives.map(objectifSequence => objectifSequence.reference).includes(objective.reference))
    .map(objectif => objectif.exercises)
    .flat()
    .map(exercice => formaterSlug(exercice.slug))
    .filter(slug => slug !== '')
}

function formaterSlug (slug: string | undefined): string {
  if (slug === undefined || slug === '') return ''
  if (slug.slice(0, 4) === 'uuid') return slug
  if (slug.slice(0, 2) === 'id') return ajouterUuid(slug)
  if (slug.slice(0, 4) !== 'http') return convertV2ToV3('ex=' + slug)
  if (isV2Link(slug)) return ajouterUuid(convertV2ToV3(slug)).slice((COOPMATHS_URL + V3_ADDENDUM).length)
  if (isV3Link(slug)) return ajouterUuid(slug).slice((COOPMATHS_URL + V3_ADDENDUM).length)
  else return slug
}

function ajouterUuid (slug: string): string {
  return 'uuid=' + getUuid(slug.split('&')[0].split(',')[0].split('=')[1]) + '&' + slug
}
type RefToUuidMap = {
  [key: string]: string;
};
function getUuid (id: string): unknown {
  const refToUuid: RefToUuidMap = refToUuidJson
  return refToUuid[id]
}

function buildLessonPlanDownloadLinks (reference: string): Record<StringGrade, string> {
  const lessonPlanGrade = buildGradeFromReference(reference)
  return {
    '6e': buildDownloadLink('fiche', `6e_${reference}`, lessonPlanGrade),
    '5e': buildDownloadLink('fiche', `5e_${reference}`, lessonPlanGrade),
    '4e': buildDownloadLink('fiche', `4e_${reference}`, lessonPlanGrade),
    '3e': buildDownloadLink('fiche', `3e_${reference}`, lessonPlanGrade),
    none: ''
  }
}

function buildDownloadLink (type: 'cours' | 'entrainement' | 'test' | 'resume' | 'mission' | 'fiche', reference: string, grade?: StringGrade): string {
  if (!grade) grade = buildGradeFromReference(reference)
  let basePath = `./public/topmaths/${type}${type === 'fiche' ? 's' : ''}/`
  if (type === 'fiche') {
    const isLessonReference = reference.charAt(0) === 'S'
    if (isLessonReference) {
      basePath += 'sequences/'
    } else {
      basePath += 'objectifs/'
    }
  }
  basePath += `${grade}/`
  const currentPath = basePath + `${reference}_${upperFirstChar(type)}.pdf`
  const legacyPath = basePath + `${upperFirstChar(type)}_${reference}.pdf`
  if (fs.existsSync(currentPath)) {
    return currentPath
  } else if (fs.existsSync(legacyPath)) {
    return legacyPath
  } else {
    return ''
  }
}

function buildGradeFromReference (reference: string): StringGrade {
  const isLessonReference = reference.charAt(0) === 'S'
  let gradeCandidate = ''
  if (isLessonReference) {
    gradeCandidate = reference.slice(1, 2) + 'e'
  } else {
    gradeCandidate = reference.slice(0, 1) + 'e'
  }
  if (!isStringGrade(gradeCandidate)) {
    console.error('grade', gradeCandidate)
    throw new Error('Grade from reference incorrect')
  }
  return gradeCandidate
}

function upperFirstChar (str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function ecrireJson (nomDuFichier: string, fichier: unknown): void {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', nomDuFichier + '.json'), JSON.stringify(fichier, null, 2))
}
