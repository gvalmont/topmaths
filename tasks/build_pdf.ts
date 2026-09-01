import { spawn } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'
import units from '../src/topmaths/json/built_units.json' with { type: 'json' }
import {
  buildGradeFromObjectiveReference,
  isReferenceIgnored,
} from '../src/topmaths/services/reference.js'
import { getTitle } from '../src/topmaths/services/string.js'
import { isStringGrade, type StringGrade } from '../src/topmaths/types/grade.js'
import {
  isObjectiveReferences,
  type ObjectiveReference,
} from '../src/topmaths/types/objective.js'
import {
  emptyUnit,
  emptyUnitLessonPlan,
  emptyUnitObjective,
  isUnits,
  type Unit,
  type UnitLessonPlan,
  type UnitObjective,
} from '../src/topmaths/types/unit.js'
import { countLessonPlans } from './helpers/lesson_plans.js'

const SOURCE_ROOT = './src/topmaths/typ'
const LESSONS = 'cours'
const LESSON_PLANS = 'fiches'
const UNITS = 'sequences'
const OBJECTIVES = 'objectifs'
const FILE_KEYWORDS = [
  '_Cours',
  '_Fiche',
  '_Poly',
  '_Presentation',
  'Entrainement_',
  '_Diaporama',
  '_Geogebra',
]

if (!isUnits(units)) {
  console.error(units)
  throw new Error('The JSON file does not contain an array of units')
}
deleteDirectory(`${SOURCE_ROOT}/${LESSONS}/${UNITS}/`)
deleteDirectory(`${SOURCE_ROOT}/${LESSON_PLANS}/`)
for (let i = 0; i < units.length; i++) {
  const previousUnit = i === 0 ? emptyUnit : units[i - 1]
  const currentUnit = units[i]
  const nextUnit = i === units.length - 1 ? emptyUnit : units[i + 1]
  writeUnitLesson(currentUnit)
  writeUnitLessonPlans(previousUnit, currentUnit, nextUnit)
}
await runShellScript('tasks/compile_pdfs.sh')
await runShellScript('tasks/copy_precompiled_pdfs.sh')
// end of script

function writeUnitLesson(unit: Unit): void {
  if (
    !unit.objectives.some((objective) =>
      fs.existsSync(
        `${SOURCE_ROOT}/${LESSONS}/${OBJECTIVES}/${objective.grade}/${objective.reference}.typ`,
      ),
    )
  ) {
    return
  }
  let content = buildHeader(unit)
  for (const objectif of unit.objectives) {
    content += buildObjectiveLesson(objectif, unit)
  }
  content = replaceImportedLessons(content, unit)
  const directory = `${SOURCE_ROOT}/${LESSONS}/${UNITS}/${unit.grade}/`
  const fileName = `${unit.reference}.typ`
  writeFile(directory, fileName, content)
}

function buildHeader(unit: Unit): string {
  let header = `#import "../../../preambule_sequence.typ": * 
#show: doc => sequence(doc, title: "Séquence ${unit.number} : ${unit.title}")
#objectifs()[
`
  for (const objective of unit.objectives) {
    if (!isIgnored(objective)) {
      header += `
        - ${objective.reference} : ${getTitle(objective)}`
    }
  }
  header += `
  ]
`
  return header
}

function isIgnored(objective: UnitObjective): boolean {
  return objective.reference.slice(1, 2) === 'X'
}

function buildObjectiveLesson(objective: UnitObjective, unit: Unit): string {
  const objectiveLessonPath = `${SOURCE_ROOT}/${LESSONS}/${OBJECTIVES}/${objective.grade}/${objective.reference}.typ`
  if (
    !fs.existsSync(objectiveLessonPath) &&
    objective.lessonImages.length === 0
  )
    return ''
  const title = `
= ${getTitle(objective)}
`
  let content = ''
  if (objective.lessonImages.length > 0) {
    objective.lessonImages.forEach((image) => {
      content += `\n#image("../../../../../../public/${image}")\n`
    })
    content +=
      '\n#align(center, text(9pt)[#link("https://www.canva.com/design/DAGsRWDsi8k/ow8Y3IaBgW60cCecoe8AjQ/view")[Cours] de #link("https://x.com/ClaireBruneau1")[Claire Bruneau]])\n'
  } else {
    content += fs.readFileSync(objectiveLessonPath, 'utf8')
    if (content.includes('image("')) copyImages(objective, unit)
  }
  return title + content
}

