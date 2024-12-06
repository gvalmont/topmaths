import type Exercice from '../../../exercices/Exercice'

export async function countMathField (exercise: Exercice): Promise<number> {
  if (exercise == null) return 0
  let numbOfAnswerFields : number = 0
  if (exercise.interactif) {
    if (!exercise.autoCorrection || !Array.isArray(exercise.autoCorrection)) {
      return 0
    }
    for (const autoCorr of exercise.autoCorrection) {
      if (autoCorr.reponse?.param?.formatInteractif === 'mathlive' ||
            autoCorr.reponse?.param?.formatInteractif === 'qcm') {
        numbOfAnswerFields++
      }
    }
    if (exercise.interactifType === 'custom' && 'goodAnswers' in exercise && Array.isArray(exercise.goodAnswers)) {
      for (const goodAnswer of exercise.goodAnswers) {
        if (Array.isArray(goodAnswer)) {
          numbOfAnswerFields += goodAnswer.length
        } else {
          numbOfAnswerFields++
        }
      }
    }
    return numbOfAnswerFields
  }
  return 0
}
