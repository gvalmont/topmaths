import type { Writable } from 'svelte/store'
import { get } from 'svelte/store'

/**
 * Handler pour la communication RPC avec FlowMath
 * Ne s'active que si globalOptions.recorder === 'flowmath'
 */
export function handleFlowmath(
  exercicesParams: Writable<any[]>,
  resultsByExercice: Writable<any[]>,
) {
  const isInIframe = window.self !== window.top

  // Listen for messages from parent window
  window.addEventListener('message', async (event) => {
    if (!event.data || typeof event.data !== 'object') return

    if (event.data.type === 'FINISH_ATTEMPT') {
      // Get exercices params to know how many exercises we have
      const params = get(exercicesParams)

      // Click validation button for each exercise
      for (let i = 0; i < params.length; i++) {
        const buttonScore = document.querySelector(
          `#buttonScoreEx${i}`,
        ) as HTMLButtonElement
        if (buttonScore !== null) {
          buttonScore.click()
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          console.warn(
            '[MathALEA-FlowMath] Validation button #buttonScoreEx' +
              i +
              ' not found',
          )
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Collect complete results
      const results = get(resultsByExercice)
      let totalQuestions = 0
      let correctAnswers = 0
      for (const result of results) {
        if (
          result?.resultsByQuestion &&
          Array.isArray(result.resultsByQuestion)
        ) {
          totalQuestions += result.resultsByQuestion.length
          correctAnswers += result.resultsByQuestion.filter(
            (r: boolean) => r === true,
          ).length
        } else if (result?.numberOfQuestions) {
          totalQuestions += result.numberOfQuestions
          if (result?.numberOfPoints !== undefined) {
            correctAnswers += result.numberOfPoints
          }
        }
      }

      const score = totalQuestions > 0 ? correctAnswers / totalQuestions : 0

      // Send complete results back to parent
      window.parent.postMessage(
        {
          type: 'ATTEMPT_FINISHED',
          payload: {
            score,
            exercicesData: results,
            totalQuestions,
            correctAnswers,
          },
        },
        '*',
      )
    }

    if (event.data.type === 'REPLAY_ATTEMPT') {
      const exercicesData = event.data.payload.exercicesData
      if (!exercicesData || !Array.isArray(exercicesData)) {
        console.error('[MathALEA-FlowMath] Invalid exercicesData')
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Import the necessary functions
      const { mathaleaWriteStudentPreviousAnswers } = await import('./mathalea')

      // Reinject answers for each exercise
      for (const exercice of exercicesData) {
        if (exercice == null || !exercice.answers) continue

        await Promise.all(mathaleaWriteStudentPreviousAnswers(exercice.answers))
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      // Click all validation buttons
      for (const exercice of exercicesData) {
        if (exercice == null) continue

        const buttonScore = document.querySelector(
          `#buttonScoreEx${exercice.indice}`,
        ) as HTMLButtonElement

        if (buttonScore !== null) {
          buttonScore.click()
          await new Promise((resolve) => setTimeout(resolve, 500))
        } else {
          console.info(
            `[MathALEA-FlowMath] Validation button #buttonScoreEx${exercice.indice} not found`,
          )
        }
      }
    }
  })
}