function copyImages(objective: Partial<UnitObjective>, unit: Unit): void {
  if (objective.grade === undefined) throw new Error('Unit grade is undefined')
  if (objective.reference === undefined)
    throw new Error('Unit reference is undefined')
  const sourceDir = `${SOURCE_ROOT}/${LESSONS}/${OBJECTIVES}/${objective.grade}/`
  const destinationDir = `${SOURCE_ROOT}/${LESSONS}/${UNITS}/${unit.grade}/`
  const filePrefix = objective.reference
  const fileExtension = '.png'
  fs.readdir(sourceDir, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err)
      return
    }
    files.forEach((file) => {
      if (file.startsWith(filePrefix) && file.endsWith(fileExtension)) {
        const sourceFilePath = path.join(sourceDir, file)
        const destinationFilePath = path.join(destinationDir, file)

        fs.copyFile(sourceFilePath, destinationFilePath, (err) => {
          if (err) {
            console.error('Error copying file:', err)
          }
        })
      }
    })
  })
}

function replaceImportedLessons(text: string, sequence: Unit): string {
  let importedLessonReferences: ObjectiveReference[] =
    findImportedLessonReferences(text)
  while (importedLessonReferences.length > 0) {
    for (const reference of importedLessonReferences) {
      const grade = buildGradeFromObjectiveReference(reference)
      if (!isStringGrade(grade))
        throw new Error(`Imported lesson reference incorrect: ${grade}`)
      const importedLesson = fs.readFileSync(
        `${SOURCE_ROOT}/${LESSONS}/${OBJECTIVES}/${grade}/${reference}.typ`,
        'utf8',
      )
      if (importedLesson.includes('image("'))
        copyImages({ grade, reference }, sequence)
      text = text.replace(new RegExp(`##${reference}`, 'g'), importedLesson)
      importedLessonReferences = findImportedLessonReferences(text)
    }
  }
  return text
}

function findImportedLessonReferences(text: string): ObjectiveReference[] {
  const regex = /##(\w+)/g
  const matches = text.match(regex) || []
  const uniqueReferences = new Set(
    matches.map((match: string) => match.slice(2)),
  )
  const importedLessonReferences = Array.from(uniqueReferences)
  if (!isObjectiveReferences(importedLessonReferences))
    throw new Error(`Invalid lesson references: ${importedLessonReferences}`)
  return importedLessonReferences
}

function writeUnitLessonPlans(
  previousUnit: Unit,
  currentUnit: Unit,
  nextUnit: Unit,
): void {
  const previousUnitLastObjective =
    previousUnit.objectives.length > 0
      ? previousUnit.objectives[previousUnit.objectives.length - 1]
      : emptyUnitObjective
  const nextUnitFirstObjective =
    nextUnit.objectives.length > 0 ? nextUnit.objectives[0] : emptyUnitObjective
  if (currentUnit.objectives.length === 0) {
    return
  }
  for (let i = 0; i < currentUnit.objectives.length; i++) {
    const currentObjective = currentUnit.objectives[i]
    if (isReferenceIgnored(currentObjective.reference)) continue
    const previousObjective =
      i === 0 ? previousUnitLastObjective : currentUnit.objectives[i - 1]
    const nextObjective =
      i === currentUnit.objectives.length - 1
        ? nextUnitFirstObjective
        : currentUnit.objectives[i + 1]
    writeObjectiveLessonPlans(
      currentUnit.grade,
      previousObjective,
      currentObjective,
      nextObjective,
    )
  }
  writeUnitLessonPlan(previousUnit, currentUnit, nextUnit)
}

function writeObjectiveLessonPlans(
  unitGrade: StringGrade,
  previousObjective: UnitObjective,
  currentObjective: UnitObjective,
  nextObjective: UnitObjective,
): void {
  let lessonPlanCount = 1
  const currentObjectiveLessonPlans = currentObjective.lessonPlans.filter(
    (lessonPlan) =>
      lessonPlan.grades.length === 0 || lessonPlan.grades.includes(unitGrade),
  )
  for (let i = 0; i < currentObjectiveLessonPlans.length; i++) {
    const previousLessonPlan =
      i === 0
        ? findLastLessonPlan(previousObjective, unitGrade)
        : currentObjectiveLessonPlans[i - 1]
    const currentLessonPlan = currentObjectiveLessonPlans[i]
    const nextLessonPlan =
      i === currentObjectiveLessonPlans.length - 1
        ? findFirstLessonPlan(nextObjective, unitGrade)
        : currentObjectiveLessonPlans[i + 1]
    let content = buildObjectiveLessonPlanHeader(
      unitGrade,
      currentObjective,
      lessonPlanCount,
    )
    content += buildCategories(
      previousLessonPlan,
      currentLessonPlan,
      nextLessonPlan,
    )
    const directory = `${SOURCE_ROOT}/${LESSON_PLANS}/${OBJECTIVES}/${currentObjective.grade}/`
    const fileName = buildFileName(unitGrade, currentLessonPlan.reference)
    writeFile(directory, fileName, content)
    lessonPlanCount++
  }
}

