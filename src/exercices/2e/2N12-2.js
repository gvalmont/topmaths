import PuissancesEncadrement from '../4e/4C30-1'
export const titre = 'Encadrer des nombres relatifs avec des puissances de 10'
export const dateDeModifImportante = '05/09/2023'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '8f56e'
export const refs = {
  'fr-fr': ['2N12-2'],
  'fr-ch': ['10NO2-8']
}
export default class PuissancesEncadrement2nde extends PuissancesEncadrement {
  constructor () {
    super()
    this.sup = 4
    this.classe = 2
    this.besoinFormulaireTexte = [
      'Niveau de difficulté',
      'Nombres séparés par des tirets\n1 : Nombre entier naturel\n2 : Nombre décimal positif supérieur à 1 \n3 : Nombre décimal positif inférieur à 1\n4 : Nombre relatif \n5 : Mélange'
    ]
  }
}
