import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { bleuMathalea } from '../../../lib/colors'
export const titre = 'Calculer la somme de quatre entiers qui se marient'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = '90d0d'
export const ref = 'can6C14'
export const refs = {
  'fr-fr': ['can6C14'],
  'fr-ch': []
}
export default function Somme4EntiersQuiSeMarient () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    const a = randint(1, 9)
    const b = randint(1, 9, a)
    const c = randint(3, 7) * 10
    const d = randint(10, 15) * 10 - c
    this.reponse = 2 * (c + d)
    this.question = `Calculer $${c - a} + ${d + b} + ${c + a} + ${d - b}$.`
    this.correction = `$${c - a} + ${d + b} + ${c + a} + ${d - b} =  ${miseEnEvidence(2 * (c + d))}$<br>`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
On change l'ordre des termes pour simplifier le calcul  :<br>
  $\\underbrace{${c - a}+${c + a}}_{${2 * c}}+
\\underbrace{${d + b}+${d - b}}_{${2 * d}}=${2 * c}+${2 * d}=${2 * c + 2 * d}$. `, bleuMathalea)
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
