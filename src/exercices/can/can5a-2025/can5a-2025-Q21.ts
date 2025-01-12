import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import ExerciceCan from '../../ExerciceCan'

export const titre = 'Calculer facilement avec la distributivité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'a343f'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N5Q21 extends ExerciceCan {
  private enonce (a?: number, b?: number) {
    if (a == null || b == null) {
      a = choice([101, 1001])
      const c = randint(1, 8)
      b = c * 10 + randint(1, 8, c)
    }
    this.reponse = a * b
    this.question = `$${a} \\times ${b}$ `
    this.correction = `$${a}\\times${b}=${texNombre(a - 1, 0)}\\times${b}+1\\times${b}=${texNombre((a - 1) * b, 0)}+${b}=${miseEnEvidence(texNombre(this.reponse, 0))}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    if (this.interactif) {
      this.question += '$=$'
    }
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(101, 13) : this.enonce()
  }
}
