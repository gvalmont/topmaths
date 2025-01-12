import VocabulaireDuCercle from './6G10-4'
/**
 * Clone de 6G10-4 pour rien (juste pour définir l'uuid 35282 qui a été diffusée et utilisée par Myriade)
 */
// export { titre } from './6G10-4'
export const titre = 'Connaître le vocabulaire du cercle'

export const uuid = '35282'
// Ne pas référencer cet exo, il ferait doublon avec 6G10-4
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
export default class LeCercle extends VocabulaireDuCercle {
  constructor () {
    super()
    this.nbQuestions = 1
  }
}
