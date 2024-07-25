import * as fs from 'fs'
import * as path from 'path'
import { spawn } from 'child_process'
import { deepCopy, isStringGrade, type StringGrade } from '../src/topmaths/types/shared.js'
import { emptyUnitLessonPlan, isUnits, type UnitLessonPlan, type Unit, type UnitObjective } from '../src/topmaths/types/unit.js'
import units from '../src/topmaths/json/sequences_modifiees.json' assert { type: 'json' }
import { countLessonPlans } from './helpers/lesson_plans.js'
import { buildGradeFromObjectiveReference } from '../src/topmaths/services/environment.js'

const TYP = './src/topmaths/typ'
const LESSONS = 'cours'
const LESSON_PLANS = 'fiches'
const UNITS = 'sequences'
const OBJECTIVES = 'objectifs'
const FILE_KEYWORDS = ['_Cours', '_Fiche', '_Poly', '_Presentation', 'Entrainement_', '_Diaporama', '_Geogebra']

const previousLessonPlans: Record<StringGrade, UnitLessonPlan> = {
  '6e': deepCopy(emptyUnitLessonPlan),
  '5e': deepCopy(emptyUnitLessonPlan),
  '4e': deepCopy(emptyUnitLessonPlan),
  '3e': deepCopy(emptyUnitLessonPlan),
  none: deepCopy(emptyUnitLessonPlan)
}

if (!isUnits(units)) { console.error(units); throw new Error('The JSON file does not contain an array of units') }
deleteDirectory(`${TYP}/${LESSONS}/${UNITS}/`)
deleteDirectory(`${TYP}/${LESSON_PLANS}/`)
for (const unit of units) {
  writeUnitLesson(unit)
  writeUnitLessonPlans(unit)
}
await runShellScript('tasks/compilerTyp.sh')
await runShellScript('tasks/copierAutresPdf.sh')
// end of script

function writeUnitLesson (unit: Unit): void {
  if (!unit.objectives.some(objective => fs.existsSync(`${TYP}/${LESSONS}/${OBJECTIVES}/${objective.grade}/${objective.reference}.typ`))) {
    return
  }
  let content = buildHeader(unit)
  for (const objectif of unit.objectives) {
    content += buildObjectiveLesson(objectif, unit)
  }
  content = replaceImportedLessons(content, unit)
  const directory = `${TYP}/${LESSONS}/${UNITS}/${unit.grade}/`
  const fileName = `${unit.reference}.typ`
  writeFile(directory, fileName, content)
}

function buildHeader (unit: Unit): string {
  let header = `#import "../../../preambule_sequence.typ": * 
#show: setup-emoji
#show: doc => sequence(doc, title: "Séquence ${unit.number} : ${unit.title}")
#objectifs()[
`
  for (const objective of unit.objectives) {
    if (!isIgnored(objective)) {
      header += `
        - ${objective.reference} : ${objective.title === undefined || objective.title === '' ? objective.titleAcademic : objective.title}`
    }
  }
  header += `
  ]
`
  return header
}

function isIgnored (objective: UnitObjective): boolean {
  return objective.reference.slice(1, 2) === 'X'
}

function buildObjectiveLesson (objective: UnitObjective, unit: Unit): string {
  const objectiveLessonPath = `${TYP}/${LESSONS}/${OBJECTIVES}/${objective.grade}/${objective.reference}.typ`
  if (!fs.existsSync(objectiveLessonPath)) return ''
  const title = `
= ${objective.title === undefined || objective.title === '' ? objective.titleAcademic : objective.title}
`
  const content = fs.readFileSync(objectiveLessonPath, 'utf8')
  if (content.includes('image("')) copyImages(objective, unit)
  return title + content
}

