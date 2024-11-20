import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint } from '../../../modules/outils'
import { choice } from '../../../lib/outils/arrayOutils'
import Decimal from 'decimal.js'
export const titre = 'Écrire un décimal sous une forme particulière'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '27504'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora+Eric Elter
*/
export default class decimalPuisance extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierFullOperations
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { fractionEgale: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const puissance = randint(1, 5)
    const puissance10 = 10 ** puissance
    const a = choice([2025, -2025])
    const dec = new Decimal(a).div(puissance10)
    this.reponse = `\\dfrac{${a}}{10^{${puissance}}}`

    this.question = `Écrire $${texNombre(dec, 5)}$ sous la forme $\\dfrac{a}{10^n}$ avec $a\\in \\mathbb{Z}$ et $n\\in \\mathbb{N}$, $n$ le plus petit possible.`
    this.correction = `$${texNombre(dec, 5)}=${miseEnEvidence(`\\dfrac{${texNombre(a, 0)}}{10^{${puissance}}}`)}$`
    if (this.interactif) { this.question += `<br>$${texNombre(dec, 5)}=$` }
    this.canEnonce = this.question
    this.canReponseACompleter = `$${texNombre(dec, 5)}=\\ldots$`
  }
}
