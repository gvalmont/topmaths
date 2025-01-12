import DenombrerCubes from '../../6e/6G43'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcType = 'AMCNum'
export const amcReady = true
export const titre = 'Compter les cubes'

/**
 * @author Jean-Claude Lhote
 * Créé pendant l'été 2021

 */
export const uuid = '76b93'

export const refs = {
  'fr-fr': ['can6G02'],
  'fr-ch': []
}
export default class CompterLesCubesManquant extends DenombrerCubes {
  constructor () {
    super()
    this.nbQuestions = 1
    this.sup2 = 1
    this.sup = 1
  }
}
