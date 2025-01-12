import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'

import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Calculer mentalement le périmètre de carrés, rectangles et cercles'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '13/12/2024'

export const uuid = 'e9252'
export const refs = {
  'fr-fr': ['6M25-1'],
  'fr-ch': []
}
/**
 * Les longueurs sont choisies de telle sorte que le calcul mental soit possible.
 * @author Rémi Angot
*/
export default class PerimetresCalculMental extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.spacingCorr = 2
  }

  nouvelleVersion () {
    this.consigne = this.nbQuestions === 1
      ? 'Calculer le périmètre exact de la figures suivante.'
      : 'Calculer le périmètre exact des figures suivantes.'
    const typeQuestionsDisponibles = ['carré', 'rectangle', 'cercleRayon', 'cercleDiametre']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let texteInteractif = ''
      switch (listeTypeQuestions[i]) {
        case 'carré':
          {
            const c = randint(2, 11) + randint(2, 9) / 10
            texte = `Carré de côté $${texNombre(c)}$ cm.`
            texteCorr = '$\\mathcal{P}_\\text{carré} = 4 \\times c$'
            texteCorr += `<br>$\\mathcal{P}_\\text{carré} = 4 \\times ${texNombre(c)}~\\text{cm}$`
            texteCorr += `<br>$\\mathcal{P}_\\text{carré} = ${miseEnEvidence(texNombre(4 * c))}~\\text{cm}$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{P}_\\text{carré} =$', texteApres: '$~\\text{cm}$' })
            handleAnswers(this, i, { reponse: { value: texNombre(4 * c), options: { nombreDecimalSeulement: true } } })
          }
          break
        case 'rectangle':
          {
            const l = randint(1, 3) + randint(1, 4) / 10
            const L = randint(5, 9) + randint(1, 4) / 10
            texte = `Rectangle de longueur $${texNombre(L)}$ cm et de largeur $${texNombre(l)}$ cm.`
            texteCorr = '$\\mathcal{P}_\\text{rectangle} = 2 \\times (L + l)$'
            texteCorr += `<br>$\\mathcal{P}_\\text{rectangle} = 2 \\times (${texNombre(L)} + ${texNombre(l)})~\\text{cm}$`
            texteCorr += `<br>$\\mathcal{P}_\\text{rectangle} = 2 \\times ${texNombre(L + l)}~\\text{cm}$`
            texteCorr += `<br>$\\mathcal{P}_\\text{rectangle} = ${miseEnEvidence(texNombre(2 * (L + l)))}~\\text{cm}$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{P}_\\text{rectangle} =$', texteApres: '$~\\text{cm}$' })
            handleAnswers(this, i, { reponse: { value: texNombre(2 * L + 2 * l), options: { nombreDecimalSeulement: true } } })
          }
          break
        case 'cercleRayon':
          {
            const r = randint(2, 9)
            texte = `Cercle de rayon $${texNombre(r)}$ cm.`
            texteCorr = '$\\mathcal{P}_\\text{cercle} = 2 \\times r \\times \\pi$'
            texteCorr += `<br>$\\mathcal{P}_\\text{cercle} = 2 \\times ${texNombre(r)}~\\text{cm} \\times \\pi$`
            texteCorr += `<br>$\\mathcal{P}_\\text{cercle} = ${miseEnEvidence(`${texNombre(2 * r)}\\pi`)}~\\text{cm}$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{P}_\\text{cercle} =$', texteApres: '$~\\text{cm}$' })
            handleAnswers(this, i, { reponse: { value: `${2 * r}\\pi`, options: { exclusifFactorisation: true } } })
          }
          break
        case 'cercleDiametre':
        {
          const d = randint(2, 9)
          texte = `Cercle de diamètre $${texNombre(d)}$ cm.`
          texteCorr = '$\\mathcal{P}_\\text{cercle} = d \\times \\pi$'
          texteCorr += `<br>$\\mathcal{P}_\\text{cercle} = ${miseEnEvidence(`${texNombre(d)}\\pi`)}~\\text{cm}$`
          texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{P}_\\text{cercle} =$', texteApres: '$~\\text{cm}$' })
          handleAnswers(this, i, { reponse: { value: `${d}\\pi`, options: { exclusifFactorisation: true } } })
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        if (this.interactif) {
          texte += '<br>' + texteInteractif
        }
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
