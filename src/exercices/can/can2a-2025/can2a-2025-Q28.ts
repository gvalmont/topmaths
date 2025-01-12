import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
export const titre = 'Résoudre une équation'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '30b10'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
*/
export default class ResoudreUneEquation extends Exercice {
  constructor () {
    super()

    this.canOfficielle = true
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierEnsemble
    this.optionsDeComparaison = { ensembleDeNombres: true }
    this.optionsChampTexte = { texteAvant: '$S=$', texteApres: '' }
  }

  nouvelleVersion () {
    const b = randint(1, 12)
    const a = this.canOfficielle ? -4 : b ** 2 * choice([-1, 1])
    this.question = `Résoudre dans $\\mathbb{R}$ : $x^{2}=${a}$`
    this.correction = ` On reconnaît une équation du type $x^2=k$ avec $k=${a}$.<br>`
    if (a > 0) {
      this.correction += `Puisque $${a}$ est strictement positif, l'équation a deux solutions : `
      this.correction += ` $-\\sqrt{${a}}=-${b}$ et $\\sqrt{${a}}=${b}$.<br>`
      this.correction += `Ainsi, $S=${miseEnEvidence(`\\{-${b}\\,;\\,${b}\\}`)}$.`
      this.reponse = [`\\{-${b};${b}\\}`, `\\{-\\sqrt{${a}};\\sqrt{${a}}\\}`, `\\{\\sqrt{${a}};-\\sqrt{${a}}\\}`, `\\{${b};-${b}\\}`,
                    `-${b};${b}`, `-\\sqrt{${a}};\\sqrt{${a}}`, `\\sqrt{${a}};-\\sqrt{${a}}`, `${b};-${b}`
      ]
    } else {
      this.reponse = ['\\emptyset', '\\{\\emptyset\\}']
      this.correction += `Puisque $${a}$ est strictement négatif, l'équation n'a pas de solution.<br>
          Ainsi, $S=${miseEnEvidence('\\emptyset')}$.`
    }
    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
