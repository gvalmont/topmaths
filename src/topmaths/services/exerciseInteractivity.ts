import type { AutoCorrection } from '../../lib/types'

type ExerciseInteractivity = {
  interactif?: boolean
  interactifReady?: boolean
  autoCorrection?: AutoCorrection[]
}

export function hasVerifiableAnswers(
  exercise: ExerciseInteractivity | undefined,
): boolean {
  return (
    exercise?.interactifReady === true ||
    exercise?.autoCorrection?.some((entry) => entry != null) === true
  )
}

export function isExerciseEffectivelyInteractive(
  exercise: ExerciseInteractivity | undefined,
): boolean {
  return exercise?.interactif === true && hasVerifiableAnswers(exercise)
}
