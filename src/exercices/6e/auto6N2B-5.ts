import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { texFractionFromString } from '../../lib/outils/deprecatedFractions'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
} from '../../modules/outils'
import Exercice from '../Exercice'

export const interactifReady = true
export const interactifType = 'mathlive'
export const titre =
  'Restituer, de manière automatique, des équivalences sur les fractions décimales'
export const dateDePublication = '08/06/2025'

/**
 * Restituer, de manière automatique, des équivalences sur les fractions décimales
 * @author Éric Elter
 */
export const uuid = 'bcef9'
export const refs = {
  'fr-fr': ['auto6N2B-5'],
  'fr-2016': ['6C30-13'],
  'fr-ch': [],
}

export default class TrouverFractionDecimaleEgale extends Exercice {
  constructor() {
    super()
    this.comment = '12 questions sont possibles au maximum.'
    this.consigne = 'Compléter.'
    this.nbQuestions = 3
    this.besoinFormulaireTexte = [
      'Choix de la fraction',
      'Nombres sépares par des tirets :\n1 : 1/10\n2 : 1/100\n3 : 1/1 000\n4 : Mélange',
    ]

    this.besoinFormulaire2Numerique = [
      "Sens de l'égalité",
      3,
      `   1 : D'une fraction à un nombre décimal
    2 : D'un nombre décimal à une fraction
    3 : Mélange`,
    ]

    this.besoinFormulaire3Numerique = [
      'Choix du nombre cherché',
      3,
      `   1 : Nombre décimal
    2 : Dénominateur
    3 : Mélange`,
    ]

    this.sup = 4
    this.sup2 = 3
    this.sup3 = 3
  }

  nouvelleVersion() {
    const choixDenominateur = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 3,
      melange: 4,
      defaut: 4,
      nbQuestions: 50,
    })
    const sensEgalite = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      max: 2,
      melange: 3,
      defaut: 3,
      nbQuestions: 50,
    })
    const nombreCherche = gestionnaireFormulaireTexte({
      saisie: this.sup3,
      max: 2,
      melange: 3,
      defaut: 3,
      nbQuestions: 50,
    })

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50; ) {
      if (
        this.questionJamaisPosee(
          i,
          nombreCherche[cpt],
          sensEgalite[cpt],
          choixDenominateur[cpt],
        )
      ) {
        // Si la question n'a jamais été posée, on en crée une autre
        let texte = ''
        let texteCorr = ''
        const numerateur = 10 ** parseInt(choixDenominateur[cpt].toString())
        const valeurDecimale =
          10 ** -parseInt(choixDenominateur[cpt].toString())

        if (sensEgalite[cpt] === 1) {
          if (nombreCherche[cpt] === 1) {
            texte = remplisLesBlancs(
              this,
              i,
              `\\dfrac{1}{${texNombre(numerateur)}} =~%{champ1}`,
              KeyboardType.clavierNumbers,
              '\\ldots',
            )
            handleAnswers(
              this,
              i,
              { champ1: { value: valeurDecimale } },
              { formatInteractif: 'fillInTheBlank' },
            )
            texteCorr = `$${texFractionFromString(1, texNombre(numerateur))}=${miseEnEvidence(texNombre(valeurDecimale))}$`
          } else {
            texte = remplisLesBlancs(
              this,
              i,
              `\\dfrac{1}{%{champ1}} = ${texNombre(valeurDecimale)}`,
              KeyboardType.clavierNumbers,
              '\\ldots',
            )
            handleAnswers(
              this,
              i,
              { champ1: { value: numerateur } },
              { formatInteractif: 'fillInTheBlank' },
            )
            texteCorr = `$${texFractionFromString(1, miseEnEvidence(texNombre(numerateur)))}=${texNombre(valeurDecimale)}$`
          }
        } else {
          if (nombreCherche[cpt] === 1) {
            texte = remplisLesBlancs(
              this,
              i,
              `%{champ1}~ = \\dfrac{1}{${texNombre(numerateur)}}`,
              KeyboardType.clavierNumbers,
              '\\ldots',
            )
            handleAnswers(
              this,
              i,
              { champ1: { value: valeurDecimale } },
              { formatInteractif: 'fillInTheBlank' },
            )
            texteCorr = `$${miseEnEvidence(texNombre(valeurDecimale))}=${texFractionFromString(1, texNombre(numerateur))}$`
          } else {
            texte = remplisLesBlancs(
              this,
              i,
              `${texNombre(valeurDecimale)}=\\dfrac{1}{%{champ1}}`,
              KeyboardType.clavierNumbers,
              '\\ldots',
            )
            handleAnswers(
              this,
              i,
              { champ1: { value: numerateur } },
              { formatInteractif: 'fillInTheBlank' },
            )
            texteCorr = `$${texNombre(valeurDecimale)}=${texFractionFromString(1, miseEnEvidence(texNombre(numerateur)))}$`
          }
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
