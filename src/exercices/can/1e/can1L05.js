import { choice } from '../../../lib/outils/arrayOutils'
import { ecritureParentheseSiNegatif, reduirePolynomeDegre3 } from '../../../lib/outils/ecritures'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'
import { context } from '../../../modules/context'

import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { functionCompare } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Résoudre une équation du second degré*'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '04/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Gilles Mora
 * Référence can1L04
 */
export const uuid = '7e740'
export const ref = 'can1L05'
export const refs = {
  'fr-fr': ['can1L05'],
  'fr-ch': []
}
export default function ResoudreEquationSecondDegre2 () {
  Exercice.call(this)
  this.nbQuestions = 1
  this.formatChampTexte = ''
  this.tailleDiaporama = 2

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    this.listeQuestions = [] // Liste de questions
    this.listeCorrections = [] // Liste de questions corrigées

    let texte, texteCorr, a, b, c, d, x1, x2
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      x1 = randint(-3, 3, 0)
      x2 = randint(-3, 3, [0, x1, -x1])
      a = randint(1, 2) * choice([-1, 1])
      b = -a * (x1 + x2)
      c = a * x1 * x2
      d = b * b - 4 * a * c
      while (d > 144) {
        a = randint(1, 5) * choice([-1, 1])
        x1 = randint(-5, 5, 0)
        x2 = randint(-5, 5, [0, x1, -x1])
        b = -a * (x1 + x2)
        c = a * x1 * x2
        d = b * b - 4 * a * c
      }

      texte = `$${reduirePolynomeDegre3(0, a, b, c)}=0$<br>

       Donner les solutions de cette équation`
      if (!this.interactif) {
        texte += '.'
      } else {
        texte += ' dans l\'ordre croissant :<br>'
        texte += remplisLesBlancs(this, i, ' %{champ1}  \\text{ et  }  %{champ2} ', KeyboardType.clavierDeBaseAvecFraction)
      }
      handleAnswers(this, i, {
        bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
        champ1: { value: Math.min(x1, x2), compare: functionCompare },
        champ2: { value: Math.max(x1, x2), compare: functionCompare }
      },
      { formatInteractif: 'mathlive' }
      )
      texteCorr = `${context.isHtml ? '<br>' : ''}$\\Delta = b^2-4ac=${ecritureParentheseSiNegatif(b)}^2-4\\times ${ecritureParentheseSiNegatif(a)}\\times ${ecritureParentheseSiNegatif(c)}=${d}>0$ donc l'équation admet deux solutions : $x_1 = \\dfrac{-b-\\sqrt{\\Delta}}{2a}$ et $x_2 = \\dfrac{-b+\\sqrt{\\Delta}}{2a}$`
      texteCorr += `<br>$x_1 = \\dfrac{${-b} -\\sqrt{${d}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${miseEnEvidence(texNombre((-b - Math.sqrt(d)) / (2 * a), 0))}$ et
       $x_2 = \\dfrac{${-b} +\\sqrt{${d}}}{2\\times ${ecritureParentheseSiNegatif(a)}}=${miseEnEvidence(texNombre((-b + Math.sqrt(d)) / (2 * a), 0))}$`
      if (this.questionJamaisPosee(i, a, x1, x2)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
    this.canEnonce = texte
    this.canReponseACompleter = ''
  }
}
