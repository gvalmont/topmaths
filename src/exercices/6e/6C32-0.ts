import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { listeDeProblemesAdditifs } from '../../lib/problems/problemesAdditifs/problemesAdditifs'
import { gestionnaireFormulaireTexte } from '../../modules/outils'
import Exercice from '../Exercice'
import { listeDeProblemesMultiplicatifs } from '../../lib/problems/problemesMultiplicatifs/problemesMultiplicatifs'
import { listeDeProblemesPartage } from '../../lib/problems/ProblemesPartage/problemesPartage'
import { listeDeProblemesMultiplicatifsComplexes } from '../../lib/problems/problemesMultiplicatifsComplexes/problemesMultiplicatifsComplexes'

export const dateDePublication = '06/06/2025'
export const interactifType = 'mathLive'
export const interactifReady = true
export const amcType = 'AMCNum'
export const amcReady = true
export const uuid = 'b3aa4'
export const refs = {
  'fr-fr': ['6C32-0'],
  'fr-ch': []
}
export const titre = 'Résoudre des problèmes variés'
/**
 * @author Jean-Claude Lhote
 */
export default class ProblemesVaries extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.besoinFormulaireTexte = ['Types de problèmes', 'Nombres séparés par des tirets\n1 : Problèmes additifs simples\n2 : Problèmes multiplicatifs simples\n3 : Problèmes de partage\n4 : Problèmes multiplicatifs complexes\n: 5 Mélange']
    // this.besoinFormulaire2CaseACocher = ['Avec des nombres décimaux quand c\'est possible', false]
    this.sup2 = false // pour l'instant pas de décimaux quasiment dans les problèmes
    this.sup = '5'
  }

  nouvelleVersion () {
    const typesDeProblemes = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 4, defaut: 5, melange: 5, nbQuestions: this.nbQuestions }).map(Number)
    const problemesAdditifs = combinaisonListes(listeDeProblemesAdditifs, this.nbQuestions)
    const problemesMultiplicatifs = combinaisonListes(listeDeProblemesMultiplicatifs, this.nbQuestions)
    const problemesPartage = combinaisonListes(listeDeProblemesPartage, this.nbQuestions)
    const problemesComplexes = combinaisonListes(listeDeProblemesMultiplicatifsComplexes, this.nbQuestions)
    const fonctionsProblemes = []
    let indexAdditifs = 0
    let indexMultiplicatifs = 0
    let indexPartage = 0
    let indexComplexes = 0

    for (let i = 0; i < this.nbQuestions; i++) {
      fonctionsProblemes.push(
        typesDeProblemes[i] === 1
          ? problemesAdditifs[indexAdditifs++]
          : typesDeProblemes[i] === 2
            ? problemesMultiplicatifs[indexMultiplicatifs++]
            : typesDeProblemes[i] === 3
              ? problemesPartage[indexPartage++]
              : problemesComplexes[indexComplexes++])
    }

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const probleme = fonctionsProblemes[i](this.sup2 ?? false)
      const question = this.interactif
        ? `${probleme.enonce}<br>${ajouteChampTexteMathLive(this, i, probleme.styleChampTexteMathlive ?? '', probleme.optionsChampTexteMathlive)}`
        : probleme.enonce
      if (this.interactif) {
        handleAnswers(this, i, { reponse: { value: probleme.reponse, compare: probleme.compare ?? fonctionComparaison, options: probleme.optionsComparaison ?? {} } })
      }
      if (this.questionJamaisPosee(i, probleme.enonce)) {
        this.listeQuestions.push(question)
        this.listeCorrections.push(probleme.correction + '<br><br>' + probleme.schema.display())
        i++
      }
      cpt++
    }
  }
}
