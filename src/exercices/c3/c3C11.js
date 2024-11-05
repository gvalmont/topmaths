import DivisionsEuclidiennes from '../6e/6C11.js'
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
export const ref = 'c3C11'
export const refs = {
  'fr-fr': ['c3C11'],
  'fr-ch': []
}
export default function DivisionCycle3 () {
  DivisionsEuclidiennes.call(this)
  this.sup = 1
}
