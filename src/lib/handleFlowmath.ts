import type { Writable } from 'svelte/store'
import { get } from 'svelte/store'
import {
  getFlowmathAttemptIdFromUrl,
  sendFlowmathAttemptFinished,
  sendFlowmathAttemptStarted,
  sendFlowmathError,
  sendFlowmathReady,
  sendFlowmathReplayCompleted,
} from './flowmathRpc'

/**
 * Handler pour la communication RPC avec FlowMath
 * Ne s'active que si globalOptions.recorder === 'flowmath'
 */
export function handleFlowmath(
  exercicesParams: Writable<any[]>,
  resultsByExercice: Writable<any[]>,
) {
  if (typeof window === 'undefined') return

  // Listen for messages from parent window
  const onMessage = async (event: MessageEvent<any>) => {
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
      sendFlowmathAttemptFinished({
        score,
        exercicesData: results,
        totalQuestions,
        correctAnswers,
      })
    }

    if (event.data.type === 'REPLAY_ATTEMPT') {
      const exercicesData = event.data.payload.exercicesData
      if (!exercicesData || !Array.isArray(exercicesData)) {
        console.error('[MathALEA-FlowMath] Invalid exercicesData')
        sendFlowmathError('[MathALEA] Invalid exercicesData received')
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Import the necessary functions
      const { mathaleaWriteStudentPreviousAnswers } = await import(
        './mathaleaUtils'
      )

      // Reinject answers for each exercise
      for (const exercice of exercicesData) {
        if (exercice == null || !exercice.answers) continue

        await Promise.all(mathaleaWriteStudentPreviousAnswers(exercice.answers))
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      await new Promise((resolve) => setTimeout(resolve, 800))

      // Signal that replay is complete - parent can now send FINISH_ATTEMPT
      sendFlowmathReplayCompleted()
    }
  }

  window.addEventListener('message', onMessage)

  const onWindowError = (event: ErrorEvent) => {
    if (!event?.message) return
    sendFlowmathError(event.message)
  }

  const onUnhandledRejection = (event: PromiseRejectionEvent) => {
    if (event?.reason == null) return
    if (typeof event.reason === 'string') {
      sendFlowmathError(event.reason)
    } else if (event.reason instanceof Error) {
      sendFlowmathError(event.reason.message)
    } else {
      sendFlowmathError(String(event.reason))
    }
  }

  window.addEventListener('error', onWindowError)
  window.addEventListener('unhandledrejection', onUnhandledRejection)

  sendFlowmathReady()
  sendFlowmathAttemptStarted(getFlowmathAttemptIdFromUrl())

  return () => {
    window.removeEventListener('message', onMessage)
    window.removeEventListener('error', onWindowError)
    window.removeEventListener('unhandledrejection', onUnhandledRejection)
  }
}
