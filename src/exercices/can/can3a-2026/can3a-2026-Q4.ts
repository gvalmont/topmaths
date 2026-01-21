import { context } from '../../../modules/context'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import FractionEtendue from '../../../modules/FractionEtendue'

export const titre = 'Effectuer une conversion d\'unités'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ssrbd'
export const refs = {
  'fr-fr': [],
  'fr-ch': [],
}

/**
 * @author Gilles Mora

*/
export default class Can3026Q4 extends ExerciceCan {
   enonce(valeur?: number, uniteDepart?: string, uniteArrivee?: string) {
    if (valeur == null || uniteDepart == null || uniteArrivee == null) {
      // Version aléatoire
      if (choice([true, false])) {
        // dm vers m
        valeur = randint(3, 15)
        uniteDepart = 'dm'
        uniteArrivee = 'm'
      } else {
        // m vers dm
        valeur = randint(15, 60)
        uniteDepart = 'm'
        uniteArrivee = 'dm'
      }
    }

    if (uniteDepart === 'dm' && uniteArrivee === 'm') {
      // dm vers m
      this.formatChampTexte = KeyboardType.clavierDeBase
      this.reponse = new FractionEtendue(valeur, 10).texFraction
      this.question = `Complète : <br>$${valeur}\\text{ dm}=$`
      this.correction = `Comme $1\\text{ m}$ $=10\\text{ dm}$, alors $1\\text{ dm}=0,1\\text{ m}$.<br>
Ainsi, pour passer des $\\text{dm}$ au $\\text{m}$, on divise par $10$.<br>
Comme $${valeur}\\div 10 =${texNombre(valeur / 10, 1)}$, alors $${valeur}\\text{ dm}=${miseEnEvidence(texNombre(valeur / 10, 1))}\\text{ m}$.`
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = `$${valeur}\\text{ dm}=\\ldots\\text{ m}$`
      if (this.interactif) {
        this.optionsChampTexte = { texteApres: '$\\text{ m}$' }
      } else {
        this.question += `${context.isHtml ? '$\\ldots\\text{ m}$' : ''}`
      }
    } else if (uniteDepart === 'm' && uniteArrivee === 'dm') {
      // m vers dm
      this.formatChampTexte = KeyboardType.clavierNumbers
      this.reponse = valeur * 10
      this.question = `Complète : <br>$${texNombre(valeur, 0)}\\text{ m}$ $=$`
      this.correction = `Comme $1\\text{ m}$ $=10\\text{ dm}$, pour passer des $\\text{m}$ au $\\text{dm}$, on multiplie par $10$.<br>
Comme $${texNombre(valeur, 1)}\\times 10 =${texNombre(valeur * 10, 0)}$, alors $${texNombre(valeur, 2)}\\text{ m}=${miseEnEvidence(texNombre(valeur * 10, 0))}\\text{ dm}$.`
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = `$${texNombre(valeur, 0)}\\text{ m}$ $= \\ldots\\text{ dm}$`
      if (this.interactif) {
        this.optionsChampTexte = { texteApres: ' $\\text{ dm}$' }
      } else {
        this.question += `${context.isHtml ? ' $\\ldots\\text{ dm}$' : ''}`
      }
    } else if (uniteDepart === 'm' && uniteArrivee === 'mm') {
      // m vers mm (version officielle)
      this.formatChampTexte = KeyboardType.clavierNumbers
      this.reponse = valeur * 1000
      this.question = `Complète : <br>$${texNombre(valeur, 1)}\\text{ m}$ $=$`
      this.correction = `Comme $1\\text{ m}$ $=1000\\text{ mm}$, pour passer des $\\text{m}$ au $\\text{mm}$, on multiplie par $1000$.<br>
Comme $${texNombre(valeur, 1)}\\times 1000 =${texNombre(valeur * 1000, 0)}$, alors $${texNombre(valeur, 1)}\\text{ m}=${miseEnEvidence(texNombre(valeur * 1000, 0))}\\text{ mm}$.`
      this.canEnonce = 'Complète.'
      this.canReponseACompleter = `$${texNombre(valeur, 1)}\\text{ m}$ $= \\ldots\\text{ mm}$`
      if (this.interactif) {
        this.optionsChampTexte = { texteApres: ' $\\text{ mm}$' }
      } else {
        this.question += `${context.isHtml ? ' $\\ldots\\text{ mm}$' : ''}`
      }
    }
  }

  nouvelleVersion() {
    this.canOfficielle ? this.enonce(0.6, 'm', 'mm') : this.enonce()
  }
}