function findLastLessonPlan(
  objective: UnitObjective,
  unitGrade: StringGrade,
): UnitLessonPlan {
  const objectiveLessonPlans = objective.lessonPlans.filter(
    (lessonPlan) =>
      lessonPlan.grades.length === 0 || lessonPlan.grades.includes(unitGrade),
  )
  const objectiveLastLessonPlan =
    objectiveLessonPlans.length > 0
      ? objectiveLessonPlans[objectiveLessonPlans.length - 1]
      : emptyUnitLessonPlan
  return objectiveLastLessonPlan
}

function findFirstLessonPlan(
  objective: UnitObjective,
  unitGrade: StringGrade,
): UnitLessonPlan {
  const nextObjectiveLessonPlans = objective.lessonPlans.filter(
    (lessonPlan) =>
      lessonPlan.grades.length === 0 || lessonPlan.grades.includes(unitGrade),
  )
  const nextObjectiveFirstLessonPlan =
    nextObjectiveLessonPlans.length > 0
      ? nextObjectiveLessonPlans[0]
      : emptyUnitLessonPlan
  return nextObjectiveFirstLessonPlan
}

function buildFileName(
  unitGrade: StringGrade,
  lessonPlanReference: string,
): string {
  return `${unitGrade}_${lessonPlanReference}.typ`
}

function buildObjectiveLessonPlanHeader(
  unitGrade: StringGrade,
  objective: UnitObjective,
  lessonPlanCount: number,
): string {
  const lessonPlanTotalCount = countLessonPlans(objective, unitGrade)
  const subTitle = `Fiche de leçon${lessonPlanTotalCount > 1 ? ` ${lessonPlanCount} / ${lessonPlanTotalCount}` : ''}`
  return `#import "../../../preambule_fiche.typ": *
#show: doc => fiche(doc, titre: "${objective.reference} : ${getTitle(objective)}", sousTitre: "${subTitle}")

`
}

function buildCategories(
  previousLessonPlan: UnitLessonPlan,
  currentLessonPlan: UnitLessonPlan,
  nextLessonPlan: UnitLessonPlan,
): string {
  let content = ''
  content += buildCategory(
    'Prérequis',
    currentLessonPlan.objectivePrerequisites.map((prerequisite) =>
      buildObjectiveLink(
        prerequisite.objectiveReference,
        getTitle(prerequisite),
      ),
    ),
  )
  content += buildCategory(
    'Matériel élève',
    currentLessonPlan.studentMaterialsNeeded,
  )
  content += buildCategory(
    'Matériel enseignant',
    currentLessonPlan.teacherMaterialsNeeded,
  )
  content += buildCategory('Début de séance', currentLessonPlan.startSteps)
  currentLessonPlan.segments.forEach((segment, i) => {
    content += buildCategory(segment.title || `Segment ${i + 1}`, segment.steps)
  })
  content += buildCategory('Fin de séance', currentLessonPlan.closureSteps)
  content += buildCategory('Prochain objectif', [
    buildObjectiveLink(
      nextLessonPlan.objectiveReference,
      nextLessonPlan.objectiveTitle,
    ),
  ])
  content += buildCategory(
    'Matériel à emmener la prochaine fois',
    nextLessonPlan.studentMaterialsNeeded,
  )
  content += buildCategory('Notes', currentLessonPlan.comments)
  return content
}

function buildCategory(categoryName: string, contentLines: string[]): string {
  let content = ''
  if (contentLines.length === 0 || contentLines.every((line) => line === ''))
    return content
  if (categoryName !== '') {
    content += `#titreCategorie("${categoryName}") :\\
`
  }
  contentLines.forEach((contentLine) => {
    if (contentLine === '') return
    contentLine = addFileLinks(contentLine)
    content += `${buildIdentation(contentLine)}- ${removeLeadingHyphens(contentLine)}\\
`
  })
  return content
}

