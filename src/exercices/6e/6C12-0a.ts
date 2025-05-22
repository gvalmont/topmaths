import QuestionsPrix from './6C12'
export const titre = 'Résoudre des problèmes de prix avec des objets mettant en jeu des multiplications'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

// Gestion de la date de publication initiale
export const dateDePublication = '11/05/2025'

export const uuid = '04314'
export const refs = {
  'fr-fr': ['6C12-0a'],
  'fr-ch': []
}
export default class QuestionsPrix1 extends QuestionsPrix {
  constructor () {
    super()
    this.sup = '1-2-5-6'
  }
}
