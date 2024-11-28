import Exercice from '../Exercice'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, quotientier, randint } from '../../modules/outils.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { fractionCliquable } from '../../modules/2dinteractif'
import { rangeMinMax } from '../../lib/outils/nombres'
import { mathalea2d } from '../../modules/2dGeneralites'
import { context } from '../../modules/context'

export const titre = 'Écrire un nombre entier sous la forme d\'une fraction'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '27/11/2024'

/**
 * @author Guillaume Valmont
 */
export const uuid = '42ade'
export const refs = {
  'fr-fr': ['6N20-0'],
  'fr-ch': ['']
}
export default class EcrireEntierSousFormeDeFraction extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.consigne = 'Compléter.'
    this.spacing = 2
    this.spacingCorr = 2
    this.nbCols = 2
    this.nbColsCorr = 2
    this.sup = '2-3-4-5-6-7-8-9-10-11'
    this.sup2 = '1-2-3-4-5'
    this.besoinFormulaireTexte = ['Dénominateurs', 'Nombres séparés par des tirets\n(de 2 à 11 par défaut)']
    this.besoinFormulaire2Texte = ['Nombres entiers', 'Nombres séparés par des tirets\n(de 1 à 5 par défaut)']
    this.correctionDetailleeDisponible = true
  }

  nouvelleVersion () {
    const listeDenominateurs = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 2,
      max: 1000,
      defaut: 1000,
      melange: 0,
      shuffle: true,
      nbQuestions: this.nbQuestions
    }).map((element) => Number(element))
    const listeNombresEntiers = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 1000,
      defaut: 1000,
      melange: 0,
      shuffle: true,
      nbQuestions: this.nbQuestions
    }).map((element) => Number(element))
    let scale
    context.isHtml ? scale = 0.5 : scale = 0.4
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const denominateur = listeDenominateurs[cpt % this.nbQuestions] === 1000 ? randint(2, 11) : listeDenominateurs[cpt % this.nbQuestions]
      const entier = listeNombresEntiers[cpt % this.nbQuestions] === 1000 ? randint(1, 3) : listeNombresEntiers[cpt % this.nbQuestions]

      const texte = remplisLesBlancs(this, i, `${entier} = \\dfrac{%{champ1}}{${denominateur}}`)
      let texteCorr = ''
      if (this.correctionDetaillee) {
        texteCorr += `$1$ unité = $\\dfrac{${denominateur}}{${denominateur}}$.<br>
        $${entier}$ unités $= ${entier} \\times 1$ unité.<br>
        $${entier}$ unités $= ${entier} \\times \\dfrac{${denominateur}}{${denominateur}}$.<br>
`
      }
      texteCorr += `$${entier} = \\dfrac{${miseEnEvidence(String(entier * denominateur))}}{${denominateur}}$`
      if (this.correctionDetaillee) {
        // Liste pour alterner les couleurs
        const liste1 = []
        const liste2 = []
        for (let k = 0; k < entier; k++) {
          if (k % 2 === 0) liste1.push(...rangeMinMax(k * denominateur + 1, (k + 1) * denominateur))
          else liste2.push(...rangeMinMax(k * denominateur + 1, (k + 1) * denominateur))
        }
        const schemaCorr = fractionCliquable(0, 0, quotientier(entier * denominateur, denominateur) + 1, denominateur, {
          cliquable: false,
          liste1,
          liste2
        })
        texteCorr += mathalea2d({
          scale,
          xmin: -0.2,
          xmax: (quotientier(entier * denominateur, denominateur) + 1) * 5,
          ymin: -1,
          ymax: 2,
          style: 'display: inline'
        }, schemaCorr)
      }
      handleAnswers(this, i, {
        champ1: { value: String(entier * denominateur) }
      }, { formatInteractif: 'fillInTheBlank' })
      if (this.questionJamaisPosee(i, entier, denominateur)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
