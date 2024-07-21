import { readFileSync } from 'fs'
import * as fs from 'fs'
import * as path from 'path'
import refToUuidJson from '../src/json/refToUuidFR.json' assert { type: 'json' }
import definitionsJson from '../src/topmaths/json/glossary/definitions.json' assert { type: 'json' }
import propertiesJson from '../src/topmaths/json/glossary/properties.json' assert { type: 'json' }
import type { RecursivePartial } from '../src/lib/types.js'
import { type UnitGrade, type ObjectiveGrade, type UnitUnit, type UnitObjective, type ObjectiveObjective, type ObjectiveExercise, type ObjectiveLessonPlan, type ObjectiveUnit, type StringGrade, isStringGrade } from '../src/topmaths/services/types.js'
import { type GlossaryMasterItem, type GlossaryRelatedItem, type GlossaryUniteItem, isGlossaryMasterItem } from '../src/topmaths/types/glossary.js'
const niveauxSequencesJson = JSON.parse(readFileSync('./src/topmaths/json/sequences.json').toString())
const niveauxObjectifsJson = JSON.parse(readFileSync('./src/topmaths/json/objectifs.json').toString())

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

let niveauxObjectifs: ObjectiveGrade[] = []
let niveauxSequences: UnitGrade[] = []
let numeroExercice = 1
let nombreDeWarnings = 0
let nombreErreurs = 0
miseEnCacheNiveauxEtSequences()
const glossary = makeGlossary()
checksDeRoutine()
console.warn(nombreDeWarnings + ' warnings')
console.error(nombreErreurs + ' erreurs')
ecrireJson('objectifs_modifies', niveauxObjectifs)
ecrireJson('sequences_modifiees', niveauxSequences)
ecrireJson('lexique', glossary)

function miseEnCacheNiveauxEtSequences () {
  niveauxSequences = preTraitementSequences(niveauxSequencesJson)
  niveauxObjectifs = preTraitementObjectifs(niveauxObjectifsJson)
  niveauxSequences = postTraitementSequences(niveauxSequences, niveauxObjectifs)
  postTraitementObjectifs()
}

function makeGlossary () {
  const formattedMasterDefinitions = definitions.map(item => formatItem(item, 'définition')).filter(isGlossaryMasterItem)
  const formattedMasterProperties = properties.map(item => formatItem(item, 'propriété')).filter(isGlossaryMasterItem)
  const glossaryMasterItems = formattedMasterDefinitions.concat(formattedMasterProperties)
  const glossaryUniteItems = glossaryMasterItems.map(makeUniteItems).flat()
  return postTraitementItems(glossaryUniteItems)
}

function preTraitementSequences (niveaux: UnitGrade[]) {
  for (const niveau of niveaux) {
    let numeroDeSequence = 1
    for (const sequence of niveau.units) {
      sequence.grade = isStringGrade(niveau.name) ? niveau.name : '6e'
      sequence.number = numeroDeSequence
      sequence.reference = `S${sequence.grade.slice(0, 1)}S${sequence.number}`
      sequence.title = sequence.title ?? ''
      sequence.period = sequence.period ?? 0
      sequence.objectives = sequence.objectives ?? []
      sequence.mentalCalculations = getCalculsMentauxAvecLiensEtIdDesExercices(sequence)
      sequence.flashQuestions = sequence.flashQuestions ?? []
      sequence.flashQuestionsLink = getLienQuestionsFlash(sequence)
      sequence.assessmentExamSlug = sequence.assessmentExamSlug ?? ''
      sequence.assessmentLink = sequence.assessmentLink ?? ''
      sequence.assessmentExamLink = getLienEvalBrevet(sequence)
      sequence.availableDownloads = {
        isLessonAvailable: false,
        isLessonSummaryAvailable: false,
        isMissionAvailable: false,
        isLessonPlanAvailable: false
      }
      numeroDeSequence++
    }
  }
  return niveaux
}

