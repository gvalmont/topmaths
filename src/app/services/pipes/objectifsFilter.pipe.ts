import { Pipe, PipeTransform } from '@angular/core'

interface Ligne {
  niveau?: string;
  theme?: string;
  sousTheme?: string;
  reference?: string;
  titre?: string
}

@Pipe({ name: 'objectifsFilter' })
export class ObjectifsFilter implements PipeTransform {
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
    searchText = searchText.toLocaleLowerCase()
    const searchArray = searchText.toLocaleLowerCase().split(' ')

    return items.filter(ligne => {
      for (const mot of searchArray) {
        if (!this.motTrouve(mot, ligne)) return false
      }
      return true
    })
  }

  motTrouve (mot: string, ligne: Ligne) {
    if (ligne.niveau !== undefined && ligne.niveau.toLocaleLowerCase().includes(mot)) return true
    if (ligne.theme !== undefined && ligne.theme.toLocaleLowerCase().includes(mot)) return true
    if (ligne.sousTheme !== undefined && ligne.sousTheme.toLocaleLowerCase().includes(mot)) return true
    if (ligne.reference !== undefined && ligne.reference.toLocaleLowerCase().includes(mot)) return true
    if (ligne.titre !== undefined && ligne.titre.toLocaleLowerCase().includes(mot)) return true
    return false
  }
}