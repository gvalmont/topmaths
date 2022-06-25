import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class OutilsService {

  constructor () { }

  /**
   * Vérifie qu'il n'y a que des lettres et des chiffres
   * @param str chaîne à tester
   * @returns true si c'est le cas, false sinon
   */
  estAlphanumerique (str: string) {
    return /^[A-Za-z0-9]*$/.test(str)
  }

}
