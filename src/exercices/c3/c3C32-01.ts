import { createList } from '../../lib/format/lists'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import { randint } from '../../modules/outils'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import Operation from '../../modules/operations'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'

export const uuid = '9d5ef'
export const refs = {
  'fr-fr': ['c3C32-01'],
  'fr-ch': []
}
export const titre = 'Au marché (addition et soustraction de masses, conversions)'
export const dateDePublication = '20/11/2024'
export const interactifType = 'mathLive'
export const interactifReady = true

const prenoms = [
  // Féminins
  'Amina', // Arabe
  'Chloé', // Français
  'Mei', // Chinois
  'Ananya', // Indien
  'Fatou', // Africain (Sénégal)
  'Isabella', // Italien/espagnol
  'Aya', // Japonais
  'Laila', // Perse/arabe
  'Sofia', // Européen
  'Zara', // Turc
  'Emma', // Français
  'Jade', // Français
  'Louise', // Français
  'Alice', // Français
  'Chloé', // Français
  'Lina', // Français
  'Léa', // Français
  'Manon', // Français
  'Camille', // Français
  'Rose', // Français
  'Lucas', // Français
  'Hugo', // Français
  'Louis', // Français
  'Gabriel', // Français
  'Léo', // Français
  'Arthur', // Français
  'Nathan', // Français
  'Jules', // Français
  'Raphaël', // Français
  'Noah', // Français
  'Ali', // Arabe
  'Hugo', // Français
  'Wei', // Chinois
  'Arjun', // Indien
  'Mamadou', // Africain (Sénégal)
  'Luca', // Italien/espagnol
  'Takeshi', // Japonais
  'Omar', // Perse/arabe
  'Mateo', // Européen
  'Emir' // Turc
]

/**
 * @Author Jean-Claude Lhote
 * Sur des propositions d'exercices des collègues du collège de Vaucouleurs
 * Et en s'appuyant sur la liasion de notre circonscription avec les professeurs des écoles
 * J'ai décidé de modéliser ces situations problèmes sous la forme d'exercices Mathaléa
 * Ces exercices seront proposés systématiquement pour 3 niveaux de difficulté afin de différentier autour d'un même problème
 */
