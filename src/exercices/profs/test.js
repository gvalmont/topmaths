// import { ComputeEngine } from '@cortex-js/compute-engine'
import Exercice from '../deprecatedExercice.js'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.ts'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { ComputeEngine } from '@cortex-js/compute-engine'

export const titre = 'Eric fait ses tests interactifs.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

export const uuid = 'testEE'

const engine = new ComputeEngine()
const expr1 = engine.parse('\\frac{-3+\\sqrt{41}}{4}', { canonical: true })
const expr2 = engine.parse('-\\frac34+\\frac{\\sqrt{41}}{4}', { canonical: true })
console.info(expr1.isEqual(expr2)) // -> false but should be true
const expr3 = engine.parse('\\frac{-3-\\sqrt{41}}{4}', { canonical: true })
const expr4 = engine.parse('-\\frac34-\\frac{\\sqrt{41}}{4}', { canonical: true })
console.info(expr3.isEqual(expr4)) // -> true as it should

// -> ["Add",12,["Delimiter",["Negate",2]]]

// console.info(engine.parse('(2+x)^2').isEqual(engine.parse('(2+x)(2+x)'))) // -> true OK of course
/* console.info(engine.parse('2^6').isEqual(engine.parse('-2^6'))) // -> false OK
console.info(engine.parse('(-2)^6').isEqual(engine.parse('2^6'))) // -> true
console.info(engine.parse('(-2)^6').isSame(engine.parse('-2^6'))) // -> false
*/

/* console.info('-\\dfrac12'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('-\\dfrac{-12}{-13}'.replace(/^-\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) > 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
console.info('-\\dfrac{-12}{-13}'.replace(/^\\dfrac(?:(\d)(\d)|{(-?\d+)}{(-?\d+)})$/i, function (match, p1, p2, p3, p4) {
  return '\\dfrac{' + ((p1 || p3) * (p2 || p4) < 0 ? '-' : '') + Math.abs(p1 || p3) + '}{' + Math.abs(p2 || p4) + '}'
}))
*/

export default function desTestsPourInteractivité () {
  Exercice.call(this)
  // this.consigne = 'Quel est le résultat des calculs suivants ?'
  this.consigne = 'Écrire ce nombre sous forme d\'une somme.'
  this.nouvelleVersion = function () {
    for (let i = 0, texte, texteCorr, cpt = 0, a, b; i < this.nbQuestions && cpt < 50;) {
      a = randint(1, 12)
      b = randint(2, 12)

      // console.info(fonctionComparaison('16^1', '16', { sansExposantUn: true }).isOk)

      const reponse = '4+6'
      // const reponse = new FractionEtendue(-20, 50).valeurDecimale
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 +' + reponse + '$ : $'
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 :$'
      const enonce = '\\dfrac{-3+\\sqrt{41}}{4} + -\\dfrac34+\\dfrac{\\sqrt{41}}{4}'
      // const enonce = '$Donner une valeur numér égale à 0.4 : $'
      // reponse = reponse.toString()
      texteCorr = ''
      // texte = `$${enonce}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme ' + KeyboardType.clavierDeBaseAvecFraction)
      texte = `$${enonce}$` + ajouteChampTexteMathLive(this, i, KeyboardType.clavierFullOperations)
      // texte += `$${enonce}$` + ajouteChampTexteMathLive(this, i + 1, 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction)
      // texte += ajouteFeedback(this, i + 1)
      // handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } })
      // handleAnswers(this, i, { reponse: { value: reponse } })
      handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison, options: { additionSeulementEtNonResultat: true } } })
      // handleAnswers(this, i, { reponse: { value: reponse, compare: fonctionComparaison } })

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
