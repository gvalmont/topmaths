import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { calculCompare, fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { sp } from '../../../lib/outils/outilString'
import { toutPourUnPoint } from '../../../lib/interactif/mathLive'
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
    this.nbQuestionsModifiable = false
    this.formatInteractif = 'fillInTheBlank'
    this.compare = fonctionComparaison
    this.formatChampTexte = KeyboardType.clavierDeBase
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const a = 2025
    const b = choice([2024, 2026])
    const choix = choice([true, false])
    switch (randint(2, 2)) {
      case 1 :

        this.consigne = choix ? `L'image de $${texNombre(a, 0)}$ par la fonction $f$ est $${texNombre(b, 0)}$.` : `$${texNombre(b, 0)}$ est l'image de $${texNombre(a, 0)}$ par la fonction $f$.`
        this.consigne += '<br> Compléter l\'égalité correspondante.'
        this.question = 'f(%{champ1}) =%{champ2}'
        this.correction = `$f(${miseEnEvidence(texNombre(a, 0))}) =${miseEnEvidence(texNombre(b, 0))}$`
        handleAnswers(this, 0, {
          bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
          champ1: { value: String(a), compare: calculCompare },
          champ2: { value: String(b), compare: calculCompare }
        }
        )
        this.reponse = { bareme: toutPourUnPoint, champ1: { value: String(a), compare: fonctionComparaison }, champ2: { value: String(b), compare: fonctionComparaison } }
        this.canReponseACompleter = `$f(${sp()}\\ldots ${sp()}) =${sp()}\\ldots$`
        break

      case 2 :
        this.consigne = choix ? `Un antécédent de $${texNombre(a, 0)}$ par la fonction $f$ est $${texNombre(b, 0)}$.` : `$${texNombre(b, 0)}$ est un antécédent de  $${texNombre(a, 0)}$ par la fonction $f$.`
        this.consigne += '<br> Compléter l\'égalité correspondante.'
        this.question = 'f(%{champ1}) =%{champ2}'
        this.correction = `$f(${miseEnEvidence(texNombre(b, 0))}) =${miseEnEvidence(texNombre(a, 0))}$`
        handleAnswers(this, 0, {
          bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
          champ1: { value: String(b) },
          champ2: { value: String(a) }
        }
        )
        this.reponse = { bareme: toutPourUnPoint, champ1: { value: String(b), compare: fonctionComparaison }, champ2: { value: String(a), compare: fonctionComparaison } }
        this.canReponseACompleter = `$f(${sp()}\\ldots ${sp()}) =${sp()}\\ldots$`
        break
    }
    this.canEnonce = this.consigne
  }
}
