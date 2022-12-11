import { Injectable } from '@angular/core'
import { environment } from 'src/environments/environment'

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

  estMathsMentales (url: string) {
    return url.slice(0, 25) === 'https://mathsmentales.net'
  }

  estMathALEA (url: string) {
    const urlMathALEA = environment.urlMathALEA
    return url.slice(0, urlMathALEA.length) === environment.urlMathALEA
  }

  estGeogebraClassic (url: string) {
    return url.slice(0, 33) === 'https://www.geogebra.org/classic/'
  }

  estGeogebraM (url: string) {
    return url.slice(0, 27) === 'https://www.geogebra.org/m/'
  }
}
