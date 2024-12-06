import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { bleuMathalea } from '../../../lib/colors'
export const titre = 'Trouver le complément à 1*'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 */
export const uuid = '89135'
export const ref = 'can6C21'
export const refs = {
  'fr-fr': ['can6C21'],
  'fr-ch': []
}
export default function ComplementAUn () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.typeExercice = 'simple'

  this.nouvelleVersion = function () {
    const a = calculANePlusJamaisUtiliser(randint(1, 9) / 10 + randint(1, 9) / 100)
    this.question = `Calculer $1-${texNombre(a)}$.`
    this.correction = `$1-${texNombre(a)}=${miseEnEvidence(texNombre(1 - a))}$<br>`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $100$ centièmes.<br>
    On enlève $${texNombre(100 * a)}$ centièmes à $100$ centièmes, il en reste $${texNombre(100 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `, bleuMathalea)
    this.reponse = calculANePlusJamaisUtiliser(1 - a)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
