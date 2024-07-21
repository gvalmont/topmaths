import { readFileSync } from 'fs'
import * as fs from 'fs'
import * as path from 'path'
import refToUuidJson from '../src/json/refToUuidFR.json' assert { type: 'json' }
import definitionsJson from '../src/topmaths/json/glossary/definitions.json' assert { type: 'json' }
import propertiesJson from '../src/topmaths/json/glossary/properties.json' assert { type: 'json' }
import type { RecursivePartial } from '../src/lib/types.js'
import { type SequenceNiveau, type ObjectifNiveau, type SequenceSequence, type SequenceObjectif, type ObjectifObjectif, type ObjectifExercice, type ObjectifFiche, type ObjectifSequence, type StringGrade, isStringGrade } from '../src/topmaths/services/types.js'
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

let niveauxObjectifs: ObjectifNiveau[] = []
let niveauxSequences: SequenceNiveau[] = []
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

function preTraitementSequences (niveaux: SequenceNiveau[]) {
  for (const niveau of niveaux) {
    let numeroDeSequence = 1
    for (const sequence of niveau.sequences) {
      sequence.niveau = isStringGrade(niveau.nom) ? niveau.nom : '6e'
      sequence.numero = numeroDeSequence
      sequence.reference = `S${sequence.niveau.slice(0, 1)}S${sequence.numero}`
      sequence.titre = sequence.titre ?? ''
      sequence.periode = sequence.periode ?? 0
      sequence.objectifs = sequence.objectifs ?? []
      sequence.calculsMentaux = getCalculsMentauxAvecLiensEtIdDesExercices(sequence)
      sequence.questionsFlash = sequence.questionsFlash ?? []
      sequence.lienQuestionsFlash = getLienQuestionsFlash(sequence)
      sequence.slugEvalBrevet = sequence.slugEvalBrevet ?? ''
      sequence.lienEval = sequence.lienEval ?? ''
      sequence.lienEvalBrevet = getLienEvalBrevet(sequence)
      sequence.telechargementsDisponibles = {
        cours: false,
        resume: false,
        mission: false,
        fiche: false
      }
      numeroDeSequence++
    }
  }
  return niveaux
}

function preTraitementObjectifs (niveaux: ObjectifNiveau[]) {
  for (const niveau of niveaux) {
    for (const theme of niveau.themes) {
      if (theme.sousThemes === undefined) {
        theme.sousThemes = []
      } else {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            numeroExercice = 1
            objectif.reference = objectif.reference ?? '0'
            objectif.titre = objectif.titre ?? ''
            objectif.titreSimplifie = objectif.titreSimplifie ?? ''
            objectif.periode = trouverPeriode(objectif)
            objectif.rappelDuCoursHTML = objectif.rappelDuCoursHTML ?? ''
            objectif.rappelDuCoursImage = getRappelDuCoursImage(objectif)
            objectif.rappelDuCoursInstrumenpoche = objectif.rappelDuCoursInstrumenpoche ?? ''
            objectif.videos = objectif.videos ?? []
            objectif.exercices = getExercicesAvecLienEtId(objectif.reference, objectif.exercices)
            objectif.fiches = getFiches(objectif.fiches)
            objectif.exercicesDeBrevet = getExercicesAvecLienEtId(objectif.reference, objectif.exercicesDeBrevet)
            objectif.lienExercices = getLienExercices(objectif.exercices)
            objectif.lienExercicesDeBrevet = getLienExercices(objectif.exercicesDeBrevet)
            objectif.sequences = getSequences(objectif)
            objectif.telechargementsDisponibles = {
              entrainement: fs.existsSync(cheminFichierLegacy('entrainement', objectif.reference)),
              test: fs.existsSync(cheminFichierLegacy('test', objectif.reference)),
              fiche: presenceFicheObjectif(objectif),
              niveauxFiches: []
            }
            objectif.theme = theme.nom ?? ''
            const stringGradeCandidate = objectif.reference.slice(0, 1) + 'e'
            objectif.niveau = isStringGrade(stringGradeCandidate) ? stringGradeCandidate : '6e'
          }
        }
      }
    }
  }
  return ajouterObjectifsParThemeParPeriode(niveaux)
}

