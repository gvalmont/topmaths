import FactoriserParNombreOux from '../3e/3L11-4'
export const titre = 'Factoriser une expression littérale'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCOpen'
export const uuid = 'dd1c9'
export const refs = {
  'fr-fr': ['4L11'],
  'fr-ch': []
}
export default class Factoriser4e extends FactoriserParNombreOux {
  constructor () {
    super()
    this.sup = 4
    this.nbQuestions = 8
  }
}