function preTraitementObjectifs (niveaux: ObjectiveGrade[]) {
  for (const niveau of niveaux) {
    for (const theme of niveau.themes) {
      if (theme.subThemes === undefined) {
        theme.subThemes = []
      } else {
        for (const sousTheme of theme.subThemes) {
          for (const objectif of sousTheme.objectives) {
            numeroExercice = 1
            objectif.reference = objectif.reference ?? '0'
            objectif.titleAcademic = objectif.titleAcademic ?? ''
            objectif.title = objectif.title ?? ''
            objectif.period = trouverPeriode(objectif)
            objectif.lessonSummaryHTML = objectif.lessonSummaryHTML ?? ''
            objectif.lessonSummaryImage = getRappelDuCoursImage(objectif)
            objectif.lessonSummaryInstrumenpoche = objectif.lessonSummaryInstrumenpoche ?? ''
            objectif.videos = objectif.videos ?? []
            objectif.exercises = getExercicesAvecLienEtId(objectif.reference, objectif.exercises)
            objectif.lessonPlans = getFiches(objectif.lessonPlans)
            objectif.examExercises = getExercicesAvecLienEtId(objectif.reference, objectif.examExercises)
            objectif.exercisesLink = getLienExercices(objectif.exercises)
            objectif.examExercisesLink = getLienExercices(objectif.examExercises)
            objectif.units = getSequences(objectif)
            objectif.availableDownloads = {
              isPracticeSheetAvailable: fs.existsSync(cheminFichierLegacy('entrainement', objectif.reference)),
              isTestSheetAvailable: fs.existsSync(cheminFichierLegacy('test', objectif.reference)),
              isLessonPlanAvailable: presenceFicheObjectif(objectif),
              availableLessonPlanGrades: []
            }
            objectif.theme = theme.name ?? ''
            const stringGradeCandidate = objectif.reference.slice(0, 1) + 'e'
            objectif.grade = isStringGrade(stringGradeCandidate) ? stringGradeCandidate : '6e'
          }
        }
      }
    }
  }
  return ajouterObjectifsParThemeParPeriode(niveaux)
}

function postTraitementSequences (niveauxSequences: UnitGrade[], niveauxObjectifs: ObjectiveGrade[]) {
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.units) {
      sequence.objectives = getObjectifsAvecInfos(sequence, niveauxObjectifs)
      sequence.mentalCalculations = getCalculsMentauxAvecInfos(sequence, niveauxObjectifs)
      sequence.flashQuestions = getQuestionsFlashAvecInfos(sequence, niveauxObjectifs)
      sequence.assessmentLink = getLienEval(sequence, niveauxObjectifs)
      ajouterReferenceFiches(sequence)
    }
  }
  niveauxSequences = majTelechargementsDisponibles()
  return niveauxSequences
}

