import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import {
  contraindreValeur,
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint,
} from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Calculer avec des nombres'

export const dateDePublication = '25/09/2025'

export const uuid = '345f7'

export const refs = {
  'fr-fr': [], // '5C12-7'],
  'fr-ch': [],
}
/**
 *
 * @author Olivier Mimeau
 */
export default class nomExercice extends Exercice {
  constructor() {
    super()
    // this.consigne = 'Consigne'
    this.besoinFormulaireTexte = [
      'Type de questions',
      [
        'Nombres séparés par des tirets  :',
        ' 1 : Double',
        ' 2 : Triple',
        ' 3 : Moitié',
        ' 4 : Quart',
        ' 5 : Dixième',
        ' 6 : Entier suivant',
        ' 7 : Entier précédent',
        ' 8 : Carré',
        ' 9 : Cube',
        '10 : Opposé',
        '11 : Inverse',
        '12 : Somme de deux nombres',
        '13 : Différence entre deux nombres',
        '14 : Produit de deux nombres',
        '15 : Quotient de deux nombres',
        // '16 : Nombre pair suivant',
        // '17 : Nombre impair suivant',
        // '18 : Multiple suivant',
      ].join('\n'),
    ]
    this.nbQuestions = 4
    /* this.besoinFormulaire2Texte = [
      'Type de nombres',
      [
        'Nombres séparés par des tirets  :',
        ' 1 : Nombres entiers',
        // ' 2 : Nombres Decimaux',
        // ' 3 : Fractions',
        // ' 4 : Mélange',
      ].join('\n'),
    ] */
    // this.besoinFormulaire3CaseACocher = ['Utiliser des nombres reltifs']
    this.besoinFormulaire4Numerique = [
      'Valeurs maximum en valeurs absolues',
      100,
    ]
    this.sup4 = 50
    this.sup3 = false
  }

