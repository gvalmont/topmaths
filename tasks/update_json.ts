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
import { emptyUnitFlashQuestion, isUnit, isUnitMentalCalculations, type UnitMentalCalculation, type Unit, type UnitObjective } from '../src/topmaths/types/unit.js'
import { emptyGlossaryMasterItem, type GlossaryMasterItem, type GlossaryRelatedItem, type GlossaryUniteItem, isGlossaryMasterItem } from '../src/topmaths/types/glossary.js'

const environment = {
  annee: 2023,
  origine: 'http://localhost:4200',
  baseUrl: 'https://coopmaths.fr/',
  V2: 'mathalea.html?',
  V3: 'alea/?',
  production: false
}

const environmentProd = {
  origine: 'https://topmaths.fr',
  baseUrl: 'https://coopmaths.fr/',
  V2: 'mathalea.html?',
  V3: 'alea/?',
  production: true
}
const listeSitesPresentsPolitiqueDeConfidentialite = [
  'https://coopmaths.fr/',
  'https://mathsmentales.net/',
  'https://mathix.org/',
  'https://www.geogebra.org/',
  'https://www.clicmaclasse.fr/'
]
const definitions: RecursivePartial<GlossaryMasterItem>[] = definitionsJson
const properties: Partial<GlossaryMasterItem>[] = propertiesJson

let numeroExercice = 1
let nombreDeWarnings = 0
let errorCount = 0
const units: Unit[] = makeUnits()
const objectives: Objective[] = makeObjectives()
updateUnits()
updateObjectives()
const glossary = makeGlossary()
checksDeRoutine()
console.warn(nombreDeWarnings + ' warnings')
console.error(errorCount + ' erreurs')
ecrireJson('objectifs_modifies', objectives)
ecrireJson('sequences_modifiees', units)
ecrireJson('lexique', glossary)

function makeGlossary (): GlossaryUniteItem[] {
  const formattedMasterDefinitions = definitions.map(item => formatItem(item, 'définition')).filter(isGlossaryMasterItem)
  const formattedMasterProperties = properties.map(item => formatItem(item, 'propriété')).filter(isGlossaryMasterItem)
  const glossaryMasterItems = formattedMasterDefinitions.concat(formattedMasterProperties)
  const glossaryUniteItems = glossaryMasterItems.map(makeUniteItems).flat()
  return postTraitementItems(glossaryUniteItems)
}

