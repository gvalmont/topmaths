import { Pipe, PipeTransform } from '@angular/core'

interface Ligne {
  niveau?: string;
  numero?: number;
  reference?: string;
  titre?: string
}

@Pipe({ name: 'sequencesFilter' })
export class SequencesFilter implements PipeTransform {
  /**
   * Pipe filters the list of elements based on the search text provided
   *
   * @param items list of elements to search in
   * @param searchText search string
   * @returns list of elements filtered by search text or []
   */
  transform (items: Ligne[], searchText: string): any[] {
    if (!items) {
      return []
    }
    if (!searchText) {
      return items
    }
    const searchArray = this.normaliser(searchText).split(' ')

    return items.filter(ligne => {
      for (const mot of searchArray) {
        if (!this.motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  motTrouve (mot: string, ligne: Ligne) {
    if (ligne.niveau !== undefined && this.normaliser(ligne.niveau).includes(mot)) return true
    if (ligne.numero !== undefined && this.normaliser(ligne.numero.toString()).includes(mot)) return true
    if (ligne.reference !== undefined && this.normaliser(ligne.reference).includes(mot)) return true
    if (ligne.titre !== undefined && this.normaliser(ligne.titre).includes(mot)) return true
    return false
  }

  normaliser (mot: string) {
    return mot.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase()
  }
}