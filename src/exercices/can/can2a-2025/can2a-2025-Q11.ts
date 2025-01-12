import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { toutPourUnPoint } from '../../../lib/interactif/mathLive'
import FractionEtendue from '../../../modules/FractionEtendue'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Calculer les coordonnées d\'un milieu'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '50ee5'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class CoordonneesMilieu extends Exercice {
  constructor () {
    super()

    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'fillInTheBlank'
  }

  nouvelleVersion () {
    const xa = this.canOfficielle ? 2 : randint(1, 5) * choice([-2, 2])
    const ya = this.canOfficielle ? 1 : randint(1, 3) * 2 + 1
    const xb = this.canOfficielle ? -4 : randint(1, 5) * choice([-2, 2])
    const yb = this.canOfficielle ? 9 : randint(4, 5) * 2 + 1
    const xm = new FractionEtendue(xa + xb, 2).simplifie()
    const ym = new FractionEtendue(ya + yb, 2).simplifie()

    this.reponse = { bareme: toutPourUnPoint, champ1: { value: xm.texFraction, options: { fractionEgale: true } }, champ2: { value: ym.texFraction, options: { fractionEgale: true } } }
    this.consigne = `Coordonnées du point $M$ milieu du segment $[AB]$ où $A(${xa}\\,;\\,${ya})$ et $B(${xb}\\,;\\,${yb})$<br>`
    this.consigne += remplisLesBlancs(this, 0, 'M(%{champ1};%{champ2})')

    this.correction = `Les coordonnées du milieu sont données par la moyenne des abscisses et la moyenne des ordonnées : <br>
      $x_M=\\dfrac{${xa}+${xb}}{2}=${miseEnEvidence(xm.texFraction)}$ et $y_M=\\dfrac{${ya}+${yb}}{2}=${miseEnEvidence(ym.texFraction)}$.<br>
      Ainsi,  $M(${miseEnEvidence(`${xm.texFraction}\\,;\\,${ym.texFraction}`)})$.`

    this.canEnonce = `Coordonnées du  milieu du segment $[AB]$ où $A(${xa}\\,;\\,${ya})$ et $B(${xb}\\,;\\,${yb})$`
    this.canReponseACompleter = ''
  }
}