function postTraitementSequences (niveauxSequences: SequenceNiveau[], niveauxObjectifs: ObjectifNiveau[]) {
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.sequences) {
      sequence.objectifs = getObjectifsAvecInfos(sequence, niveauxObjectifs)
      sequence.calculsMentaux = getCalculsMentauxAvecInfos(sequence, niveauxObjectifs)
      sequence.questionsFlash = getQuestionsFlashAvecInfos(sequence, niveauxObjectifs)
      sequence.lienEval = getLienEval(sequence, niveauxObjectifs)
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
    for (const sequence of niveau.sequences) {
      for (const objectif of sequence.objectifs) {
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
      for (const sousTheme of theme.sousThemes) {
        for (const objectif of sousTheme.objectifs) {
          references.push(objectif.reference)
        }
      }
    }
  }
  return references
}

function getCalculsMentauxAvecLiensEtIdDesExercices (sequence: SequenceSequence) {
  let numeroExercice = 1
  for (const calculMental of sequence.calculsMentaux) {
    for (const exercice of calculMental.exercices) {
      exercice.lien = getLienExercice(exercice.slug, true)
      exercice.id = sequence.reference + '-' + numeroExercice
      numeroExercice++
    }
  }
  return sequence.calculsMentaux
}

function getLienQuestionsFlash (sequence: SequenceSequence) {
  let lienQuestionsFlash = environment.baseUrl + environment.V3
  for (const questionFlash of sequence.questionsFlash) {
    const slug = questionFlash.slug
    if (slug !== '') {
      lienQuestionsFlash = lienQuestionsFlash.concat(formaterSlug(slug), '&')
    }
  }
  lienQuestionsFlash.slice(0, -1)
  return lienQuestionsFlash
}

function getLienEvalBrevet (sequence: SequenceSequence) {
  let lienEvalBrevet = ''
  if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== '') {
    if (sequence.slugEvalBrevet.slice(0, 2) === 'ex') {
      lienEvalBrevet = environment.baseUrl + environment.V2
      lienEvalBrevet += sequence.slugEvalBrevet
      lienEvalBrevet = conversionV2enV3(lienEvalBrevet)
    } else if (sequence.slugEvalBrevet.slice(0, 4) === 'uuid') {
      lienEvalBrevet = environment.baseUrl + environment.V3
      lienEvalBrevet += sequence.slugEvalBrevet
    } else {
      lienEvalBrevet = sequence.slugEvalBrevet
    }
    lienEvalBrevet = lienEvalBrevet.concat('&v=eleve')
  }
  return lienEvalBrevet
}

function trouverPeriode (objectif: SequenceObjectif) {
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.sequences) {
      for (const sequenceObjectif of sequence.objectifs) {
        if (sequenceObjectif.reference === objectif.reference) {
          return sequence.periode
        }
      }
    }
  }
  return 0
}

function getRappelDuCoursImage (objectif: ObjectifObjectif) {
  if (objectif.rappelDuCoursImage === '' || objectif.rappelDuCoursImage === undefined) {
    return ''
  } else {
    return '../topmaths/img/' + objectif.rappelDuCoursImage
  }
}

