import ExerciceSimple from '../../ExerciceSimple'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { creerNomDePolygone } from '../../../lib/outils/outilString'
import { arrondi } from '../../../lib/outils/nombres'

import { toutPourUnPoint } from '../../../lib/interactif/mathLive'
import FractionEtendue from '../../../modules/FractionEtendue'
import { ecritureParentheseSiNegatif } from '../../../lib/outils/ecritures'
export const titre = "Calculer les coordonnées d'un milieu"
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '2bkn0'
export const refs = {
  'fr-fr': [],
  'fr-ch': ['NR'],
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 */
export default class coordMilieu2026 extends ExerciceSimple {
  constructor() {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
  }

  nouvelleVersion() {
    const annee = 2026
    const nom = creerNomDePolygone(2, ['PQDO'])
    const b = this.canOfficielle ? -4 : randint(-5, 5) * 2
    const c = this.canOfficielle ? 4 : randint(-5, 5) * 2
    const reponse1 = new FractionEtendue(annee + b, 2).texFraction
    const reponse2 = new FractionEtendue(annee + c, 2).texFraction
    this.consigne = `Dans un repère du plan, on donne $${nom[0]}(${texNombre(annee, 0)}\\,;\\,${c})$ et $${nom[1]}(${b}\\,;\\,${texNombre(annee, 0)})$.<br>
        Déterminer les coordonnées (sous forme décimale) du milieu de $[${nom[0] + nom[1]}]$.`
    this.question = '(%{champ1}\\,;\\,%{champ2})'
    this.correction = `Les coordonnées du milieu sont données par :
        $\\left(\\dfrac{${texNombre(annee, 0)}+${ecritureParentheseSiNegatif(b)}}{2};\\dfrac{${c}+${texNombre(annee, 0)}}{2}\\right)=
        \\left(\\dfrac{${texNombre(annee + b, 0)}}{2};\\dfrac{${texNombre(c + annee, 0)}}{2}\\right)=
        ${miseEnEvidence(`(${texNombre((annee + b) / 2, 1)};${texNombre((c + annee) / 2, 1)})`)}$.<br>`
    this.reponse = `(${arrondi((annee + b) / 2, 1)};${arrondi((c + annee) / 2, 1)})`

    handleAnswers(this, 0, {
      bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
      champ1: { value: reponse1 },
      champ2: { value: reponse2 },
    })
    this.reponse = {
      bareme: toutPourUnPoint,
      champ1: { value: reponse1 },
      champ2: { value: reponse2 },
    }
    this.formatInteractif = 'fillInTheBlank'
    this.canReponseACompleter = '$(\\,\\ldots\\,;\\,\\ldots\\,)$'
    this.canEnonce = this.consigne
  }
}
