import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { texNombre } from '../../../lib/outils/texNombre'
export const titre = ''
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '3321e'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora
 * Référence
*/
export default class CalculDivers extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.compare = fonctionComparaison
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.listeCanEnonces = []
    this.listeCanReponsesACompleter = []
    const choix = randint(1, 3)
    if (choix === 1) {
      this.question = 'Quel est le plus grand nombre entier de quatre chiffres que l\'on peut écrire en utilisant, une seule fois, les quatre chiffres : $2$, $0$, $2$ et $5$ ?'
      this.reponse = texNombre(5220, 0)
      this.correction = ` Le plus grand nombre entier est $${miseEnEvidence(this.reponse)}$.`
    } else {
      this.question = 'Quel est le plus grand nombre entier de '
      switch (choix) {
        case 2 :
          this.question += 'cinq'
          this.reponse = texNombre(55222, 0)
          this.correction = ` Le plus grand nombre entier est $${miseEnEvidence(this.reponse)}$.`
          break
        case 3 :
          this.question += 'six'
          this.reponse = texNombre(552222, 0)
          this.correction = ` Le plus grand nombre entier est $${miseEnEvidence(this.reponse)}$.`
          break
      }
      this.question += ' chiffres que l\'on peut écrire en utilisant, deux fois maximum, les quatre chiffres : $2$, $0$, $2$ et $5$ ?'
    }

    if (this.interactif) { this.question += '<br>' }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
