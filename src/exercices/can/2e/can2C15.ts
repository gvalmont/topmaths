import { choice } from '../../../lib/outils/arrayOutils'
import { texFractionFromString, obtenirListeFractionsIrreductibles } from '../../../lib/outils/deprecatedFractions'
import FractionEtendue from '../../../modules/FractionEtendue'
import { randint } from '../../../modules/outils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import Exercice from '../../Exercice'
export const titre = 'Calculer un nombre connaissant son inverse'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '10/11/2022'
/**
 * @author Gilles Mora

*/

export const uuid = 'd9488'

export const refs = {
  'fr-fr': ['can2C15'],
  'fr-ch': []
}
export default class NombreInverse extends Exercice {
  constructor () {
    super()

    this.typeExercice = 'simple'
    this.nbQuestions = 1

    this.formatInteractif = 'fractionEgale'
  }

  nouvelleVersion () {
    const maFraction = choice(obtenirListeFractionsIrreductibles())
    const a = randint(1, 4)
    const b = maFraction[0]
    const c = maFraction[1]
    const d = new FractionEtendue(a * c + b, c)
    const e = new FractionEtendue(a * c - b, c)
    const listeNom = ['R', 'x', 'y', 'T', 'z', 'U', 'A', 'B', 'C']
    const Nom = choice(listeNom)
    if (choice([true, false])) {
      this.reponse = new FractionEtendue(a * c + b, c).inverse()
      this.question = `Calculer $${Nom}$  sachant que : <br>
     $\\dfrac{1}{${Nom}}=${a}+${texFractionFromString(b, c)}$`
      this.correction = `$\\dfrac{1}{${Nom}}=${a}+${texFractionFromString(b, c)} = \\dfrac{${a} \\times ${c}}{${c}} + \\dfrac{${b}}{${c}} = \\dfrac{${a * c}}{${c}} + \\dfrac{${b}}{${c}}  =${d.texFraction}$<br><br>
    Ainsi $${Nom}=${miseEnEvidence(`${d.inverse().texFraction}`)}$.`
      this.canEnonce = `$\\dfrac{1}{${Nom}}=${a}+${texFractionFromString(b, c)}$`// 'Compléter'
      this.canReponseACompleter = `$${Nom}=\\ldots$`
    } else {
      this.reponse = new FractionEtendue(a * c - b, c).inverse()
      this.question = `Calculer $${Nom}$  sachant que : <br>
         $\\dfrac{1}{${Nom}}=${a}-${texFractionFromString(b, c)}$`
      this.correction = `$\\dfrac{1}{${Nom}}=${a}-${texFractionFromString(b, c)} = \\dfrac{${a} \\times ${c}}{${c}} - \\dfrac{${b}}{${c}} = \\dfrac{${a * c}}{${c}} - \\dfrac{${b}}{${c}}  =${e.texFraction}$<br><br>
        Ainsi $${Nom}=${miseEnEvidence(`${e.inverse().texFraction}`)}$.`
      this.canEnonce = `$\\dfrac{1}{${Nom}}=${a}-${texFractionFromString(b, c)}$`// 'Compléter'
      this.canReponseACompleter = `$${Nom}=\\ldots$`
    }
  }
}