function getLienExercices (exercices: ObjectifExercice[]) {
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

function getExercicesAvecLienEtId (reference: string, exercices: ObjectifExercice[]) {
  if (exercices === undefined || exercices.length === 0) return []
  for (const exercice of exercices) {
    exercice.id = reference + '-' + numeroExercice
    exercice.slug = formaterSlug(exercice.slug)
    exercice.lien = getLienExercice(exercice.slug)
    exercice.isInteractif = exercice.isInteractif ?? false
    exercice.description = exercice.description ?? ''
    exercice.estDansLePanier = exercice.estDansLePanier ?? false
    numeroExercice++
  }
  return exercices
}

function getFiches (fiches: ObjectifFiche[]) {
  if (fiches === undefined) return []
  for (const fiche of fiches) {
    fiche.debutDeSeance = fiche.debutDeSeance ?? []
    fiche.deroule = fiche.deroule ?? []
    fiche.devoirs = fiche.devoirs ?? []
    fiche.finDeSeance = fiche.finDeSeance ?? []
    fiche.materielEleve = fiche.materielEleve ?? []
    fiche.materielEnseignant = fiche.materielEnseignant ?? []
    fiche.niveaux = fiche.niveaux ?? []
    fiche.notes = fiche.notes ?? []
    fiche.prochaineSeance = fiche.prochaineSeance ?? []
    fiche.reference = fiche.reference ?? '0'
  }
  return fiches
}

function getSequences (objectif: ObjectifObjectif) {
  const listeDesSequences: ObjectifSequence[] = []
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.sequences) {
      for (const sequenceObjectif of sequence.objectifs) {
        if (objectif.reference === sequenceObjectif.reference) {
          listeDesSequences.push({
            reference: sequence.reference,
            titre: sequence.titre
          })
        }
      }
    }
  }
  return listeDesSequences
}

function ajouterObjectifsParThemeParPeriode (niveaux: ObjectifNiveau[]) {
  for (const niveau of niveaux) {
    for (const theme of niveau.themes) {
      let nbObjectifsThemePeriode1 = 0
      let nbObjectifsThemePeriode2 = 0
      let nbObjectifsThemePeriode3 = 0
      let nbObjectifsThemePeriode4 = 0
      let nbObjectifsThemePeriode5 = 0
      for (const sousTheme of theme.sousThemes) {
        let nbObjectifsSousThemePeriode1 = 0
        let nbObjectifsSousThemePeriode2 = 0
        let nbObjectifsSousThemePeriode3 = 0
        let nbObjectifsSousThemePeriode4 = 0
        let nbObjectifsSousThemePeriode5 = 0
        for (const objectif of sousTheme.objectifs) {
          switch (objectif.periode) {
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
        sousTheme.nbObjectifsParPeriode = [
          nbObjectifsSousThemePeriode1,
          nbObjectifsSousThemePeriode2,
          nbObjectifsSousThemePeriode3,
          nbObjectifsSousThemePeriode4,
          nbObjectifsSousThemePeriode5
        ]
      }
      theme.nbObjectifsParPeriode = [
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

function getObjectifsAvecInfos (sequence: SequenceSequence, niveauxObjectifs: ObjectifNiveau[]) {
  if (sequence.objectifs === undefined) return []
  for (const objectifSequence of sequence.objectifs) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (objectifSequence.reference === objectif.reference) {
              objectifSequence.reference = objectif.reference
              objectifSequence.titre = objectif.titre
              objectifSequence.titreSimplifie = objectif.titreSimplifie
              objectifSequence.exercices = objectif.exercices
              objectifSequence.exercicesDeBrevet = objectif.exercicesDeBrevet
              objectifSequence.theme = objectif.theme
              objectifSequence.niveau = objectif.niveau
              objectifSequence.fiches = objectif.fiches
              break
            }
          }
        }
      }
    }
    if (objectifSequence.titre === undefined || objectifSequence.titre === '') {
      console.error('L\'objectif ' + objectifSequence.reference + ' de la séquence ' + sequence.titre + ' n\'a pas été trouvé.')
      nombreErreurs++
    }
  }
  return sequence.objectifs
}

function getCalculsMentauxAvecInfos (sequence: SequenceSequence, niveauxObjectifs: ObjectifNiveau[]) {
  if (sequence.calculsMentaux === undefined) return []
  for (const calculMental of sequence.calculsMentaux) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (calculMental.reference === objectif.reference) {
              if (calculMental.titre === undefined || calculMental.titre === '') {
                calculMental.titre = objectif.titre
                calculMental.titreSimplifie = objectif.titreSimplifie
              }
              calculMental.exercices = calculMental.exercices ?? []
              calculMental.pageExiste = true
              calculMental.theme = objectif.theme
              break
            }
          }
        }
      }
    }
  }
  return sequence.calculsMentaux
}