function formatItem (item: RecursivePartial<GlossaryMasterItem>, type: 'définition' | 'propriété') {
  item.type = type
  if (item.titles === undefined) return
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

function interpreterMarkupPerso (contenu: string) {
  contenu = contenu.replace(/rouge\[\[/g, '<span class=\'rouge\'>')
  contenu = contenu.replace(/vert\[\[/g, '<span class=\'vert\'>')
  contenu = contenu.replace(/noir\[\[/g, '<span class=\'noir\'>')
  contenu = contenu.replace(/bleu\[\[/g, '<span class=\'bleu\'>')
  contenu = contenu.replace(/\[\[/g, '<span class=\'mot-defini\'>')
  contenu = contenu.replace(/\]\]/g, '</span>')
  return contenu
}

function interpreterMarkupArray (array: (string | undefined)[]) {
  if (array === undefined || array.length === 0) {
    return []
  } else {
    return array
      .filter(str => str !== undefined)
      .map(item => interpreterMarkupPerso(item))
  }
}

function makeUniteItems (masterItem: GlossaryMasterItem) {
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

function creerSlug (titre: string) {
  const normalizedStr = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const slug = normalizedStr
    .replace(/\s+/g, '-')
    .replace(/'+/g, '')
    .toLowerCase()

  return slug
}

function ajouterSlugsSousItemsDejaCrees (item: GlossaryMasterItem, slugsItem: string[]) {
  return item.relatedItems.concat(slugsItem.map(slug => ({ title: '', slug })))
}

function postTraitementItems (items: GlossaryUniteItem[]) {
  items = completerNotionsLiees(items)
  items = ajouterTitresAuxNotions(items)
  items = rangerNotionsLiees(items)
  items = items.sort(comparerTitres)
  return items
}

function completerNotionsLiees (items: GlossaryUniteItem[]) {
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
        nombreErreurs++
      }
    }
  }
  return items
}

function notionLieeDejaAjoutee (slugNotion: string, item: GlossaryUniteItem) {
  for (const notionLiee of item.relatedItems) {
    if (notionLiee.slug === slugNotion) return true
  }
  return false
}

function ajouterTitresAuxNotions (items: GlossaryUniteItem[]) {
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

function rangerNotionsLiees (items: GlossaryUniteItem[]) {
  for (const item of items) {
    if (item.relatedItems === undefined || item.relatedItems.length === 0) {
      item.relatedItems = []
    } else {
      item.relatedItems = item.relatedItems.sort(comparerTitres)
    }
  }
  return items
}

function comparerTitres (a: GlossaryRelatedItem, b: GlossaryRelatedItem) {
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

function checksDeRoutine () {
  const referencesObjectifsSequences = getListeReferencesObjectifsSequences()
  const referencesObjectifs = getListeReferencesObjectifs()
  checkSequences(referencesObjectifsSequences, referencesObjectifs)
  checkObjectifs(referencesObjectifsSequences, referencesObjectifs)
  checkLexique()
}

function getListeReferencesObjectifsSequences () {
  const references: string[] = []
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.units) {
      for (const objectif of sequence.objectives) {
        references.push(objectif.reference)
      }
    }
  }
  return references
}

function getListeReferencesObjectifs () {
  const references: string[] = []
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.subThemes) {
        for (const objectif of sousTheme.objectives) {
          references.push(objectif.reference)
        }
      }
    }
  }
  return references
}

function getCalculsMentauxAvecLiensEtIdDesExercices (sequence: UnitUnit) {
  let numeroExercice = 1
  for (const calculMental of sequence.mentalCalculations) {
    for (const exercice of calculMental.exercises) {
      exercice.link = getLienExercice(exercice.slug, true)
      exercice.uuid = sequence.reference + '-' + numeroExercice
      numeroExercice++
    }
  }
  return sequence.mentalCalculations
}

function getLienQuestionsFlash (sequence: UnitUnit) {
  let lienQuestionsFlash = environment.baseUrl + environment.V3
  for (const questionFlash of sequence.flashQuestions) {
    const slug = questionFlash.slug
    if (slug !== '') {
      lienQuestionsFlash = lienQuestionsFlash.concat(formaterSlug(slug), '&')
    }
  }
  lienQuestionsFlash.slice(0, -1)
  return lienQuestionsFlash
}

function getLienEvalBrevet (sequence: UnitUnit) {
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

function trouverPeriode (objectif: UnitObjective) {
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.units) {
      for (const sequenceObjectif of sequence.objectives) {
        if (sequenceObjectif.reference === objectif.reference) {
          return sequence.period
        }
      }
    }
  }
  return 0
}

function getRappelDuCoursImage (objectif: ObjectiveObjective) {
  if (objectif.lessonSummaryImage === '' || objectif.lessonSummaryImage === undefined) {
    return ''
  } else {
    return '../topmaths/img/' + objectif.lessonSummaryImage
  }
}

function getLienExercices (exercices: ObjectiveExercise[]) {
  if (exercices === undefined || exercices.length === 0) return ''
  let lienExercices = environment.baseUrl + environment.V3
  let nbExercices = 0
  for (const exercice of exercices) {
    const slug = formaterSlug(exercice.slug)
    if (slug !== '') {
      lienExercices = lienExercices.concat(slug, '&i=0&')
      nbExercices++
    }
  }
  lienExercices = lienExercices.slice(0, -1)
  if (nbExercices === 0) lienExercices = ''
  return lienExercices
}

function getExercicesAvecLienEtId (reference: string, exercices: ObjectiveExercise[]) {
  if (exercices === undefined || exercices.length === 0) return []
  for (const exercice of exercices) {
    exercice.uuid = reference + '-' + numeroExercice
    exercice.slug = formaterSlug(exercice.slug)
    exercice.link = getLienExercice(exercice.slug)
    exercice.isInteractive = exercice.isInteractive ?? false
    exercice.description = exercice.description ?? ''
    exercice.isInCart = exercice.isInCart ?? false
    numeroExercice++
  }
  return exercices
}

function getFiches (fiches: ObjectiveLessonPlan[]) {
  if (fiches === undefined) return []
  for (const fiche of fiches) {
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
  }
  return fiches
}

function getSequences (objectif: ObjectiveObjective) {
  const listeDesSequences: ObjectiveUnit[] = []
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.units) {
      for (const sequenceObjectif of sequence.objectives) {
        if (objectif.reference === sequenceObjectif.reference) {
          listeDesSequences.push({
            reference: sequence.reference,
            title: sequence.title
          })
        }
      }
    }
  }
  return listeDesSequences
}

function ajouterObjectifsParThemeParPeriode (niveaux: ObjectiveGrade[]) {
  for (const niveau of niveaux) {
    for (const theme of niveau.themes) {
      let nbObjectifsThemePeriode1 = 0
      let nbObjectifsThemePeriode2 = 0
      let nbObjectifsThemePeriode3 = 0
      let nbObjectifsThemePeriode4 = 0
      let nbObjectifsThemePeriode5 = 0
      for (const sousTheme of theme.subThemes) {
        let nbObjectifsSousThemePeriode1 = 0
        let nbObjectifsSousThemePeriode2 = 0
        let nbObjectifsSousThemePeriode3 = 0
        let nbObjectifsSousThemePeriode4 = 0
        let nbObjectifsSousThemePeriode5 = 0
        for (const objectif of sousTheme.objectives) {
          switch (objectif.period) {
            case 1:
              nbObjectifsThemePeriode1++
              nbObjectifsSousThemePeriode1++
              break
            case 2:
              nbObjectifsThemePeriode2++
              nbObjectifsSousThemePeriode2++
              break
            case 3:
              nbObjectifsThemePeriode3++
              nbObjectifsSousThemePeriode3++
              break
            case 4:
              nbObjectifsThemePeriode4++
              nbObjectifsSousThemePeriode4++
              break
            case 5:
              nbObjectifsThemePeriode5++
              nbObjectifsSousThemePeriode5++
              break
          }
        }
        sousTheme.objectivesPerPeriodCount = [
          nbObjectifsSousThemePeriode1,
          nbObjectifsSousThemePeriode2,
          nbObjectifsSousThemePeriode3,
          nbObjectifsSousThemePeriode4,
          nbObjectifsSousThemePeriode5
        ]
      }
      theme.objectivesPerPeriodCount = [
        nbObjectifsThemePeriode1,
        nbObjectifsThemePeriode2,
        nbObjectifsThemePeriode3,
        nbObjectifsThemePeriode4,
        nbObjectifsThemePeriode5
      ]
    }
  }
  return niveaux
}

function getObjectifsAvecInfos (sequence: UnitUnit, niveauxObjectifs: ObjectiveGrade[]) {
  if (sequence.objectives === undefined) return []
  for (const objectifSequence of sequence.objectives) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.subThemes) {
          for (const objectif of sousTheme.objectives) {
            if (objectifSequence.reference === objectif.reference) {
              objectifSequence.reference = objectif.reference
              objectifSequence.titleAcademic = objectif.titleAcademic
              objectifSequence.title = objectif.title
              objectifSequence.exercises = objectif.exercises
              objectifSequence.examExercises = objectif.examExercises
              objectifSequence.theme = objectif.theme
              objectifSequence.grade = objectif.grade
              objectifSequence.lessonPlans = objectif.lessonPlans
              break
            }
          }
        }
      }
    }
    if (objectifSequence.titleAcademic === undefined || objectifSequence.titleAcademic === '') {
      console.error('L\'objectif ' + objectifSequence.reference + ' de la séquence ' + sequence.title + ' n\'a pas été trouvé.')
      nombreErreurs++
    }
  }
  return sequence.objectives
}

