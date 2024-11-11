import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Trouver un reste dans une division euclidienne'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'cfe2d'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 * Référence
*/
export default class resteDivEucl extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.compare = fonctionComparaison
    // this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const a = choice([2, 3, 4, 5, 10, 100, 1000, 2000])

    this.reponse = 2025 % a
    this.question = `Quel est le reste de la division euclidienne de $${texNombre(2025, 0)}$ par $${texNombre(a)}$ ?`
    if (this.reponse === 0) { this.correction = `$${texNombre(2024)}$ est divisible par $${a}$, donc le reste est $${miseEnEvidence('0')}$.` } else {
      this.correction = `$${texNombre(2024)}=${texNombre(a)}\\times ${texNombre((2024 - this.reponse) / a, 0)}+${this.reponse}$<br>
      Donc le reste est $${miseEnEvidence(texNombre(this.reponse, 0))}$.`
    }
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