function getQuestionsFlashAvecInfos (sequence: SequenceSequence, niveauxObjectifs: ObjectifNiveau[]) {
  if (sequence.questionsFlash === undefined) return []
  for (const questionFlash of sequence.questionsFlash) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (questionFlash.reference === objectif.reference) {
              if (questionFlash.titre === undefined || questionFlash.titre === '') {
                questionFlash.titre = objectif.titre
                questionFlash.titreSimplifie = objectif.titreSimplifie
              }
              questionFlash.slug = questionFlash.slug ?? ''
              questionFlash.pageExiste = true
              questionFlash.theme = objectif.theme
              break
            }
          }
        }
      }
    }
  }
  return sequence.questionsFlash
}

function getLienEval (sequence: SequenceSequence, niveauxObjectifs: ObjectifNiveau[]) {
  const slugsObjectif = getSlugsObjectifsSequence(sequence, niveauxObjectifs)
  if (slugsObjectif.length === 0) return ''
  let lienEval = environment.baseUrl + environment.V3
  for (const slug of slugsObjectif) {
    lienEval = lienEval.concat(slug, '&')
  }
  lienEval.slice(0, -1)
  return lienEval
}

function ajouterReferenceFiches (sequence: SequenceSequence) {
  for (const objectifSequence of sequence.objectifs) {
    if (objectifSequence.fiches.length > 0) {
      let numeroFiche = 1
      for (const fiche of objectifSequence.fiches) {
        if (fiche.niveaux.length === 0 || fiche.niveaux.includes(sequence.niveau)) {
          const nbFiches = getNbFiches(objectifSequence, sequence.niveau)
          fiche.reference = objectifSequence.reference + (nbFiches > 1 ? '-' + numeroFiche : '')
          numeroFiche++
        }
      }
    }
  }
}

function getNbFiches (objectif: SequenceObjectif, niveauSequence: string) {
  let nbFiches = 0
  for (const fiche of objectif.fiches) {
    if (fiche.niveaux.length === 0) nbFiches++
    else {
      for (const niveauFiche of fiche.niveaux) {
        if (niveauFiche === niveauSequence) nbFiches++
      }
    }
  }
  return nbFiches
}

function majTelechargementsDisponibles () {
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.sequences) {
      sequence.telechargementsDisponibles = {
        cours: fs.existsSync(cheminFichier('cours', sequence.reference)),
        resume: fs.existsSync(cheminFichierLegacy('resume', sequence.reference)),
        mission: fs.existsSync(cheminFichierLegacy('mission', sequence.reference)),
        fiche: presenceFicheSequence(sequence)
      }
    }
  }
  return niveauxSequences
}

function postTraitementObjectifs () {
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.sousThemes) {
        for (const objectif of sousTheme.objectifs) {
          objectif.telechargementsDisponibles.niveauxFiches = getNiveauxFichesDisponibles(objectif)
        }
      }
    }
  }
}

function checkSequences (referencesObjectifsSequences: string[], referencesObjectifs: string[]) {
  checkDoublonsBrevet()
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.sequences) {
      for (const objectif of sequence.objectifs) {
        if (!referencesObjectifs.includes(objectif.reference)) {
          console.warn(sequence.reference + ' comporte l\'objectif ' + objectif.reference + ' qui n\'existe pas')
          nombreDeWarnings++
        }
      }
      for (const calculMental of sequence.calculsMentaux) {
        if ((calculMental.reference !== undefined && calculMental.reference !== '') && (calculMental.titre === undefined || calculMental.titre === '')) {
          console.warn('L\'objectif lié à un calcul mental de ' + sequence.reference + ' n\'existe pas')
          nombreDeWarnings++
        }
      }
      for (const questionFlash of sequence.questionsFlash) {
        if (questionFlash.titre === undefined || questionFlash.titre === '') {
          console.warn('L\'objectif lié à une question flash de ' + sequence.reference + ' n\'existe pas')
          nombreDeWarnings++
        }
      }
      if (sequence.telechargementsDisponibles.cours === false) {
        console.warn('Cours de ' + sequence.reference + ' manquant')
        nombreDeWarnings++
      }
    }
  }
}