function getCalculsMentauxAvecInfos (sequence: UnitUnit, niveauxObjectifs: ObjectiveGrade[]) {
  if (sequence.mentalCalculations === undefined) return []
  for (const calculMental of sequence.mentalCalculations) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.subThemes) {
          for (const objectif of sousTheme.objectives) {
            if (calculMental.reference === objectif.reference) {
              if (calculMental.titleAcademic === undefined || calculMental.titleAcademic === '') {
                calculMental.titleAcademic = objectif.titleAcademic
                calculMental.title = objectif.title
              }
              calculMental.exercises = calculMental.exercises ?? []
              calculMental.isRelatedObjectivePageAvailable = true
              calculMental.theme = objectif.theme
              break
            }
          }
        }
      }
    }
  }
  return sequence.mentalCalculations
}

function getQuestionsFlashAvecInfos (sequence: UnitUnit, niveauxObjectifs: ObjectiveGrade[]) {
  if (sequence.flashQuestions === undefined) return []
  for (const questionFlash of sequence.flashQuestions) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.subThemes) {
          for (const objectif of sousTheme.objectives) {
            if (questionFlash.reference === objectif.reference) {
              if (questionFlash.titleAcademic === undefined || questionFlash.titleAcademic === '') {
                questionFlash.titleAcademic = objectif.titleAcademic
                questionFlash.title = objectif.title
              }
              questionFlash.slug = questionFlash.slug ?? ''
              questionFlash.isRelatedObjectivePageAvailable = true
              questionFlash.theme = objectif.theme
              break
            }
          }
        }
      }
    }
  }
  return sequence.flashQuestions
}

