import { deuxColonnes } from '../../../lib/format/miseEnPage'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import { randint } from '../../../modules/outils'
import { nombreElementsDifferents } from '../../ExerciceQcm'
import ExerciceQcmA from '../../ExerciceQcmA'
export const uuid = '67e1a'
export const refs = {
  'fr-fr': ['3L1QCM-02'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Équation produit nul (2013 Centres étrangers)'
export const dateDePublication = '30/10/2024'
/**
 *
 * @author Jean-Claude LHOTE
 * jean-claude.lhote@ac-nancy-metz.fr
 */
export default class EtrangersJuin13Exo1Q1 extends ExerciceQcmA {
  private appliquerLesValeurs (a: number, b: number, c: number): void {
    const s1 = -a
    const s2 = c / b
    this.reponses = [
      `$${String(s1)}$ et $${texNombre(s2, 2)}$`,
      `$${String(-s1)}$ et $${texNombre(-s2, 2)}$`,
      `$${String(s1)}$ et $${String(c - b)}$`
    ]
    this.enonce = `Les solutions de l'équation  $(x+${String(a)})(${String(b)}x-${String(c)})$ ?`
    this.correction = 'Un produit est nul quand l\'un de ses facteurs est nul.<br>'
    const contenuColonne1 = `Donc, soit $~\\begin{alignedat}{2}
    &x+${String(a)}&=0\\\\
    &x&=-${String(a)}\\\\
    &x&=${String(s1)}\\\\
    \\end{alignedat}$
    `
    const contenuColonne2 = `, soit $~\\begin{alignedat}{2}
    ${String(b)}&x-${String(c)}&=0\\\\
    ${String(b)}&x&=${String(c)}\\\\
    &x&=${texNombre(s2, 2)}\\\\
    \\end{alignedat}$
    `
    this.correction += deuxColonnes(contenuColonne1, contenuColonne2)

    this.correction += `Donc, l'équation $(x+${String(a)})(${String(b)}x-${String(c)})=0$ a pour solutions $${miseEnEvidence(`x=${String(s1)} \\text{ et }x=${texNombre(s2, 2)}`)}$.`
  }

  versionOriginale: () => void = () => {
    this.appliquerLesValeurs(7, 2, 7)
  }

  versionAleatoire: () => void = () => {
    const n = 3
    do {
      const a = randint(2, 9)
      const c = randint(5, 9)
      const b = choice([2, 4])
      this.appliquerLesValeurs(a, b, c)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  constructor () {
    super()
    this.versionAleatoire()
  }
}
