import { readFileSync } from 'fs'
import * as fs from 'fs'
import * as path from 'path'
import { isArray } from 'mathjs'
import refToUuid from '../src/json/refToUuid.json' assert { type: 'json' }

const niveauxSequencesJson = JSON.parse(readFileSync('./src/topmaths/json/sequences.json').toString())
const niveauxObjectifsJson = JSON.parse(readFileSync('./src/topmaths/json/objectifs.json').toString())
const lexiqueJson = JSON.parse(readFileSync('./src/topmaths/json/lexique.json').toString())

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

let niveauxObjectifs = []
let niveauxSequences = []
let lexique = []
let numeroExercice = 1
let nombreDeWarnings = 0
let nombreErreurs = 0
preChecksDeRoutine()
miseEnCacheNiveauxEtSequences()
miseEnCacheLexique()
checksDeRoutine()
console.warn(nombreDeWarnings + ' warnings')
console.error(nombreErreurs + ' erreurs')
ecrireJson('objectifs_modifies', niveauxObjectifs)
ecrireJson('sequences_modifiees', niveauxSequences)
ecrireJson('lexique_modifie', lexique)

function miseEnCacheNiveauxEtSequences () {
  niveauxSequences = preTraitementSequences(niveauxSequencesJson)
  niveauxObjectifs = preTraitementObjectifs(niveauxObjectifsJson)
  niveauxSequences = postTraitementSequences(niveauxSequences, niveauxObjectifs)
  postTraitementObjectifs()
}

function preChecksDeRoutine () {
  preCheckSequences()
  preCheckObjectifs()
  preCheckLexique()
}

function preCheckSequences () {
  let numeroSequence = 1
  for (const niveau of niveauxSequencesJson) {
    numeroSequence = 1
    for (const sequence of niveau.sequences) {
      const referenceSequence = `S${niveau.nom.slice(0, 1)}S${numeroSequence}`
      if (niveau.nom === '3e' && (sequence.slugEvalBrevet === undefined || sequence.slugEvalBrevet === '')) {
        console.warn(referenceSequence + ' n\'a pas de slugEvalBrevet')
        sequence.slugEvalBrevet = ''
        nombreDeWarnings++
      }
      if (sequence.slugEvalBrevet !== undefined && sequence.slugEvalBrevet !== '' && sequence.slugEvalBrevet.slice(0, 3) !== 'ex=') {
        console.warn('Le slugEvalBrevet de ' + referenceSequence + ' ne commence pas par ex=')
        nombreDeWarnings++
      }
      if (sequence.periode === undefined || isNaN(sequence.periode) || Number(sequence.periode) === 0) {
        console.warn(referenceSequence + ' n\'a pas de période')
        sequence.periode = 0
        nombreDeWarnings++
      }
      if (sequence.titre.slice(sequence.titre.length - 1) === '.') {
        console.warn('Le titre de ' + referenceSequence + ' se termine par un point')
        nombreDeWarnings++
      }
      numeroSequence++
    }
  }
}

function preCheckObjectifs () {
  for (const niveau of niveauxObjectifsJson) {
    for (const theme of niveau.themes) {
      for (const sousTheme of theme.sousThemes) {
        for (const objectif of sousTheme.objectifs) {
          if (objectif.titre.slice(objectif.titre.length - 1) === '.') {
            console.warn('Le titre de ' + objectif.reference + ' se termine par un point')
            nombreDeWarnings++
          }
          for (const exercice of objectif.exercices) {
            if (exercice.slug.slice(0, 'https://mathsmentales.net'.length) !== 'https://mathsmentales.net' && exercice.slug.includes('i=')) {
              console.warn('Un slug de ' + objectif.reference + ' contient i=')
              nombreDeWarnings++
            }
            if (exercice.slug.slice(0, 3) === 'ex=') {
              console.warn('Un slug de ' + objectif.reference + ' commence par ex=')
              nombreDeWarnings++
            }
            if (exercice.slug.slice(0, 4) === '&ex=') {
              console.warn('Un slug de ' + objectif.reference + ' commence par &ex=')
              nombreDeWarnings++
            }
            if (objectif.exercices.length > 1 && (exercice.description === undefined || exercice.description === '')) {
              console.warn('Un exercice de ' + objectif.reference + ' ne comporte pas de description alors qu\'il comporte plusieurs exercices')
              exercice.description = ''
              nombreDeWarnings++
            }
          }
        }
      }
    }
  }
}

