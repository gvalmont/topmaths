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

    return items.filter(ligne => {
      if (ligne.niveau !== undefined && ligne.niveau.toLocaleLowerCase().includes(searchText)) return true
      if (ligne.theme !== undefined && ligne.theme.toLocaleLowerCase().includes(searchText)) return true
      if (ligne.sousTheme !== undefined && ligne.sousTheme.toLocaleLowerCase().includes(searchText)) return true
      if (ligne.reference !== undefined && ligne.reference.toLocaleLowerCase().includes(searchText)) return true
      if (ligne.titre !== undefined && ligne.titre.toLocaleLowerCase().includes(searchText)) return true
      return false
    })
  }
}