export default class ExerciceProbleme001 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.besoinFormulaireNumerique = ['niveau de difficulté', 3, '1 : Élèves à besoin\n2 : Moyens\n3 : Avancés']
    this.sup = 1
    this.besoinFormulaire3CaseACocher = ['Opération posée dans la correction', false]
    this.sup3 = false
    this.nbQuestionsModifiable = true
    this.correctionDetailleeDisponible = true
    this.correctionDetaillee = true
  }

  nouvelleVersion () {
    const prenomsMelanges = shuffle(prenoms)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const listeFruit1 = [
        { nomSingulier: 'une fraise', nomPluriel: 'fraises', pluriel: 'de fraises', masseUnitaire: 50 },
        { nomSingulier: 'un abricot', nomPluriel: 'abricots', pluriel: 'd\'abricots', masseUnitaire: 100 },
        { nomSingulier: 'un kiwi', nomPluriel: 'kiwis', pluriel: 'de kiwis', masseUnitaire: 150 },
        { nomSingulier: 'un citron', nomPluriel: 'citrons', pluriel: 'de citrons', masseUnitaire: 100 },
        { nomSingulier: 'une orange', nomPluriel: 'oranges', pluriel: 'd\'oranges', masseUnitaire: 200 },
        { nomSingulier: 'une banane', nomPluriel: 'bananes', pluriel: 'de bananes', masseUnitaire: 150 },
        { nomSingulier: 'une pomme', nomPluriel: 'pommes', pluriel: 'de pommes', masseUnitaire: 200 },
        { nomSingulier: 'une poire', nomPluriel: 'poires', pluriel: 'de poires', masseUnitaire: 200 },
        { nomSingulier: 'une cerise', nomPluriel: 'cerises', pluriel: 'de cerises', masseUnitaire: 5 }
      ]
      const fruit1 = choice(listeFruit1)
      const fruit2 = choice(listeFruit1.filter(fruit => fruit.nomSingulier !== fruit1.nomSingulier))
      const fruit3 = choice(listeFruit1.filter(fruit => fruit.nomSingulier !== fruit1.nomSingulier && fruit.nomSingulier !== fruit2.nomSingulier))
      let quantiteFruit2: { litteral: string, nombre: number }
      let quantiteFruit3: { litteral: string, nombre: number }
      let quantiteFruit1: { litteral: string, nombre: number }
      let masseFruit1: number
      let masseFruit2: number
      let masseFruit3: number
      let masseTotale: number
      do {
        switch (this.sup) {
          case 1:
            quantiteFruit1 = {
              litteral: '',
              nombre: Math.round(randint(1, 7) * 500 / fruit1.masseUnitaire)
            }
            quantiteFruit2 = choice([{
              litteral: 'un demi-kilogramme',
              nombre: 500 / fruit2.masseUnitaire
            },
            {
              litteral: 'un kilogramme',
              nombre: 1000 / fruit2.masseUnitaire
            },
            {
              litteral: 'un quart de kilogramme',
              nombre: 250 / fruit2.masseUnitaire
            }
            ])
            quantiteFruit3 = {
              litteral: '',
              nombre: randint(7, 25) * 50 / fruit3.masseUnitaire
            }
            break
          case 3:
            quantiteFruit1 = {
              litteral: '',
              nombre: Math.round(randint(1, 7) * 500 / fruit1.masseUnitaire)
            }
            quantiteFruit2 = choice([{
              litteral: 'un demi-kilogramme',
              nombre: 500 / fruit2.masseUnitaire
            },
            {
              litteral: 'un kilogramme',
              nombre: 1000 / fruit2.masseUnitaire
            },
            {
              litteral: 'un quart de kilogramme',
              nombre: 250 / fruit2.masseUnitaire
            }
            ])
            quantiteFruit3 = {
              litteral: '',
              nombre: randint(7, 25) * 50 / fruit3.masseUnitaire
            }
            break
          default:
            quantiteFruit1 = {
              litteral: '',
              nombre: Math.round(randint(1, 7) * 500) / fruit1.masseUnitaire
            }
            quantiteFruit2 = choice([{
              litteral: 'un demi-kilogramme',
              nombre: 500 / fruit2.masseUnitaire
            },
            {
              litteral: 'un kilogramme',
              nombre: 1000 / fruit2.masseUnitaire
            },
            {
              litteral: 'un quart de kilogramme',
              nombre: 250 / fruit2.masseUnitaire
            }
            ])
            quantiteFruit3 = {
              litteral: '',
              nombre: randint(7, 25) * 50 / fruit3.masseUnitaire
            }
            break
        }
        masseFruit1 = quantiteFruit1.nombre * fruit1.masseUnitaire
        masseFruit2 = quantiteFruit2.nombre * fruit2.masseUnitaire
        masseFruit3 = quantiteFruit3.nombre * fruit3.masseUnitaire
        masseTotale = (masseFruit1 + masseFruit2 + masseFruit3) / 1000
      } while (masseTotale > 4.7)

      let correction = ''
      const prenom = prenomsMelanges[i % prenoms.length]
      let listeCorrections: string[] = []
      let enonce = `${prenom} revient du marché. Il a acheté $${texNombre(masseFruit1)}$ g ${fruit1.pluriel}, ${quantiteFruit2.litteral} ${fruit2.pluriel} et a oublié la masse ${fruit3.pluriel} achetés.<br>
Le contenu de son panier pèse $${texNombre(masseTotale, 3, true)}$ kg.`
      let listeQuestions: string[] = []
      if (this.sup === 1) {
        listeQuestions = [
          'Exprimer la masse totale du panier en grammes.' + ajouteQuestionMathlive({ exercice: this, question: 4 * i, objetReponse: { reponse: { value: texNombre(masseTotale * 1000, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' }),
          `Exprimer la masse des ${fruit2.nomPluriel} en grammes.` + ajouteQuestionMathlive({ exercice: this, question: 4 * i + 1, objetReponse: { reponse: { value: texNombre(masseFruit2, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' }),
          `Quelle est la masse totale de ${fruit1.nomPluriel} et ${fruit2.nomPluriel} achetés ?` + ajouteQuestionMathlive({ exercice: this, question: 4 * i + 2, objetReponse: { reponse: { value: texNombre(masseFruit1 + masseFruit2, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' }),
          `Quelle est la masse des ${fruit3.nomPluriel} ?` + ajouteQuestionMathlive({ exercice: this, question: 4 * i + 3, objetReponse: { reponse: { value: texNombre(masseFruit3, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' })
        ]
        listeCorrections = [
          `${this.correctionDetaillee ? 'Pour exprimer la masse totale du panier en grammes, on multiplie la masse totale par 1000.<br>' : ''}
          $${texNombre(masseTotale, 0)}\\times 1000$ kg = $${texNombre(masseTotale * 1000, 0)}$ g.<br>
          ${this.sup3 ? Operation({ operande1: masseTotale, operande2: 1000, type: 'multiplication', precision: 0 }) : ''}
             ${this.sup3 ? '<br><br>' : ''}
    La masse totale de fruits dans le panier est de $${texNombre(masseTotale * 1000, 0)}$ g.`,
          `${this.correctionDetaillee ? `Pour exprimer la masse des ${fruit2.nomPluriel} en grammes, on multiplie la masse par 1000.<br>` : ''}
          $${texNombre(masseFruit2 / 1000, 3, true)}\\text{ kg }\\times 1000=${texNombre(masseFruit2, 0)}\\text{ g}$.<br>
          ${this.sup3 ? Operation({ operande1: masseFruit2 / 1000, operande2: 1000, type: 'multiplication', precision: 0 }) : ''}
             ${this.sup3 ? '<br><br>' : ''}
    La masse des ${fruit2.nomPluriel} est de $${texNombre(masseFruit2, 0)}$ g.`,
         `${this.correctionDetaillee ? `Pour exprimer la masse totale ${fruit1.pluriel} et ${fruit2.pluriel} achetés, on additionne les masses.<br>` : ''}
          $${texNombre(masseFruit1, 0)}$ g + $${texNombre(masseFruit2, 0)}$ g = $${texNombre(masseFruit1 + masseFruit2, 0)}$ g.<br>
          ${this.sup3 ? Operation({ operande1: masseFruit1, operande2: masseFruit2, type: 'addition', precision: 0 }) : ''}
             ${this.sup3 ? '<br><br>' : ''}
    La masse totale ${fruit1.pluriel} et ${fruit2.pluriel} achetés est de $${texNombre(masseFruit1 + masseFruit2, 0)}$ g.`,
          `${this.correctionDetaillee ? `Pour exprimer la masse des ${fruit3.nomPluriel} en grammes, on calcule la différence entre la masse du panier et la masse totale ${fruit1.pluriel} et ${fruit2.pluriel} calculée à la question précédente.<br>` : ''}
          $${texNombre(masseTotale * 1000, 0)}-${texNombre(masseFruit1 + masseFruit2, 0)}= ${texNombre(masseFruit3, 0)}$ g.<br>
          ${this.sup3 ? Operation({ operande1: masseTotale * 1000, operande2: masseFruit1 + masseFruit2, type: 'soustraction', precision: 0 }) : ''}
             ${this.sup3 ? '<br><br>' : ''}
    ${prenom} a acheté $${texNombre(masseFruit3, 0)}$ g ${fruit3.pluriel}.`
        ]
      } else if (this.sup === 2) {
        listeQuestions = [
          'Exprimer la masse totale du panier en grammes.' + ajouteQuestionMathlive({ exercice: this, question: 3 * i, objetReponse: { reponse: { value: texNombre(masseTotale * 1000, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' }),
          `Exprimer la masse des ${fruit2.nomPluriel} en grammes.<br><br>` + ajouteQuestionMathlive({ exercice: this, question: 3 * i + 1, objetReponse: { reponse: { value: texNombre(masseFruit2, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' }),
          `Quelle est la masse des ${fruit3.nomPluriel} ?` + ajouteQuestionMathlive({ exercice: this, question: 3 * i + 2, objetReponse: { reponse: { value: texNombre(masseFruit3, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' })
        ]
        listeCorrections = [
          `${this.correctionDetaillee ? 'Pour exprimer la masse totale du panier en grammes, on multiplie la masse totale par 1000.<br>' : ''}
          $${texNombre(masseTotale, 0)}\\times 1000$ kg = $${texNombre(masseTotale * 1000, 0)}$ g.<br>
          ${this.sup3 ? Operation({ operande1: masseTotale, operande2: 1000, type: 'multiplication', precision: 0 }) : ''}
         ${this.sup3 ? '<br><br>' : ''}
     La masse totale de fruits dans le panier est de $${texNombre(masseTotale * 1000, 0)}$ g.`,
          `${this.correctionDetaillee ? `Pour exprimer la masse des ${fruit2.nomPluriel} en grammes, on multiplie la masse par 1000.<br>` : ''}
          $${texNombre(masseFruit2 / 1000, 3, true)}\\text{ kg }\\times 1000=${texNombre(masseFruit2, 0)}\\text{ g}$.<br>
        ${this.sup3 ? Operation({ operande1: masseFruit2 / 1000, operande2: 1000, type: 'multiplication', precision: 0 }) : ''}
             ${this.sup3 ? '<br><br>' : ''}
     La masse des ${fruit2.nomPluriel} est de $${texNombre(masseFruit2, 0)}$ g.`,
          `${this.correctionDetaillee ? `Pour exprimer la masse des ${fruit3.nomPluriel} en grammes, on calcule la différence entre la masse du panier et la somme des masses de ${fruit1.nomPluriel} et de ${fruit2.nomPluriel}.<br>` : ''}
          $${texNombre(masseTotale * 1000, 0)}-(${texNombre(masseFruit1, 0)} + ${texNombre(masseFruit2, 0)})=${texNombre(masseTotale * 1000, 0)}-${texNombre(masseFruit1 + masseFruit2, 0)}= ${texNombre(masseFruit3, 0)}$ g.<br>
            ${this.sup3 ? Operation({ operande1: masseFruit1, operande2: masseFruit2, type: 'addition', precision: 0, style: 'display: inline-block' }) : ''}
          ${this.sup3 ? Operation({ operande1: masseTotale * 1000, operande2: masseFruit1 + masseFruit2, type: 'soustraction', precision: 0, style: 'display: inline-block' }) : ''}
           ${this.sup3 ? '<br><br>' : ''}
   ${prenom} a acheté $${texNombre(masseFruit3, 0)}$ g ${fruit3.pluriel}.`
        ]
      } else {
        listeQuestions = [
          `<br>Quelle est la masse des ${fruit3.nomPluriel} ?` + ajouteQuestionMathlive({ exercice: this, question: i, objetReponse: { reponse: { value: texNombre(masseFruit3, 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' })
        ]
        listeCorrections = [
          `${this.correctionDetaillee ? `Pour exprimer la masse des ${fruit3.nomPluriel} en grammes, on retire la masse totale ${fruit1.pluriel} et ${fruit2.pluriel} achetés de la masse du panier après conversion de toutes les donnnées en grammes.<br>` : ''}
            ${this.sup3 ? Operation({ operande1: masseTotale, operande2: 1000, type: 'multiplication', precision: 0, style: 'display: inline-block' }) : ''}
         ${this.sup3 ? Operation({ operande1: masseFruit2 / 1000, operande2: 1000, type: 'multiplication', precision: 0, style: 'display: inline-block' }) : ''}
          ${this.sup3 ? Operation({ operande1: masseTotale * 1000, operande2: masseFruit1 + masseFruit2, type: 'soustraction', precision: 0, style: 'display: inline-block' }) : ''}
          ${this.sup3 ? '<br><br>' : ''}
     - Masse du panier en grammes : $${texNombre(masseTotale, 3, true)}\\times 1000\\text{ g }=${texNombre(masseTotale * 1000, 0)}$ g.<br>
          - Masse totale ${fruit1.pluriel} et ${fruit2.pluriel} achetés : $${texNombre(masseFruit1, 0)}\\text{ g }+${texNombre(masseFruit2, 0)}\\text{ g }=${texNombre(masseFruit1 + masseFruit2, 0)}$ g.<br>
          - Masse des ${fruit3.nomPluriel} : $${texNombre(masseTotale * 1000, 0)}\\text{ g }-${texNombre(masseFruit1 + masseFruit2, 0)}\\text{ g }=${texNombre(masseFruit3, 0)}$ g.<br>
          `
        ]
      }
      enonce += listeQuestions.length === 1
        ? listeQuestions[0]
        : createList({
          items: listeQuestions,
          style: 'alpha'
        })
      correction = listeCorrections.length === 1
        ? listeCorrections[0]
        : createList({
          items: listeCorrections,
          style: 'alpha'
        })
      if (this.questionJamaisPosee(i, [quantiteFruit1, quantiteFruit2, quantiteFruit3].map(el => JSON.stringify(el)).join(''))) {
        this.listeQuestions.push(enonce)
        this.listeCorrections.push(correction)
        // this.listeCorrections.push(correction)
        i++
      }
      cpt++
    }
  }
}
