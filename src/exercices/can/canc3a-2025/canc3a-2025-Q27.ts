import Exercice from '../../Exercice'
import { texNombre } from '../../../lib/outils/texNombre'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import Hms from '../../../modules/Hms'
export const titre = 'Convertir des fractions d\'heure en minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '50cd1'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class Can2025CM2Q27 extends Exercice {
  constructor () {
    super()

    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.optionsDeComparaison = { HMS: true }
    this.formatChampTexte = KeyboardType.clavierHms
    this.optionsChampTexte = { texteAvant: ' $=$ ' }
  }

  nouvelleVersion () {
    const h = this.canOfficielle ? 4 : randint(1, 5)
    const min = this.canOfficielle ? 10 : randint(1, 5) * 10
    this.reponse = new Hms({ hour: h, minute: min })
    this.question = `Complète ${this.interactif ? '(en heures/minutes)' : ''}. <br> `
    this.question += `$${texNombre(h * 60 + min, 0)}$ min `

    this.correction = `Comme $1$ h $=60$ min, $${h}$ h $=${h}\\times 60 $ min $=${texNombre(h * 60, 0)}$ min.<br>
    $${texNombre(h * 60 + min, 0)}$ h $=${miseEnEvidence(h)}$ h $${miseEnEvidence(min)}$ min.`
    if (!this.interactif) { this.question += '$=\\ldots$ h $\\ldots$ min' }
    this.canEnonce = 'Complète.'
    this.canReponseACompleter = `$${texNombre(h * 60 + min, 0)}$ h $=\\ldots$ h $\\ldots$ min `
  }
}
