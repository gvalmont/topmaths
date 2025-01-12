import Exercice from '../../Exercice'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { choice } from '../../../lib/outils/arrayOutils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

import Decimal from 'decimal.js'
export const titre = 'Trouver un nombre entre deux valeurs'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ffea6'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gilles Mora

*/
export default class nombreEntreDeuxValeurs extends Exercice {
  constructor () {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.formatChampTexte = KeyboardType.clavierDeBase
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    const valInf = new Decimal(2025).div(choice([100, 1000]))
    const valSup = choice([valInf.add(0.01), valInf.add(0.001)])
    this.reponse = {
      reponse: {
        value: `]${valInf};${valSup}[`,
        options: { estDansIntervalle: true }
      }
    }

    this.question = 'Complète par un nombre. <br>'
    if (this.interactif) {
      this.optionsChampTexte = { texteAvant: `$${texNombre(valInf, 4)} < $`, texteApres: `$<${texNombre(valSup, 4)}  $` }
    } else { this.question += `$${texNombre(valInf, 4)} < \\ldots < ${texNombre(valSup, 4)}$` }
    this.correction = `On complète avec un nombre strictement compris entre $${texNombre(valInf, 4)}$ et $${texNombre(valSup, 4)}$, comme 
     par exemple : $${miseEnEvidence(texNombre(valSup.add(valInf).div(2), 5))}$.`

    this.canEnonce = 'Complèter par un nombre.'
    this.canReponseACompleter = `$${texNombre(valInf, 4)} < \\ldots < ${texNombre(valSup, 4)}$`
  }
}
