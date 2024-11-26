import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import NombrePeriodique from '../../modules/NombrePeriodique'
import { ceil, round } from 'mathjs'

export const titre = 'Convertir un nombre périodique en écriture décimale en fraction irréductible'
export const dateDePublication = '12/09/2024'
export const dateDeModifImportante = '21/11/2024'
export const interactifReady = false
export const uuid = '8f8bc'
export const refs = {
  'fr-ch': ['1CN-4'],
  'fr-fr': []
}

/**
 * Description didactique de l'exercice
 * @author Nathan Scheinmann
 */

export default class NombrePeriodiqueVersFraction extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.consigne = ''
    this.besoinFormulaireNumerique = ['Longueur maximale de la période', 4, '1\n2\n3\n4']
    this.besoinFormulaire2Numerique = ['Nombre de chiffres maximum dans la partie entière', 3, '1\n2\n3']
    this.besoinFormulaire3Numerique = ['Nombre de chiffres maximum dans la partie décimale (hors période)', 3, '0\n1\n2\n3']
    this.besoinFormulaire4CaseACocher = ['Partie entière égale à 0']
    this.besoinFormulaire5CaseACocher = ['Indiquer que la calculatrice est autorisée']
    this.sup = 2
    this.sup2 = 1
    this.sup3 = 1
    this.sup4 = false
    this.sup5 = true
  }

  nouvelleVersion () {
    this.consigne = `Écrire en fraction irréductible ${this.nbQuestions > 1 ? 'les nombres périodiques suivants' : 'le nombre périodique suivant'}.`
    if (this.sup5) {
      this.consigne += ' La calculatrice est autorisée.'
    }
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const periode = ceil(randint(10 ** (this.sup - 1), 10 ** this.sup - 1) / (10 ** randint(0, this.sup)))
      let entier = round(randint(10 ** (this.sup2 - 1), 10 ** this.sup2 - 1) / (10 ** randint(0, this.sup2)))
      let decimal = 0
      if (this.sup3 === 1) {
        decimal = -1
      } else {
        decimal = ceil(randint(10 ** (this.sup3 - 1), 10 ** this.sup3 - 1) / (10 ** randint(0, this.sup3)))
      }
      if (this.sup4 === true) {
        entier = 0
      }
      const nombrePerio = new NombrePeriodique(entier, decimal, periode)
      let texte = ''
      let texteCorr = ''

      texte = `$${nombrePerio.toString()}$`
      texteCorr = `${nombrePerio.toFractionNouvelProcedure()}`

      if (this.questionJamaisPosee(i, periode)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
