import { type RecursivePartial } from '../../src/lib/types.js'
import { type Objective } from '../../src/topmaths/types/objective.js'
import { type StringGrade } from '../../src/topmaths/types/shared.js'

export function countLessonPlans (objective: RecursivePartial<Objective>, grade: StringGrade): number {
  if (!objective.lessonPlans) return 0
  return objective.lessonPlans
    .filter(fiche => fiche !== undefined && fiche.grades !== undefined &&
      (fiche.grades.length === 0 || fiche.grades.includes(grade)))
    .length
}

export function getLessonPlanReference (objectiveReference: string, lessonPlanNumber: number, isMultipleLessonPlans: boolean): string {
  return objectiveReference + (isMultipleLessonPlans ? '-' + lessonPlanNumber : '')
}
