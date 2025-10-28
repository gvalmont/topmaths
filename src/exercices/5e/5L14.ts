import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { lettreDepuisChiffre } from '../../lib/outils/outilString'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { ecritureParentheseSiNegatif } from '../../lib/outils/ecritures'

export const titre = "Calculer une expression littérale simple pour une valeur donnée"
export const interactifReady = true
export const dateDePublication = '22/10/2025'

export const uuid = 'd05d3'
export const refs = {
  'fr-fr': ['5L14'],
  'fr-ch': [],
}
/**
 *
 * @author Rémi Angot
 */
export default class CalculerUneExpressionSimple extends Exercice {
  constructor() {
    super()
    this.nbQuestions = 4
    this.besoinFormulaireCaseACocher = ['Afficher tous les signes ✕']
    this.sup = true
    this.besoinFormulaire2CaseACocher = ['Avec des nombres relatifs']
    this.sup2 = false
    this.besoinFormulaire3Texte = [
      'Types d\'expressions',
      `1 : ax + b
2 : a(x + b)
3 : (x + a)(x + b)
4 : x*x + a
5 : x*x + a*x
6 : ax - b
7 : a(x - b)
8 : Mélange`,
    ]
    this.sup3 = 8
  }

  nouvelleVersion() {
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      min: 1,
      max: 7,
      melange: 8,
      defaut: 7,
      nbQuestions: this.nbQuestions,
      listeOfCase: ['ax+b' , 'a(x+b)', '(x+a)(x+b)', 'x*x+a', 'x*x+a*x', 'ax-b', 'a(x-b)']
    })
    const listeTypeQuestions = combinaisonListes(
      typesDeQuestionsDisponibles,
      this.nbQuestions,
    )
    const signeDisponible = this.sup2 ? [1, -1] : [1]
    const signes = combinaisonListes(signeDisponible, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; ) {
      let texte = ''
      let texteCorr = ''
      let expression = ''
      let answer: number
      const a = randint(2, 15)
      let b = randint(2, 15)
      const x = randint(2, 15) * signes[i]

      switch (listeTypeQuestions[i]) {
        case 'ax+b':
          expression = this.sup ? `${a} \\times x + ${b}` : `${a}x + ${b}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(x)} + ${b}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * x + b)}$`
          answer = a * x + b
          break
        case 'a(x+b)':
          expression = this.sup ? `${a} \\times (x + ${b})` : `${a}(x + ${b})`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a} \\times (${x} + ${b})$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(x + b)}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * x + a * b)}$`
          answer = a * (x + b)
          break
        case '(x+a)(x+b)':
          expression = this.sup ? `(x + ${a}) \\times (x + ${b})` : `(x + ${a})(x + ${b})`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = (${x} + ${a}) \\times (${x} + ${b})$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${x + a} \\times ${ecritureParentheseSiNegatif(x + b)}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(x * x + a * x + b * x + a * b)}$`
          answer = (x + a) * (x + b)
          break
        case 'x*x+a':
          expression = this.sup ? `x \\times x + ${a}` : `x^2 + ${a}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${x} \\times ${x} + ${a}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${x * x} + ${a}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(x * x + a)}$`
          answer = x * x + a
          break
        case 'x*x+a*x':
          expression = this.sup ? `x \\times x + ${a} \\times x` : `x^2 + ${a}x`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${x} \\times ${x} + ${a} \\times ${x}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${x * x} + ${a * x}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(x * x + a * x)}$`
          answer = x * x + a * x
          break
        case 'ax-b':
        if (!this.sup2) {
          b = randint(1, a * x)
        }
          expression = this.sup ? `${a} \\times x - ${b}` : `${a}x - ${b}`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${x} - ${b}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${a * x} - ${b}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * x - b)}$`
          answer = a * x - b
          break
        default:
        // case 'a(x-b)':
        if (!this.sup2) {
          b = randint(1, x)
        }
          expression = this.sup ? `${a} \\times (x - ${b})` : `${a}(x - ${b})`
          texteCorr = `$${lettreDepuisChiffre(i + 1)} = ${a} \\times (${x} - ${b})$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${a} \\times ${ecritureParentheseSiNegatif(x - b)}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)} = ${miseEnEvidence(a * x - a * b)}$`
          answer = a * (x - b)
          break
      }
      texte = `Calculer $${lettreDepuisChiffre(i + 1)} = ${expression}$, pour $x = ${x}$`
      if (this.interactif) {
      texte += `<br>$${lettreDepuisChiffre(i + 1)} = $`
      texte += ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
      handleAnswers(this, i, {reponse:{value: answer}})
      }
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
