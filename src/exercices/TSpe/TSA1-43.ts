import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteCode } from '../../lib/outils/embellissements'
import { scriptPython } from '../../lib/outils/scriptPython'
import { texNombre } from '../../lib/outils/texNombre'
import { context } from '../../modules/context'
import { randint } from '../../modules/outils'
import ExerciceSimple from '../ExerciceSimple'

export const titre =
  'Compléter une boucle Python de recherche de seuil (QCM Bac)'
export const dateDePublication = '29/08/2026'
export const uuid = '0465d'
export const refs = {
  'fr-fr': ['TSA1-43'],
  'fr-ch': [],
}
export const interactifReady = true

function consolePython(code: string): string {
  const codeNumerote = code
    .split('\n')
    .map((ligne, index) => `${String(index + 1).padStart(2, ' ')} | ${ligne}`)
    .join('\n')
  if (!context.isHtml) return scriptPython(codeNumerote, 5)

  return `<div style="max-width:34rem;margin:1rem 0;border:1px solid #334155;border-radius:0.6rem;overflow:hidden;background:#0f172a;box-shadow:0 4px 12px rgba(15,23,42,0.2);">
  <div style="display:flex;align-items:center;gap:0.4rem;padding:0.55rem 0.75rem;background:#1e293b;border-bottom:1px solid #334155;">
    <span style="width:0.7rem;height:0.7rem;border-radius:50%;background:#fb7185;"></span>
    <span style="width:0.7rem;height:0.7rem;border-radius:50%;background:#fbbf24;"></span>
    <span style="width:0.7rem;height:0.7rem;border-radius:50%;background:#4ade80;"></span>
    <span style="margin-left:0.45rem;color:#cbd5e1;font:600 0.8rem system-ui,sans-serif;">Console Python</span>
  </div>
  <pre style="margin:0;padding:1rem 1.1rem;color:#e2e8f0;background:#0f172a;font:0.95rem/1.55 ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace;white-space:pre;overflow-x:auto;"><code>${codeNumerote}</code></pre>
</div>`
}

/**
 * Identifier la condition d'une boucle de recherche du premier dépassement.
 *
 * @author Stéphane Guyon
 */
export default class BouclePythonRechercheSeuil extends ExerciceSimple {
  private appliquerValeurs(
    lettre: string,
    nomFonction: string,
    u0: number,
    coefficient: number,
    termeConstant: number,
    seuil: number,
  ): void {
    const coefficientTex = texNombre(coefficient, 1)
    const coefficientPython = coefficient.toFixed(1)

    const programme = `def ${nomFonction}():
    n = 0
    ${lettre} = ${u0}
    while ...:
        n = n + 1
        ${lettre} = ${coefficientPython}*${lettre} + ${termeConstant}
    return n`

    this.question = `On considère la suite $(${lettre}_n)$ définie sur $\\mathbb N$ par $${lettre}_0=${u0}$ et, pour tout entier naturel $n$, par :<br>
$${lettre}_{n+1}=${coefficientTex}${lettre}_n+${termeConstant}$.<br><br>
La fonction Python ci-dessous doit renvoyer la plus petite valeur de l'entier $n$ telle que $${lettre}_n>${seuil}$.<br>
${consolePython(programme)}
À la ligne 4, on complète l'instruction ${texteCode('while')} par :<br>`

    const reponsesQcm = [
      `$${lettre}\\leqslant ${seuil}$`,
      `$${lettre}=${seuil}$`,
      `$${lettre}>${seuil}$`,
      `$n\\leqslant ${seuil}$`,
    ]
    this.reponse = this.versionQcm ? reponsesQcm[0] : `\\leqslant ${seuil}`
    this.distracteurs = reponsesQcm.slice(1)
    this.optionsChampTexte = this.versionQcm
      ? {}
      : { texteAvant: `$${lettre}$` }
    this.versionQcmOptions = {
      radio: true,
      vertical: false,
      dontKnow: this.sup4,
    }
    this.correction = `On veut que la boucle s'arrête dès que $${lettre}>${seuil}$. Cela signifie qu'elle doit tourner tant que $${lettre}\\leqslant ${seuil}$ : c'est donc cette condition qui doit être placée après ${texteCode('while')}.<br>
Lorsque $${lettre}>${seuil}$, la condition $${lettre}\\leqslant ${seuil}$ devient fausse, la boucle s'arrête et le programme renvoie le rang correspondant.<br><br>
Les autres propositions ne conviennent pas :<br>
$\\bullet$ $${lettre}=${seuil}$ ne ferait continuer la boucle que dans le seul cas d'une égalité ;<br>
$\\bullet$ $${lettre}>${seuil}$ ferait continuer la boucle précisément lorsque le seuil est déjà dépassé ;<br>
$\\bullet$ $n\\leqslant ${seuil}$ compare le rang au seuil, alors que la consigne porte sur la valeur du terme de la suite.<br><br>
La bonne réponse est donc $${miseEnEvidence(`${lettre}\\leqslant ${seuil}`)}$.`
  }

  nouvelleVersion(): void {
    if (this.sup) {
      this.appliquerValeurs('u', 'seuil', 15, 1.2, 12, 10000)
    } else {
      this.appliquerValeurs(
        choice(['u', 'v', 'w']),
        choice(['seuil', 'rangSeuil', 'premierRang']),
        randint(5, 30),
        randint(11, 15) / 10,
        randint(4, 20),
        choice([1000, 2000, 5000, 10000, 20000]),
      )
    }
  }

  constructor() {
    super()
    this.nbQuestions = 1
    this.nbQuestionsModifiable = true
    this.versionQcmDisponible = true
    this.versionQcm = true
    this.formatChampTexte = KeyboardType.clavierCompareAvecNombres
    this.besoinFormulaireCaseACocher = ['Sujet original', false]
    this.besoinFormulaire4CaseACocher = ['Ajout de « Je ne sais pas »', false]
    this.sup = false
    this.sup4 = false
  }
}
