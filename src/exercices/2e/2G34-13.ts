import FractionEtendue from '../../modules/FractionEtendue'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { miseEnEvidence, texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import PolynomePlusieursVariables from '../../lib/mathFonctions/PolynomePlusieursVariables'
import MonomePlusieursVariables from '../../lib/mathFonctions/MonomePlusieursVariables'
import EquationSecondDegre from '../../modules/EquationSecondDegre'
export const titre = 'Déterminer le point d\'intersection d\'une droite et une courbe'
export const interactifReady = false
export const interactifType = 'mathLive'
export const dateDePublication = '05/01/2025'
/**
 * @author Nathan Scheinmann
*/

export const uuid = 'e37e2'
export const refs = {
  'fr-fr': ['2G34-13'],
  'fr-ch': ['1F2-13']
}
export default class IntersectionDroitesPoints extends Exercice {
  constructor () {
    super()
    this.consigne = ''
    this.nbQuestions = 1
    this.besoinFormulaireNumerique = ['Type de questions', 1, '1 : Aucun point d\'intersection\n2 : Au moins un point d\'intersection\n3 : Mélange']
    this.besoinFormulaire2CaseACocher = ['Avec des fractions']
    this.besoinFormulaire3Numerique = ['Type de courbes', 1, '1 : Deux droites\n2 : Une droite et une parabole\n3 : Deux paraboles\n4 : Mélange']
    this.sup2 = false
    this.sup = 4
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 2,
      melange: 3,
      defaut: 3,
      listeOfCase: ['aucune', 'unOuDeux'],
      nbQuestions: this.nbQuestions,
      shuffle: true
    })
    const typesDeCourbes = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      min: 1,
      max: 3,
      melange: 4,
      defaut: 3,
      listeOfCase: ['droiteDroite', 'droitePara', 'paraPara'],
      nbQuestions: this.nbQuestions,
      shuffle: true
    })
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let droite = [new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
      let courbe = [new FractionEtendue(0, 1), new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
      let courbe2 = [new FractionEtendue(0, 1), new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
      let droiteLit: PolynomePlusieursVariables
      let courbeLit: PolynomePlusieursVariables
      let courbeLit2: PolynomePlusieursVariables
      let eqSeqDeg: EquationSecondDegre
      let differenceCourbe: PolynomePlusieursVariables
      let courbeChoix1: PolynomePlusieursVariables
      let courbeChoix2: PolynomePlusieursVariables
      if (typesDeCourbes[i] !== 'droiteDroite') {
        do {
          do {
            if (this.sup2 === false) {
              droite = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1)]
              courbe = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1), new FractionEtendue(randint(-10, 10, [0]), 1)]
              courbe2 = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1), new FractionEtendue(randint(-10, 10, [0]), 1)]
            } else {
              droite = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0]))]
              courbe = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0]))]
              courbe2 = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0]))]
            }
            droiteLit = new PolynomePlusieursVariables([new MonomePlusieursVariables(droite[0], { variables: ['x'], exposants: [0] }), new MonomePlusieursVariables(droite[1], { variables: ['x'], exposants: [1] })]).ordonner()
            courbeLit = new PolynomePlusieursVariables([new MonomePlusieursVariables(courbe[0], { variables: ['x'], exposants: [0] }), new MonomePlusieursVariables(courbe[1], { variables: ['x'], exposants: [1] }), new MonomePlusieursVariables(courbe[2], { variables: ['x'], exposants: [2] })]).ordonner()
            courbeLit2 = new PolynomePlusieursVariables([new MonomePlusieursVariables(courbe2[0], { variables: ['x'], exposants: [0] }), new MonomePlusieursVariables(courbe2[1], { variables: ['x'], exposants: [1] }), new MonomePlusieursVariables(courbe2[2], { variables: ['x'], exposants: [2] })]).ordonner()
            if (typesDeCourbes[i] === 'droitePara') {
              courbeChoix1 = droiteLit
              courbeChoix2 = courbeLit
            } else {
              courbeChoix1 = courbeLit
              courbeChoix2 = courbeLit2
            }
            differenceCourbe = courbeChoix2.difference(courbeChoix1).ordonner().reduire()
          } while (differenceCourbe.monomes.length < 3)
          eqSeqDeg = EquationSecondDegre.aPartirDesCoefficients(differenceCourbe.monomes[0].coefficient, differenceCourbe.monomes[1].coefficient, differenceCourbe.monomes[2].coefficient, new FractionEtendue(0, 1), new FractionEtendue(0, 1), new FractionEtendue(0, 1), { variable: 'x', format: 'reduit' })
          differenceCourbe = differenceCourbe.reduire()
        } while ((listeTypeDeQuestions[i] === 'aucune' && eqSeqDeg.delta.signe === 1) ||
        (listeTypeDeQuestions[i] === 'unOuDeux' && eqSeqDeg.delta.signe === -1) || (listeTypeDeQuestions[i] === 'unOuDeux' && eqSeqDeg.solutionsListeTex[0].includes('sqrt')))
        if (typesDeCourbes[i] === 'droitePara') {
          texte += `Soit la droite $(d)$ d'équation $y=${courbeChoix1.toString()}$ et la parabole $\\mathcal{C}$ d'équation $y=${courbeChoix2.toString()}$. Déterminer l'ensemble des points d'intersection de $(d)$ et $\\mathcal{C}$.`
          texteCorr += 'Afin de déterminer les points d\'intersection de $(d)$ et $\\mathcal{C}$, on cherche les solutions de l\'équation '
        }
        if (typesDeCourbes[i] === 'paraPara') {
          texte += `Soit la courbe $\\mathcal{C_1}$ d'équation $y=${courbeChoix2.toString()}$ et la parabole $\\mathcal{C_2}$ d'équation $y=${courbeChoix1.toString()}$. Déterminer l'ensemble des points d'intersection de $\\mathcal{C_1}$ et $\\mathcal{C_2}$.`
          texteCorr += 'Afin de déterminer les points d\'intersection de $\\mathcal{C_1}$ et $\\mathcal{C_2}$, on cherche les solutions de l\'équation '
        }
        texteCorr += `\\[${courbeChoix2.toString()}=${courbeChoix1.toString()}\\]
    c'est-à-dire
    \\[${eqSeqDeg.printToLatexMDG()}=0\\]
    On résout cette équation en utilisant la méthode de résolution du deuxième degré. On calcule le discriminant $\\Delta=${eqSeqDeg.delta.texFractionSimplifiee}$.<br>`
        if (eqSeqDeg.delta.num === 0) {
          texteCorr += `Le discriminant étant nul, l'équation admet une unique solution réelle. Elle vaut $x_1=${eqSeqDeg.solutionsListeTex[0]}$.<br>`
          texteCorr += `Le point d'intersection de $(d)$ et $\\mathcal{C}$ a donc pour coordonnées $${miseEnEvidence(`\\left(${eqSeqDeg.solutionsListeTex[0]}\\,;\\,${courbeChoix2.evaluer({ x: eqSeqDeg.solutionFrac()[0] as FractionEtendue }).texFractionSimplifiee}\\right)`)}$.<br>`
        } else if (eqSeqDeg.delta.signe === 1) {
          texteCorr += `Le discriminant étant positif, l'équation admet deux solutions réelles. Elles valent $x_1=${eqSeqDeg.solutionsListeTex[0]}$ et $x_2=${eqSeqDeg.solutionsListeTex[1]}$.<br> 
        On détermine les points d'intersection en évaluant la coordonnée des abscisse des solutions dans l'équation ${typesDeCourbes[i] === 'paraPara' ? 'd\'une des paraboles' : 'de la droite'}.`
          texteCorr += `\\[y_1=${courbeChoix1.toStringEvaluate({ x: eqSeqDeg.solutionFrac()[0] as FractionEtendue })}=${courbeChoix1.evaluer({ x: eqSeqDeg.solutionFrac()[0] as FractionEtendue }).texFractionSimplifiee}\\quad\\text{ et }\\quad y_2=${courbeChoix1.toStringEvaluate({ x: eqSeqDeg.solutionFrac()[1] as FractionEtendue })}=${courbeChoix1.evaluer({ x: eqSeqDeg.solutionFrac()[1] as FractionEtendue }).texFractionSimplifiee}\\]`
          texteCorr += `Les points d'intersection de ${typesDeCourbes[i] !== ' paraPara' ? '$(d)$ et $\\mathcal{C}$' : '$\\mathcal{C_1}$ et $\\mathcal{C_2}$'} ont donc pour coordonnées $${miseEnEvidence(`\\left(${eqSeqDeg.solutionsListeTex[0]}\\,;\\,${courbeChoix2.evaluer({ x: eqSeqDeg.solutionFrac()[0] as FractionEtendue }).texFractionSimplifiee}\\right)`)}$ et $${miseEnEvidence(`\\left(${eqSeqDeg.solutionsListeTex[1]}\\,;\\,${courbeChoix2.evaluer({ x: eqSeqDeg.solutionFrac()[1] as FractionEtendue }).texFractionSimplifiee}\\right)`)}$.<br>`
        } else {
          texteCorr += `Le discriminant étant négatif, l'équation n'admet pas de solution réelle. ${typesDeCourbes[i] !== 'paraPara' ? 'La droite $(d)$ et la parabole $\\mathcal{C}$' : 'Les paraboles $\\mathcal{C_1}$ et $\\mathcal{C_2}$'} ${texteEnCouleurEtGras('n\'ont pas de points d\'intersection')}.<br>`
        }
      } else if (typesDeCourbes[i] === 'droiteDroite') {
        let droite1 = [new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
        let droite2 = [new FractionEtendue(0, 1), new FractionEtendue(0, 1)]
        if (typesDeQuestionsDisponibles[i] !== 'aucune') {
          do {
            if (this.sup2 === false) {
              droite1 = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1)]
              droite2 = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1)]
            } else {
              droite1 = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0]))]
              droite2 = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0]))]
            }
          } while (droite1[1].isEqual(droite2[1]) || droite1[0].isEqual(droite2[0]))
        } else {
          do {
            if (this.sup2 === false) {
              droite1 = [new FractionEtendue(randint(-10, 10, [0]), 1), new FractionEtendue(randint(-10, 10), 1)]
              droite2 = [new FractionEtendue(randint(-10, 10), 1), droite1[1]]
            } else {
              droite1 = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), new FractionEtendue(randint(-10, 10), randint(-10, 10, [0]))]
              droite2 = [new FractionEtendue(randint(-10, 10, [0]), randint(-10, 10, [0])), droite1[1]]
            }
          } while (droite1[0].isEqual(droite2[0]))
        }
        courbeChoix1 = new PolynomePlusieursVariables([new MonomePlusieursVariables(droite1[0], { variables: ['x'], exposants: [0] }), new MonomePlusieursVariables(droite1[1], { variables: ['x'], exposants: [1] })]).ordonner()
        courbeChoix2 = new PolynomePlusieursVariables([new MonomePlusieursVariables(droite2[0], { variables: ['x'], exposants: [0] }), new MonomePlusieursVariables(droite2[1], { variables: ['x'], exposants: [1] })]).ordonner()
        differenceCourbe = courbeChoix1.difference(courbeChoix2).ordonner().reduire()
        differenceCourbe = differenceCourbe.reduire()
        texte += `Soit la droite $(d_1)$ d'équation $y=${courbeChoix1.toString()}$ et la droite $(d_2)$ d'équation $y=${courbeChoix2.toString()}$. Déterminer l'ensemble des points d'intersection de $(d_1)$ et $(d_2)$.`
        if (typesDeQuestionsDisponibles[i] !== 'aucune') {
          texteCorr += 'Afin de déterminer les points d\'intersection de $(d_1)$ et $(d_2)$, on cherche les solutions de l\'équation '
          texteCorr += `\\[${courbeChoix1.toString()}=${courbeChoix2.toString()} \\iff ${differenceCourbe.monomes[0].toString()}=${differenceCourbe.monomes[1].oppose().toString()}\\]`
          const sol = differenceCourbe.monomes[1].coefficient.produitFraction(differenceCourbe.monomes[0].coefficient.oppose().inverse())
          texteCorr += `L'équation admet une solution $x_1=${sol.texFractionSimplifiee}$.<br>
        On détermine le point d'intersection en évaluant la coordonnée des abscisse des solutions dans l'équation d'une des droites.`
          texteCorr += `\\[y_1=${courbeChoix1.toStringEvaluate({ x: sol as FractionEtendue })}=${courbeChoix1.evaluer({ x: sol as FractionEtendue }).texFractionSimplifiee}\\]`
          texteCorr += `Les points d'intersection de $(d_1)$ et $(d_2)$ ont donc pour coordonnées $${miseEnEvidence(`\\left(${sol.texFractionSimplifiee}\\,;\\,${courbeChoix2.evaluer({ x: sol as FractionEtendue }).texFractionSimplifiee}\\right)`)}$.<br>`
        } else {
          texteCorr += `Les deux droites ont la même pente, mais une ordonnée à l'origine différente; elles sont donc parallèles. Ainsi, les droites $(d_1)$ et $(d_2)$ ${texteEnCouleurEtGras('n\'ont pas de points d\'intersection')}.<br>`
        }
      }
      if (this.listeQuestions.indexOf(texte) === -1) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
