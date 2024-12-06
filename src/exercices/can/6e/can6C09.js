import { bleuMathalea } from '../../../lib/colors'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
export const titre = 'Soustraire $10n + 9$'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = '592c7'
export const ref = 'can6C09'
export const refs = {
  'fr-fr': ['can6C09'],
  'fr-ch': []
}
export default function SoustraireX9 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    const a = randint(5, 9)
    const b = randint(1, 8)
    const c = randint(1, 4)
    this.reponse = a * 10 + b - c * 10 - 9
    this.question = `Calculer $${a * 10 + b} - ${c * 10 + 9}$.`
    this.correction = `$${a * 10 + b} - ${c * 10 + 9}= ${this.reponse}$<br>`
    this.correction += texteEnCouleur(`<br> Mentalement : <br>
    Soustraire $${c * 10 + 9}$ revient à soustraire $${c * 10 + 10}$, puis à ajouter $1$.<br>
    Ainsi, $${a * 10 + b} - ${c * 10 + 9}=${a * 10 + b} - ${c * 10 + 10}+1=${a * 10 + b - c * 10 - 10}+1=${this.reponse}$.
       `, bleuMathalea)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
