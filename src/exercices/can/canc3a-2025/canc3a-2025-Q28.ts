import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Calculer d\'un entier avec un décimal'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'fee12'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class Can2025CM2Q28 extends Exercice {
  constructor () {
    super()

    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteAvant: '$=$' }
  }

  nouvelleVersion () {
    const a = this.canOfficielle ? 3 : randint(3, 9)
    const b = this.canOfficielle ? 8 : randint(6, 9)
    this.reponse = texNombre(a * b / 10, 1)
    this.question = `$${a}\\times ${b}$  dixièmes `

    this.correction = `$${b}$  dixièmes $= ${texNombre(b / 10, 1)}$<br>
     $${a}\\times ${b}$  dixièmes $=${a}\\times ${texNombre(b / 10, 1)}=${miseEnEvidence(texNombre(a * b / 10, 1))}$`

    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
