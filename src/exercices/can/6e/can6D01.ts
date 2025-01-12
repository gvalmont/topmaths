import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Convertir des heures/minutes en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021

 */
export const uuid = '1db82'

export const refs = {
  'fr-fr': ['can6D01'],
  'fr-ch': []
}
export default class ConversionHeuresEtMinutesVersMinutes extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1

    this.optionsChampTexte = { texteApres: ' minutes' }
  }

  nouvelleVersion () {
    const a = randint(2, 4)
    const b = randint(10, 59)
    const d = a * 60 + b
    this.question = `Compléter : <br> $${a}$ heures $${b}$ minutes $=$`
    if (!this.interactif) {
      this.question += ' .... minutes'
    }
    this.correction = `Il y a $60$ minutes dans une heure.<br>
    Comme $${a} \\times 60 + ${b}=${d}$ alors $${a}$h $${b}$min = $${d}$ minutes`
    this.reponse = d
    this.canEnonce = 'Compléter.'
    this.canReponseACompleter = `$${a}$ heures $${b} $ minutes $=$ $\\ldots$ minutes`
  }
}
