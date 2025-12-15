import TriangleEquilateral from '../4e/4G22-0'

export const titre = 'Calculer des longueurs dans un triangle équilatéral'
export const dateDePublication = '12/12/2025'
export const interactifReady = true
export const interactifType = 'mathLive'

export const uuid = 'b18ea'

export const refs = {
  'fr-fr': ['2G11-10'],
  'fr-ch': [],
}
export default class TriangleEquilateral2e extends TriangleEquilateral {
  constructor() {
    super()
    this.niveau = 2
    this.besoinFormulaireTexte = [
      'Type de questions',
      "Nombres séparés par des tirets\n1 : Calcul de la hauteur\n2 : Calcul de l'aire\n3 : Calcul du côté",
    ]
  }
}
