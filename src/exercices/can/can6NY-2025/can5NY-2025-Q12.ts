import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint } from '../../../modules/outils'
import { prenomF } from '../../../lib/outils/Personne'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
export const titre = 'Trouver une année'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '2c4e0'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class anneeATrouver extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const a = randint(30, 50)
    const prenom = prenomF(1)
    this.question = 'Si ' + prenom + ` a $${a}$ ans en $2025$, en quelle année est-elle naît  ?`
    this.reponse = 2025 - a
    this.correction = `Comme $${2025}-${a}=${texNombre(this.reponse, 0)}$, ${prenom} est naît en $${miseEnEvidence(texNombre(this.reponse))}$.`
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
