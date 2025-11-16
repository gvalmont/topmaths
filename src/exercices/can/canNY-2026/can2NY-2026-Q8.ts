import ExerciceSimple from '../../ExerciceSimple'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'

import { randint } from '../../../modules/outils'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
export const titre = 'Compléter une égalité'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = 'ru8u5'
export const refs = {
  'fr-fr': [],
  'fr-ch': ['NR'],
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Eric Elter - Gilles Mora

*/
export default class EgaliteCompleter2026 extends ExerciceSimple {
  constructor() {
    super()
    this.typeExercice = 'simple' // Cette ligne est très importante pour faire un exercice simple !
    this.nbQuestions = 1
    this.nbQuestionsModifiable = false
    this.formatInteractif = 'fillInTheBlank'
    this.formatChampTexte = KeyboardType.clavierFullOperations
  }

  nouvelleVersion() {
    const annee =2026
    switch (this.canOfficielle ? 1 : randint(1,3)) {
      case 1:
        this.reponse = `\\sqrt{${annee}}`
        this.consigne = `Compléter :`
        this.question = `\\sqrt{${texNombre(annee, 0)}}\\times ~%{champ1}=${annee} `
        this.correction = `On utilise la propriété $\\sqrt{a}\\times \\sqrt{a} =a$ valable pour $a$  positif.<br>
        Ainsi, $\\sqrt{${texNombre(annee, 0)}}\\times${miseEnEvidence(this.reponse)}=${annee}$`
        handleAnswers(this, 0, { champ1: { value: this.reponse } })
        this.canReponseACompleter = `$\\sqrt{${texNombre(annee, 0)}}\\times \\ldots =${annee}$`
        break
      case 2:
       this.reponse = `2\\times\\sqrt{${annee}}`
        this.consigne = `Compléter :`
        this.question = `\\sqrt{${texNombre(annee, 0)}}+\\sqrt{${texNombre(annee, 0)}}= ~%{champ1} `
        this.correction = `
        $\\sqrt{${texNombre(annee, 0)}}+\\sqrt{${texNombre(annee, 0)}}=${miseEnEvidence(this.reponse)}$`
        handleAnswers(this, 0, { champ1: { value: this.reponse } })
        this.canReponseACompleter = `$\\sqrt{${texNombre(annee, 0)}}+\\sqrt{${texNombre(annee, 0)}}= \\ldots$`
        break
      case 3:
         this.reponse = `${annee}`
        this.consigne = `Compléter :`
        this.question = `\\sqrt{${texNombre(annee, 0)}}\\times \\sqrt{${texNombre(annee, 0)}}=~%{champ1} `
        this.correction = `On utilise la propriété $\\sqrt{a}\\times \\sqrt{a} =a$ valable pour $a$  positif.<br>
        $\\sqrt{${texNombre(annee, 0)}}\\times \\sqrt{${texNombre(annee, 0)}}=${miseEnEvidence(this.reponse)}$`
        handleAnswers(this, 0, { champ1: { value: this.reponse } })
        this.canReponseACompleter = `$\\sqrt{${texNombre(annee, 0)}}\\times \\sqrt{${texNombre(annee, 0)}} =\\ldots$`
        break
    }
    this.canEnonce = this.consigne
  }
}
