import TablesDeMultiplications from '../6e/_Tables_de_multiplications'
export const titre = 'Tables de multiplication'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
export const dateDeModifImportante = '27/08/2024'

/**
 *
 * @author Jean-Claude Lhote
 */
export const uuid = '4e27f'

export const refs = {
  'fr-fr': ['c3C10-1'],
  'fr-ch': []
}
export default class TablesDeMultiplicationsCM extends TablesDeMultiplications {
  constructor () {
    super()
    this.sup2 = '1'
  }
}
