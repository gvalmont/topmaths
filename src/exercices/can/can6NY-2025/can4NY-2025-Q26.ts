import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import Decimal from 'decimal.js'
export const titre = 'Prendre 10 \\% d\'une quantité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '21957'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter + Gilles Mora
*/
export default class CalculsPourcentages extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.compare = fonctionComparaison
    // this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []

    const a = new Decimal(2025).div(choice([10, 100, 1000]))
    this.reponse = texNombre(new Decimal(a).div(10), 5)
    this.question = `$10\\,\\%$ de $${texNombre(a, 4)}$`
    this.correction = `Prendre $10\\,\\%$ d'une quantité revient à la diviser par $10$.<br>
      Ainsi, $10\\,\\%$ de $${texNombre(a, 4)}=${texNombre(a, 4)} \\div 10 = ${miseEnEvidence(this.reponse)}$.`

    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
