import ReperagePointDuPlan from './5R12-2.js'
export const titre = 'Déterminer les coordonnées (positives) d\'un point'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'
export const dateDeModifImportante = '24/11/2024'
/**
 * Lire les coordonnées d'un point du quart de plan positif avec une précision allant de l'unité à 0,25.
 * @author Jean-Claude Lhote - Eric Elter (pour l'interactivité)
 */
export const uuid = 'cf83c'
export const ref = '5R12'
export const refs = {
  'fr-fr': ['5R12'],
  'fr-ch': ['9FA1-5']
}
export default function ReperagePointDuQuartDePlan () {
  ReperagePointDuPlan.call(this)
  this.quartDePlan = true
}
