import * as fs from 'fs'
import * as path from 'path'

const emptyObjectiveReference = '6C10' // keep in sync with objective.ts

const emptyObjective = { // keep in sync with objective.ts
  downloadLinks: {
    practiceSheetLink: '',
    testSheetLink: '',
    lessonPlanLinks: {
      tout: [],
      '6e': [],
      '5e': [],
      '4e': [],
      '3e': []
    }
  },
  examExercises: [],
  examExercisesLink: '',
  exercises: [],
  exercisesLink: '',
  grade: 'tout',
  lessonPlans: [],
  lessonSummaryHTML: '',
  lessonSummaryImage: '',
  lessonSummaryImageAlt: '',
  lessonSummaryInstrumenpoche: '',
  prerequisites: [],
  term: 0,
  reference: emptyObjectiveReference,
  subTheme: '',
  theme: '',
  title: '',
  titleAcademic: '',
  units: [],
  videos: []
}

const emptyUnitReference = 'S6S1' // keep in sync with unit.ts

const emptyUnit = { // keep in sync with unit.ts
  assessmentExamLink: '',
  assessmentExamSlug: '',
  assessmentLink: '',
  downloadLinks: {
    lessonLink: '',
    lessonSummaryLink: '',
    missionLink: '',
    lessonPlanLink: ''
  },
  grade: 'tout',
  number: 0,
  objectives: [],
  term: 0,
  reference: emptyUnitReference,
  title: ''
}

const emptyGlossaryUniteItem = { // keep in sync with glossary.ts
  comments: [],
  content: '',
  examples: [],
  grades: [],
  includesImage: false,
  keywords: [],
  relatedObjectives: [],
  relatedItems: [],
  reference: '',
  title: '',
  type: 'définition'
}

const emptyCalendarSchoolYear = { // keep in sync with calendar.ts
  schoolYearString: '2000-2001',
  start: new Date(),
  end: new Date(),
  periods: []
}

const emptyCurriculum = { // keep in sync with curriculum.ts
  tout: {
    unitsPerTerm: [],
    cumulateUnitsPerTerm: []
  },
  '6e': {
    unitsPerTerm: [],
    cumulateUnitsPerTerm: []
  },
  '5e': {
    unitsPerTerm: [],
    cumulateUnitsPerTerm: []
  },
  '4e': {
    unitsPerTerm: [],
    cumulateUnitsPerTerm: []
  },
  '3e': {
    unitsPerTerm: [],
    cumulateUnitsPerTerm: []
  }
}

// synchronise them with build_json.ts
writeJson('built_objectives', [emptyObjective])
writeJson('built_units', [emptyUnit])
writeJson('glossary', [emptyGlossaryUniteItem])
writeJson('built_calendar', [emptyCalendarSchoolYear])
writeJson('built_curriculum', emptyCurriculum)
writeTs('objectivesReferences', [emptyObjectiveReference])
writeTs('unitsReferences', [emptyUnitReference])
writeTs('specialUnitsReferences', [''])

function writeJson (fileName, data) {
  fs.writeFileSync(path.join('./src', 'topmaths', 'json', fileName + '.json'), JSON.stringify(data, null, 2))
}

function writeTs (fileName, data) {
  fs.writeFileSync(path.join('./src', 'topmaths', 'types', fileName + '.ts'), `export const ${fileName} = <const> ${JSON.stringify(data, null, 2).replace(/"/g, '\'')}
`)
}
