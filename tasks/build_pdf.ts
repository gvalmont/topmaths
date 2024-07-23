import * as fs from 'fs'
import * as path from 'path'
import { exec } from 'child_process'
import { isStringGrade, type StringGrade } from '../src/topmaths/types/shared.js'
import type { ObjectiveLessonPlan } from '../src/topmaths/types/objective.js'
import { isUnits, type Unit, type UnitObjective } from '../src/topmaths/types/unit.js'
import units from '../src/topmaths/json/sequences_modifiees.json' assert { type: 'json' }

let fichePrecedenteSequence: ObjectiveLessonPlan = {
  startSteps: [],
  lessonSteps: [],
  homeworks: [],
  closureSteps: [],
  studentMaterialsNeeded: [],
  teacherMaterialsNeeded: [],
  grades: [],
  comments: [],
  nextSessionSteps: [],
  reference: ''
}
const fichesPrecedentes = {
  '6e': { ...fichePrecedenteSequence },
  '5e': { ...fichePrecedenteSequence },
  '4e': { ...fichePrecedenteSequence },
  '3e': { ...fichePrecedenteSequence },
  none: { ...fichePrecedenteSequence }
}

if (!isUnits(units)) {
  console.error(units)
  throw new Error('The JSON file does not contain an array of units')
}

for (const unit of units) {
  if (coursDeUnObjectifTrouve(unit)) genererTypCoursSequence(unit)
  genererTypFichesSequence(unit)
}
compilerTyp()

function coursDeUnObjectifTrouve (sequence: Unit): boolean {
  for (const objectif of sequence.objectives) {
    if (fs.existsSync(`./src/topmaths/typ/cours/objectifs/${objectif.grade}/${objectif.reference}.typ`)) return true
  }
  return false
}

function genererTypCoursSequence (sequence: Unit): void {
  let typCoursSequence = ''
  typCoursSequence += `#import "../../../preambule_sequence.typ": * 
`
  typCoursSequence += creerEnTete(sequence)
  for (const objectif of sequence.objectives) {
    typCoursSequence += genererTypCoursObjectif(objectif, sequence)
  }
  typCoursSequence = replaceImportedLessons(typCoursSequence, sequence)
  const directory = `./src/topmaths/typ/cours/sequences/${sequence.grade}/`
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(`${directory}${sequence.reference}.typ`, typCoursSequence, 'utf8')
}

function creerEnTete (sequence: Unit): string {
  let enTete = `#show: setup-emoji
#show: doc => sequence(doc, title: "Séquence ${sequence.number} : ${sequence.title}")
#objectifs()[
`
  for (const objectif of sequence.objectives) {
    const estObjectifExtra = objectif.reference.slice(1, 2) !== 'X'
    if (estObjectifExtra) {
      enTete += `
        - ${objectif.reference} : ${objectif.title === undefined || objectif.title === '' ? objectif.titleAcademic : objectif.title}`
    }
  }
  enTete += `
  ]
`
  return enTete
}

function genererTypCoursObjectif (objectif: UnitObjective, sequence: Unit): string {
  if (!fs.existsSync(`./src/topmaths/typ/cours/objectifs/${objectif.grade}/${objectif.reference}.typ`)) return ''
  let typObjectif = ''
  const titreObjectif = `
= ${objectif.title === undefined || objectif.title === '' ? objectif.titleAcademic : objectif.title}
`
  const coursObjectif = fs.readFileSync(`./src/topmaths/typ/cours/objectifs/${objectif.grade}/${objectif.reference}.typ`, 'utf8')
  if (coursObjectif.includes('image("')) copierImages(objectif, sequence)
  typObjectif += titreObjectif
  typObjectif += coursObjectif
  return typObjectif
}

function copierImages (objectif: { grade: StringGrade; reference: string; }, sequence: Unit): void {
  const sourceDir = `./src/topmaths/typ/cours/objectifs/${objectif.grade}/`
  const destinationDir = `./src/topmaths/typ/cours/sequences/${sequence.grade}/`
  const filePrefix = objectif.reference
  const fileExtension = '.png'
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }

    files.forEach(file => {
      if (file.startsWith(filePrefix) && file.endsWith(fileExtension)) {
        const sourceFilePath = path.join(sourceDir, file)
        const destinationFilePath = path.join(destinationDir, file)

        fs.copyFile(sourceFilePath, destinationFilePath, err => {
          if (err) {
            console.error('Error copying file:', err)
          }
        })
      }
    })
  })
}