function copyImages (objective: Partial<UnitObjective>, unit: Unit): void {
  if (objective.grade === undefined) throw new Error('Unit grade is undefined')
  if (objective.reference === undefined) throw new Error('Unit reference is undefined')
  const sourceDir = `${TYP}/${LESSONS}/${OBJECTIVES}/${objective.grade}/`
  const destinationDir = `${TYP}/${LESSONS}/${UNITS}/${unit.grade}/`
  const filePrefix = objective.reference
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
  const importedLessonReferences = findImportedLessonReferences(text)
  for (const reference of importedLessonReferences) {
    const grade = buildGradeFromObjectiveReference(reference)
    if (!isStringGrade(grade)) throw new Error(`Imported lesson reference incorrect: ${grade}`)
    const importedLesson = fs.readFileSync(`${TYP}/${LESSONS}/${OBJECTIVES}/${grade}/${reference}.typ`, 'utf8')
    if (importedLesson.includes('image("')) copyImages({ grade, reference }, sequence)
    text = text.replace(new RegExp(`##${reference}`, 'g'), importedLesson)
  }
  return text
}

function findImportedLessonReferences (text: string): string[] {
  const regex = /##(\w+)/g
  const matches = text.match(regex) || []
  const uniqueReferences = new Set(matches.map((match: string) => match.slice(2)))
  return Array.from(uniqueReferences)
}

function writeUnitLessonPlans (unit: Unit): void {
  if (unit.objectives.filter(objective => objective.lessonPlans.length > 0).length === 0) {
    return
  }
  unit.objectives.forEach(objective => writeObjectiveLessonPlans(objective, unit.grade))
  writeUnitLessonPlan(unit)
}

function writeObjectiveLessonPlans (objective: UnitObjective, unitGrade: StringGrade): void {
  let lessonPlanCount = 1
  objective.lessonPlans
    .filter(lessonPlan => lessonPlan.grades.length === 0 || lessonPlan.grades.includes(unitGrade))
    .forEach(lessonPlan => {
      const content = buildObjectiveLessonPlan(unitGrade, objective, lessonPlan, lessonPlanCount)
      const directory = `${TYP}/${LESSON_PLANS}/${OBJECTIVES}/${objective.grade}/`
      const fileName = buildFileName(unitGrade, lessonPlan.reference)
      writeFile(directory, fileName, content)
      lessonPlanCount++
    })
}

function buildFileName (unitGrade: StringGrade, lessonPlanReference: string): string {
  return `${unitGrade}_${lessonPlanReference}.typ`
}

function buildObjectiveLessonPlan (unitGrade: StringGrade, objective: UnitObjective, lessonPlan: UnitLessonPlan, lessonPlanCount: number): string {
  const lessonPlanTotalCount = countLessonPlans(objective, unitGrade)
  const subTitle = `Fiche de séance${lessonPlanTotalCount > 1 ? ` ${lessonPlanCount} / ${lessonPlanTotalCount}` : ''}`
  let content = `#import "../../../preambule_fiche.typ": *
`
  content += `#show: setup-emoji
#show: doc => fiche(doc, titre: "${objective.reference} : ${objective.title ? objective.title : objective.titleAcademic}", sousTitre: "${subTitle}")

`
  content += buildCategories(lessonPlan, unitGrade)
  return content
}

function buildCategories (lessonPlan: UnitLessonPlan, unitGrade: StringGrade): string {
  if (previousLessonPlans[unitGrade].reference !== '') replaceMaterialPlaceholder(lessonPlan, unitGrade)
  let content = ''
  content += buildCategory('Matériel élève', lessonPlan.studentMaterialsNeeded)
  content += buildCategory('Matériel enseignant', lessonPlan.teacherMaterialsNeeded)
  if (previousLessonPlans[unitGrade].nextSessionSteps.length > 0) {
    content += buildCategory('Suite à la séance précédente', previousLessonPlans[unitGrade].nextSessionSteps)
  }
  content += buildCategory('Début de séance', lessonPlan.startSteps)
  content += buildCategory('Déroulé', lessonPlan.lessonSteps)
  content += buildCategory('Devoirs', lessonPlan.homeworks)
  content += buildCategory('Fin de séance', lessonPlan.closureSteps)
  content += 'material_placeholder'
  content += buildCategory('Notes', lessonPlan.comments)
  previousLessonPlans[unitGrade] = lessonPlan
  return content
}

