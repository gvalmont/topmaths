import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif, rienSi1 } from '../../../lib/outils/ecritures'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = 'Déterminer la valeur de $p$ dans une fonction affine'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '30/11/2024'
export const uuid = '25d1f'
export const refs = {
  'fr-fr': ['can2F23'],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class TrouverpFonctionAffine extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    // this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
  }

  nouvelleVersion () {
    const nom = ['f', 'g', 'h']
    const nomF = choice(nom)
    const a = randint(-10, 10, 0)
    const b = randint(-10, 10, 0)
    const m = randint(-10, 10, 0)
    const p = b - m * a
    this.reponse = texNombre(p, 0)
    this.question = `$${nomF}$ est  la fonction définie par $${nomF}(x)=${rienSi1(m)}x+p$.<br>
    Déterminer la valeur de $p$ sachant que $${nomF}(${a})=${b}$.`
    this.correction = `Comme $${nomF}(${a})=${b}$, alors : <br>
    $\\begin{aligned}
    ${rienSi1(m)}\\times ${ecritureParentheseSiNegatif(a)}+p&=${b}\\\\
    ${m * a}+p&=${b}\\\\
    p&=${miseEnEvidence(this.reponse)}
    \\end{aligned}$`
    if (this.interactif) { this.question += '<br>$p=$' }
    this.canEnonce = this.question
    this.canReponseACompleter = '$p=\\ldots$'
  }
}