function buildObjectiveLink(
  objectiveReference: ObjectiveReference,
  objectiveTitle: string,
): string {
  return `#link("https://topmaths.fr/?v=objective&ref=${objectiveReference}")[${objectiveReference} : ${objectiveTitle}]`
}

function addFileLinks(content: string): string {
  if (!FILE_KEYWORDS.some((keyword) => content.includes(keyword))) {
    return content
  }
  let words = content.split(' ')
  words = words.map((word) => {
    if (FILE_KEYWORDS.some((keyword) => word.includes(keyword))) {
      word = `#lien("${word}")`
    }
    return word
  })
  return words.join(' ')
}

function buildIdentation(line: string): string {
  const indentLevelCount = countIndentLevel(line)
  let indentation = ''
  for (let i = 0; i < indentLevelCount; i++) {
    indentation += '  '
  }
  indentation += '  '
  return indentation
}

function countIndentLevel(str: string): number {
  let count = 0
  for (let i = 0; i < str.length && str[i] === '-'; i++) {
    count++
  }
  return count
}

function removeLeadingHyphens(str: string): string {
  return str.replace(/^[-]+/, '')
}

function writeUnitLessonPlan(
  previousUnit: Unit,
  currentUnit: Unit,
  nextUnit: Unit,
): void {
  let content = buildUnitLessonPlanHeader(currentUnit)
  content += buildUnitLessonPlanGrid(previousUnit, currentUnit, nextUnit)
  const directory = `${SOURCE_ROOT}/${LESSON_PLANS}/${UNITS}/${currentUnit.grade}/`
  const fileName = `${currentUnit.reference}.typ`
  writeFile(directory, fileName, content)
}

function buildUnitLessonPlanHeader(unit: Unit): string {
  return `#import "../../../preambule_fiche.typ": *
#show: doc => fiche(doc, titre: "Séquence ${unit.number} : ${unit.title}", sousTitre: "Fiche de séquence", paysage: true)

#table(
  columns: 1,
  inset: 0pt,
  align: horizon,
  `
}

function buildUnitLessonPlanGrid(
  previousUnit: Unit,
  currentUnit: Unit,
  nextUnit: Unit,
): string {
  let content = ''
  let lessonNumber = 1
  const previousUnitLastObjective =
    previousUnit.objectives.length > 0
      ? previousUnit.objectives[previousUnit.objectives.length - 1]
      : emptyUnitObjective
  const nextUnitFirstObjective =
    nextUnit.objectives.length > 0 ? nextUnit.objectives[0] : emptyUnitObjective
  for (let i = 0; i < currentUnit.objectives.length; i++) {
    const previousObjective =
      i === 0 ? previousUnitLastObjective : currentUnit.objectives[i - 1]
    const currentObjective = currentUnit.objectives[i]
    const nextObjective =
      i === currentUnit.objectives.length - 1
        ? nextUnitFirstObjective
        : currentUnit.objectives[i + 1]
    for (let i = 0; i < currentObjective.lessonPlans.length; i++) {
      const currentLessonPlan = currentObjective.lessonPlans[i]
      if (isReferenceIgnored(currentObjective.reference)) continue
      const previousLessonPlan =
        i === 0
          ? findLastLessonPlan(previousObjective, currentUnit.grade)
          : currentObjective.lessonPlans[i - 1]
      const nextLessonPlan =
        i === currentObjective.lessonPlans.length - 1
          ? findFirstLessonPlan(nextObjective, currentUnit.grade)
          : currentObjective.lessonPlans[i + 1]
      content += `[ #titreObjectif("Leçon ${lessonNumber} - ${currentObjective.reference} : ${getTitle(currentObjective)}")\\
#v(-2em)
#block(inset: 10pt, [
`
      content += buildCategories(
        previousLessonPlan,
        currentLessonPlan,
        nextLessonPlan,
      )
      content += '])], '
      lessonNumber++
    }
  }
  content = content.slice(0, content.length - 2) + ')'
  return content
}

function writeFile(directory: string, fileName: string, content: string): void {
  if (!fs.existsSync(directory)) fs.mkdirSync(directory, { recursive: true })
  fs.writeFileSync(`${directory}${fileName}`, content, 'utf8')
}

function deleteDirectory(directory: string): void {
  if (fs.existsSync(directory)) {
    fs.rmSync(directory, { recursive: true })
  }
}

async function runShellScript(scriptPath: string): Promise<void> {
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
