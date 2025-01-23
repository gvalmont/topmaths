import ExerciceComparerDeuxFractions from '../5e/5N14'
export const titre = 'Comparer deux fractions (dénominateurs multiples)'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'qcmMono'
export const uuid = 'd7e11'
export const refs = {
  'fr-fr': ['4C20'],
  'fr-ch': []
}
export default class ExerciceComparerDeuxFractions4e extends ExerciceComparerDeuxFractions {
  constructor () {
    super()
    this.sup = 11
    this.sup2 = true
  }
}
