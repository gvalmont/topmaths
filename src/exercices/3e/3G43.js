import CalculDeVolumes from '../6e/6M30'
export const titre = 'Calculer des volumes'
export const amcReady = true
export const amcType = 'AMCHybride'
export const interactifReady = true
export const interactifType = ['qcm', 'mathLive']
export const dateDeModifImportante = '10/06/2024'
export const uuid = 'acb80'
export const refs = {
  'fr-fr': ['3G43', 'BP2G20'],
  'fr-ch': ['11GM2-4']
}
export default class CalculDeVolumes3e extends CalculDeVolumes {
  constructor () {
    super()
    this.sup = 1
    this.sup4 = 8
    this.classe = 3
    this.besoinFormulaire4Texte = ['Type de solides', 'Nombres séparés par des tirets\n1  : Cubes\n2 : Pavés droits\n3 : Cylindres\n4 : Prismes droits\n5 : Cônes\n6 : Pyramides\n7 : Boules\n8: Mélange']
  }
}
