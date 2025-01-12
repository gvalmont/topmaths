import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

import { bleuMathalea } from '../../../lib/colors'
import Exercice from '../../Exercice'
export const titre = 'Calculer la somme de quatre entiers qui se marient'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021
 */
export const uuid = '90d0d'

export const refs = {
  'fr-fr': ['can6C14'],
  'fr-ch': []
}
export default class Somme4EntiersQuiSeMarient extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
    this.formatChampTexte = KeyboardType.clavierNumbers
    this.nbQuestions = 1
  }

  nouvelleVersion () {
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
