import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'

export const titre = 'Complément à la dizaine supérieure'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ccf0d'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025CE2Q1 extends ExerciceCan {
  enonce (a?: number, b?: number) {
    if (a == null || b == null) {
      a = randint(2, 4) * 100 + randint(2, 6) * 10 + randint(1, 4)
      b = Math.round(Math.ceil(a / 10) * 10)
    }
    this.reponse = { champ1: { value: b - a } }
    this.question = `$${a} + \\ldots = ${b}$`
    this.correction = `Pour trouver le nombre manquant, on peut calculer $${b}-${a}=${miseEnEvidence(texNombre(b - a, 0))}$.`
    this.canEnonce = this.question
    this.canReponseACompleter = `$${a} + \\ldots\\ldots = ${b}$`
    if (this.interactif) {
      this.question = `${a} + %{champ1} = ${b}`
    }
    this.formatInteractif = 'fillInTheBlank'
  }

  nouvelleVersion () {
    this.canOfficielle = this.sup
    this.canOfficielle ? this.enonce(342, 350) : this.enonce()
  }
}
