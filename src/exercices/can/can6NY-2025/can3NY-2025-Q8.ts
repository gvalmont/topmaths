import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import Decimal from 'decimal.js'
import { randint } from '../../../modules/outils'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Calculer avec des décimaux'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'e2101'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 * Référence
*/
export default class calcAvecDecimaux extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.optionsChampTexte = { texteAvant: ' $=$' }
    this.formatChampTexte = ''
    this.compare = fonctionComparaison
    this.formatChampTexte = KeyboardType.clavierDeBase
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const a = new Decimal(randint(1, 29, [10, 20])).div(choice([10, 100]))
    this.reponse = texNombre(new Decimal(2025).sub(a), 2)
    this.question = `$${texNombre(2025)}-${texNombre(a, 2)}$`
    this.correction = `$${texNombre(2025)}-${texNombre(a, 2)}=${miseEnEvidence(this.reponse)}$`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
