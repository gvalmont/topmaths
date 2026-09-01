import { describe, expect, it } from 'vitest'
import {
  hasVerifiableAnswers,
  isExerciseEffectivelyInteractive,
} from './exerciseInteractivity'

describe('topmaths effective exercise interactivity', () => {
  it('falls back to non-interactive mode when i=1 is requested but no answer is verifiable', () => {
    const exercise = {
      interactif: true,
      interactifReady: false,
      autoCorrection: [],
    }

    expect(hasVerifiableAnswers(exercise)).toBe(false)
    expect(isExerciseEffectivelyInteractive(exercise)).toBe(false)
  })

  it('is effective when the exercise declares itself interactive-ready', () => {
    expect(
      isExerciseEffectivelyInteractive({
        interactif: true,
        interactifReady: true,
        autoCorrection: [],
      }),
    ).toBe(true)
  })

  it('recognizes generated auto-correction data as a verifiable answer', () => {
    expect(
      isExerciseEffectivelyInteractive({
        interactif: true,
        interactifReady: false,
        autoCorrection: [{ formatInteractif: 'mathlive' }],
      }),
    ).toBe(true)
  })

  it('remains non-interactive when interactivity was not requested', () => {
    expect(
      isExerciseEffectivelyInteractive({
        interactif: false,
        interactifReady: true,
        autoCorrection: [{ formatInteractif: 'mathlive' }],
      }),
    ).toBe(false)
  })
})
