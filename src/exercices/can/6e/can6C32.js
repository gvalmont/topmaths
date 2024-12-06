import { texteParPosition } from '../../../lib/2d/textes.ts'
import Pyramide from '../../../modules/pyramide.js'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { mathalea2d } from '../../../modules/2dGeneralites.js'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Calculer dans une pyramide additive'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '09/05/2022'
/**
 * @author  Jean-Claude Lhote
 */
export const uuid = '109ae'
export const ref = 'can6C32'
export const refs = {
  'fr-fr': ['can6C32'],
  'fr-ch': []
}
export default function Pyramide3Etages () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.typeExercice = 'simple'
  this.tailleDiaporama = 2
  this.nouvelleVersion = function () {
    const pyr = new Pyramide({ operation: '+', nombreEtages: 3, rangeData: [3, 10], exclusions: [0] })
    pyr.isVisible = [[false], [false, false], [true, true, true]]
    this.question = `Chaque case contient la somme des deux cases sur lesquelles elle repose. Quel est le nombre qui correspond à * ?<br>
    ${mathalea2d({ xmin: 0, ymin: 0, xmax: 12, ymax: 3.5, scale: 0.6 }, pyr.representeMoi(0, 0), texteParPosition('*', 6, 2.5))}`
    this.reponse = pyr.valeurs[0][0]
    pyr.isVisible = [[true], [true, true], [true, true, true]]
    this.correction = `Le nombre qui se trouve au sommet de la pyramide est : $${miseEnEvidence(this.reponse)}$.<br>
    ${mathalea2d({ xmin: 0, ymin: 0, xmax: 12, ymax: 3.5, scale: 0.6 }, pyr.representeMoi(0, 0))}`
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
