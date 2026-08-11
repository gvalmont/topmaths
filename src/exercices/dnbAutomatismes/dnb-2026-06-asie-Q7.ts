import { texPrix } from '../../lib/format/style'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { randint } from '../../modules/outils'
import ExerciceCan from '../ExerciceCan'

export const uuid = 'cf889'
export const refs = {
  'fr-fr': [],
  'fr-ch': [],
}
export const interactifReady = true
export const interactifType = 'multi-mathfield'
export const titre = "Lire les coordonnées d'un point dans un repère"
export const dateDePublication = '06/06/2026'

/**
 * DNB Asie juin 2026 - Question 7
 * @author Jean-Claude Lhote
 */
export default class AutoQ7Asiebrevet2026 extends ExerciceCan {
  constructor() {
    super()
  }

  enonce(
    prixInitial?: number,
    remiseEnPourcentage?: number,
    baisseOuHausse = 'baisse',
  ) {
    if (prixInitial == null || remiseEnPourcentage == null) {
      prixInitial = randint(5, 9) * 10
      remiseEnPourcentage = randint(1, 3) * 10
      baisseOuHausse = randint(0, 1) === 0 ? 'baisse' : 'hausse'
    }

    this.question = `Un article coûte $${texPrix(prixInitial)}$ €. Calculer son nouveau prix après une ${baisseOuHausse} de $${remiseEnPourcentage}\\%$.`
    this.optionsChampTexte = { texteApres: '€', texteAvant: ' ' }
    this.reponse =
      baisseOuHausse === 'baisse'
        ? texPrix(prixInitial * (1 - remiseEnPourcentage / 100))
        : texPrix(prixInitial * (1 + remiseEnPourcentage / 100))

    this.correction = `Le nouveau prix est calculé en appliquant la ${baisseOuHausse} de $${remiseEnPourcentage}\\%$ au prix initial de $${texPrix(prixInitial)}$ €.<br>
Le calcul est le suivant :<br> 
$\\text{Nouveau prix} = ${prixInitial} ${baisseOuHausse === 'baisse' ? '-' : '+'} \\dfrac{${remiseEnPourcentage}\\times ${prixInitial}}{100} = ${prixInitial} ${baisseOuHausse === 'baisse' ? '-' : '+'} ${texPrix((prixInitial * remiseEnPourcentage) / 100)} =${miseEnEvidence(this.reponse)}$`
  }

  nouvelleVersion() {
    if (this.canOfficielle) {
      this.enonce(60, 10, 'baisse')
    } else {
      this.enonce()
    }
  }
}
