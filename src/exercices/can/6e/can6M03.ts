import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Convertir en mètres'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021

 */
export const uuid = 'd52aa'

export const refs = {
  'fr-fr': ['can6M03'],
  'fr-ch': []
}
export default class ConvertirEnM extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    let a
    if (choice([true, false])) {
      a = randint(0, 5) * 10 + randint(1, 9)
      this.reponse = a * 1000
      this.question = `$${a}$ km font combien de mètres ?`
      this.correction = `Comme $1$ km $=1000$ m, $${a}$ km = $${texNombre(this.reponse)}$ m.`

      this.optionsChampTexte = { texteApres: ' m' }
    } else {
      a = randint(11, 24) * 10 + randint(0, 9)
      this.reponse = a / 100
      this.question = `$${a}$ cm font combien de mètres ?`
      this.correction = `Comme $1$ cm $=0,01$ m, $${a}$ cm = $${texNombre(this.reponse)}$ m.`

      this.optionsChampTexte = { texteApres: ' m' }
    }
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ m'
  }

  // this.besoinFormulaireNumerique = ['Type de questions', 2, '1 : km vers m\n2 : cm vers m']
}
