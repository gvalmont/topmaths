import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Chercher un reste en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021

 */
export const uuid = '46e66'

export const refs = {
  'fr-fr': ['can6D02'],
  'fr-ch': []
}
export default class ResteEnMinutes extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1

    this.typeExercice = 'simple'
  }

  nouvelleVersion () {
    const a = randint(1, 2)
    const b = randint(10, 59)
    const d = a * 60 + b
    this.question = ` $${d}$ minutes $=$  $a$ heure(s) et  $b$ minute(s).<br>
    Quelle est la valeur de $b$ sachant que $a$ est le plus grand possible?`
    this.correction = `$${d} = ${a} \\times 60 + ${b}$ donc $${d}$ minutes = $${a}h ${b}$ min, donc $b=${b}$.`
    this.reponse = b
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
