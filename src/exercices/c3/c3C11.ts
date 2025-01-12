import DivisionsEuclidiennes from '../6e/6C11'
export const titre = 'Divisions euclidiennes'
export const amcReady = true
export const amcType = 'AMCOpen'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDeModifImportante = '01/11/2014'
/**
 * @author Jean-Claude Lhote
 */
export const uuid = 'b259a'

export const refs = {
  'fr-fr': ['c3C11'],
  'fr-ch': []
}
export default class DivisionCycle3 extends DivisionsEuclidiennes {
  constructor () {
    super()
    this.sup = 1
  }
}
