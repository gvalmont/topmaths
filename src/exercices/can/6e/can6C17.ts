import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

import { randint } from '../../../modules/outils'
import { bleuMathalea } from '../../../lib/colors'
import Exercice from '../../Exercice'
export const titre = 'Calculer la fraction d’une quantité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = 'daaa3'

export const refs = {
  'fr-fr': ['can6C17'],
  'fr-ch': []
}
export default class FractionSimpleDeQuantite extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1

    this.optionsDeComparaison = { nombreDecimalSeulement: true }
    this.formatChampTexte = KeyboardType.clavierNumbers
    this.optionsChampTexte = { texteApres: ' L' }
  }

  nouvelleVersion () {
    const a = randint(2, 6)
    this.reponse = randint(2, 9) * 10
    const b = this.reponse * a
    this.question = `Calculer $\\dfrac{1}{${a}} \\text{ de } ${b} \\text{ L}$.`
    this.correction = `$\\dfrac{1}{${a}}$ de $${b}$ L = $${miseEnEvidence(this.reponse)}$ L<br>`
    this.correction += texteEnCouleur(`
    <br> Mentalement : <br>
    Prendre $\\dfrac{1}{${a}}$ d'une quantité revient à la diviser par $${a}$.<br>
    Ainsi, $\\dfrac{1}{${a}}$ de $${b}=${b}\\div ${a}=${b / a}$.
     `, bleuMathalea)
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ L'
  }
}