function getLienEval (sequence: UnitUnit, niveauxObjectifs: ObjectiveGrade[]) {
  const slugsObjectif = getSlugsObjectifsSequence(sequence, niveauxObjectifs)
  if (slugsObjectif.length === 0) return ''
  let lienEval = environment.baseUrl + environment.V3
  for (const slug of slugsObjectif) {
    lienEval = lienEval.concat(slug, '&')
  }
  lienEval.slice(0, -1)
  return lienEval
}

function ajouterReferenceFiches (sequence: UnitUnit) {
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

function getNbFiches (objectif: UnitObjective, niveauSequence: string) {
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

function majTelechargementsDisponibles () {
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.units) {
      sequence.availableDownloads = {
        isLessonAvailable: fs.existsSync(cheminFichier('cours', sequence.reference)),
        isLessonSummaryAvailable: fs.existsSync(cheminFichierLegacy('resume', sequence.reference)),
        isMissionAvailable: fs.existsSync(cheminFichierLegacy('mission', sequence.reference)),
        isLessonPlanAvailable: presenceFicheSequence(sequence)
      }
    }
  }
  return niveauxSequences
}

function postTraitementObjectifs () {
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.subThemes) {
        for (const objectif of sousTheme.objectives) {
          objectif.availableDownloads.availableLessonPlanGrades = getNiveauxFichesDisponibles(objectif)
        }
      }
    }
  }
}

function checkSequences (referencesObjectifsSequences: string[], referencesObjectifs: string[]) {
  checkDoublonsBrevet()
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.units) {
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
}

function checkDoublonsBrevet () {
  const listeExercicesDeBrevet: string[] = []
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.units) {
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
}

function checkObjectifs (referencesObjectifsSequences: string[], referencesObjectifs: string[]) {
  checkSitesAbsentsPolitiqueDeConfidentialite()
  checkReferencesEnDoublon(referencesObjectifs)
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.subThemes) {
        for (const objectif of sousTheme.objectives) {
          if (objectif.period < 1) {
            console.warn(objectif.reference + ' n\'a pas de période')
            nombreDeWarnings++
          }
          if (!referencesObjectifsSequences.includes(objectif.reference)) {
            console.warn(objectif.reference + ' n\'est lié à aucune séquence')
            nombreDeWarnings++
          }
          if ((objectif.lessonSummaryImage === undefined || objectif.lessonSummaryImage === '') &&
            (objectif.lessonSummaryHTML === undefined || objectif.lessonSummaryHTML === '') &&
            (objectif.lessonSummaryInstrumenpoche === undefined || objectif.lessonSummaryInstrumenpoche === '')) {
            console.warn(objectif.reference + ' n\'a pas de rappel de cours')
            nombreDeWarnings++
          }
          if (objectif.videos.length === 0) {
            console.warn(objectif.reference + ' n\'a pas de vidéo')
            nombreDeWarnings++
          }
          if (objectif.exercises.length === 0) {
            console.warn(objectif.reference + ' n\'a pas d\'exercice')
            nombreDeWarnings++
          } else {
            if (presenceExerciceMathalea(objectif.exercises)) {
              if (objectif.availableDownloads.isPracticeSheetAvailable === false) {
                console.warn('Entraînement de ' + objectif.reference + ' manquant')
                nombreDeWarnings++
              }
              if (objectif.availableDownloads.isTestSheetAvailable === false) {
                console.warn('Test de ' + objectif.reference + ' manquant')
                nombreDeWarnings++
              }
            }
          }
        }
      }
    }
  }
}

