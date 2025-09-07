import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import { randint } from '../../modules/outils'
// import ExerciceQcmA from '../../ExerciceQcmA'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = '6d860'
export const refs = {
  'fr-fr': ['1A-C1-1'],
  'fr-ch': [],
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Comparer deux nombres'
export const dateDePublication = '02/09/2025'
// Ceci est un exemple de QCM avec version originale et version aléatoire
/**
 *
 * @author Gilles Mora
 *
 */
export default class AutoC1a extends ExerciceQcmA {
  versionOriginale: () => void = () => {
    this.enonce = `La seule inégalité vraie est : `
    this.correction = `  La fonction carré étant strictement décroissante sur $]-\\infty\\,;\\,0]$, 
    on a : $${miseEnEvidence(`(-1{,}076)^2 > (-1{,}075)^2)`)}$ car $-1,076<-1,075$.<br>

    
    La fonction inverse étant strictement décroissante sur $]0\\,;\\,+\\infty[$ et sur $]-\\infty\\,;\\,0[$, 
    on a : $\\dfrac{1}{2,03}>\\dfrac{1}{2,032}$ car $2,03 < 2,032$ et $\\dfrac{1}{-2,03}<\\dfrac{1}{-2,032}$ car $-2,03>-2,032$.<br>
    La fonction carré étant strictement croissante sur $[0\\,;\\,+\\infty[$, 
    on a : $\\left(\\dfrac{1}{3}\\right)^2> \\left(\\dfrac{1}{4}\\right)^2$ car $\\dfrac{1}{3}>\\dfrac{1}{4}$.
  `

    this.reponses = [
      '$(-1,076)^2>(-1,075)^2$',
      '$\\dfrac{1}{2,03}<\\dfrac{1}{2,032}$',
      `$\\dfrac{1}{-2,03}>\\dfrac{1}{-2,032}$`,
      '$\\left(\\dfrac{1}{3}\\right)^2<\\left(\\dfrac{1}{4}\\right)^2$',
    ]
  }
  versionAleatoire: () => void = () => {
    const choixType = randint(1, 4) // 4 cas différents
    const a1 = randint(1, 5) + randint(1, 9) / 10 + randint(1, 9) / 100 // entre 1.2 et 2.7
    const b1 = a1 + randint(1, 9) / 100 // b légèrement plus grand que a
    const aStr1 = texNombre(-a1, 4) // -a plus grand
    const bStr1 = texNombre(-b1, 4) // -b plus petit

    // Nombres différents pour les autres propositions
    const c1 = randint(1, 5) + randint(1, 9) / 10 + randint(1, 9) / 100
    const d1 = c1 + randint(1, 9) / 10 + randint(1, 9) / 100
    const e1 = randint(1, 5) + randint(1, 9) / 10 + randint(1, 9) / 100
    const f1 = e1 + randint(1, 9) / 10 + randint(1, 9) / 100
    const g1 = randint(1, 5) + randint(1, 9) / 10 + randint(1, 9) / 100
    const h1 = g1 + randint(1, 9) / 10 + randint(1, 9) / 100
    const fausseReponse1 = `$(${aStr1})^2>(${bStr1})^2$ est fausse car la fonction carré est strictement décroissante sur $]-\\infty\\,;\\,0]$, 
        on a :  $(${aStr1})^2 < (${bStr1})^2$ car $${aStr1} > ${bStr1}$.<br>`
    const fausseReponse2 = `$\\dfrac{1}{${texNombre(c1, 3)}}<\\dfrac{1}{${texNombre(d1, 3)}}$ est fausse car la fonction inverse est strictement décroissante sur $]0\\,;\\,+\\infty[$, donc $\\dfrac{1}{${texNombre(c1, 3)}} > \\dfrac{1}{${texNombre(d1, 3)}}$ car $${texNombre(c1, 3)}<${texNombre(d1, 3)}$.<br>`
    const fausseReponse3 = `$${texNombre(g1, 3)}^2>${texNombre(h1, 3)}^2$ est fausse car la fonction carré est strictement croissante sur $[0\\,;\\,+\\infty[$, donc $${texNombre(g1, 3)}^2<${texNombre(h1, 3)}^2$ car $${texNombre(g1, 3)}<${texNombre(h1, 3)}$.<br>`
    const fausseReponse4 = `$\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2>\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$ est fausse car la fonction carré est strictement croissante sur $]0\\,;\\,+\\infty[$, donc $\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2<\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$ car $\\dfrac{1}{${texNombre(f1, 4)}} < \\dfrac{1}{${texNombre(e1, 4)}}$.<br>`
    switch (choixType) {
      case 1:
        {
          // Version avec fonction carré (nombres négatifs)

          this.enonce = `La seule inégalité vraie est : `
          this.correction = `La seule inégalité vraie est : $${miseEnEvidence(`(${aStr1})^2 < (${bStr1})^2`)}$.<br>
        En effet, la fonction carré étant strictement décroissante sur $]-\\infty\\,;\\,0]$, 
        on a : $(${aStr1})^2 < (${bStr1})^2$ car $${aStr1} > ${bStr1}$.<br><br>
        Concernant les autres propositions :<br>
        ${fausseReponse2}
        ${fausseReponse3}
       ${fausseReponse4}`
          this.reponses = [
            `$(${aStr1})^2<(${bStr1})^2$`, // Bonne réponse
            `$\\dfrac{1}{${texNombre(c1, 3)}} < \\dfrac{1}{${texNombre(d1, 3)}}$`, // Fausse : inverse décroissante
            `$${texNombre(g1, 3)}^2>${texNombre(h1, 3)}^2$`, // Fausse : carré croissante sur positifs
            `$\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2>\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$`, // Fausse : carré croissante sur positifs
          ]
        }
        break

      case 2:
        this.enonce = `La seule inégalité vraie est : `
        this.correction = `La seule inégalité vraie est : $${miseEnEvidence(`\\dfrac{1}{${texNombre(c1, 3)}}>\\dfrac{1}{${texNombre(d1, 3)}}`)}$.<br>
        En effet, la fonction inverse étant strictement décroissante sur $]0\\,;\\,+\\infty[$, donc $\\dfrac{1}{${texNombre(c1, 3)}} > \\dfrac{1}{${texNombre(d1, 3)}}$ car $${texNombre(c1, 3)}<${texNombre(d1, 3)}$.<br>
        Concernant les autres propositions :<br>
       ${fausseReponse1}
       ${fausseReponse3}
       ${fausseReponse4}`
        this.reponses = [
          `$\\dfrac{1}{${texNombre(c1, 3)}} > \\dfrac{1}{${texNombre(d1, 3)}}$`,
          `$(${aStr1})^2>(${bStr1})^2$`,
          `$${texNombre(g1, 3)}^2>${texNombre(h1, 3)}^2$`, // Fausse : carré croissante sur positifs
          `$\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2>\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$`, // Fausse : carré croissante sur positifs
        ]

        break

      case 3:
        this.enonce = `La seule inégalité vraie est : `
        this.correction = `La seule inégalité vraie est : $${miseEnEvidence(`${texNombre(g1, 3)}^2<${texNombre(h1, 3)}^2`)}$.<br>
        En effet, la fonction carré étant strictement croissante sur $[0\\,;\\,+\\infty[$, 
        on a : $${texNombre(g1, 3)}^2<${texNombre(h1, 3)}^2$ car $${texNombre(g1, 3)}<${texNombre(h1, 3)}$.<br><br>
        Concernant les autres propositions :<br>
       ${fausseReponse1}
       ${fausseReponse2}
       ${fausseReponse4}`
        this.reponses = [
          `$${texNombre(g1, 3)}^2<${texNombre(h1, 3)}^2$`,
          `$(${aStr1})^2>(${bStr1})^2$`,
          `$\\dfrac{1}{${texNombre(c1, 3)}} < \\dfrac{1}{${texNombre(d1, 3)}}$`, // Fausse
          `$\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2>\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$`, // Fausse
        ]

        break

      case 4:
      default:
        this.enonce = `La seule inégalité vraie est : `
        this.correction = `La seule inégalité vraie est : $${miseEnEvidence(`\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2<\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2`)}$.<br>
        En effet, la fonction carré étant strictement croissante sur $[0\\,;\\,+\\infty[$, 
        on a : $\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2<\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$ car $\\dfrac{1}{${texNombre(f1, 4)}} < \\dfrac{1}{${texNombre(e1, 4)}}$.<br><br>
        Concernant les autres propositions :<br>
       ${fausseReponse1}
       ${fausseReponse2}
       ${fausseReponse3}`
        this.reponses = [
          `$\\left(\\dfrac{1}{${texNombre(f1, 4)}}\\right)^2<\\left(\\dfrac{1}{${texNombre(e1, 4)}}\\right)^2$`, // Bonne réponse
          `$${texNombre(g1, 3)}^2>${texNombre(h1, 3)}^2$`,
          `$\\dfrac{1}{${texNombre(c1, 3)}} < \\dfrac{1}{${texNombre(d1, 3)}}$`, // Fausse
          `$(${aStr1})^2>(${bStr1})^2$`,
        ]

        break
    }
  }
  constructor() {
    super()
    this.versionAleatoire()
    this.spacing = 1.5
    this.spacingCorr = 1.5
  }
}
