import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceSimple from '../../ExerciceSimple'

import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { texNombre } from '../../../lib/outils/texNombre'
import { context } from '../../../modules/context'
import { randint } from '../../../modules/outils'
export const titre = 'Calculer une valeur dans un tableau de proportionnalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'yyalm'
export const refs = {
  'fr-fr': [],
  'fr-ch': ['NR'],
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 */
export default class CalculTabProp2026 extends ExerciceSimple {
  constructor() {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsChampTexte = { texteAvant: '<br><br>' }
  }

  nouvelleVersion() {
    const a = randint(1, 6) * 2
    const k = this.canOfficielle ? 2 : choice([ 2, 0.5])
    const b = a * k
    const annee = 2026
    const reponse = annee * k

    this.question = 'Compléter le tableau de proportionnalité :<br><br>'
    this.question += `$
              \\begin{array}{|c|c|}
              \\hline
              ${texNombre(a, 0)}&${texNombre(b, 0)}${context.isHtml ? '\\\\' : '\\tabularnewline'}
              \\hline
              ${texNombre(annee, 0)}&${context.isHtml ? '\\\\' : '\\tabularnewline'}
              \\hline
              \\end{array}
              $`
    this.correction = `On constate que $${texNombre(b, 0)}=${texNombre(a, 0)}\\times ${texNombre(k, 1)}$.<br>
              Donc, la valeur cherchée est : $${texNombre(annee)}\\times ${texNombre(k, 1)} =${miseEnEvidence(texNombre(reponse, 0))}$.`
    this.reponse = reponse.toFixed(0)

    this.canEnonce = 'Compléter le tableau de proportionnalité.'

    this.canReponseACompleter = `$
              \\begin{array}{|c|c|}
              \\hline
              ~~~${a}~~~&~~~${b}~~~\\tabularnewline
              \\hline
              ${annee}&\\tabularnewline
              \\hline
              \\end{array}
              $`
  }
}
