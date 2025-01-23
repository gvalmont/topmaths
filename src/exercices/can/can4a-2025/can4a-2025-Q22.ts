import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import { sp } from '../../../lib/outils/outilString'

export const titre = 'Somme de nombre relatifs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3422g'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N4Q22 extends ExerciceCan {
  enonce (a?: number, b?: number) {
    if (a == null || b == null) {
      a = randint(8, 14)
      b = randint(2, 4) + a
    }
    this.question = `$${a}$${sp(3)}$${b}$${sp(3)}$${b}$<br>La moyenne de ces trois nombres est : `
    this.correction = `$\\dfrac{${a}+${b}+${b}}{3}=${miseEnEvidence((a + b * 2) / 3)}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    this.reponse = Math.round((a + b * 2) / 3)
    this.question += this.interactif ? '' : ' $\\ldots$'
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(10, 13) : this.enonce()
  }
}