function checkDoublonsBrevet () {
  const listeExercicesDeBrevet: string[] = []
  for (const niveau of niveauxSequences) {
    for (const sequence of niveau.sequences) {
      if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== '') {
        const listeExosAvecEx = sequence.slugEvalBrevet.split('&')
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
        sequence.slugEvalBrevet = ''
      }
    }
  }
}

function checkObjectifs (referencesObjectifsSequences: string[], referencesObjectifs: string[]) {
  checkSitesAbsentsPolitiqueDeConfidentialite()
  checkReferencesEnDoublon(referencesObjectifs)
  for (const niveau of niveauxObjectifs) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.sousThemes) {
        for (const objectif of sousTheme.objectifs) {
          if (objectif.periode < 1) {
            console.warn(objectif.reference + ' n\'a pas de période')
            nombreDeWarnings++
          }
          if (!referencesObjectifsSequences.includes(objectif.reference)) {
            console.warn(objectif.reference + ' n\'est lié à aucune séquence')
            nombreDeWarnings++
          }
          if ((objectif.rappelDuCoursImage === undefined || objectif.rappelDuCoursImage === '') &&
            (objectif.rappelDuCoursHTML === undefined || objectif.rappelDuCoursHTML === '') &&
            (objectif.rappelDuCoursInstrumenpoche === undefined || objectif.rappelDuCoursInstrumenpoche === '')) {
            console.warn(objectif.reference + ' n\'a pas de rappel de cours')
            nombreDeWarnings++
          }
          if (objectif.videos.length === 0) {
            console.warn(objectif.reference + ' n\'a pas de vidéo')
            nombreDeWarnings++
          }
          if (objectif.exercices.length === 0) {
            console.warn(objectif.reference + ' n\'a pas d\'exercice')
            nombreDeWarnings++
          } else {
            if (presenceExerciceMathalea(objectif.exercices)) {
              if (objectif.telechargementsDisponibles.entrainement === false) {
                console.warn('Entraînement de ' + objectif.reference + ' manquant')
                nombreDeWarnings++
              }
              if (objectif.telechargementsDisponibles.test === false) {
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
      for (const sousTheme of theme.sousThemes) {
        for (const objectif of sousTheme.objectifs) {
          for (const exercice of objectif.exercices) {
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

function presenceExerciceMathalea (exercices: ObjectifExercice[]) {
  for (const exercice of exercices) {
    if (exercice.lien.slice(0, 'https://coopmaths.fr/'.length) === 'https://coopmaths.fr/') return true
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

function getSlugsObjectifsSequence (sequence: SequenceSequence, niveauxObjectifs: ObjectifNiveau[]) {
  const slugsObjectif: string[] = []
  for (const objectifSequence of sequence.objectifs) {
    for (const niveauObjectif of niveauxObjectifs) {
      for (const theme of niveauObjectif.themes) {
        for (const sousTheme of theme.sousThemes) {
          for (const objectif of sousTheme.objectifs) {
            if (objectifSequence.reference === objectif.reference) {
              for (const exercice of objectif.exercices) {
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

function presenceFicheObjectif (objectif: SequenceObjectif) {
  return objectif.fiches.length > 0
}

function getNiveauxFichesDisponibles (objectif: ObjectifObjectif): StringGrade[] {
  const niveauxDisponibles: StringGrade[] = []
  for (const fiche of objectif.fiches) {
    if (fiche.niveaux.length === 0) {
      if (!niveauxDisponibles.includes(objectif.niveau)) niveauxDisponibles.push(objectif.niveau)
    } else {
      for (const niveau of fiche.niveaux) {
        if (!niveauxDisponibles.includes(niveau)) niveauxDisponibles.push(niveau)
      }
    }
  }
  return niveauxDisponibles
}

function presenceFicheSequence (sequence: SequenceSequence) {
  for (const objectif of sequence.objectifs) {
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
