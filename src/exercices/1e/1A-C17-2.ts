import CalculCompose from '../can/2e/can2L20'
export const titre = 'Calculer $f(x+a)$ avec $f$ affine'
export const dateDePublication = '24/07/2025'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Clone de can2L20 pour les auto 1er
 * @author Gilles Mora
 */

export const uuid = 'b49c5'

export const refs = {
  'fr-fr': ['1A-C17-2'],
  'fr-ch': []
}
export default class Auto1AC17b extends CalculCompose {
  constructor () {
    super()
    this.versionQcm = true
  }
}
