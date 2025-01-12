import { texteGras } from '../../lib/format/style'
import engine from '../../lib/interactif/comparisonFunctions'

import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'
import { context } from '../../modules/context'
import { ecritureAlgebrique, ecritureAlgebriqueSauf1, rienSi1 } from '../../lib/outils/ecritures'
import { fraction } from '../../modules/fractions'
import Trinome from '../../modules/Trinome'
import { texNombre } from '../../lib/outils/texNombre'
export const titre = 'Nombre de solutions d\'une équation du second degré à paramètre'
export const dateDePublication = '30/10/2021'

/**
 * Deux fonctions polynômiales de degré 2 avec un paramètre sont données.
 * On souhaite savoir quand ces fonctions possèdent deux racines distinctes.
 * Il faut déterminer les valeurs de m telles que \Delta > 0
 * @author Eric Schrafstetter
 * Refait par Jean-claude Lhote sans utiliser xcas.

*/
export const uuid = 'fe4dg'

export const refs = {
  'fr-fr': ['1AL23-23'],
  'fr-ch': []
}
export default class EquationDuSecondDegreAvecUnParametre extends Exercice {
  constructor () {
    super()
    this.consigne = `Déterminer, suivant la valeur du paramètre $m$, le ${texteGras('nombre de solutions')} de l'équation du second degré.`
    this.nbQuestions = 2
    this.sup = 1 // Niveau de difficulté
    context.isHtml ? (this.spacingCorr = 2) : (this.spacingCorr = 1)
  }

