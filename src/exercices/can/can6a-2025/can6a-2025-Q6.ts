import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import Hms from '../../../modules/Hms'
export const titre = 'Ajouter une demi-heure'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '8eb0d'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Gilles Mora

*/
export default class Can2025N62Q6 extends Exercice {
  constructor () {
    super()

    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.canOfficielle = true
    this.optionsDeComparaison = { HMS: true }
    this.formatChampTexte = KeyboardType.clavierHms
    this.optionsChampTexte = { texteAvant: '<br>' }
  }

  nouvelleVersion () {
    const h = this.canOfficielle ? 4 : randint(1, 9)
    const min = this.canOfficielle ? 55 : randint(3, 5) * 10 + 5
    this.reponse = new Hms({ hour: h + 1, minute: min - 30 })
    this.question = `Il est $${h}$ h $${min}$ min.<br>
    Dans une demi-heure, quelle heure sera-t-il ?`

    this.correction = `Une demi-heure est égale à $30$ minutes. <br>
    Ainsi $${h}$ h $${min}$ min + $30$ min est égal à $${miseEnEvidence(h + 1)}$ h $${miseEnEvidence(min - 30)}$ min.`

    handleAnswers(this, 0, { reponse: { value: new Hms({ hour: h + 1, minute: min - 30 }).toString(), options: { HMS: true } } })
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ h $\\ldots$ min'
  }
}
