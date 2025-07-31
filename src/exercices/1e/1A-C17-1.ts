import DeveloppementDouble from '../can/2e/can2L13'
export const titre = 'Développer avec la double distributivité'
export const dateDePublication = '23/07/2025'
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifReady = true
export const interactifType = 'mathLive'

/**
 * Clone de can2L13 pour les auto 1er
 * @author Gilles Mora
 */

export const uuid = 'a3cc6'

export const refs = {
  'fr-fr': ['1A-C17-1'],
  'fr-ch': []
}
export default class Auto1AC17a extends DeveloppementDouble {
  constructor () {
    super()
    this.versionQcm = true
  }
}
