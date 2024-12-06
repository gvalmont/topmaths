import { choice } from '../../../lib/outils/arrayOutils'
import { randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Calculer le double ou le triple'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = 'c3b5b'
export const ref = 'can6C12'
export const refs = {
  'fr-fr': ['can6C12'],
  'fr-ch': []
}
export default function DoubleOuTriple () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    const a = randint(1, 3)
    const b = randint(1, 9, a)
    const c = a * 10 + b
    if (choice([true, false])) {
      this.reponse = (3 * c)
      this.question = `Quel est le triple de $${c}$ ?`
      this.correction = `Le triple de $${c}$ est $3 \\times ${c}=${miseEnEvidence(3 * c)}$.`
    } else {
      this.reponse = (2 * c)
      this.question = `Quel est le double de $${c}$ ?`
      this.correction = `Le double de $${c}$ est $2 \\times ${c}=${miseEnEvidence(2 * c)}$.`
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
