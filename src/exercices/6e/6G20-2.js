import VocabulaireDesTriangles from '../5e/5G20-1'
export const titre = 'Utiliser le vocabulaire des triangles'
export const interactifReady = false

/**
 * Vocabulaire des triangles
 * 6G20-2
 * @author Sébastien Lozano
 */
export const uuid = 'b5eaf'

export const refs = {
  'fr-fr': ['6G20-2'],
  'fr-ch': []
}
export default class VocabulaireDesTriangles6e extends VocabulaireDesTriangles {
  constructor () {
    super()
    this.classe = 6
  }
}