function preCheckLexique () {
  for (const definition of lexiqueJson.definitions) {
    preCheckItem(definition)
  }
  for (const propriete of lexiqueJson.proprietes) {
    preCheckItem(propriete)
  }
}

function preCheckItem (item) {
  if (isArray(item.notionsLiees)) {
    if (item.notionsLiees[0] !== undefined && typeof item.notionsLiees[0] !== 'object') {
      console.error('Les notionsLiees de ' + item.titres[0] + ' ne sont pas des objets')
      nombreErreurs++
    }
  } else {
    console.error('Les notionsLiees de ' + item.titres[0] + ' n\'est pas un array')
    nombreErreurs++
  }
}

function preTraitementSequences (niveaux) {
  for (const niveau of niveaux) {
    let numeroDeSequence = 1
    for (const sequence of niveau.sequences) {
      sequence.niveau = niveau.nom
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
        mission: false
      }
      numeroDeSequence++
    }
  }
  return niveaux
}

function preTraitementObjectifs (niveaux) {
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
            objectif.niveau = objectif.reference.slice(0, 1) + 'e'
          }
        }
      }
    }
  }
  return ajouterObjectifsParThemeParPeriode(niveaux)
}

function postTraitementSequences (
  niveauxSequences,
  niveauxObjectifs
) {
  for (const niveauSequence of niveauxSequences) {
    for (const sequence of niveauSequence.sequences) {
      sequence.objectifs = getObjectifsAvecInfos(sequence, niveauxObjectifs)
      sequence.calculsMentaux = getCalculsMentauxAvecInfos(sequence, niveauxObjectifs)
      sequence.questionsFlash = getQuestionsFlashAvecInfos(sequence, niveauxObjectifs)
      sequence.lienEval = getLienEval(sequence, niveauxObjectifs)
      ajouterReferenceFiches(sequence)
    }
  }
  niveauxSequences = majTelechargementsDisponibles(niveauxSequences)
  return niveauxSequences
}

function miseEnCacheLexique () {
  const items = []
  for (const definition of lexiqueJson.definitions) {
    const item = definition
    item.type = 'definition'
    items.push(...traiterItem(item))
  }
  for (const propriete of lexiqueJson.proprietes) {
    const item = propriete
    item.type = 'propriete'
    items.push(...traiterItem(item))
  }
  lexique = postTraitementItems(items)
}

function traiterItem (item) {
  item.niveau = item.objectifsLies[0].slice(0, 1) + 'e'
  item.contenu = interpreterMarkupPerso(item.contenu)
  item.exemples = interpreterMarkupArray(item.exemples)
  item.remarques = interpreterMarkupArray(item.remarques)
  return creerSousItems(item)
}

function interpreterMarkupPerso (contenu) {
  contenu = contenu.replaceAll('rouge[[', '<span class=\'rouge\'>')
  contenu = contenu.replaceAll('vert[[', '<span class=\'vert\'>')
  contenu = contenu.replaceAll('noir[[', '<span class=\'noir\'>')
  contenu = contenu.replaceAll('bleu[[', '<span class=\'bleu\'>')
  contenu = contenu.replaceAll('[[', '<span class=\'mot-defini\'>')
  contenu = contenu.replaceAll(']]', '</span>')
  return contenu
}

function interpreterMarkupArray (array) {
  if (array === undefined || array.length === 0) {
    return []
  } else {
    return array.map(item => interpreterMarkupPerso(item))
  }
}

