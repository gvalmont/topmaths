import Exercice from '../Exercice'
import { listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Calculer l\'aire de carrés, rectangles, triangles et disques (calcul mental)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '13/12/2024'

export const uuid = '9e8f9'
export const refs = {
  'fr-fr': ['6M25-2'],
  'fr-ch': []
}
/**
 * Les longueurs sont choisies de telle sorte que le calcul mental soit possible.
 * @author Rémi Angot
*/
export default class AiresCalculMental extends Exercice {
  constructor () {
    super()
    this.consigne = 'Calculer l\'aire exacte des figures suivantes.'
    this.nbQuestions = 5
    this.spacingCorr = 2
    // this.besoinFormulaireCaseACocher = ['Tracer les figures', false]
  }

  nouvelleVersion () {
    const typeQuestionsDisponibles = ['carré', 'rectangle', 'triangle', 'disqueRayon', 'disqueDiametre']
    const listeTypeQuestions = combinaisonListes(typeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texte = ''
      let texteCorr = ''
      let texteInteractif = ''
      switch (listeTypeQuestions[i]) {
        case 'carré':
          {
            const c = randint(2, 10)
            texte = `Carré de côté $${texNombre(c)}$ cm.`
            texteCorr = '$\\mathcal{A}_\\text{carré} = c \\times c$'
            texteCorr += `<br>$\\mathcal{A}_\\text{carré} = ${texNombre(c)}~\\text{cm}  \\times ${texNombre(c)}~\\text{cm}$`
            texteCorr += `<br>$\\mathcal{A}_\\text{carré} = ${miseEnEvidence(texNombre(c * c))}~\\text{cm}^2$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{A}_\\text{carré} =$', texteApres: '$~\\text{cm}^2$' })
            handleAnswers(this, i, { reponse: { value: texNombre(c * c), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } } })
          }
          break
        case 'rectangle':
          {
            const l = randint(1, 3) + randint(2, 9) / 10
            const L = randint(5, 9)
            texte = `Rectangle de longueur $${texNombre(L)}$ cm et de largeur $${texNombre(l)}$ cm.`
            texteCorr = '$\\mathcal{A}_\\text{rectangle} = L \\times l$'
            texteCorr += `<br>$\\mathcal{A}_\\text{rectangle} = ${texNombre(L)}~\\text{cm} \\times ${texNombre(l)}~\\text{cm}$`
            texteCorr += `<br>$\\mathcal{A}_\\text{rectangle} = ${miseEnEvidence(texNombre(L * l))}~\\text{cm}^2$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{A}_\\text{rectangle} =$', texteApres: '$~\\text{cm}^2$' })
            handleAnswers(this, i, { reponse: { value: texNombre(L * l), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } } })
          }
          break
        case 'triangle':
          {
            const b = randint(2, 9)
            const h = randint(2, 9)
            texte = `Triangle de base $${texNombre(b)}$ cm et de hauteur $${texNombre(h)}$ cm.`
            texteCorr = '$\\mathcal{A}_\\text{triangle} = (b \\times h) \\div 2$'
            texteCorr += `<br>$\\mathcal{A}_\\text{triangle} = (${texNombre(b)}~\\text{cm} \\times ${texNombre(h)}~\\text{cm}) \\div 2$`
            texteCorr += `<br>$\\mathcal{A}_\\text{triangle} = ${texNombre(b * h)}~\\text{cm}^2 \\div 2$`
            texteCorr += `<br>$\\mathcal{A}_\\text{triangle} = ${miseEnEvidence(texNombre(b * h / 2))}~\\text{cm}^2$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{A}_\\text{triangle} =$', texteApres: '$~\\text{cm}^2$' })
            handleAnswers(this, i, { reponse: { value: texNombre(b * h / 2), compare: fonctionComparaison, options: { nombreDecimalSeulement: true } } })
          }
          break
        case 'disqueRayon':
          {
            const r = randint(2, 9)
            texte = `Disque de rayon $${texNombre(r)}$ cm.`
            texteCorr = '$\\mathcal{A}_\\text{disque} = r \\times r \\times \\pi$'
            texteCorr += `<br>$\\mathcal{A}_\\text{disque} = ${texNombre(r)}~\\text{cm} \\times ${texNombre(r)}~\\text{cm} \\times \\pi$`
            texteCorr += `<br>$\\mathcal{A}_\\text{disque} = ${miseEnEvidence(`${texNombre(r * r)}\\pi`)}~\\text{cm}^2$`
            texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{A}_\\text{disque} =$', texteApres: '$~\\text{cm}^2$' })
            handleAnswers(this, i, { reponse: { value: `${r * r}\\pi`, compare: fonctionComparaison, options: { exclusifFactorisation: true } } })
          }
          break
        case 'disqueDiametre':
        {
          const r = randint(2, 9)
          texte = `Disque de diamètre $${texNombre(2 * r)}$ cm.`
          texteCorr = '$\\mathcal{A}_\\text{disque} = r \\times r \\times \\pi$'
          texteCorr += `<br>$\\mathcal{A}_\\text{disque} = ${texNombre(r)}~\\text{cm} \\times ${texNombre(r)}~\\text{cm} $`
          texteCorr += `<br>$\\mathcal{A}_\\text{disque} = ${miseEnEvidence(`${texNombre(r * r)}\\pi`)}~\\text{cm}^2$`
          texteInteractif += ajouteChampTexteMathLive(this, i, KeyboardType.college6eme, { texteAvant: '$\\mathcal{A}_\\text{disque} =$', texteApres: '$~\\text{cm}^2$' })
          handleAnswers(this, i, { reponse: { value: `${r * r}\\pi`, compare: fonctionComparaison, options: { exclusifFactorisation: true } } })
        }
      }
      if (this.questionJamaisPosee(i, texte)) {
        if (this.interactif) {
          texte += '<br>' + texteInteractif
        }
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
