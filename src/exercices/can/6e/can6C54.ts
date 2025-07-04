import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../Exercice'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { randint } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { obtenirListeFractionsIrreductibles } from '../../../modules/fractions'
export const titre = 'Compléter une égalité de fractions'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '03/07/2025'
/**
 * @author Gilles Mora
*/
export const uuid = '39c09'

export const refs = {
  'fr-fr': ['can6C54'],
  'fr-ch': []
}
export default class FractionsEgalesACompleter extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.formatInteractif = 'fillInTheBlank'
  }

  nouvelleVersion () {
    switch (choice([1, 2])) {
      case 1:
        {
          const k = randint(2, 10)

          const listeFractions = obtenirListeFractionsIrreductibles()
          const frac = choice(listeFractions)
          this.reponse = frac.num * k
          this.consigne = 'Complèter. '
          this.correction = `Le dénominateur de la fraction a été multiplié par $${k}$, donc le numérateur doit aussi être multiplié par $${k}$.<br>
        
        $\\begin{aligned}
        ${frac.texFraction} &= \\dfrac{${frac.num}\\times ${k}}{${frac.den}\\times ${k}}\\\\
        &=\\dfrac{${miseEnEvidence(this.reponse)}}{${frac.den * k}}
        \\end{aligned}$`
          this.question = `${frac.texFraction} =\\dfrac{%{champ1}}{${frac.den * k}}`
          this.canEnonce = 'Complèter.'
          this.canReponseACompleter = `$${frac.texFraction} =\\dfrac{\\ldots}{${frac.den * k}}$ `
        }
        break
      case 2:
        {
          const k = randint(2, 10)

          const listeFractions = obtenirListeFractionsIrreductibles()
          const frac = choice(listeFractions)

          this.reponse = frac.den * k
          this.consigne = 'Compléter.'
          this.question = `${frac.texFraction} = \\dfrac{${frac.num * k}}{%{champ1}}`

          this.correction = `Le numérateur de la fraction a été multiplié par $${k}$, donc le dénominateur doit aussi être multiplié par $${k}$.<br>
$\\begin{aligned}
${frac.texFraction} &= \\dfrac{${frac.num}\\times ${k}}{${frac.den}\\times ${k}} \\\\
&= \\dfrac{${frac.num * k}}{${miseEnEvidence(this.reponse)}}
\\end{aligned}$
`
          this.canEnonce = this.consigne
          this.canReponseACompleter = `$${frac.texFraction} = \\dfrac{${frac.num * k}}{\\ldots}$`
        }
        break
    }
  }
}
