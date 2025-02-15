import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import ExerciceCan from '../../ExerciceCan'

export const titre = 'Multiples de 10'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e24f0'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025NCE2Q17 extends ExerciceCan {
  enonce (a?: number) {
    if (a == null) {
      a = randint(2, 29, [10, 20]) * 10
    }
    this.reponse = { champ1: { value: a } }
    this.consigne = 'Complète : '
    this.formatInteractif = 'fillInTheBlank'
    this.correction = `$10 \\times ${miseEnEvidence(texNombre(a, 0))} = ${a * 10}$.`
    this.canEnonce = this.consigne
    if (this.interactif) {
      this.question = `10 \\times %{champ1} = ${a * 10}`
    } else {
      this.question = `10 \\times \\ldots\\ldots = ${a * 10}`
    }
    this.canReponseACompleter = `$10 \\times \\ldots\\ldots = ${a * 10}$`
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(20) : this.enonce()
  }
}
