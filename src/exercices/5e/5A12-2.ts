import { combinaisonListes } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { listeNombresPremiersStrictJusqua, premiersEntreBornes } from '../../lib/outils/primalite'
import { egalOuApprox, lister } from '../../lib/outils/ecritures'
import { texNombre } from '../../lib/outils/texNombre'

export const titre = 'Reconnaître un nombre premier'
export const dateDeModifImportante = '06/12/2024'

/**
 * @author Guillaume Valmont
*/

export const uuid = '03d65'
export const refs = {
  'fr-fr': ['5A12-2'],
  'fr-ch': ['9NO4-14']
}
export default class ReconnaitreNombrePremier extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.besoinFormulaireNumerique = ['Maximum', 10000]
    this.sup = 500
    this.besoinFormulaire2CaseACocher = ['Avec calcul de la racine carrée']
    this.sup2 = false
  }

  nouvelleVersion () {
    this.listeQuestions = []
    this.listeCorrections = []
    this.autoCorrection = []

    const typeQuestionsDisponibles = ['premier', 'non premier']

    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const max = Number(this.sup)
      const listePremiers = listeNombresPremiersStrictJusqua(max)
      let a = 0
      switch (listeTypeQuestions[i]) {
        case 'premier':
          a = listePremiers[randint(0, listePremiers.length - 1)]
          break
        case 'non premier':
          a = randint(2, max, listePremiers)
          break
      }
      const texte = `Vérifier si $${texNombre(a)}$ est un nombre premier.`
      const texteCorr = rediger(a, this.sup2)
      if (this.questionJamaisPosee(i, texte)) {
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

function rediger (a: number, avecCalculDeRacine: boolean): string {
  if (premiersEntreBornes(2, 30).includes(a)) {
    return `$${texNombre(a)}$ est un nombre premier. Il fait partie des nombres premiers à connaître : ${lister(premiersEntreBornes(2, 30).map(t => `$${t}$`))}.`
  }
  const premiersATester = premiersEntreBornes(2, Math.floor(Math.sqrt(a)))
  let redaction = ''
  if (avecCalculDeRacine) {
    redaction = `$\\sqrt{${a}} \\approx ${texNombre(Math.sqrt(a), 2)}$<br>
    On vérifie si $${texNombre(a)}$ est divisible par tous les nombres inférieurs ou égaux à $${Math.floor(Math.sqrt(a))}$, c'est-à-dire ${lister(premiersATester.map(t => `$${t}$`))}.<br>`
  } else {
    redaction = `On essaie de diviser $${texNombre(a)}$ par tous les nombres premiers jusqu'à ce que le quotient soit inférieur au dividende.<br>`
  }
  let i = 0
  while (i < premiersATester.length && a % premiersATester[i] !== 0) {
    redaction += `$${a} \\div ${premiersATester[i]} ${egalOuApprox(a / premiersATester[i], 2)} ${texNombre(a / premiersATester[i], 2)}$<br>`
    i++
  }
  if (a % premiersATester[i] === 0) {
    redaction += `$${a} \\div ${premiersATester[i]} = ${texNombre(a / premiersATester[i], 2)}$<br>`
    redaction += `$${texNombre(a)}$ est divisible par $${premiersATester[i]}$, donc $${texNombre(a)}$ n'est pas un nombre premier.`
  } else {
    if (avecCalculDeRacine) {
      redaction += `$${texNombre(a)}$ n'est divisible par aucun des nombres premiers inférieurs ou égaux à $${Math.floor(Math.sqrt(a))}$, donc $${texNombre(a)}$ est un nombre premier.`
    } else {
      const premierSuivant = premiersEntreBornes(2, a * 2).slice(premiersATester.length)[0]
      redaction += `$${a} \\div ${premierSuivant} ${egalOuApprox(a / premierSuivant, 2)} ${texNombre(a / premierSuivant, 2)}$<br>`
      redaction += `$${texNombre(a / premierSuivant, 2)} < ${premierSuivant}$, donc peut s'arrêter.<br>`
      redaction += `$${texNombre(a)}$ est un nombre premier.`
    }
  }
  return redaction
}