function creerSousItems (item) {
  const items = []
  const slugsSousItemsDejaCrees = []
  for (const titre of item.titres) {
    const newItem = { ...item }
    newItem.titre = titre
    newItem.slug = creerSlug(titre)
    newItem.avecImage = fs.existsSync(`public/topmaths/img/lexique/${newItem.slug}.png`)
    newItem.notionsLiees = ajouterSlugsSousItemsDejaCrees(item, slugsSousItemsDejaCrees)
    slugsSousItemsDejaCrees.push(newItem.slug)
    items.push(newItem)
  }
  return items
}

function creerSlug (titre) {
  const normalizedStr = titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const slug = normalizedStr
    .replace(/\s+/g, '-')
    .replace(/'+/g, '')
    .toLowerCase()

  return slug
}

function ajouterSlugsSousItemsDejaCrees (item, slugsItem) {
  return item.notionsLiees.concat(slugsItem.map(slug => ({ slug })))
}

function postTraitementItems (items) {
  items = completerNotionsLiees(items)
  items = ajouterTitresAuxNotions(items)
  items = rangerNotionsLiees(items)
  items = items.sort(comparerTitres)
  return items
}

function completerNotionsLiees (items) {
  for (const item1 of items) {
    for (const notionLieeItem1 of item1.notionsLiees) {
      let trouve = false
      for (const item2 of items) {
        if (item2.slug === notionLieeItem1.slug) {
          trouve = true
          if (!notionLieeDejaAjoutee(item1.slug, item2)) {
            const nouvelleNotion = { slug: item1.slug }
            item2.notionsLiees.push(nouvelleNotion)
          }
          break
        }
      }
      if (!trouve) {
        console.error('La notion liée ' + notionLieeItem1.slug + ' de ' + item1.titre + ' n\'existe pas')
        nombreErreurs++
      }
    }
  }
  return items
}

function notionLieeDejaAjoutee (slugNotion, item) {
  for (const notionLiee of item.notionsLiees) {
    if (notionLiee.slug === slugNotion) return true
  }
  return false
}

function ajouterTitresAuxNotions (items) {
  for (const item1 of items) {
    for (const notionLieeItem1 of item1.notionsLiees) {
      for (const item2 of items) {
        if (item2.slug === notionLieeItem1.slug) {
          notionLieeItem1.titre = item2.titre
          break
        }
      }
    }
  }
  return items
}

function rangerNotionsLiees (items) {
  for (const item of items) {
    if (item.notionsLiees === undefined || item.notionsLiees.length === 0) {
      item.notionsLiees = []
    } else {
      item.notionsLiees = item.notionsLiees.sort(comparerTitres)
    }
  }
  return items
}

function comparerTitres (a, b) {
  const titreA = a.titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()
  const titreB = b.titre.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase()

  if (titreA < titreB) {
    return -1
  }
  if (titreA > titreB) {
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
  const references = []
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
  const references = []
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

function getCalculsMentauxAvecLiensEtIdDesExercices (sequence) {
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

function getLienQuestionsFlash (sequence) {
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

function getLienEvalBrevet (sequence) {
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

function trouverPeriode (objectif) {
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

function getRappelDuCoursImage (objectif) {
  if (objectif.rappelDuCoursImage === '' || objectif.rappelDuCoursImage === undefined) {
    return ''
  } else {
    return '../topmaths/img/' + objectif.rappelDuCoursImage
  }
}

function getLienExercices (exercices) {
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

function getExercicesAvecLienEtId (reference, exercices) {
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

function getFiches (fiches) {
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

function getSequences (objectif) {
  const listeDesSequences = []
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

function ajouterObjectifsParThemeParPeriode (niveaux) {
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

function getObjectifsAvecInfos (sequence, niveauxObjectifs) {
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

function getCalculsMentauxAvecInfos (sequence, niveauxObjectifs) {
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

function getQuestionsFlashAvecInfos (sequence, niveauxObjectifs) {
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

function getLienEval (sequence, niveauxObjectifs) {
  const slugsObjectif = getSlugsObjectifsSequence(sequence, niveauxObjectifs)
  if (slugsObjectif.length === 0) return ''
  let lienEval = environment.baseUrl + environment.V3
  for (const slug of slugsObjectif) {
    lienEval = lienEval.concat(slug, '&')
  }
  lienEval.slice(0, -1)
  return lienEval
}

function ajouterReferenceFiches (sequence) {
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

function getNbFiches (objectif, niveauSequence) {
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

function checkSequences (referencesObjectifsSequences, referencesObjectifs) {
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
  const listeExercicesDeBrevet = []
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

function checkObjectifs (referencesObjectifsSequences, referencesObjectifs) {
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
  const listeHTTP = []
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
  const listeAbsents = []
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

function checkReferencesEnDoublon (references) {
  const referencesEnDoublon = []
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

function presenceExerciceMathalea (exercices) {
  for (const exercice of exercices) {
    if (exercice.lien.slice(0, 'https://coopmaths.fr/'.length) === 'https://coopmaths.fr/') return true
  }
  return false
}

function checkLexique () {
  const slugs = []
  for (const item of lexique) {
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
function getLienExercice (slug, calculMental = false) {
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

function estMathsMentales (url) {
  return url.slice(0, 25) === 'https://mathsmentales.net'
}

function estCoopmaths (url) {
  const urlCoopmaths = environment.baseUrl
  return url.slice(0, urlCoopmaths.length) === environment.baseUrl
}

function estV2 (url) {
  const urlV2 = environment.baseUrl + environment.V2
  return url.slice(0, urlV2.length) === urlV2
}

function estV3 (url) {
  const urlV3 = environment.baseUrl + environment.V3
  return url.slice(0, urlV3.length) === urlV3
}

function conversionV2enV3 (url) {
  url = url.replaceAll('mathalea.html', 'alea/')
  url = url.replaceAll('ex=dnb', 'uuid=dnb')
  url = url.replaceAll('ex=', 'id=')
  url = url.replaceAll(',i=', '&i=')
  url = url.replaceAll(',n=', '&n=')
  url = url.replaceAll(',v=', '&v=')
  url = url.replaceAll(',s=', '&s=')
  url = url.replaceAll(',s2=', '&s2=')
  url = url.replaceAll(',s3=', '&s3=')
  url = url.replaceAll(',s4=', '&s4=')
  url = url.replaceAll(',cd=', '&cd=')
  return url
}

function getSlugsObjectifsSequence (sequence, niveauxObjectifs) {
  const slugsObjectif = []
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

function formaterSlug (slug) {
  if (slug === '') return ''
  if (slug.slice(0, 4) === 'uuid') return slug
  if (slug.slice(0, 2) === 'id') return ajouterUuid(slug)
  if (slug.slice(0, 4) !== 'http') return conversionV2enV3('ex=' + slug)
  if (estV2(slug)) return ajouterUuid(conversionV2enV3(slug)).slice((environment.baseUrl + environment.V3).length)
  if (estV3(slug)) return ajouterUuid(slug).slice((environment.baseUrl + environment.V3).length)
  else return slug
}

function ajouterUuid (slug) {
  return 'uuid=' + getUuid(slug.split('&')[0].split(',')[0].split('=')[1]) + '&' + slug
}
function getUuid (id) {
  return refToUuid[id]
}

function cheminFichierLegacy (type, reference) {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${type.charAt(0).toUpperCase() + type.slice(1)}_${reference}.pdf`
}

function presenceFicheObjectif (objectif) {
  return objectif.fiches.length > 0
}

function getNiveauxFichesDisponibles (objectif) {
  const niveauxDisponibles = []
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

function presenceFicheSequence (sequence) {
  for (const objectif of sequence.objectifs) {
    if (presenceFicheObjectif(objectif)) return true
  }
  return false
}

function cheminFichier (type, reference) {
  return `./public/topmaths/${type}/${reference.charAt(0) === 'S' ? reference.slice(1, 2) : reference.slice(0, 1)}e/${reference}_${type.charAt(0).toUpperCase() + type.slice(1)}.pdf`
}

function ecrireJson (nomDuFichier, fichier) {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', nomDuFichier + '.json'), JSON.stringify(fichier, null, 2))
}
