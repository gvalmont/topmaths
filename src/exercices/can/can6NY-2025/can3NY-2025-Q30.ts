import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = ''
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '30f80'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora
 * Référence
*/
export default class ComparerFractions extends Exercice {
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
    const annee = 2025
    const b = choice([8, 11, 23])
    const c = choice([13, 17, 19, 31])
    if (choice([true, false])) {
      this.reponse = 0
      this.question = `Utiliser l'égalité $ ${texNombre(annee, 0)} = ${b} \\times  ${texNombre(annee / b - 1, 0)} + ${b} $ pour donner le reste de la division euclidienne de $ ${texNombre(annee, 0)} $ par $ ${b}$`
      this.correction = ` Comme $${b}$ n'est pas inférieur à $${b}$, l'égalité 
        $ ${texNombre(annee, 0)} = ${b} \\times  ${texNombre(annee / b - 1, 0)} + ${b} $ ne traduit pas directement la division euclidienne de $ ${texNombre(annee, 0)} $ par ${b}. <br>
        Transformons cette égalité en :  $${texNombre(annee, 0)}= ${texNombre(annee, 0)} = ${b} \\times  ${texNombre(annee / b - 1, 0)} + 1\\times ${b}=${b} \\times  ${texNombre(annee / b, 0)} $  qui montre que le reste  de la division euclidienne de $ ${texNombre(annee, 0)} $ par $ ${b} $ est $${miseEnEvidence('0')}$.`
    } else {
      this.question = `Utiliser l'égalité $ ${texNombre(annee, 0)} = ${c} \\times ${Math.floor(annee / c) - 1} + ${annee - c * Math.floor(annee / c) + c} $ pour donner le reste de la division euclidienne de $ ${texNombre(annee, 0)} $ par $ ${c}$`
      this.correction = ` Comme $${annee - c * Math.floor(annee / c) + c}$ n'est pas inférieur à $${c}$, l'égalité 
        $ ${texNombre(annee, 0)} = ${c} \\times ${Math.floor(annee / c) - 1} + ${annee - c * Math.floor(annee / c) + c} $ ne traduit pas directement l'expression de la division euclidienne de $ ${texNombre(annee, 0)} $ par ${c}. <br>
        Transformons cette égalité en :
        $${texNombre(annee, 0)}= ${c} \\times ${Math.floor(annee / c) - 1}+ ${c} + ${annee - c * Math.floor(annee / c)}=${c} \\times ${Math.floor(annee / c)} + ${annee - c * Math.floor(annee / c)}$.<br>
        Le reste est donc   $${miseEnEvidence(texNombre(annee - c * Math.floor(annee / c), 0))}$.`
      this.reponse = annee - c * Math.floor(annee / c)
    }
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