function replaceMaterialPlaceholder (lessonPlan: UnitLessonPlan, unitGrade: StringGrade): void {
  const reference = previousLessonPlans[unitGrade].reference
  const path = `${TYP}/${LESSON_PLANS}/${OBJECTIVES}/${buildGradeFromObjectiveReference(reference)}/${buildFileName(unitGrade, reference)}`
  const data = fs.readFileSync(path, 'utf8')
  const materialNeededString = buildCategory('Matériel à emmener la prochaine fois', lessonPlan.studentMaterialsNeeded)
  const updatedData = data.replace('material_placeholder', materialNeededString)
  fs.writeFileSync(path, updatedData, 'utf8')
}

function buildCategory (categoryName: string, contentLines: string[]): string {
  let content = ''
  if (contentLines.length === 0) return content
  if (categoryName !== '') {
    content += `#titreCategorie("${categoryName}") :\\
`
  }
  contentLines.forEach(contentLine => {
    contentLine = addFileLinks(contentLine)
    content += `${buildIdentation(contentLine)}- ${removeLeadingHyphens(contentLine)}\\
`
  })
  return content
}

function addFileLinks (content: string): string {
  if (!FILE_KEYWORDS.some(keyword => content.includes(keyword))) {
    return content
  }
  let words = content.split(' ')
  words = words.map(word => {
    if (FILE_KEYWORDS.some(keyword => word.includes(keyword))) {
      word = `#lien("${word}")`
    }
    return word
  })
  return words.join(' ')
}

function buildIdentation (line: string): string {
  const indentLevelCount = countIndentLevel(line)
  let indentation = ''
  for (let i = 0; i < indentLevelCount; i++) {
    indentation += '  '
  }
  indentation += '  '
  return indentation
}

function countIndentLevel (str: string): number {
  let count = 0
  for (let i = 0; i < str.length && str[i] === '-'; i++) {
    count++
  }
  return count
}

function removeLeadingHyphens (str: string): string {
  return str.replace(/^[-]+/, '')
}

function writeUnitLessonPlan (unit: Unit): void {
  let content = ''
  content += `#import "../../../preambule_fiche.typ": *
`
  content += `#show: setup-emoji
#show: doc => fiche(doc, titre: "Séquence ${unit.number} : ${unit.title}", sousTitre: "Fiche de séquence", paysage: true)

#table(
  columns: 1,
  inset: 0pt,
  align: horizon,
  `
  let lessonNumber = 1
  for (const objective of unit.objectives) {
    for (const lessonPlan of objective.lessonPlans) {
      content += `[ #titreObjectif("Séance ${lessonNumber} - ${objective.reference} : ${objective.title === undefined || objective.title === '' ? objective.titleAcademic : objective.title}")\\
#v(-2em)
#block(inset: 10pt, [
`
      content += buildCategories(lessonPlan, unit.grade)
      content += '])], '
      lessonNumber++
    }
  }
  content = content.slice(0, content.length - 2) + ')'
  const directory = `${TYP}/${LESSON_PLANS}/${UNITS}/${unit.grade}/`
  const fileName = `${unit.reference}.typ`
  writeFile(directory, fileName, content)
}

function writeFile (directory: string, fileName: string, content: string): void {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(`${directory}${fileName}`, content, 'utf8')
}

function deleteDirectory (directory: string): void {
  if (fs.existsSync(directory)) {
    fs.rmdirSync(directory, { recursive: true })
  }
}

async function runShellScript (scriptPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(scriptPath, [], { shell: true })
    child.stdout.on('data', (data) => {
      console.log(data.toString())
    })
    child.stderr.on('data', (data) => {
      console.error(data.toString())
    })
    child.on('error', (error) => {
      console.error(`Error executing ${scriptPath}: ${error.message}`)
      reject(error) // Reject the promise on error
    })
    child.on('exit', (code) => {
      console.log(`${scriptPath} exited with code ${code}`)
      if (code === 0) {
        resolve() // Resolve the promise on successful exit
      } else {
        reject(new Error(`${scriptPath} exited with code ${code}`)) // Reject the promise on error exit code
      }
    })
  })
}
