// import { ComputeEngine } from '@cortex-js/compute-engine'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'

import { ComputeEngine } from '@cortex-js/compute-engine'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { texNombre } from '../../lib/outils/texNombre'

export const titre = 'Eric fait ses tests interactifs.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const refs = {
  'fr-fr': [],
  'fr-ch': [],
}

export const uuid = 'testEE'

const engine = new ComputeEngine()
const result = fonctionComparaison('3.1\\times10^{3}', '3100', {
  ecritureScientifique: true,
})
// console.log('result', result)
/*
const result = fonctionComparaison(
  '0.90\\times c_{n}+50',
  '20+30+0.90\\times c_{n}',
  {
    calculFormel: true,
  },
)
console.log('result', result)


*/
const expr1 = engine.parse('0.93\times c_{n}+20', { canonical: false })
const expr2 = engine.parse('10+10+0.93c_{n}', {
  canonical: false,
})
// console.info(expr1.json) // -> false but should be true
// console.info(expr2.json) // -> false but should be true

// console.info('comparaison', expr1.isEqual(expr2)) // -> true OK of course
// console.info(expr1.isSame(expr2)) // -> true OK of course

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

export default class desTestsPourInteractivité extends Exercice {
  constructor() {
    super()

    // this.consigne = 'Quel est le résultat des calculs suivants ?'
    this.consigne = `Écrire une expression égale à celle proposée.`
  }

  nouvelleVersion() {
    for (
      let i = 0, texte, texteCorr, cpt = 0, a, b;
      i < this.nbQuestions && cpt < 50;

    ) {
      a = randint(1, 12)
      b = randint(2, 12)

      // console.info(fonctionComparaison('16^1', '16', { sansExposantUn: true }).isOk)

      const reponse = `${texNombre(0.93)}\\times c_{n}+20`
      // const reponse = new FractionEtendue(-20, 50).valeurDecimale
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 +' + reponse + '$ : $'
      // const enonce = '$Donner l\'ensemble des nombres entiers non nuls positifs inférieurs à 4 :$'
      // const enonce =
      //  '\\dfrac{-3+\\sqrt{41}}{4} + -\\dfrac34+\\dfrac{\\sqrt{41}}{4}'
      const enonce = `${texNombre(0.93)}\\times c_{n}+20`
      // const enonce = '$Donner une valeur numér égale à 0.4 : $'
      // reponse = reponse.toString()
      texteCorr = ''
      // texte = `$${enonce}=$` + ajouteChampTexteMathLive(this, i, 'inline15 college6eme ' + KeyboardType.clavierDeBaseAvecFraction)
      texte =
        `$${enonce}$` +
        ajouteChampTexteMathLive(this, i, KeyboardType.clavierSuite)
      // texte += `$${enonce}$` + ajouteChampTexteMathLive(this, i + 1, 'largeur01 inline nospacebefore ' + KeyboardType.clavierDeBaseAvecFraction)
      // texte += ajouteFeedback(this, i + 1)
      // handleAnswers(this, i, { reponse: { value: reponse, compare: expressionDeveloppeeEtNonReduiteCompare } })
      // handleAnswers(this, i, { reponse: { value: reponse } })
      handleAnswers(this, i, {
        reponse: {
          value: reponse,
          options: { calculFormel: true },
        },
      })
      // handleAnswers(this, i, { reponse: { value: reponse } })

      if (this.questionJamaisPosee(i, a, b)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
