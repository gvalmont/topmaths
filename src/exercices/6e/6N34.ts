import ExerciceConversions from './_Exercice_conversions'
export const titre = 'Effectuer des conversions avec tous les préfixes de milli à tera'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'

/**
 * @author Rémi Angot

 * Relecture : Novembre 2021 par EE
 */

export const uuid = 'c57cf'

export const refs = {
  'fr-fr': ['6N34'],
  'fr-ch': ['10GM3-9']
}
export default class Reglages6N34 extends ExerciceConversions {
  constructor () {
    super()
    this.sup = 5
  }
}