function replaceImportedLessons (text: string, sequence: Unit): string {
  const importedLessonReferences = getImportedLessonReferences(text)
  for (const importedLessonReference of importedLessonReferences) {
    const levelCandidate = `${importedLessonReference.slice(0, 1)}e`
    const level = isStringGrade(levelCandidate) ? levelCandidate : 'none'
    const importedLesson = fs.readFileSync(`./src/topmaths/typ/cours/objectifs/${level}/${importedLessonReference}.typ`, 'utf8')
    if (importedLesson.includes('image("')) copierImages({ grade: level, reference: importedLessonReference }, sequence)
    text = text.replace(new RegExp(`##${importedLessonReference}`, 'g'), importedLesson)
  }
  return text
}

function getImportedLessonReferences (text: string): string[] {
  const regex = /##(\w+)/g
  const matches: string[] = []
  const importedLessonReferences: string[] = []

  let match: RegExpExecArray | null
  while ((match = regex.exec(text)) !== null) {
    const name = match[1]
    if (!importedLessonReferences.includes(name)) {
      matches.push(name)
      importedLessonReferences.push(name)
    }
  }
  return importedLessonReferences
}

function genererTypFichesSequence (sequence: Unit): void {
  let nbFichesObjectifs = 0
  for (const objectifSequence of sequence.objectives) {
    if (objectifSequence.lessonPlans.length > 0) {
      genererTypFichesObjectif(objectifSequence, sequence.grade)
      nbFichesObjectifs++
    }
  }
  if (nbFichesObjectifs > 0) genererTypFicheSequence(sequence)
}

function genererTypFichesObjectif (objectif: UnitObjective, niveauSequence: StringGrade): void {
  let indiceFiche = 0
  for (const fiche of objectif.lessonPlans) {
    if (fiche.grades.length === 0 || fiche.grades.includes(niveauSequence)) {
      genererTypFicheObjectif(niveauSequence, objectif, fiche, indiceFiche)
      fichesPrecedentes[niveauSequence] = fiche
      indiceFiche++
    }
  }
}