  nouvelleVersion () {
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const a = randint(-5, 5, 0)
      const coefBm = randint(-2, 2)
      const coefBc = randint(-3, 3)
      const coefCm = randint(-2, 2)
      const coefCc = randint(-3, 3)

      // Enoncé
      const expr0 = engine.parse(`${coefBm}mx${ecritureAlgebrique(a)}x^2${rienSi1(coefCm)}m${ecritureAlgebriqueSauf1(coefBc)}x${ecritureAlgebrique(coefCc)}`).simplify().latex
      const texte = `$${expr0}=0$`
      // Corrigé
      let texteCorr = 'Écrivons l\'équation sous la forme $ax^2+bx+c=0$ :'
      const expr1 = engine.parse(`${a}x^2+(${rienSi1(coefBm)}m${ecritureAlgebrique(coefBc)})x${ecritureAlgebriqueSauf1(coefCm)}m${ecritureAlgebrique(coefCc)}`).simplify().latex
      texteCorr += `<br>$${expr1}=0$`
      texteCorr += `<br>On a donc $a=${a}$, $b=${rienSi1(coefBm)}m${ecritureAlgebrique(coefBc)}$ et $c=${rienSi1(coefCm)}m${ecritureAlgebrique(coefCc)}$`
      texteCorr += `<br>Le discriminant vaut $\\Delta=b^2-4\\times a\\times c = (${rienSi1(coefBm)}m${ecritureAlgebrique(coefBc)})^2${ecritureAlgebrique(-4 * a)}\\times(${rienSi1(coefCm)}m${ecritureAlgebrique(coefCc)})$`
      const delta = `(${rienSi1(coefBm)}m${ecritureAlgebrique(coefBc)})^2${ecritureAlgebrique(-4 * a)}\\times(${rienSi1(coefCm)}m${ecritureAlgebrique(coefCc)})`
      const delta2 = engine.parse(delta).expand().simplify().latex
      texteCorr += `<br>Ou encore, sous forme développée : $\\Delta = ${delta2}$`
      const coeffBB = 2 * coefBm * coefBc - 4 * a * coefCm// coefficient "b" dans l'écriture de Delta
      const coeffAA = coefBm * coefBm // coefficient "a" dans l'écriture de Delta
      const coeffCC = -4 * a * coefCc + coefBc * coefBc// coefficient "c" dans l'écriture de Delta
      const deltaPrime = coeffBB * coeffBB - 4 * coeffAA * coeffCC
      if (coeffAA === 0) { // Eq du 1er degré
        const m1 = fraction(-coeffCC, coeffBB).texFractionSimplifiee
        if (coeffBB > 0) { // Delta est une droite croissante
          texteCorr += `<br>Cherchons la valeur de $m$ qui annule cette expression du premier degré : $m=${m1}$`
          texteCorr += `<br>$\\Delta$ est une droite croissante de coefficient directeur $${coeffBB}$.`
          texteCorr += '<br>$\\underline{\\text{Conclusion}}$ :'
          texteCorr += `<br>- Si $m < ${m1}$, l'équation n'a pas de solution réelle;`
          texteCorr += `<br>- Si $m = ${m1}$, l'équation a une unique solution réelle;`
          texteCorr += `<br>- Si $m > ${m1}$, l'équation a 2 solutions réelles;`
        } else if (coeffBB < 0) { // Delta est une droite décroissante
          texteCorr += `<br>Cherchons la valeur de $m$ qui annule cette expression du premier degré : $m=${m1}$`
          texteCorr += `<br>$\\Delta$ est une droite décroissante de coefficient directeur $${coeffBB}$.`
          texteCorr += '<br>$\\underline{\\text{Conclusion}}$ :'
          texteCorr += `<br>- Si $m < ${m1}$, l'équation a 2 solutions réelles;`
          texteCorr += `<br>- Si $m = ${m1}$, l'équation a une unique solution réelle;`
          texteCorr += `<br>- Si $m > ${m1}$, l'équation n'a pas de solution réelle;`
        } else { // Delta est constant
          if (coeffCC === 0) {
            texteCorr += '<br>Quelque soit $m$ réel, on a $\\Delta$ qui est nul. L\'équation du départ admet donc toujours une unique solution.'
          } else if (coeffCC > 0) {
            texteCorr += '<br>Quelque soit $m$ réel, on a $\\Delta$ qui est strictement positif. L\'équation du départ admet donc toujours 2 solutions.'
          } else {
            texteCorr += '<br>Quelque soit $m$ réel, on a $\\Delta$ qui est strictement négatif. L\'équation du départ admet jamais de solution réelle.'
          }
        }
      } else {
        texteCorr += '<br>Cherchons les valeurs de $m$ qui annulent cette expression du second degré :'
        texteCorr += `<br>Le discriminant $\\Delta^\\prime$ vaut : $\\Delta^\\prime =${deltaPrime}$`
        const trinom = new Trinome(coeffAA, coeffBB, coeffCC)
        const f = trinom.discriminant
        if (f.superieurLarge(0) && f.estParfaite) {
          texteCorr += ` (Remarquons que $\\sqrt{\\Delta^\\prime} =${f.racineCarree().texFractionSimplifiee}$)`
        }
        if (deltaPrime < 0) {
          texteCorr += '<br>Celui-ci étant strictement négatif, l\'équation n\'a pas de solution et $\\Delta$ ne change pas de signe.'
          if (coeffAA > 0) {
            texteCorr += '<br>Comme le coefficient devant $m^2$ est positif, $\\Delta > 0$.'
            texteCorr += '<br>$\\underline{\\text{Conclusion}}$ : L\'équation du départ admet toujours 2 solutions.'
          } else {
            texteCorr += '<br>Comme le coefficient devant $m^2$ est négatif, $\\Delta < 0$.'
            texteCorr += '<br>$\\underline{\\text{Conclusion}}$ : L\'équation du départ n\'a pas de solution réelle.'
          }
        } else if (deltaPrime === 0) {
          const m1 = trinom.x1.texFractionSimplifiee
          texteCorr += `<br>Celui-ci étant nul, l'équation $\\Delta = 0$ a une unique solution $m=\\dfrac{-b}{2a}=${m1}$.`
          if (coeffAA > 0) {
            texteCorr += `<br>De plus le coefficient $${coeffAA}$ devant $m^2$ étant positif, $\\Delta > 0$ si $m\\neq${m1}$.`
            texteCorr += `<br>$\\underline{\\text{Conclusion}}$ : Si $m=${m1}$ l'équation admet une unique solution, sinon l'équation admet 2 solutions.`
          } else {
            texteCorr += `<br>De plus le coefficient $${coeffAA}$ devant $m^2$ étant négatif, $\\Delta < 0$ si $m\\neq${m1}$.`
            texteCorr += `<br>$\\underline{\\text{Conclusion}}$ : Si $m=${m1}$ l'équation admet une unique solution, sinon l'équation n'admet pas de solution.`
          }
        } else {
          const m1 = trinom.texX1
          const m2 = trinom.texX2
          const x1 = trinom.x1
          const x2 = trinom.x2
          texteCorr += '<br>Celui-ci étant strictement positif, l\'équation $\\Delta = 0$ a 2 solutions :'
          if (m1.includes('sqrt')) {
            texteCorr += `<br>$m_1=${m1}\\simeq${texNombre(x1, 4)}$ et $m_2=${m2}\\simeq${texNombre(x2, 4)}$`
          } else {
            texteCorr += `<br>$m_1=${m1}$ et $m_2=${m2}$`
          }
          if (coeffAA > 0) {
            texteCorr += '<br>De plus le coefficient devant $m^2$ est positif, $\\Delta$ est donc une parabole avec ses branches dirigées vers le haut.'
            texteCorr += '<br>$\\Delta$ est donc positif à l\'extérieur des racines et négatif à l\'intérieur.'
            texteCorr += '<br>$\\underline{\\text{Conclusion}}$ :<br> - Si $m=m_1$ ou $m_2$, l\'équation admet une unique solution,'
            texteCorr += '<br>- Si $m\\in ]m_1,m_2[$, l\'équation n\'a pas de solution réelle,'
            texteCorr += '<br>- Si $m\\in ]-\\infty,m_1[\\cup]m_2,+\\infty[$, l\'équation admet 2 solutions réelles'
          } else {
            texteCorr += '<br>De plus le coefficient devant $m^2$ est négatif, $\\Delta$ est donc une parabole avec ses branches dirigées vers le bas.'
            texteCorr += '<br>$\\Delta$ est donc négatif à l\'extérieur des racines et positif à l\'intérieur.'
            texteCorr += '<br>$\\underline{\\text{Conclusion}}$ :<br> - Si $m=m_1$ ou $m_2$, l\'équation admet une unique solution,'
            texteCorr += '<br>- Si $m\\in ]m_1,m_2[$, l\'équation admet 2 solutions réelles,'
            texteCorr += '<br>- Si $m\\in ]-\\infty,m_1[\\cup]m_2,+\\infty[$, l\'équation admet n\'a pas de solution réelle'
          }
        }

        if (this.listeQuestions.indexOf(texte) === -1) {
          // Si la question n'a jamais été posée, on en crée une autre
          this.listeQuestions[i] = texte
          this.listeCorrections[i] = texteCorr
          i++
        }
        cpt++
      }
      listeQuestionsToContenu(this)
    }
    // this.besoinFormulaireNumerique = ['Niveau de difficulté', 3]
  }
}
