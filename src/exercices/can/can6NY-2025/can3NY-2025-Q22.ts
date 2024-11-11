import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
export const titre = 'Trouver un nombre à partir d\'un programme'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '448b5'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 * Référence
*/
export default class programmeCalcul extends Exercice {
  constructor () {
    super()
    this.titre = titre
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatInteractif = 'calcul'
    this.compare = fonctionComparaison
    this.formatChampTexte = KeyboardType.clavierDeBase
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const b = randint(2, 10) * 100 + 25
    this.reponse = (2025 - b) / 100
    this.question = `Je pense à un nombre. <br>
    Je le multiplie par $100$, puis j'ajoute au résultat $${texNombre(b, 0)}$ et j'obtiens $${texNombre(2025, 0)}$. <br>
  Quel est ce nombre ?`
    this.correction = `Pour obtenir $${texNombre(2025, 0)}$, on a ajouté $${texNombre(2025 - b)}$ à $${texNombre(b, 0)}$ et le nombre qui, multiplié par $100$ donne $${texNombre(2025 - b)}$ est $${texNombre(this.reponse)}$.<br>
    Le nombre choisi au départ est donc $${miseEnEvidence(`${this.reponse}`)}$.`
    if (this.interactif) { this.question += '<br><br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
