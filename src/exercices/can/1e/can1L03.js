import { reduireAxPlusB, rienSi1 } from '../../../lib/outils/ecritures'
import Exercice from '../../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../../modules/outils.js'
import { remplisLesBlancs } from '../../../lib/interactif/questionMathLive'

import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'

export const titre = 'Trouver les racines à partir d’une forme factorisée'
export const interactifReady = true
export const interactifType = 'mathLive'

// Les exports suivants sont optionnels mais au moins la date de publication semble essentielle
export const dateDePublication = '01/06/2022' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 *
 * @author Gilles Mora
 */
export const uuid = 'a23a1'
export const ref = 'can1L03'
export const refs = {
  'fr-fr': ['can1L03'],
  'fr-ch': []
}
export default function RacinesPoly () {
  Exercice.call(this)
  this.nbQuestions = 1

  // Dans un exercice simple, ne pas mettre de this.listeQuestions = [] ni de this.consigne

  this.nouvelleVersion = function () {
    let texte, texteCorr
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const a = randint(-9, 9, 0)
      const x1 = randint(-9, 9)
      const x2 = randint(-9, 9, [0, x1])
      if (x1 === 0) {
        texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
        $f(x)=${rienSi1(a)}x(${reduireAxPlusB(1, -x2)})$. <br>`
      } else {
        texte = `Soit $f$ la fonction définie sur $\\mathbb{R}$ par :
        $f(x)=${rienSi1(a)}(${reduireAxPlusB(1, -x1)})(${reduireAxPlusB(1, -x2)})$. <br>
      Déterminer les racines de $f$.`
      }
      if (this.interactif) {
        texte += '<br>Écrire ces racines dans l\'ordre croissant : '
        texte += remplisLesBlancs(this, i, ' %{champ1}  \\text{ et  }  %{champ2} ', KeyboardType.clavierDeBaseAvecFraction)
      }
      handleAnswers(this, i, {
        bareme: (listePoints) => [Math.min(listePoints[0], listePoints[1]), 1],
        champ1: { value: Math.min(x1, x2), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } },
        champ2: { value: Math.max(x1, x2), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } }
      }
      )
      texteCorr = `$f$ est une fonction polynôme du second degré écrite sous forme factorisée $a(x-x_1)(x-x_2)$.<br>
      Les racines sont donc $x_1=${miseEnEvidence(x1)}$ et $x_2=${miseEnEvidence(x2)}$.`
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
