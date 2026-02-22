
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import ExerciceCan from '../../ExerciceCan'
export const titre = 'Développer et réduire un carré'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'tpykz'
export const refs = {
  'fr-fr': [],
  'fr-ch': ['NR'],
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora

*/
export default class Can2a2026Q9 extends ExerciceCan {
 enonce(a?: number): void {
    if (a == null) {
      a = randint(2, 9)
    }
 this.optionsDeComparaison = { texteSansCasse: true }
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecVariable
    this.reponse = `x^2-${2 * a}x+${a * a}`
    this.question = `Développer, réduire, ordonner $(x-${a})^2$.`
    this.correction = `On utilise l'identité remarquable $(a-b)^2=a^2-2ab+b^2$ avec $a=x$ et $b=${a}$.<br>
$\\begin{aligned}(x-${a})^2&=x^2-2\\times x\\times ${a}+${a}^2\\\\
&=x^2-${2 * a}x+${a * a}\\\\
&=${miseEnEvidence(`x^2-${2 * a}x+${a * a}`)}\\end{aligned}$`
    
    this.canEnonce = this.question
    this.canReponseACompleter = ''
    
    if (this.interactif) {
      this.question += '<br>'
    }
  }

  nouvelleVersion(): void {
    this.canOfficielle ? this.enonce(3) : this.enonce()
  }
}