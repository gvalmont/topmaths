import QuestionsPrix from './6N5-1'

export const titre = 'Résoudre des problèmes de prix avec des objets mettant en jeu des divisions euclidiennes'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

// Gestion de la date de publication initiale
export const dateDePublication = '11/05/2025'

export const uuid = '25d7a'
export const refs = {
  'fr-fr': ['6N2K'],
  'fr-2016': ['6C12-0b'],
  'fr-ch': []
}
export default class QuestionsPrix2 extends QuestionsPrix {
  constructor () {
    super()
    this.sup = '7'
  }
}