  nouvelleVersion() {
    this.sup4 = contraindreValeur(10, 200, this.sup4, 50)
    const listeTypeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 15,
      defaut: 1,
      melange: 19,
      // shuffle: false,
      nbQuestions: this.nbQuestions,
    })
    type Operation = {
      num: number
      nom: string
      enchainement: string
      fct: (x: number, y: number) => number
    }
    const operations: Operation[] = [
      {
        num: 1,
        nom: 'le double de number1',
        enchainement: `$number1 \\times 2$`,
        fct: (x: number, y: number) => 2 * x,
      },
      {
        num: 2,
        nom: 'le triple de number1',
        enchainement: `$ number1 \\times 3$`,
        fct: (x: number, y: number) => 3 * x,
      },
      {
        num: 3,
        nom: 'la moitié de number1',
        enchainement: `$number1 \\div 2$`,
        fct: (x: number, y: number) => x / 2,
      },
      {
        num: 4,
        nom: 'le quart de number1',
        enchainement: `$number1 \\div 4$`,
        fct: (x: number, y: number) => x / 4,
      },
      {
        num: 5,
        nom: 'le dixième de number1',
        enchainement: `$number1 \\div 10$`,
        fct: (x: number, y: number) => x / 10,
      },
      {
        num: 6,
        nom: "l'entier suivant de number1",
        enchainement: `$number1 + 1$`,
        fct: (x: number, y: number) => Math.floor(x) + 1,
      },
      {
        num: 7,
        nom: "l'entier précédent de number1",
        enchainement: `$number1 - 1$`,
        fct: (x: number, y: number) => Math.floor(x) - 1,
      },
      {
        num: 8,
        nom: 'le carré de number1',
        enchainement: `$number1^2$`,
        fct: (x: number, y: number) => x * x,
      },
      {
        num: 9,
        nom: 'le cube de number1',
        enchainement: `$number1^3$`,
        fct: (x: number, y: number) => x * x * x,
      },
      {
        num: 10,
        nom: "l'opposé de number1",
        enchainement: `$number1 \\times (-1)$`,
        fct: (x: number, y: number) => -x,
      },
      {
        num: 11,
        nom: "l'inverse de number1",
        enchainement: `$\\dfrac{1}{number1}$`,
        fct: (x: number, y: number) => (x !== 0 ? 1 / x : NaN),
      },
      {
        num: 16,
        nom: 'le nombre pair suivant de number1',
        enchainement: `$number1 + 2$ (si le nombre se termine par 0,2,4,6,8) , $number1 + 1$ sinon`,
        fct: (x: number, y: number) =>
          Math.floor(x) % 2 === 0 ? Math.floor(x) + 2 : Math.floor(x) + 1,
      },
      {
        num: 17,
        nom: 'le nombre impair suivant de number1',
        enchainement: `$number1 + 1$ (si le nombre se termine par 0,2,4,6,8) , $number1 + 2$ sinon`,
        fct: (x: number, y: number) =>
          Math.floor(x) % 2 === 1 ? Math.floor(x) + 2 : Math.floor(x) + 1,
      },
      {
        num: 12,
        nom: 'la somme de number1 et number2',
        enchainement: `$number1 + number2$`,
        fct: (x: number, y: number) => x + y,
      },
      {
        num: 13,
        nom: 'la différence entre number1 et number2',
        enchainement: `$number1 - number2$`,
        fct: (x: number, y: number) => x - y,
      },
      {
        num: 14,
        nom: 'le produit de number1 par number2',
        enchainement: `$number1 \\times number2$`,
        fct: (x: number, y: number) => x * y,
      },
      {
        num: 15,
        nom: 'le quotient de number1 par number2',
        enchainement: `$number1 \\div number2$`,
        fct: (x: number, y: number) => (y !== 0 ? x / y : NaN),
      },
      {
        num: 18,
        nom: 'le multiple de number2 suivant number1',
        enchainement: `$number1 +1$`,
        fct: (x: number, y: number) =>
          y !== 0 ? (Math.floor(x / y) + 1) * y : NaN,
      },
    ]
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; ) {
      let texte = ''
      let texteCorr = ''
      const lOperation = Number(listeTypeQuestions[i])
      // alea
      let nombre1 = 0
      let nombre2 = 0
      switch (listeTypeQuestions[i]) {
        case 8: // carré
          nombre1 = randint(1, 10)
          break
        case 9: // cube
          nombre1 = randint(1, 5)
          break
        case 13: // différence
          nombre1 = randint(2, this.sup4)
          nombre2 = randint(1, nombre1 - 1)
          break
        case 14: // produit
          nombre1 = randint(2, this.sup4)
          nombre2 = randint(2, 11)
          break
        case 15: // quotient
          nombre2 = choice([2, 3, 4, 5, 6, 8, 10])
          do nombre1 = nombre2 * randint(1, 12)
          while (nombre1 < this.sup4 + 1)
          break
        case 18: // multiple de number2 suivant
          nombre1 = randint(1, this.sup4)
          nombre2 = choice([3, 4, 5, 9, 10])
          break
        default:
          nombre1 = randint(1, this.sup4)
          nombre2 = randint(1, this.sup4)
      }
      if (this.sup3) {
        if (choice([true, false])) nombre1 = -nombre1
        if (choice([true, false]) || lOperation !== 18) nombre2 = -nombre2
      }
      const texteAvecNombre = operations[lOperation - 1].nom
        .replace('number1', `${nombre1}`)
        .replace('number2', `${nombre2}`)
      texte += `Calculer ${texteAvecNombre}.`
      const metUnE = texteAvecNombre.charAt(1) === 'a' ? 'e' : ''
      const enchainementAvecNombre = operations[lOperation - 1].enchainement
        .replace('number1', `${nombre1}`)
        .replace('number2', `${nombre2}`)
      texteCorr += `${texteAvecNombre.replace('l', 'L')} est égal${metUnE} à ${enchainementAvecNombre}`
      texteCorr +=
        lOperation === 11
          ? ''
          : ` = $${texNombre(operations[lOperation - 1].fct(nombre1, nombre2))}$.`

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
