import { deuxColonnes } from '../../../lib/format/miseEnPage'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { randint } from '../../../modules/outils'
import { nombreElementsDifferents } from '../../ExerciceQcm'
import ExerciceQcmA from '../../ExerciceQcmA'
export const uuid = 'c82d0'
export const refs = {
  'fr-fr': ['3L1QCM-08'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Équation produit nul  (septembre 2022 Métropole)'
export const dateDePublication = '07/11/2024'

/**
 *
 * @author Jean-Claude LHOTE
 * jean-claude.lhote@ac-nancy-metz.fr
 */
export default class MetropoleSep22Ex1Q4 extends ExerciceQcmA {
  private appliquerLesValeurs (a: number, b: number, c: number): void {
    const s1 = `-\\dfrac{${String(b)}}{${String(a)}}`
    this.reponses = [
        `$${s1}$ et $${String(c)}$`,
        `$${String(-b)}$ et $${String(-c)}$`,
        `$${String(a)}$ et $${String(-c)}$`
    ]
    this.enonce = `Les solutions de l'équation  $(${String(a)}x+${String(b)})(-x+${String(c)})$ ?`
    this.correction = 'Un produit est nul quand l\'un de ses facteurs est nul.<br>'
    const contenuColonne1 = `Donc, soit $~\\begin{alignedat}{2}
    ${String(a)}&x+${String(b)}&=0\\\\
    ${String(a)}&x&=-${String(b)}\\\\
    &x&=-\\dfrac{${String(b)}}{${String(a)}}\\\\
    \\end{alignedat}$
    `
    const contenuColonne2 = `, soit $~\\begin{alignedat}{2}
    -&x+${String(c)}&=0\\\\
    -&x&=-${String(c)}\\\\
    &x&=${String(c)}\\\\
    \\end{alignedat}$
    `

    this.correction += deuxColonnes(contenuColonne1, contenuColonne2)
    this.correction += `Donc, l'équation$(${String(a)}x+${String(b)})(-x+${String(c)})=0$ a pour solutions $${miseEnEvidence(`x=-\\dfrac{${String(b)}}{${String(a)}} \\text{ et }x=${String(c)}`)}$.`
  }

  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(2, 1, 3)
  }

  versionAleatoire: () => void = () => {
    const n = 3
    do {
      const a = choice([2, 4, 5])
      const c = randint(2, 9)
      const b = choice([1, 3, 7])
      this.appliquerLesValeurs(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
