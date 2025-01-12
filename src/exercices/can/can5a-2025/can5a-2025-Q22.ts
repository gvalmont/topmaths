import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import { texPrix } from '../../../lib/outils/texNombre'

export const titre = 'Proportionnalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'a343b'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N5Q14 extends ExerciceCan {
  private enonce (a?: number, b?: number, c?: number) {
    let coeff
    let pu
    if (a == null || b == null || c == null) {
      a = randint(1, 4) * 4
      coeff = choice([1.5, 2.5])
      pu = choice([5, 7, 9]) / 4
      b = a * pu
      c = a * coeff
    }
    pu = b / a
    coeff = c / a
    this.reponse = pu * c
    this.question = `$${a}$ gommes coûtent $${b}$ euros. <br>
    Combien coûtent $${c}$ gommes ?`
    this.correction = `Le prix de $${a}$ gommes est $${b}$ euros.<br>
    On calcule le prix de $${a / 2}$ gommes :<br>
    $${b}\\div 2=${texPrix(b / 2)}$<br>
    Le prix de $${a / 2}$ gommes est $${texPrix(b / 2)}$ euros.<br>
    Ainsi, le prix de $${c}$ gommes est $${coeff === 2.5 ? `2\\times ${b} + ${texPrix(b / 2)}` : `${b} + ${texPrix(b / 2)}`} =${miseEnEvidence(texPrix(b * coeff))}$.`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ euros'
    this.optionsChampTexte = { texteApres: ' €' }
    if (this.interactif) {
      this.question += '<br>'
    }
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(4, 5, 10) : this.enonce()
  }
}
