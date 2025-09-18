import { tableauColonneLigne } from '../../lib/2d/tableau'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import FractionEtendue from '../../modules/FractionEtendue'
import ExerciceQcmA from '../ExerciceQcmA'
export const dateDePublication = '14/09/2025'
export const uuid = '2e3f9'

export const refs = {
  'fr-fr': ['1A-P1'],
  'fr-ch': [],
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Calculer une probabilité dans un tableau'
export default class auto1AP1 extends ExerciceQcmA {
  versionOriginale: () => void = () => {
    this.enonce =
      `On lance un dé à 4 faces. La probabilité d’obtenir chacune des faces est donnée dans le tableau ci-dessous :<br><br>` +
      tableauColonneLigne(
        ['\\text{Numéro de la face}', '1', '2', '3', '4'],
        ['\\text{Probabilité}'],
        ['0,5', '\\dfrac{1}{6}', '0,2', 'x'],
      ) +
      `<br><br>On peut affirmer que :`
    this.correction = `La somme des probabilités doit être égale à 1. On a donc : <br>
    Comme $0,5=\\dfrac{1}{2}$ et $0,2=\\dfrac{1}{5}$, on a : <br>
    $\\begin{aligned}
    x&=1-\\left(\\dfrac{1}{2}+\\dfrac{1}{6}+\\dfrac{1}{5}\\right)\\\\
    & =1-\\left(\\dfrac{15}{30}+\\dfrac{5}{30}+\\dfrac{6}{30}\\right)\\\\
    & =1-\\dfrac{26}{30}\\\\
    &=\\dfrac{4}{30}\\\\
    &=${miseEnEvidence('\\dfrac{2}{15}')}
    \\end{aligned}$ <br>
  `

    this.reponses = [
      '$x=\\dfrac{2}{15}$',
      '$x=\\dfrac{2}{3}$',
      `$\\vphantom{\\dfrac{1}{3}}x=0,4$`,
      '$\\vphantom{\\dfrac{1}{3}}x=0,1$',
    ]
  }

  versionAleatoire = () => {
    switch (choice([1, 2, 3, 4])) {
      case 1:
        // Cas où la réponse est décimale données 1 fraction et deux décimales
        {
          const tableaux = [
            {
              fraction: {
                frac: new FractionEtendue(1, 4),
                tex: '\\dfrac{1}{4}',
                val: 0.25,
              },
              decimales: [0.35, 0.25, 0.15],
            },
            {
              fraction: {
                frac: new FractionEtendue(1, 5),
                tex: '\\dfrac{1}{5}',
                val: 0.2,
              },
              decimales: [0.3, 0.35, 0.15],
            },
            {
              fraction: {
                frac: new FractionEtendue(2, 5),
                tex: '\\dfrac{2}{5}',
                val: 0.4,
              },
              decimales: [0.25, 0.2, 0.15],
            },
            {
              fraction: {
                frac: new FractionEtendue(1, 2),
                tex: '\\dfrac{1}{2}',
                val: 0.5,
              },
              decimales: [0.25, 0.15, 0.1],
            },
            {
              fraction: {
                frac: new FractionEtendue(3, 10),
                tex: '\\dfrac{3}{10}',
                val: 0.3,
              },
              decimales: [0.35, 0.2, 0.15],
            },
            {
              fraction: {
                frac: new FractionEtendue(1, 10),
                tex: '\\dfrac{1}{10}',
                val: 0.1,
              },
              decimales: [0.45, 0.25, 0.2],
            },
            {
              fraction: {
                frac: new FractionEtendue(3, 5),
                tex: '\\dfrac{3}{5}',
                val: 0.6,
              },
              decimales: [0.2, 0.15, 0.05],
            },
            {
              fraction: {
                frac: new FractionEtendue(7, 20),
                tex: '\\dfrac{7}{20}',
                val: 0.35,
              },
              decimales: [0.3, 0.2, 0.15],
            },
            {
              fraction: {
                frac: new FractionEtendue(9, 20),
                tex: '\\dfrac{9}{20}',
                val: 0.45,
              },
              decimales: [0.25, 0.2, 0.1],
            },
            {
              fraction: {
                frac: new FractionEtendue(3, 20),
                tex: '\\dfrac{3}{20}',
                val: 0.15,
              },
              decimales: [0.45, 0.25, 0.15],
            },
          ]

          const tableau = choice(tableaux)
          const bonneReponse = choice(tableau.decimales)
          const autresDecimales = tableau.decimales.filter(
            (d: number) => d !== bonneReponse,
          )

          this.enonce =
            `On lance un dé à 4 faces. La probabilité d'obtenir chacune des faces est donnée dans le tableau ci-dessous :<br><br>` +
            tableauColonneLigne(
              ['\\text{Numéro de la face}', '1', '2', '3', '4'],
              ['\\text{Probabilité}'],
              [
                tableau.fraction.tex,
                texNombre(autresDecimales[0]),
                texNombre(autresDecimales[1]),
                'x',
              ],
            ) +
            `<br><br>On peut affirmer que :`

          this.correction = `La somme des probabilités doit être égale à 1.  <br>
        Comme $${tableau.fraction.tex}=${texNombre(tableau.fraction.val)}$, on a : <br>
        $\\begin{aligned}
        x&=1-\\left(${texNombre(tableau.fraction.val)}+${texNombre(autresDecimales[0])}+${texNombre(autresDecimales[1])}\\right)\\\\
        &=1-${texNombre(tableau.fraction.val + autresDecimales[0] + autresDecimales[1])}\\\\
        &=${miseEnEvidence(texNombre(bonneReponse))}
        \\end{aligned}$ <br>`

          this.reponses = [
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(bonneReponse)}$`,
            `$x=${tableau.fraction.frac.oppose().ajouteEntier(1).texFraction}$`, //1-la fraction
            `$\\vphantom{\\dfrac{1}{3}}${texNombre(1 - autresDecimales[0] - autresDecimales[1])}$`, //oubli de la fraction
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(tableau.fraction.val + autresDecimales[0] + autresDecimales[1])}$`, //oubli du 1
          ]
        }
        break

      case 2:
        {
          const tableaux = [
            {
              fraction2: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(15, 60),
                val: 0.25,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(12, 60),
                val: 0.2,
              },
              fraction1: {
                frac: new FractionEtendue(13, 60),
                fracd: new FractionEtendue(13, 60),
                val: 0.22,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(15, 30),
                val: 0.5,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction1: {
                frac: new FractionEtendue(7, 30),
                fracd: new FractionEtendue(7, 30),
                val: 0.233,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(24, 60),
                val: 0.4,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 20),
                fracd: new FractionEtendue(3, 60),
                val: 0.05,
              },
              fraction1: {
                frac: new FractionEtendue(13, 60),
                fracd: new FractionEtendue(13, 60),
                val: 0.217,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(3, 10),
                fracd: new FractionEtendue(18, 60),
                val: 0.3,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(10, 60),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(15, 60),
                val: 0.25,
              },
              fraction1: {
                frac: new FractionEtendue(17, 60),
                fracd: new FractionEtendue(17, 60),
                val: 0.283,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(6, 30),
                val: 0.2,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(10, 30),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(12, 30),
                val: 0.4,
              },
              fraction1: {
                frac: new FractionEtendue(1, 15),
                fracd: new FractionEtendue(2, 30),
                val: 0.067,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(3, 5),
                fracd: new FractionEtendue(18, 30),
                val: 0.6,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction1: {
                frac: new FractionEtendue(2, 15),
                fracd: new FractionEtendue(4, 30),
                val: 0.133,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(30, 60),
                val: 0.5,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 20),
                fracd: new FractionEtendue(3, 60),
                val: 0.05,
              },
              fraction1: {
                frac: new FractionEtendue(7, 60),
                fracd: new FractionEtendue(7, 60),
                val: 0.117,
              },
            },

            {
              fraction2: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(10, 30),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(15, 30),
                val: 0.5,
              },
              fraction1: {
                frac: new FractionEtendue(1, 15),
                fracd: new FractionEtendue(2, 30),
                val: 0.067,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(12, 30),
                val: 0.4,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(6, 30),
                val: 0.2,
              },
              fraction1: {
                frac: new FractionEtendue(7, 30),
                fracd: new FractionEtendue(7, 30),
                val: 0.233,
              },
            },
          ]

          const tableau = choice(tableaux)
          this.enonce =
            `On lance un dé à 4 faces. La probabilité d'obtenir chacune des faces est donnée dans le tableau ci-dessous :<br><br>` +
            tableauColonneLigne(
              ['\\text{Numéro de la face}', '1', '2', '3', '4'],
              ['\\text{Probabilité}'],
              [
                tableau.fraction1.frac.texFraction,
                texNombre(tableau.fraction2.val),
                tableau.fraction3.frac.texFraction,
                'x',
              ],
            ) +
            `<br><br>On peut affirmer que :`

          this.correction = `La somme des probabilités doit être égale à 1.  <br>
        Comme $${texNombre(tableau.fraction2.val)}=${tableau.fraction2.frac.texFraction}$, on a : <br>
        $\\begin{aligned}
        x&=1-\\left(${tableau.fraction1.frac.texFraction}+${tableau.fraction2.frac.texFraction}+${tableau.fraction3.frac.texFraction}\\right)\\\\
        x&=1-\\left(${tableau.fraction1.fracd.texFraction}+${tableau.fraction2.fracd.texFraction}+${tableau.fraction3.fracd.texFraction}\\right)\\\\
        x&=1-${tableau.fraction1.fracd.sommeFractions(tableau.fraction2.fracd, tableau.fraction3.fracd).texFraction}\\\\
        x&=${tableau.fraction4.frac.texFraction}\\\\
        x&=${miseEnEvidence(texNombre(tableau.fraction4.val))}
        \\end{aligned}$ <br>`
          this.reponses = [
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(tableau.fraction4.val)}$`,
            `$x=${tableau.fraction1.fracd.sommeFractions(tableau.fraction2.fracd, tableau.fraction3.fracd).texFraction}$`, //addition des fraction oubli du 1-
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(1 - tableau.fraction4.val)}$`, //1-solution en décimale
            `$x=${tableau.fraction1.frac.sommeFractions(tableau.fraction3.fracd).oppose().ajouteEntier(1).texFraction}$`, //oubli de la valeur décimale
          ]
        }
        break

      case 3:
        {
          const tableaux = [
            // Cas 1 (original)
            {
              fraction2: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(3, 20),
                val: 0.25,
              },
              fraction3: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(2, 20),
                val: 0.1,
              },
              fraction4: {
                frac: new FractionEtendue(9, 20),
                fracd: new FractionEtendue(9, 20),
                val: 0.45,
              },
              fraction1: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(4, 20),
                val: 0.2,
              },
            },

            // Cas 2: Valeurs décimales: 0.3 + 0.15 + 0.35 + 0.2 = 1
            // Dénominateur commun: 20
            {
              fraction1: {
                frac: new FractionEtendue(3, 10),
                fracd: new FractionEtendue(6, 20),
                val: 0.3,
              },
              fraction2: {
                frac: new FractionEtendue(3, 20),
                fracd: new FractionEtendue(3, 20),
                val: 0.15,
              },
              fraction3: {
                frac: new FractionEtendue(7, 20),
                fracd: new FractionEtendue(7, 20),
                val: 0.35,
              },
              fraction4: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(4, 20),
                val: 0.2,
              },
            },

            // Cas 3: Valeurs décimales: 0.4 + 0.25 + 0.1 + 0.25 = 1
            // Dénominateur commun: 20
            {
              fraction1: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(8, 20),
                val: 0.4,
              },
              fraction2: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(5, 20),
                val: 0.25,
              },
              fraction3: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(2, 20),
                val: 0.1,
              },
              fraction4: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(5, 20),
                val: 0.25,
              },
            },

            // Cas 4: Valeurs décimales: 0.5 + 0.2 + 0.15 + 0.15 = 1
            // Dénominateur commun: 20
            {
              fraction1: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(10, 20),
                val: 0.5,
              },
              fraction2: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(4, 20),
                val: 0.2,
              },
              fraction3: {
                frac: new FractionEtendue(3, 20),
                fracd: new FractionEtendue(3, 20),
                val: 0.15,
              },
              fraction4: {
                frac: new FractionEtendue(3, 20),
                fracd: new FractionEtendue(3, 20),
                val: 0.15,
              },
            },

            // Cas 5: Valeurs décimales: 0.6 + 0.1 + 0.2 + 0.1 = 1
            // Dénominateur commun: 10
            {
              fraction1: {
                frac: new FractionEtendue(3, 5),
                fracd: new FractionEtendue(6, 10),
                val: 0.6,
              },
              fraction2: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(1, 10),
                val: 0.1,
              },
              fraction3: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(2, 10),
                val: 0.2,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(1, 10),
                val: 0.1,
              },
            },

            // Cas 6: Valeurs décimales: 0.35 + 0.3 + 0.25 + 0.1 = 1
            // Dénominateur commun: 20
            {
              fraction1: {
                frac: new FractionEtendue(7, 20),
                fracd: new FractionEtendue(7, 20),
                val: 0.35,
              },
              fraction2: {
                frac: new FractionEtendue(3, 10),
                fracd: new FractionEtendue(6, 20),
                val: 0.3,
              },
              fraction3: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(5, 20),
                val: 0.25,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(2, 20),
                val: 0.1,
              },
            },

            // Cas 7: Valeurs décimales: 0.45 + 0.35 + 0.15 + 0.05 = 1
            // Dénominateur commun: 20
            {
              fraction1: {
                frac: new FractionEtendue(9, 20),
                fracd: new FractionEtendue(9, 20),
                val: 0.45,
              },
              fraction2: {
                frac: new FractionEtendue(7, 20),
                fracd: new FractionEtendue(7, 20),
                val: 0.35,
              },
              fraction3: {
                frac: new FractionEtendue(3, 20),
                fracd: new FractionEtendue(3, 20),
                val: 0.15,
              },
              fraction4: {
                frac: new FractionEtendue(1, 20),
                fracd: new FractionEtendue(1, 20),
                val: 0.05,
              },
            },

            // Cas 8: Valeurs décimales: 0.5 + 0.25 + 0.125 + 0.125 = 1
            // Dénominateur commun: 8
            {
              fraction1: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(4, 8),
                val: 0.5,
              },
              fraction2: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(2, 8),
                val: 0.25,
              },
              fraction3: {
                frac: new FractionEtendue(1, 8),
                fracd: new FractionEtendue(1, 8),
                val: 0.125,
              },
              fraction4: {
                frac: new FractionEtendue(1, 8),
                fracd: new FractionEtendue(1, 8),
                val: 0.125,
              },
            },
          ]

          const tableau = choice(tableaux)
          this.enonce =
            `On lance un dé à 4 faces. La probabilité d'obtenir chacune des faces est donnée dans le tableau ci-dessous :<br><br>` +
            tableauColonneLigne(
              ['\\text{Numéro de la face}', '1', '2', '3', '4'],
              ['\\text{Probabilité}'],
              [
                texNombre(tableau.fraction1.val),
                texNombre(tableau.fraction2.val),
                tableau.fraction3.frac.texFraction,
                'x',
              ],
            ) +
            `<br><br>On peut affirmer que :`

          this.correction = `La somme des probabilités doit être égale à 1.  <br>
        Comme $${tableau.fraction3.frac.texFraction}=${texNombre(tableau.fraction3.val)}$, on a : <br>
        $\\begin{aligned}
        x&=1-\\left(${texNombre(tableau.fraction1.val)}+${texNombre(tableau.fraction2.val)}+${texNombre(tableau.fraction3.val)}\\right)\\\\
        x&=${texNombre(tableau.fraction4.val)}\\\\
         x&=${miseEnEvidence(tableau.fraction4.frac.texFraction)}
        \\end{aligned}$ <br>`
          this.reponses = [
            `$\\vphantom{\\dfrac{1}{3}}x=${tableau.fraction4.frac.texFraction}$`,
            `$x=${tableau.fraction1.fracd.sommeFractions(tableau.fraction2.fracd, tableau.fraction3.fracd).texFraction}$`, //addition des fraction oubli du 1-
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(1 - tableau.fraction4.val)}$`, //1-solution en décimale
            `$x=${tableau.fraction1.frac.sommeFractions(tableau.fraction3.fracd).oppose().ajouteEntier(1).texFraction}$`, //oubli de la valeur décimale
          ]
        }
        break

      case 4:
      default:
        {
          const tableaux = [
            {
              fraction2: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(15, 60),
                val: 0.25,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(12, 60),
                val: 0.2,
              },
              fraction1: {
                frac: new FractionEtendue(13, 60),
                fracd: new FractionEtendue(13, 60),
                val: 0.22,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(15, 30),
                val: 0.5,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction1: {
                frac: new FractionEtendue(7, 30),
                fracd: new FractionEtendue(7, 30),
                val: 0.233,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(24, 60),
                val: 0.4,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 20),
                fracd: new FractionEtendue(3, 60),
                val: 0.05,
              },
              fraction1: {
                frac: new FractionEtendue(13, 60),
                fracd: new FractionEtendue(13, 60),
                val: 0.217,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(3, 10),
                fracd: new FractionEtendue(18, 60),
                val: 0.3,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(10, 60),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 4),
                fracd: new FractionEtendue(15, 60),
                val: 0.25,
              },
              fraction1: {
                frac: new FractionEtendue(17, 60),
                fracd: new FractionEtendue(17, 60),
                val: 0.283,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(6, 30),
                val: 0.2,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(10, 30),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(12, 30),
                val: 0.4,
              },
              fraction1: {
                frac: new FractionEtendue(1, 15),
                fracd: new FractionEtendue(2, 30),
                val: 0.067,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(3, 5),
                fracd: new FractionEtendue(18, 30),
                val: 0.6,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction1: {
                frac: new FractionEtendue(2, 15),
                fracd: new FractionEtendue(4, 30),
                val: 0.133,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(30, 60),
                val: 0.5,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(20, 60),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 20),
                fracd: new FractionEtendue(3, 60),
                val: 0.05,
              },
              fraction1: {
                frac: new FractionEtendue(7, 60),
                fracd: new FractionEtendue(7, 60),
                val: 0.117,
              },
            },

            {
              fraction2: {
                frac: new FractionEtendue(1, 10),
                fracd: new FractionEtendue(3, 30),
                val: 0.1,
              },
              fraction3: {
                frac: new FractionEtendue(1, 3),
                fracd: new FractionEtendue(10, 30),
                val: 0.33,
              },
              fraction4: {
                frac: new FractionEtendue(1, 2),
                fracd: new FractionEtendue(15, 30),
                val: 0.5,
              },
              fraction1: {
                frac: new FractionEtendue(1, 15),
                fracd: new FractionEtendue(2, 30),
                val: 0.067,
              },
            },
            {
              fraction2: {
                frac: new FractionEtendue(2, 5),
                fracd: new FractionEtendue(12, 30),
                val: 0.4,
              },
              fraction3: {
                frac: new FractionEtendue(1, 6),
                fracd: new FractionEtendue(5, 30),
                val: 0.167,
              },
              fraction4: {
                frac: new FractionEtendue(1, 5),
                fracd: new FractionEtendue(6, 30),
                val: 0.2,
              },
              fraction1: {
                frac: new FractionEtendue(7, 30),
                fracd: new FractionEtendue(7, 30),
                val: 0.233,
              },
            },
          ]

          const tableau = choice(tableaux)
          this.enonce =
            `On lance un dé à 4 faces. La probabilité d'obtenir chacune des faces est donnée dans le tableau ci-dessous :<br><br>` +
            tableauColonneLigne(
              ['\\text{Numéro de la face}', '1', '2', '3', '4'],
              ['\\text{Probabilité}'],
              [
                tableau.fraction1.frac.texFraction,
                texNombre(tableau.fraction2.val),
                tableau.fraction3.frac.texFraction,
                'x',
              ],
            ) +
            `<br><br>On peut affirmer que :`

          this.correction = `La somme des probabilités doit être égale à 1.  <br>
        Comme $${texNombre(tableau.fraction2.val)}=${tableau.fraction2.frac.texFraction}$, on a : <br>
        $\\begin{aligned}
        x&=1-\\left(${tableau.fraction1.frac.texFraction}+${tableau.fraction2.frac.texFraction}+${tableau.fraction3.frac.texFraction}\\right)\\\\
        x&=1-\\left(${tableau.fraction1.fracd.texFraction}+${tableau.fraction2.fracd.texFraction}+${tableau.fraction3.fracd.texFraction}\\right)\\\\
        x&=1-${tableau.fraction1.fracd.sommeFractions(tableau.fraction2.fracd, tableau.fraction3.fracd).texFraction}\\\\
        x&=${miseEnEvidence(tableau.fraction4.frac.texFraction)}
        \\end{aligned}$ <br>`

          this.reponses = [
            `$x=${tableau.fraction4.frac.texFraction}$`,
            `$x=${tableau.fraction1.fracd.sommeFractions(tableau.fraction2.fracd, tableau.fraction3.fracd).texFraction}$`, //addition des fraction oubli du 1-
            `$\\vphantom{\\dfrac{1}{3}}x=${texNombre(1 - tableau.fraction2.val)}$`, //1-solution en décimale
            `$x=${tableau.fraction1.frac.sommeFractions(tableau.fraction3.fracd).oppose().ajouteEntier(1).texFraction}$`, //oubli de la valeur décimale
          ]
        }
        break
    }
  }

  constructor() {
    super()
    this.versionAleatoire()
  }
}
