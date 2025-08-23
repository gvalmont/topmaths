import CalculsFractionsSimples from '../c3/c3C23'
export const interactifReady = true
export const interactifType = 'mathLive'

export const titre = 'Calculs simples avec des fractions'

export const uuid = '64422'

export const refs = {
  'fr-fr': ['BP2AutoH24', '6N3K'],
  'fr-2016': ['6C23', 'BP2AutoH24'],
  'fr-ch': []
}
export default class ExerciceAdditionnerFractions6e extends CalculsFractionsSimples {
  constructor () {
    super()
    this.sup = '1-2'
  }
}
