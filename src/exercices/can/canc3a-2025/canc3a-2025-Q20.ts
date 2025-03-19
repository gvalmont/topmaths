import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { context } from '../../../modules/context'
export const titre = 'Calculer le tiers d\'une quantité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '86cef'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class Can2025CM2Q20 extends Exercice {
  constructor () {
    super()

    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteApres: 'œufs.' }
  }

  nouvelleVersion () {
    const a = this.canOfficielle ? 18 : randint(2, 9) * 3
    this.reponse = texNombre(a / 3, 0)
    this.question = `Le tiers de  $${a}$ œufs est  `
    if (!this.interactif) {
      this.question += '$\\ldots$'
    }
    this.correction = `Pour prendre le tiers d'un nombre, on le divise par $3$.<br>
     $${a}\\div 3 =${texNombre(a / 3, 0)}$<br>
     $${texNombre(a / 3, 0)}\\times 2= ${miseEnEvidence(texNombre(2 * a / 3, 0))}$ œufs.`

    this.canReponseACompleter = '$\\ldots$ œufs'
  }
}
