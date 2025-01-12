import ArrondirUneValeur6e from '../6e/6N31-3'
export const titre = 'Encadrer puis arrondir une valeur comprenant un cosinus'
export const amcReady = true
export const amcType = 'qcmMult'
export const interactifReady = true
export const interactifType = 'qcm'
export const dateDePublication = '09/05/2021'
export const uuid = 'b236d'
export const refs = {
  'fr-fr': ['4G40-1'],
  'fr-ch': []
}
export default class ArrondirUneValeur4eCos extends ArrondirUneValeur6e {
  constructor () {
    super()
    this.version = 4
    this.sup2 = true
    this.spacing = 3
    this.besoinFormulaireNumerique = false
  }
}