function checkSitesAbsentsPolitiqueDeConfidentialite () {
  const listeHTTP: string[] = []
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.subThemes) {
        for (const objectif of sousTheme.objectives) {
          for (const exercice of objectif.exercises) {
            if (exercice.slug.slice(0, 4) === 'http') {
              listeHTTP.push(exercice.slug)
            }
          }
        }
      }
    }
  }
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

function checkReferencesEnDoublon (references: string[]) {
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

function presenceExerciceMathalea (exercices: ObjectiveExercise[]) {
  for (const exercice of exercices) {
    if (exercice.link.slice(0, 'https://coopmaths.fr/'.length) === 'https://coopmaths.fr/') return true
  }
  return false
}

function checkLexique () {
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
function getLienExercice (slug: string, calculMental = false) {
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

function estMathsMentales (url: string) {
  return url.slice(0, 25) === 'https://mathsmentales.net'
}

function estCoopmaths (url: string) {
  const urlCoopmaths = environment.baseUrl
  return url.slice(0, urlCoopmaths.length) === environment.baseUrl
}

function estV2 (url: string) {
  const urlV2 = environment.baseUrl + environment.V2
  return url.slice(0, urlV2.length) === urlV2
}

function estV3 (url: string) {
  const urlV3 = environment.baseUrl + environment.V3
  return url.slice(0, urlV3.length) === urlV3
}

function conversionV2enV3 (url: string) {
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

function getSlugsObjectifsSequence (sequence: UnitUnit, niveauxObjectifs: ObjectiveGrade[]) {
  const slugsObjectif: string[] = []
  for (const objectifSequence of sequence.objectives) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.subThemes) {
          for (const objectif of sousTheme.objectives) {
            if (objectifSequence.reference === objectif.reference) {
              for (const exercice of objectif.exercises) {
                const slug = formaterSlug(exercice.slug)
                if (slug !== '') slugsObjectif.push(slug)
              }
              break
            }
          }
        }
      }
    }
  }
  return slugsObjectif
}

function formaterSlug (slug: string) {
  if (slug === '') return ''
  if (slug.slice(0, 4) === 'uuid') return slug
  if (slug.slice(0, 2) === 'id') return ajouterUuid(slug)
  if (slug.slice(0, 4) !== 'http') return conversionV2enV3('ex=' + slug)
  if (estV2(slug)) return ajouterUuid(conversionV2enV3(slug)).slice((environment.baseUrl + environment.V3).length)
  if (estV3(slug)) return ajouterUuid(slug).slice((environment.baseUrl + environment.V3).length)
  else return slug
}

function ajouterUuid (slug: string) {
  return 'uuid=' + getUuid(slug.split('&')[0].split(',')[0].split('=')[1]) + '&' + slug
}
type RefToUuidMap = {
  [key: string]: string;
};
function getUuid (id: string): unknown {
  const refToUuid: RefToUuidMap = refToUuidJson
  return refToUuid[id]
}

function cheminFichierLegacy (type: string, reference: string) {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
}

function presenceFicheObjectif (objectif: UnitObjective) {
  return objectif.lessonPlans.length > 0
}

function getNiveauxFichesDisponibles (objectif: ObjectiveObjective): StringGrade[] {
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

function presenceFicheSequence (sequence: UnitUnit) {
  for (const objectif of sequence.objectives) {
    if (presenceFicheObjectif(objectif)) return true
  }
  return false
}

function cheminFichier (type: string, reference: string) {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${reference}_${type.charAt(0).toUpperCase() + type.slice(1)}.pdf`
}

function ecrireJson (nomDuFichier: string, fichier: unknown) {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', nomDuFichier + '.json'), JSON.stringify(fichier, null, 2))
}
