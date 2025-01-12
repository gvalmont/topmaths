import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
export const titre = 'Appliquer 25 % sur un nombre'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'c9016'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora

*/
export default class AppliquerPourcentage extends Exercice {
  constructor () {
    super()

    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecFraction
    this.optionsChampTexte = { texteAvant: ' $=$' }
  }

  nouvelleVersion () {
    if (this.canOfficielle) {
      this.reponse = 20
      this.question = '$25\\,\\%$ de $80$'
      this.correction = `$25\\,\\%$ de $80 = ${miseEnEvidence(20)}$`
      this.correction += `<br>Prendre $25\\,\\%$  de $80$ revient à prendre le quart de 80.<br>
      Ainsi, $25\\,\\%$ de $80$ est égal à $80\\div 4 =20$.
   `
    } else {
      const a = choice([randint(2, 9) * 4, randint(1, 5) * 40])
      const p = 25
      this.reponse = a / 4
      this.question = `$${p}\\,\\%$ de $${a}$`

      this.correction = `$${p}\\,\\%$ de $${a} = ${miseEnEvidence(texNombre(this.reponse))}$`
      this.correction += `<br> Prendre $${p}\\,\\%$  de $${a}$ revient à prendre $${p / 10}\\times 10\\,\\%$  de $${a}$.<br>
      Comme $10\\,\\%$  de $${a}$ vaut $${a / 10}$ (pour prendre $10\\,\\%$  d'une quantité, on la divise par $10$), alors
      $${p}\\,\\%$ de $${a}=${p / 10}\\times ${a / 10}=${this.reponse}$.
     `
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