function genererTypFicheObjectif (niveauSequence: StringGrade, objectif: UnitObjective, fiche: ObjectiveLessonPlan, indiceFiche: number): void {
  const nombreTotalDeFiches = getNbFiches(objectif, niveauSequence)
  const plusieursFiches = nombreTotalDeFiches > 1
  const numeroFiche = indiceFiche + 1
  const sousTitre = `Fiche de séance${plusieursFiches ? ' ' + numeroFiche + ' / ' + nombreTotalDeFiches : ''}`
  fiche.reference = objectif.reference + (plusieursFiches ? '-' + numeroFiche : '')
  if (fichesPrecedentes[niveauSequence].reference !== '') remplacerPlaceholderMateriel(fiche, niveauSequence)
  let typObjectif = ''
  typObjectif += `#import "../../../preambule_fiche.typ": *
`
  typObjectif += `#show: setup-emoji
#show: doc => fiche(doc, titre: "${objectif.reference} : ${objectif.title}", sousTitre: "${sousTitre}")

`
  typObjectif += getTypLignes('Matériel élève', fiche.studentMaterialsNeeded)
  typObjectif += getTypLignes('Matériel enseignant', fiche.teacherMaterialsNeeded)
  if (fichesPrecedentes[niveauSequence].nextSessionSteps.length > 0) {
    typObjectif += getTypLignes('Suite à la séance précédente', fichesPrecedentes[niveauSequence].nextSessionSteps)
  }
  typObjectif += getTypLignes('Début de séance', fiche.startSteps)
  typObjectif += getTypLignes('Déroulé', fiche.lessonSteps)
  typObjectif += getTypLignes('Devoirs', fiche.homeworks)
  typObjectif += getTypLignes('Fin de séance', fiche.closureSteps)
  typObjectif += 'placeholderMateriel'
  typObjectif += getTypLignes('Notes', fiche.comments)
  const directory = `./src/topmaths/typ/fiches/objectifs/${objectif.grade}/`
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(`${directory}${niveauSequence}_${fiche.reference}.typ`, typObjectif, 'utf8')
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

function remplacerPlaceholderMateriel (fiche: ObjectiveLessonPlan, niveauSequence: StringGrade): void {
  const cheminFichePrecedente = `./src/topmaths/typ/fiches/objectifs/${fichesPrecedentes[niveauSequence].reference.slice(0, 1) + 'e'}/${niveauSequence}_${fichesPrecedentes[niveauSequence].reference}.typ`
  const data = fs.readFileSync(cheminFichePrecedente, 'utf8')
  let replacementString = ''
  if (fiche.studentMaterialsNeeded.length > 0) {
    replacementString += `#titreCategorie("Matériel à emmener la prochaine fois") :\\
`
    for (const materiel of fiche.studentMaterialsNeeded) {
      replacementString += `- ${materiel}\\
`
    }
  }
  const updatedData = data.replace('placeholderMateriel', replacementString)
  fs.writeFileSync(cheminFichePrecedente, updatedData, 'utf8')
}

function getTypLignes (titre: string, lignes: string[]): string {
  let typLignes = ''
  if (lignes.length > 0) {
    if (titre !== '') {
      typLignes += `#titreCategorie("${titre}") :\\
`
    }
    for (const ligne of lignes) {
      if (titre === 'Matériel enseignant') {
        if (ligne.includes('_Cours') || ligne.includes('_Fiche') || ligne.includes('_Poly') || ligne.includes('_Presentation') || ligne.includes('Entrainement_') || ligne.includes('_Diaporama') || ligne.includes('_Geogebra')) {
          const mots = ligne.split(' ')
          const nomFichier = mots.shift()
          let reste = ''
          if (mots[0] !== undefined) reste = mots.join(' ')
          typLignes += `- #lien("${nomFichier}")${reste !== '' ? ' ' + reste : ''}\\
`
        } else {
          typLignes += `- ${ligne}\\
`
        }
      } else {
        const indentLevel = getIndentLevel(ligne)
        const lineWithoutLeadingHyphens = removeLeadingHyphens(ligne)
        for (let i = 0; i < indentLevel; i++) {
          typLignes += '  '
        }
        typLignes += `  - ${lineWithoutLeadingHyphens}\\
`
      }
    }
  }
  return typLignes
  function getIndentLevel (str: string): number {
    let count = 0
    for (let i = 0; i < str.length && str[i] === '-'; i++) {
      count++
    }
    return count
  }
  function removeLeadingHyphens (str: string): string {
    return str.replace(/^[-]+/, '')
  }
}

function genererTypFicheSequence (sequence: Unit): void {
  let typSequence = ''
  typSequence += `#import "../../../preambule_fiche.typ": *
`
  typSequence += `#show: setup-emoji
#show: doc => fiche(doc, titre: "Séquence ${sequence.number} : ${sequence.title}", sousTitre: "Fiche de séquence", paysage: true)

#table(
  columns: 1,
  inset: 0pt,
  align: horizon,
  `
  let numeroSeance = 1
  for (const objectif of sequence.objectives) {
    for (const fiche of objectif.lessonPlans) {
      typSequence += `[ #titreObjectif("Séance ${numeroSeance} - ${objectif.reference} : ${objectif.title}")\\
#v(-2em)
#block(inset: 10pt, [
`
      typSequence += getTypLignes('Matériel élève', fiche.studentMaterialsNeeded)
      typSequence += getTypLignes('Matériel enseignant', fiche.teacherMaterialsNeeded)
      if (fichePrecedenteSequence.nextSessionSteps.length > 0) {
        typSequence += getTypLignes('Suite à la séance précédente', fichePrecedenteSequence.nextSessionSteps)
      }
      typSequence += getTypLignes('Début de séance', fiche.startSteps)
      typSequence += getTypLignes('Déroulé', fiche.lessonSteps)
      typSequence += getTypLignes('Devoirs', fiche.homeworks)
      typSequence += getTypLignes('Fin de séance', fiche.closureSteps)
      typSequence += '])], '
      fichePrecedenteSequence = fiche
      numeroSeance++
    }
  }
  typSequence = typSequence.slice(0, typSequence.length - 2) + ')'
  const directory = `./src/topmaths/typ/fiches/sequences/${sequence.grade}/`
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(`${directory}${sequence.reference}.typ`, typSequence, 'utf8')
}

function compilerTyp (): void {
  runShellScript('tasks/compilerTyp.sh', () => {
    copierAutresPdf()
  })
}

function copierAutresPdf (): void {
  runShellScript('tasks/copierAutresPdf.sh', () => {})
}

function runShellScript (scriptPath: string, callback: () => void): void {
  const child = exec(scriptPath, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing ${scriptPath}: ${error.message}`)
      console.error(stderr) // Log the standard error output
      return
    }
    // Log the standard output
    console.log(`${scriptPath} output:
${stdout}`)
    callback()
  })

  child.on('exit', (code) => {
    console.log(`${scriptPath} exited with code ${code}`)
  })
}