type UnitGrade = {
  name: string,
  units: Unit[]
}
function makeUnits (): Unit[] {
  const formattedUnits: Unit[] = []
  const unitMaster: RecursivePartial<UnitGrade>[] = unitsMasterJson
  for (const grade of unitMaster) {
    if (grade.name === undefined) { console.error(grade); throw new Error('Grade name is undefined') }
    if (grade.units === undefined) { console.error(grade); throw new Error('Grade units is undefined') }
    let unitNumber = 1
    for (const unit of grade.units) {
      if (unit === undefined) { console.error(grade.units); throw new Error('Unit is undefined') }
      unit.assessmentExamLink = getLienEvalBrevet(unit)
      unit.assessmentExamSlug = unit.assessmentExamSlug ?? ''
      unit.assessmentLink = unit.assessmentLink ?? ''
      unit.availableDownloads = {
        isLessonAvailable: false,
        isLessonSummaryAvailable: false,
        isMissionAvailable: false,
        isLessonPlanAvailable: false
      }
      unit.flashQuestions = unit.flashQuestions ? unit.flashQuestions.map(flashQuestion => Object.assign({}, emptyUnitFlashQuestion, flashQuestion)) : []
      unit.flashQuestionsLink = getLienQuestionsFlash(unit)
      const unitGradeCandidate = grade.name
      if (!isStringGrade(unitGradeCandidate)) { console.error(grade.name); throw new Error('Grade name incorrect') }
      unit.grade = unitGradeCandidate
      unit.mentalCalculations = getCalculsMentauxAvecLiensEtIdDesExercices(unit)
      unit.number = unitNumber
      unit.objectives = unit.objectives ? unit.objectives.map(objective => Object.assign({}, emptyObjective, objective)) : []
      unit.period = unit.period ?? 0
      unit.reference = `S${unit.grade.slice(0, 1)}S${unit.number}`
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

type ObjectiveSubTheme = {
  name: string,
  objectives: Objective[]
}

type ObjectiveTheme = {
  name: string,
  subThemes: ObjectiveSubTheme[]
}

type ObjectiveGrade = {
  name: string,
  themes: ObjectiveTheme[]
}

function makeObjectives (): Objective[] {
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
          numeroExercice = 1
          objective.availableDownloads = {
            isPracticeSheetAvailable: fs.existsSync(cheminFichierLegacy('entrainement', objective.reference)),
            isTestSheetAvailable: fs.existsSync(cheminFichierLegacy('test', objective.reference)),
            isLessonPlanAvailable: presenceFicheObjectif(objective),
            availableLessonPlanGrades: []
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
    unit.availableDownloads = {
      isLessonAvailable: fs.existsSync(cheminFichier('cours', unit.reference)),
      isLessonSummaryAvailable: fs.existsSync(cheminFichierLegacy('resume', unit.reference)),
      isMissionAvailable: fs.existsSync(cheminFichierLegacy('mission', unit.reference)),
      isLessonPlanAvailable: presenceFicheSequence(unit)
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
  item.slug = item.slug ?? ''
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
      relatedItem.slug = relatedItem.slug ?? ''
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

function makeUniteItems (masterItem: GlossaryMasterItem): GlossaryUniteItem[] {
  const uniteItems: GlossaryUniteItem[] = []
  const slugsSousItemsDejaCrees: string[] = []
  for (const title of masterItem.titles) {
    const uniteItem: GlossaryUniteItem = { ...masterItem, title }
    uniteItem.slug = creerSlug(title)
    uniteItem.includesImage = fs.existsSync(`public/topmaths/img/lexique/${uniteItem.slug}.png`)
    uniteItem.relatedItems = ajouterSlugsSousItemsDejaCrees(masterItem, slugsSousItemsDejaCrees)
    slugsSousItemsDejaCrees.push(uniteItem.slug)
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

function ajouterSlugsSousItemsDejaCrees (item: GlossaryMasterItem, slugsItem: string[]): GlossaryRelatedItem[] {
  return item.relatedItems.concat(slugsItem.map(slug => ({ title: '', slug })))
}

function postTraitementItems (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  items = completerNotionsLiees(items)
  items = ajouterTitresAuxNotions(items)
  items = rangerNotionsLiees(items)
  items = items.sort(comparerTitres)
  return items
}

function completerNotionsLiees (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  for (const item1 of items) {
    for (const notionLieeItem1 of item1.relatedItems) {
      let trouve = false
      for (const item2 of items) {
        if (item2.slug === notionLieeItem1.slug) {
          trouve = true
          if (!notionLieeDejaAjoutee(item1.slug, item2)) {
            const nouvelleNotion = { slug: item1.slug, title: item1.title }
            item2.relatedItems.push(nouvelleNotion)
          }
          break
        }
      }
      if (!trouve) {
        console.error('La notion liée ' + notionLieeItem1.slug + ' de ' + item1.title + ' n\'existe pas')
        errorCount++
      }
    }
  }
  return items
}

function notionLieeDejaAjoutee (slugNotion: string, item: GlossaryUniteItem): boolean {
  for (const notionLiee of item.relatedItems) {
    if (notionLiee.slug === slugNotion) return true
  }
  return false
}

function ajouterTitresAuxNotions (items: GlossaryUniteItem[]): GlossaryUniteItem[] {
  for (const item1 of items) {
    for (const notionLieeItem1 of item1.relatedItems) {
      for (const item2 of items) {
        if (item2.slug === notionLieeItem1.slug) {
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

function checksDeRoutine (): void {
  const referencesObjectifsSequences = getListeReferencesObjectifsSequences()
  const referencesObjectifs = getListeReferencesObjectifs()
  checkSequences(referencesObjectifsSequences, referencesObjectifs)
  checkObjectifs(referencesObjectifsSequences, referencesObjectifs)
  checkLexique()
}

function getListeReferencesObjectifsSequences (): string[] {
  return units
    .map(unit => unit.objectives
      .map(objectif => objectif.reference))
    .flat()
}

function getListeReferencesObjectifs (): string[] {
  return objectives.map(objective => objective.reference)
}

function getCalculsMentauxAvecLiensEtIdDesExercices (sequence: RecursivePartial<Unit>): UnitMentalCalculation[] {
  if (sequence.mentalCalculations === undefined) return []
  let numeroExercice = 1
  for (const mentalCalculation of sequence.mentalCalculations) {
    if (mentalCalculation !== undefined) {
      mentalCalculation.exercises = mentalCalculation.exercises ?? []
      const exercises = mentalCalculation.exercises.filter(exercise => exercise !== undefined)
      for (const exercice of exercises) {
        exercice.link = getLienExercice(exercice.slug, true)
        exercice.id = sequence.reference + '-' + numeroExercice
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

  const mentalCalculationsCandidate = sequence.mentalCalculations.filter(mentalCalculation => mentalCalculation !== undefined)
  if (!isUnitMentalCalculations(mentalCalculationsCandidate)) {
    console.error(mentalCalculationsCandidate)
    throw new Error('Mental calculations are not UnitMentalCalculations')
  }
  return mentalCalculationsCandidate
}

function getLienQuestionsFlash (sequence: RecursivePartial<Unit>): string {
  if (!sequence.flashQuestions) return ''
  let lienQuestionsFlash = environment.baseUrl + environment.V3
  for (const questionFlash of sequence.flashQuestions) {
    if (!questionFlash) continue
    const slug = questionFlash.slug
    if (slug !== '') {
      lienQuestionsFlash = lienQuestionsFlash.concat(formaterSlug(slug), '&')
    }
  }
  lienQuestionsFlash.slice(0, -1)
  return lienQuestionsFlash
}

function getLienEvalBrevet (sequence: RecursivePartial<Unit>): string {
  let lienEvalBrevet = ''
  if (sequence.assessmentExamSlug !== undefined && sequence.assessmentExamSlug !== '') {
    if (sequence.assessmentExamSlug.slice(0, 2) === 'ex') {
      lienEvalBrevet = environment.baseUrl + environment.V2
      lienEvalBrevet += sequence.assessmentExamSlug
      lienEvalBrevet = conversionV2enV3(lienEvalBrevet)
    } else if (sequence.assessmentExamSlug.slice(0, 4) === 'uuid') {
      lienEvalBrevet = environment.baseUrl + environment.V3
      lienEvalBrevet += sequence.assessmentExamSlug
    } else {
      lienEvalBrevet = sequence.assessmentExamSlug
    }
    lienEvalBrevet = lienEvalBrevet.concat('&v=eleve')
  }
  return lienEvalBrevet
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
  let lienExercices = environment.baseUrl + environment.V3
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
      console.error('Objective ' + unitObjective.reference + ' of unit ' + unit.title + ' not found.')
      errorCount++
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
    const relatedObjective = objectives.find(objective => objective.reference === mentalCalculation.reference)
    if (!relatedObjective) {
      console.error('Objective ' + mentalCalculation.reference + ' of mental calculation ' + mentalCalculation.title + ' not found.')
      errorCount++
      return mentalCalculation
    }
    mentalCalculation.titleAcademic = relatedObjective.titleAcademic
    mentalCalculation.title = relatedObjective.title
    mentalCalculation.exercises = mentalCalculation.exercises ?? []
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
      errorCount++
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
  let lienEval = environment.baseUrl + environment.V3
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

function updateObjectives (): void {
  objectives.map(objective => {
    objective.availableDownloads.availableLessonPlanGrades = getNiveauxFichesDisponibles(objective)
    return objective
  })
}

function checkSequences (referencesObjectifsSequences: string[], referencesObjectifs: string[]): void {
  checkDoublonsBrevet()
  for (const sequence of units) {
    for (const objectif of sequence.objectives) {
      if (!referencesObjectifs.includes(objectif.reference)) {
        console.warn(sequence.reference + ' comporte l\'objectif ' + objectif.reference + ' qui n\'existe pas')
        nombreDeWarnings++
      }
    }
    for (const calculMental of sequence.mentalCalculations) {
      if ((calculMental.reference !== undefined && calculMental.reference !== '') && (calculMental.titleAcademic === undefined || calculMental.titleAcademic === '')) {
        console.warn('L\'objectif lié à un calcul mental de ' + sequence.reference + ' n\'existe pas')
        nombreDeWarnings++
      }
    }
    for (const questionFlash of sequence.flashQuestions) {
      if (questionFlash.titleAcademic === undefined || questionFlash.titleAcademic === '') {
        console.warn('L\'objectif lié à une question flash de ' + sequence.reference + ' n\'existe pas')
        nombreDeWarnings++
      }
    }
    if (sequence.availableDownloads.isLessonAvailable === false) {
      console.warn('Cours de ' + sequence.reference + ' manquant')
      nombreDeWarnings++
    }
  }
}

function checkDoublonsBrevet (): void {
  const listeExercicesDeBrevet: string[] = []
  for (const sequence of units) {
    if (sequence.assessmentExamSlug !== undefined && sequence.assessmentExamSlug !== '') {
      const listeExosAvecEx = sequence.assessmentExamSlug.split('&')
      for (const exoAvecEx of listeExosAvecEx) {
        const exo = exoAvecEx.slice(3)
        for (const exerciceDeBrevet of listeExercicesDeBrevet) {
          if (exo === exerciceDeBrevet) {
            console.warn(exo + ' présent en double')
            nombreDeWarnings++
          }
        }
        listeExercicesDeBrevet.push(exo)
      }
    } else {
      sequence.assessmentExamSlug = ''
    }
  }
}

function checkObjectifs (referencesObjectifsSequences: string[], referencesObjectifs: string[]): void {
  checkSitesAbsentsPolitiqueDeConfidentialite()
  checkReferencesEnDoublon(referencesObjectifs)
}

function checkSitesAbsentsPolitiqueDeConfidentialite (): void {
  const listeHTTP: string[] = objectives
    .map(objective => objective.exercises
      .map(exercise => exercise.slug)
      .filter(slug => slug.slice(0, 4) === 'http')).flat()
  const listeAbsents: string[] = []
  for (const site of listeHTTP) {
    let trouve = false
    for (const sitePresent of listeSitesPresentsPolitiqueDeConfidentialite) {
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
    nombreDeWarnings += listeAbsents.length
  }
}

function checkReferencesEnDoublon (references: string[]): void {
  const referencesEnDoublon: string[] = []
  for (let i = 0; i < references.length - 1; i++) {
    for (let j = i + 1; j < references.length; j++) {
      if (references[i] === references[j]) {
        referencesEnDoublon.push(references[i])
      }
    }
  }
  if (referencesEnDoublon.length > 0) {
    console.warn('Références en doublon : ', ...referencesEnDoublon)
    nombreDeWarnings += referencesEnDoublon.length
  }
}

function checkLexique (): void {
  const slugs: string[] = []
  for (const item of glossary) {
    for (const slug of slugs) {
      if (item.slug === slug) {
        console.warn('Slug ' + slug + ' en doublon')
        nombreDeWarnings++
      }
    }
    slugs.push(item.slug)
  }
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
      lien = slug + '&embed=' + environmentProd.origine
    } else if (slug.slice(0, 4) !== 'http') { // c'est un slug
      if (slug.includes(',')) { // c'est un slug V2
        if (!slug.startsWith('id=')) slug = 'ex=' + slug
        lien = `${environment.baseUrl + environment.V2}${slug},i=0`
        lien = conversionV2enV3(lien)
      } else { // c'est un slug v3
        lien = environment.baseUrl + environment.V3 + formaterSlug(slug) + '&i=0'
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
  const urlCoopmaths = environment.baseUrl
  return url.slice(0, urlCoopmaths.length) === environment.baseUrl
}

function estV2 (url: string): boolean {
  const urlV2 = environment.baseUrl + environment.V2
  return url.slice(0, urlV2.length) === urlV2
}

function estV3 (url: string): boolean {
  const urlV3 = environment.baseUrl + environment.V3
  return url.slice(0, urlV3.length) === urlV3
}

function conversionV2enV3 (url: string): string {
  url = url.replace(/mathalea\.html/g, 'alea/')
  url = url.replace(/ex=dnb/g, 'uuid=dnb')
  url = url.replace(/ex=/g, 'id=')
  url = url.replace(/,i=/g, '&i=')
  url = url.replace(/,n=/g, '&n=')
  url = url.replace(/,v=/g, '&v=')
  url = url.replace(/,s=/g, '&s=')
  url = url.replace(/,s2=/g, '&s2=')
  url = url.replace(/,s3=/g, '&s3=')
  url = url.replace(/,s4=/g, '&s4=')
  url = url.replace(/,cd=/g, '&cd=')
  return url
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
  if (slug.slice(0, 4) !== 'http') return conversionV2enV3('ex=' + slug)
  if (estV2(slug)) return ajouterUuid(conversionV2enV3(slug)).slice((environment.baseUrl + environment.V3).length)
  if (estV3(slug)) return ajouterUuid(slug).slice((environment.baseUrl + environment.V3).length)
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

function cheminFichierLegacy (type: string, reference: string): string {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
}

function presenceFicheObjectif (objectif: RecursivePartial<UnitObjective>): boolean {
  if (objectif.lessonPlans === undefined) return false
  return objectif.lessonPlans.length > 0
}

function getNiveauxFichesDisponibles (objectif: Objective): StringGrade[] {
  const niveauxDisponibles: StringGrade[] = []
  for (const fiche of objectif.lessonPlans) {
    if (fiche.grades.length === 0) {
      if (!niveauxDisponibles.includes(objectif.grade)) niveauxDisponibles.push(objectif.grade)
    } else {
      for (const niveau of fiche.grades) {
        if (!niveauxDisponibles.includes(niveau)) niveauxDisponibles.push(niveau)
      }
    }
  }
  return niveauxDisponibles
}

function presenceFicheSequence (sequence: Unit): boolean {
  for (const objectif of sequence.objectives) {
    if (presenceFicheObjectif(objectif)) return true
  }
  return false
}

function cheminFichier (type: string, reference: string): string {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${reference}_${type.charAt(0).toUpperCase() + type.slice(1)}.pdf`
}

function ecrireJson (nomDuFichier: string, fichier: unknown): void {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', nomDuFichier + '.json'), JSON.stringify(fichier, null, 2))
}
