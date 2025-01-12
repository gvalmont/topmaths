import { paveLPH3d } from '../../../modules/3d'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
import { mathalea2d } from '../../../modules/2dGeneralites'
export const titre = 'Volume de pavé droit par dénombrement de cubes unités'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDePublication = '04/07/2022'

/**
 * @author Jean-Claude Lhote
 *

 */
export const uuid = 'e332d'

export const refs = {
  'fr-fr': ['can6M11'],
  'fr-ch': []
}
export default class VolumePaveCubes extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
    this.sup = 1
  }

  nouvelleVersion () {
    const l = randint(2, 5)
    const L = randint(2, 4)
    const h = randint(2, 6, [l, L])
    const pav = paveLPH3d(0, 0, 0, 0.8, L, l, h)
    this.question = `Ce pavé droit est composé de cubes identiques. En prenant comme unité l'un de ces cubes, quel est le volume de ce pavé droit ?<br>
  ${mathalea2d({ xmin: 0, ymin: 0, xmax: 7, ymax: (h + l * 0.5) * 0.8 }, pav.c2d)}`
    this.reponse = L * l * h
    this.correction = `Le volume de ce pavé droit est : $${L}\\times ${l}\\times ${h}=${this.reponse}$`
    this.canEnonce = this.question
    this.canReponseACompleter = '$\\dots$ unités'
  }
}
