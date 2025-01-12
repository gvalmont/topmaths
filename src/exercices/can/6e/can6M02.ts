import { enleveElement } from '../../../lib/outils/arrayOutils'
import { context } from '../../../modules/context'
import { propositionsQcm } from '../../../lib/interactif/qcm'
import { listeQuestionsToContenu, randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Trouver la bonne unité'
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = true
export const amcType = 'qcmMono'

/**
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021

 */
export const uuid = 'ac56a'

export const refs = {
  'fr-fr': ['can6M02'],
  'fr-ch': []
}
export default class LaBonneUnite extends Exercice {
  constructor () {
    super()

    this.nbQuestions = 1
  }

  nouvelleVersion () {
    const hauteurs = [
      ['chaise', 75, 115, ' cm'],
      ['grue', 120, 250, ' dm'],
      ['tour', 50, 180, ' m'],
      ['girafe', 40, 50, ' dm'],
      ['coline', 75, 150, ' m']
    ]

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const unites = [' cm', ' dm', ' m']
      const a = randint(0, 4)
      const b = randint(hauteurs[a][1] as number, hauteurs[a][2] as number)
      enleveElement(unites, hauteurs[a][3])
      let texte = `Choisir parmi les propositions suivantes la hauteur d'une ${hauteurs[a][0]}.<br>`
      this.canEnonce = texte
      this.autoCorrection[i] = {
        enonce: texte,
        propositions: [
          {
            texte: `$${b}$${hauteurs[a][3]}`,
            statut: true
          },
          {
            texte: `$${b}$${unites[0]}`,
            statut: false
          },
          {
            texte: `$${b}$${unites[1]}`,
            statut: false
          }
        ]
      }
      const monQcm = propositionsQcm(this, i)
      if (!context.isAmc) {
        texte += monQcm.texte
      }
      const texteCorr = `La hauteur d'une ${hauteurs[a][0]} est ${b} ${hauteurs[a][3]}.`
      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr

        this.listeCanEnonces.push(this.canEnonce)
        this.listeCanReponsesACompleter.push(monQcm.texte)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
