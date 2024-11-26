import Decimal from 'decimal.js'
import { createList } from '../../lib/format/lists'
import { choice } from '../../lib/outils/arrayOutils'
import { randint } from '../../modules/outils'
import { texNombre } from '../../lib/outils/texNombre'
import Operation from '../../modules/operations'
import { egalOuApprox } from '../../lib/outils/ecritures'
import Exercice from '../Exercice'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { premiereLettreEnMajuscule } from '../../lib/outils/outilString'

export const uuid = '559fc'
export const refs = {
  'fr-fr': ['c3C32-00'],
  'fr-ch': []
}
export const titre = 'A la pêche aux coquillages (proportionnalité)'
export const dateDePublication = '15/11/2024'
export const interactifType = 'mathLive'
export const interactifReady = true
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
    this.sup = 2
    this.besoinFormulaire3CaseACocher = ['Opération posée dans la correction', false]
    this.nbQuestionsModifiable = true
  }

  nouvelleVersion () {
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let nbCoquillages: number
      let nouveauNombre: number|undefined
      const coquillages = [
        { nomSingulier: 'un bigorneau', nomPluriel: 'bigorneaux', masseMoyenne: 2 },
        { nomSingulier: 'une palourde', nomPluriel: 'palourdes', masseMoyenne: 20 },
        { nomSingulier: 'un bulot', nomPluriel: 'bulots', masseMoyenne: 50 },
        { nomSingulier: 'une coque', nomPluriel: 'coques', masseMoyenne: 15 },
        { nomSingulier: 'une moule', nomPluriel: 'moules', masseMoyenne: 25 },
        { nomSingulier: 'une praire', nomPluriel: 'praires', masseMoyenne: 30 },
        { nomSingulier: 'une telline', nomPluriel: 'tellines', masseMoyenne: 5 },
        { nomSingulier: 'un pétoncle', nomPluriel: 'pétoncles', masseMoyenne: 35 }
      ]
      const coquillage = choice(coquillages)
      const pronom = coquillage.nomSingulier.startsWith('une') ? 'elles' : 'ils'
      const tout = coquillage.nomSingulier.startsWith('une') ? 'toutes' : 'tous'
      const masseMoyenne = coquillage.masseMoyenne
      switch (this.sup) {
        case 1:
          nbCoquillages = choice([10, 100])
          nouveauNombre = randint(1, 6) * 10 + 5
          break
        case 3:
          nbCoquillages = randint(31, 59, [40, 50])
          break
        default:
          nbCoquillages = randint(31, 59, [40, 50])
          nouveauNombre = undefined
          break
      }
      const masseCoquillages = new Decimal(nbCoquillages).mul(randint(Math.floor(masseMoyenne * 2 / 3), Math.ceil(masseMoyenne * 3 / 2)))
      let listePrincipale: string
      let correction: string
      if (this.sup !== 1) { // this.sup = 2 et 3
        listePrincipale = `Aujourd'hui, j'ai trouvé $${nbCoquillages}$ ${coquillage.nomPluriel}. ${premiereLettreEnMajuscule(pronom)} pèsent ensemble $${this.sup === 2 ? `${texNombre(masseCoquillages, 2)}` : `${texNombre(masseCoquillages, 0)}`}$ g.<br>En supposant qu'${pronom} aient ${tout} la même masse, trouve combien pèse ${coquillage.nomSingulier}.
    ${this.sup === 3 ? '<br>Donner une valeur approchée au gramme près.' : ''}`

        if (this.sup === 2) {
          listePrincipale += ajouteQuestionMathlive({ exercice: this, question: i, objetReponse: { reponse: { value: texNombre(masseCoquillages.div(nbCoquillages), 2) } }, typeInteractivite: 'mathlive', texteApres: 'g' })
          correction = `Pour trouver la masse moyenne d'${coquillage.nomSingulier}, on divise la masse totale par le nombre de ${coquillage.nomPluriel}.<br>
    $${texNombre(masseCoquillages)}\\text{ g}\\div ${nbCoquillages}$ ${egalOuApprox(masseCoquillages.div(nbCoquillages), 2)} $${texNombre(masseCoquillages.div(nbCoquillages), 2)}$ g.<br>
     ${this.sup3 ? `${Operation({ operande1: masseCoquillages.toNumber(), operande2: nbCoquillages, type: 'division', precision: 2 })}` : ''}
        ${premiereLettreEnMajuscule(coquillage.nomSingulier)} pèse $${texNombre(masseCoquillages.div(nbCoquillages), 2)}$ g.<br>`
        } else {
          listePrincipale += ajouteQuestionMathlive({ exercice: this, question: i, objetReponse: { reponse: { value: texNombre(masseCoquillages.div(nbCoquillages), 0) } }, typeInteractivite: 'mathlive', texteApres: 'g' })
          correction = `Pour trouver la masse moyenne d'${coquillage.nomSingulier}, on divise la masse totale par le nombre de ${coquillage.nomPluriel}.<br>
    $${texNombre(masseCoquillages)}\\text{ g}\\div ${nbCoquillages} ${egalOuApprox(masseCoquillages.div(nbCoquillages), 0)} ${texNombre(masseCoquillages.div(nbCoquillages), 0)}$ g.
    ${this.sup3 ? `${Operation({ operande1: masseCoquillages.toNumber(), operande2: nbCoquillages, type: 'division', precision: 2 })}` : ''}
        ${premiereLettreEnMajuscule(coquillage.nomSingulier)} pèse environ $${texNombre(masseCoquillages.div(nbCoquillages), 0)}$ g au gramme près.<br>`
        }
      } else { // this.sup = 1
        listePrincipale = createList({
          items: [
    `Aujourd'hui, j'ai trouvé $${nbCoquillages}$ ${coquillage.nomPluriel}. ${premiereLettreEnMajuscule(pronom)} pèsent ensemble $${texNombre(masseCoquillages, 2)}$ g.<br>En supposant qu'${pronom} aient ${tout} la même masse, trouve combien pèse ${coquillage.nomSingulier} ?
          ${ajouteQuestionMathlive({ exercice: this, question: 2 * i, objetReponse: { reponse: { value: texNombre(masseCoquillages.div(nbCoquillages), 2) } }, typeInteractivite: 'mathlive', texteApres: 'g' })}`,
    `Combien pèsent $${nouveauNombre}$ ${coquillage.nomPluriel} (on suppose toujours qu'${pronom} ont ${tout} la même masse) ?
      ${ajouteQuestionMathlive({ exercice: this, question: 2 * i + 1, objetReponse: { reponse: { value: texNombre(masseCoquillages.mul(Number(nouveauNombre)).div(nbCoquillages), 2) } }, typeInteractivite: 'mathlive', texteApres: 'g' })}`
          ],
          style: 'alpha',
          classOptions: 'display: inline-block;'
        })
        correction = createList({
          items: [
    `Pour trouver la masse moyenne d'${coquillage.nomSingulier}, on divise la masse totale par le nombre de ${coquillage.nomPluriel}.<br>
    $${texNombre(masseCoquillages)}\\text{ g}\\div ${nbCoquillages}$ = $${texNombre(masseCoquillages.div(nbCoquillages), 2)}$ g.<br>
${this.sup3 ? `${Operation({ operande1: masseCoquillages.toNumber(), operande2: nbCoquillages, type: 'division', precision: 1 })}` : ''}${premiereLettreEnMajuscule(coquillage.nomSingulier)} pèse $${texNombre(masseCoquillages.div(nbCoquillages), 2)}$ g en moyenne.<br>`,
    `Pour trouver la masse de $${nouveauNombre}$ ${coquillage.nomPluriel}, on multiplie la masse moyenne d'${coquillage.nomSingulier} par le nombre de ${coquillage.nomPluriel}.
    $${texNombre(masseCoquillages.div(nbCoquillages), 2)}\\text{ g}\\times ${nouveauNombre}$ = $${texNombre(masseCoquillages.mul(Number(nouveauNombre)).div(nbCoquillages), 2)}$ g.<br>
     ${this.sup3 ? `${Operation({ operande1: masseCoquillages.div(nbCoquillages).toNumber(), operande2: nouveauNombre, type: 'multiplication', precision: 1 })}` : ''}$
     ${nouveauNombre}$ ${coquillage.nomPluriel} pèsent $${texNombre(masseCoquillages.mul(Number(nouveauNombre)).div(nbCoquillages), 2)}$ g.<br>`
          ],
          style: 'alpha'
        }
        )
      }
      if (this.questionJamaisPosee(i, nbCoquillages, masseCoquillages.toString(), coquillage.nomPluriel)) {
        this.listeQuestions.push(listePrincipale)
        this.listeCorrections.push(correction)
        i++
      }
      cpt++
    }
  }
}
