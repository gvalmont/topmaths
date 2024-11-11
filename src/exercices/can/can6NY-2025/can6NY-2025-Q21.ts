import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Rechercher un nombre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '1836e'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class rechercherUnNombre extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const a = randint(5, 20)
    this.reponse = texNombre(a, 0)

    this.question = `En ajoutant un nombre à $${texNombre(2025, 0)}$, on obtient $${2025 + a}$.<br>
        Quel nombre a-t-on ajouté ?`
    this.correction = `Comme $${a}+ ${texNombre(2025, 0)}=${2025 + a}$, 
        le nombre ajouté est $${miseEnEvidence(this.reponse)}$.`

    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
