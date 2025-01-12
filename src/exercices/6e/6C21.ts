import DivisionsEuclidiennesEgaliteFondamentale from './6C11b'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Effectuer divisions euclidiennes - Niveau 2'

/**
 * @author Rémi Angot
*/

export const uuid = 'bbcac'

export const refs = {
  'fr-fr': ['6C21'],
  'fr-ch': ['9NO3-4']
}
export default class DivisionsEuclidiennesNiv2 extends DivisionsEuclidiennesEgaliteFondamentale {
  constructor () {
    super()
    this.sup = 3
  }
}
