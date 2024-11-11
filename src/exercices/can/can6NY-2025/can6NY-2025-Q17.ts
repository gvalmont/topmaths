import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { sp } from '../../../lib/outils/outilString'
export const titre = 'Compléter une suite d\'heures/minutes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'cd8eb'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class SuiteACompleterHeures extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { HMS: true }
    this.formatChampTexte = KeyboardType.clavierHms
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const h = 20
    const k = randint(14, 16)

    this.question = `Compléter la suite : <br>
         $${h}$ h $25$ min ${sp(3)}; ${sp(3)}$${h}$ h $${25 + k}$ min ${sp(3)}; ${sp(3)}$${h}$ h $${25 + 2 * k}$ min ${sp(3)}; ${sp(3)} `

    this.correction = `On ajoute $${k}$ minutes à chaque fois, donc l'heure qui suit est $${miseEnEvidence(texNombre(h + 1, 0))}$ h $${miseEnEvidence(texNombre(25 + 3 * k - 60, 0))}$ min.`
    this.reponse = { reponse: { value: `${h + 1}h ${25 + 3 * k - 60}`, compare: fonctionComparaison, options: { HMS: true } } }
    if (!this.interactif) { this.question += '$\\ldots$ h $\\ldots$ min' }

    this.canEnonce = 'Compléter la suite.'
    this.canReponseACompleter = `$${h}$ h $25$ min <br> $${h}$ h $${25 + k}$ min <br> $${h}$ h $${25 + 2 * k}$ min <br>  $\\ldots$ h $\\ldots$ min`
  }
}
