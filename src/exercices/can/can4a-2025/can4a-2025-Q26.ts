import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import { texNombre } from '../../../lib/outils/texNombre'

export const titre = 'Convertir des heures décimales en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3422k'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N4Q26 extends ExerciceCan {
  enonce (a?:number) {
    if (a == null) {
      a = randint(2, 4) + randint(2, 8) / 10
    }
    const dp = a - Math.floor(a)
    this.question = `$${texNombre(a, 1)}\\text{ h}$`
    this.correction = `$${texNombre(a, 1)}\\text{ h}=${Math.floor(a)}\\times 60+${texNombre(dp, 1)}\\times 60 = ${Math.floor(a) * 60}+${texNombre(dp * 60, 0)}=${miseEnEvidence(texNombre(a * 60, 0))}$`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots\\text{ min}$'
    this.reponse = Math.round(a * 60)
    this.optionsChampTexte = { texteApres: ' min' }
    this.question += this.interactif ? ' $=$' : ''
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(2.4) : this.enonce()
  }
}
