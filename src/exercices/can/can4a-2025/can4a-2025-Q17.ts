import { miseEnEvidence } from '../../../lib/outils/embellissements'
import ExerciceCan from '../../ExerciceCan'
import { randint } from '../../../modules/outils'
import { context } from '../../../modules/context'
import { scratchblock } from '../../../modules/scratchblock'

export const titre = 'Boucle scratch'
export const interactifReady = true
export const interactifType = 'mathLive'
export const uuid = '34224'
export const refs = {
  'fr-fr': [],
  'fr-ch': []
}

/**
 * @author Jean-Claude Lhote

*/
export default class Can2025N4Q17 extends ExerciceCan {
  enonce (a?: number, b?: number) {
    if (a == null || b == null) {
      a = randint(2, 5)
      b = randint(1, 5) * 5
    }
    let texteScratch = `\\begin{scratch}[${context.isHtml ? 'print,' : ''}fill,blocks,scale=0.8]\n`
    texteScratch += '\\blockinit{quand \\greenflag est cliqué}\n'
    texteScratch += `\\blockrepeat{répéter \\ovalnum{${String(a)}} fois}{`
    texteScratch += `\\blockmove{avancer de \\ovalnum{${String(b)}} pas}\n`
    texteScratch += '\\blocklook{attendre \\ovalnum{1} secondes}\n'
    texteScratch += '}'
    texteScratch += '\\end{scratch}\n'
    const texte = scratchblock(texteScratch)

    this.question = 'À l\'issue de l\'exécution de ce programme, de combien de pas le lutin a-t-il avancé ?<br>'
    this.question += texte || 'Problème de rendu'
    this.correction = `Il y a $${a}$ répétitions de la boucle, et à chaque répétition le lutin avance de $${b}$ pas, donc il avance de $${a}$ fois de $${b}$ pas, soit $${miseEnEvidence(a * b)}$ pas.`
    this.canEnonce = this.question
    this.optionsChampTexte = { texteAvant: '<br>Le lutin a avancé de ', texteApres: ' pas.' }
    this.canReponseACompleter = '$\\ldots$ pas'
    this.reponse = String(a * b)
    this.optionsDeComparaison = { nombreDecimalSeulement: true }
  }

  nouvelleVersion () {
    this.canOfficielle ? this.enonce(4, 20) : this.enonce()
  }
}
