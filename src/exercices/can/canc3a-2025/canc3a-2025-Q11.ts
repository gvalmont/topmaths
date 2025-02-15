import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'

import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Calculer avec des dixèmes/centièmes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '0021e'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class Can2025CM2Q11 extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteApres: 'unités.' }
  }

  nouvelleVersion () {
    const a = this.canOfficielle ? 1234 : randint(1201, 1299)
    const b = this.canOfficielle ? 'dixièmes' : choice(['dixièmes', 'centièmes'])

    this.reponse = b === 'dixièmes' ? texNombre(a / 10, 1) : texNombre(a / 100, 2)
    this.question = `$${texNombre(a, 0)}$ ${b} est égal à `
    if (!this.interactif) { this.question += '$\\ldots$ unités.' }
    this.correction = `$${texNombre(a, 0)}$ ${b}  est égal à $ ${b === 'dixièmes' ? `${texNombre(a, 0)}\\div 10` : `${texNombre(a, 0)}\\div 100`} = ${miseEnEvidence(this.reponse)}$ unités`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\ldots$ unités'
  }
}
