import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { bleuMathalea } from '../../../lib/colors'
export const titre = 'Calculer le double ou la moitié'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = '88435'
export const ref = 'can6C16'
export const refs = {
  'fr-fr': ['can6C16'],
  'fr-ch': []
}
export default function DoubleEtMoitie () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    const a = randint(1, 25) // variables aléatoires
    this.question = `Le double d'un nombre vaut $${4 * a}$, combien vaut sa moitié ?`
    this.correction = `Sa moitié vaut : $${miseEnEvidence(texNombre(a))}$.<br>`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    Si le double du nombre est $${4 * a}$, ce nombre est : $${4 * a}\\div 2=${2 * a}$.<br>
    Puisqu'on cherche sa moitié, on le divise par $2$, soit  $${2 * a}\\div 2=${a}$.<br>
     `, bleuMathalea)
    this.reponse = a
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
