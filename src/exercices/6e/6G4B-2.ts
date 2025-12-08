import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
} from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Connaître la mesure de quelques angles particuliers'
export const amcReady = false
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '04/12/2025'

/**
 * @author Éric Elter
 */
export const uuid = 'cded3'

export const refs = {
  'fr-fr': ['6G4B-2', '3AutoG04-1'],
  'fr-ch': [],
}
export default class MesureAnglesParticuliers extends Exercice {
  constructor() {
    super()
    this.consigne = 'Compléter.'
    this.sup = '7'
    this.spacing = 1
    this.comment =
      "Par le peu d'angles disponibles, cet exerice ne possède que 6 questions au maximum."

    this.besoinFormulaireTexte = [
      "Type d'angles",
      [
        'Nombres séparés par des tirets  :',
        '1 : Nul',
        '2 : Aigu',
        '3 : Droit',
        '4 : Obtus',
        '5 : Plat',
        '6 : Plein',
        '7 : Mélange',
      ].join('\n'),
    ]
  }

  nouvelleVersion() {
    const listeTypeDeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 6,
      defaut: 7,
      melange: 7,
      nbQuestions: 6,
    })

    const typeQuestionsDisponibles = combinaisonListes(
      listeTypeDeQuestions,
      this.nbQuestions,
    )

    for (
      let i = 0, typeAngle, texteExtra, reponse, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      if (this.questionJamaisPosee(i, typeQuestionsDisponibles[i])) {
        texteExtra = ''
        switch (typeQuestionsDisponibles[i]) {
          case 1:
            typeAngle = 'nul'
            reponse = 0
            break
          case 2:
            typeAngle = 'aigu'
            reponse = 90
            texteExtra = 'moins de '
            break
          case 3:
            typeAngle = 'droit'
            reponse = 90
            break
          case 4:
            typeAngle = 'obtus'
            reponse = 90
            texteExtra = 'plus de '
            break
          case 5:
            typeAngle = 'plat'
            reponse = 180
            break
          default:
            typeAngle = 'plein'
            reponse = 360
            break
        }

        texte = `Un angle ${typeAngle} mesure ${texteExtra}`

        texteCorr = texte + `$${miseEnEvidence(reponse)}^\\circ$.`

        texte += this.interactif
          ? ajouteChampTexteMathLive(this, i, KeyboardType.clavierNumbers, {
              texteApres: '$^\\circ$.',
            })
          : '\\ldots\\ldots\\ldots $^\\circ$.'

        handleAnswers(this, i, {
          reponse: {
            value: reponse,
            options: { nombreDecimalSeulement: true },
          },
        })

        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
