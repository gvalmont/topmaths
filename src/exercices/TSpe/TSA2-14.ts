import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { tableauDeVariation } from '../../lib/mathFonctions/etudeFonction'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import {
  ecritureParentheseSiNegatif,
  reduireAxPlusB,
} from '../../lib/outils/ecritures'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const titre =
  'Calculer la limite d’une fonction rationnelle en un réel'
export const dateDePublication = '08/08/2026'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = '37ce6'
export const refs = {
  'fr-fr': ['TSA2-14', 'TCA2-14'],
  'fr-ch': [],
}

type TypeNumerateur = 'constantPositif' | 'constantNegatif' | 'affine'
type Cote = '+' | '-'

/**
 * Limites unilatérales de quotients dont le dénominateur tend vers zéro.
 * @author Stéphane Guyon
 */
export default class LimitesUnilateralesQuotients extends Exercice {
  constructor() {
    super()
    this.nbQuestions = 3
  }

  nouvelleVersion(): void {
    

    const typesNumerateurs = combinaisonListes<TypeNumerateur>(
      ['constantPositif', 'constantNegatif', 'affine'],
      this.nbQuestions,
    )
    const cotes = combinaisonListes<Cote>(['+', '-'], this.nbQuestions)

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; cpt++) {
      const a = randint(-5, 5)
      const cote = cotes[i]
      const coefficientDenominateur = randint(-5, 5, 0)
      const denominateur = reduireAxPlusB(
        coefficientDenominateur,
        -coefficientDenominateur * a,
      )

      let numerateur: string
      let imageNumerateur: number
      let calculImageNumerateur: string

      switch (typesNumerateurs[i]) {
        case 'constantPositif':
          imageNumerateur = randint(1, 9)
          numerateur = `${imageNumerateur}`
          calculImageNumerateur = `${imageNumerateur}`
          break
        case 'constantNegatif':
          imageNumerateur = -randint(1, 9)
          numerateur = `${imageNumerateur}`
          calculImageNumerateur = `${imageNumerateur}`
          break
        case 'affine': {
          const coefficientNumerateur = randint(-5, 5, 0)
          imageNumerateur = randint(-8, 8, 0)
          const constanteNumerateur =
            imageNumerateur - coefficientNumerateur * a
          numerateur = reduireAxPlusB(
            coefficientNumerateur,
            constanteNumerateur,
          )
          calculImageNumerateur = `${coefficientNumerateur}\\times ${ecritureParentheseSiNegatif(a)}${constanteNumerateur === 0 ? '' : constanteNumerateur > 0 ? `+${constanteNumerateur}` : constanteNumerateur}=${imageNumerateur}`
          break
        }
      }

      const signeXMoinsA = cote === '+' ? 1 : -1
      const signeDenominateur =
        coefficientDenominateur * signeXMoinsA > 0 ? 1 : -1
      const zeroLateral = signeDenominateur > 0 ? '0^+' : '0^-'
      const signeLimite = imageNumerateur * signeDenominateur > 0 ? 1 : -1
      const reponse = signeLimite > 0 ? '+\\infty' : '-\\infty'
      const expression = `\\dfrac{${numerateur}}{${denominateur}}`
      const indiceLimite = `x\\to ${a}^{${cote}}`
const calculImageDenominateur = `${coefficientDenominateur}\\times ${ecritureParentheseSiNegatif(a)}${-coefficientDenominateur * a === 0 ? '' : -coefficientDenominateur * a > 0 ? `+${-coefficientDenominateur * a}` : -coefficientDenominateur * a}`
      let texte = `Soit $f$ la fonction définie sur $\\mathbb R\\setminus\\{${a}\\}$ par $f(x)=${expression}$.<br>`
      if (this.interactif) {
        texte += `$\\displaystyle \\lim_{${indiceLimite}}f(x)=$${ajouteChampTexteMathLive(this, i, KeyboardType.clavierLimites)}`
      } else {
        texte += `Calculer $\\displaystyle \\lim_{${indiceLimite}}f(x)$.`
      }

      const solutionInequation =
        coefficientDenominateur > 0 ? `x>${a}` : `x<${a}`
      const signeGauche = coefficientDenominateur > 0 ? '-' : '+'
      const signeDroite = coefficientDenominateur > 0 ? '+' : '-'
      const signeGaucheAffiche =
        cote === '-' ? `\\textcolor{red}{${signeGauche}}` : signeGauche
      const signeDroiteAffiche =
        cote === '+' ? `\\textcolor{red}{${signeDroite}}` : signeDroite
      const ligneSignes = [
        'Line',
        30,
        '',
        0,
        signeGaucheAffiche,
        20,
        'z',
        5,
        signeDroiteAffiche,
        20,
      ]
      const tableauSignes = tableauDeVariation({
        tabInit: [
          [
            ['$x$', 2, 20],
            [`$${denominateur}$`, 2, 30],
          ],
          ['$-\\infty$', 30, `$${a}$`, 20, '$+\\infty$', 30],
        ],
        tabLines: [ligneSignes],
        espcl: 4,
        deltacl: 1.2,
        lgt: 3.5,
        scale: 0.8,
        hauteurLignes: [20, 20],
      })

      let texteCorr =`On étudie séparément le comportement du numérateur et du dénominateur au voisinage de $${a}$.<br>`
         if (typesNumerateurs[i] === 'affine') {
        texteCorr += `On calcule l’image de $${a}$ du numérateur : $${calculImageNumerateur}$, qui est donc non-nul.<br>`
      }
      else {texteCorr += `Le numérateur est constant et non nul.<br>`}
       texteCorr += `On calcule ensuite l’image de $${a}$ du dénominateur : $${calculImageDenominateur}=0$.<br>`
       texteCorr += `Le dénominateur s'annule donc en $${a}$, la limite est du type  "$\\dfrac{${a}}{0}$", qui tend vers l'infini.<br>`
      texteCorr += `On étudie  le signe de $${denominateur}$ au voisinage de $${a}$.<br>`
      texteCorr += `Pour cela, on résout : $${denominateur}>0\\iff ${solutionInequation}$.<br>`
      texteCorr += `On obtient le tableau de signes suivant :<br><br>${tableauSignes}<br>`
      texteCorr += `On en déduit que $\\displaystyle \\lim_{${indiceLimite}}(${denominateur})=${zeroLateral}$.<br>`

   
      texteCorr += `$\\displaystyle \\lim_{${indiceLimite}}(${numerateur})=${imageNumerateur}$.<br>`
      texteCorr += `Par quotient, $\\displaystyle \\lim_{${indiceLimite}}f(x)=${miseEnEvidence(reponse)}$.`

      if (
        this.questionJamaisPosee(
          i,
          expression,
          a,
          cote,
          typesNumerateurs[i],
        )
      ) {
        handleAnswers(this, i, { reponse: { value: reponse } })
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
    }
    listeQuestionsToContenu(this)
  }
}
