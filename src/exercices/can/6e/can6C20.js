import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { calculANePlusJamaisUtiliser, randint } from '../../../modules/outils.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { bleuMathalea } from '../../../lib/colors'
export const titre = 'Trouver le complément à 1'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/*!
 * @author Jean-Claude Lhote & Gilles Mora
 * Créé pendant l'été 2021
 */
export const uuid = '9e396'
export const ref = 'can6C20'
export const refs = {
  'fr-fr': ['can6C20'],
  'fr-ch': []
}
export default function ComplementAUn () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.typeExercice = 'simple'
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    let a
    let correctionSup
    switch (choice([1, 2, 3])) {
      case 1:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 10)
        correctionSup = texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $10$ dixièmes.<br>
    On enlève $${texNombre(10 * a)}$ dixièmes à $10$ dixièmes, il en reste $${texNombre(10 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `, bleuMathalea)
        break
      case 2:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 100)
        correctionSup = texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $100$ centièmes.<br>
    On enlève $${texNombre(100 * a)}$ centièmes à $100$ centièmes, il en reste $${texNombre(100 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `, bleuMathalea)
        break
      case 3:
        a = calculANePlusJamaisUtiliser(randint(2, 9) / 1000)
        correctionSup = texteEnCouleur(`
    <br> Mentalement : <br>
    $1$ unité = $1000$ millièmes.<br>
    On enlève $${texNombre(1000 * a)}$ millièmes à $1000$ millièmes, il en reste $${texNombre(1000 * (1 - a))}$.<br>
    Ainsi, $1-${texNombre(a)}=${texNombre(1 - a)}$.  `, bleuMathalea)
        break
    }
    this.question = `Calculer $1-${texNombre(a)}$.`
    this.correction = `$1-${texNombre(a)}=${miseEnEvidence(texNombre(1 - a))}$<br>` + correctionSup
    this.reponse = calculANePlusJamaisUtiliser(1 - a)

    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
