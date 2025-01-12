import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { toutPourUnPoint } from '../../../lib/interactif/mathLive'
import { randint } from '../../../modules/outils'
import { ecritureAlgebriqueSauf1 } from '../../../lib/outils/ecritures'
export const titre = 'Calculer les coordonnées d\'un vecteur'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e6edd'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class CoordonneesVecteurEgalite extends Exercice {
  constructor () {
    super()

    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
  }

  nouvelleVersion () {
    const xu = this.canOfficielle ? -1 : randint(-5, -2)
    const yu = this.canOfficielle ? 45 : randint(20, 30)
    const xv = this.canOfficielle ? 1 : randint(1, 5)
    const yv = this.canOfficielle ? 0 : randint(0, 1)

    const coeff = this.canOfficielle ? -2 : randint(-3, 3, [-1, 0, 1])
    const xw = xu + coeff * xv
    const yw = yu + coeff * yv

    this.reponse = { bareme: toutPourUnPoint, champ1: { value: xw }, champ2: { value: yw } }
    this.consigne = `Coordonnées de $\\vec{u}${ecritureAlgebriqueSauf1(coeff)}\\vec{v}$  où $\\vec{u}(${xu}\\,;\\,${yu})$ et $\\vec{v}(${xv}\\,;\\,${yv})$.<br>`
    if (this.interactif) { this.consigne += '<br>' }
    this.consigne += remplisLesBlancs(this, 0, '\\vec{w}(%{champ1};%{champ2})')

    this.correction = `Les coordonnées du vecteur $\\vec{w}$ sont  : <br>
      $x_{\\vec{w}}=${xu}${ecritureAlgebriqueSauf1(coeff)}\\times ${xv}=${miseEnEvidence(xw)}$ et
        $y_{\\vec{w}}=${yu}${ecritureAlgebriqueSauf1(coeff)}\\times ${yv}=${miseEnEvidence(yw)}$.<br>
      Ainsi,  $\\vec{w}(${miseEnEvidence(`${xw}\\,;\\,${yw}`)})$.`

    this.canEnonce = `Coordonnées de $\\vec{u}${ecritureAlgebriqueSauf1(coeff)}\\vec{v}$  où $\\vec{u}(${xu}\\,;\\,${yu})$ et $\\vec{v}(${xv}\\,;\\,${yv})$`
    this.canReponseACompleter = ''
  }
}
