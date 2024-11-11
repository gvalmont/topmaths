import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import FractionEtendue from '../../../modules/FractionEtendue'
export const titre = 'Simplifier une fraction simple'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '663ca'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 * Référence
*/
export default class simplifierFractionSimple extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const n = choice([2025, -2025])
    const d = choice([-1, 1, 2025, -2025])
    // this.optionsDeComparaison = abs(d) === 1 ? { fractionIrreductible: true } : { nombreDecimalSeulement: true }
    this.reponse = new FractionEtendue(n, d).toLatex()
    this.question = `Écrire le plus simplement possible : $\\dfrac{${texNombre(n)}}{${texNombre(d)}}$`
    this.correction = `$\\dfrac{${texNombre(n)}}{${texNombre(d)}}=${miseEnEvidence(this.reponse)}$`
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
