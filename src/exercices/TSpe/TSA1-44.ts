import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteCode } from '../../lib/outils/embellissements'
import { scriptPython } from '../../lib/outils/scriptPython'
import { texNombre } from '../../lib/outils/texNombre'
import { tableauColonneLigne } from '../../lib/2d/tableau'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { context } from '../../modules/context'
import { randint } from '../../modules/outils'
import ExerciceSimple from '../ExerciceSimple'

export const titre = 'Déterminer la valeur renvoyée par un algorithme de seuil'
export const dateDePublication = '29/08/2026'
export const uuid = '87fb7'
export const refs = {
  'fr-fr': ['TSA1-44'],
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
 * Exécuter une boucle Python de recherche de seuil et identifier la valeur
 * renvoyée.
 *
 * @author Stéphane Guyon
 */
export default class ValeurRenvoyeeAlgorithmeSeuil extends ExerciceSimple {
  nouvelleVersion(): void {
    const lettre = choice(['u', 'v', 'w'])
    const nomFonction = choice(['seuil', 'rangSeuil', 'premierRang'])
    const u0 = randint(2, 10)
    const coefficient = choice([2, 3])
    const termeConstant = randint(2, 10)
    const seuil = choice([500, 1000, 2000, 5000])
    const coefficientTex = texNombre(coefficient)
    const coefficientPython = String(coefficient)

    const valeurs = [u0]
    while (valeurs.at(-1)! <= seuil && valeurs.length < 100) {
      valeurs.push(coefficient * valeurs.at(-1)! + termeConstant)
    }
    const rang = valeurs.length - 1
    const valeurAvantSeuil = valeurs[rang - 1]
    const valeurAuSeuil = valeurs[rang]

    const programme = `def ${nomFonction}():
    n = 0
    ${lettre} = ${u0}
    while ${lettre} <= ${seuil}:
        n = n + 1
        ${lettre} = ${coefficientPython}*${lettre} + ${termeConstant}
    return n`

    this.question = `On considère la suite $(${lettre}_n)$ définie sur $\\mathbb N$ par $${lettre}_0=${u0}$ et, pour tout entier naturel $n$, par :<br>
$${lettre}_{n+1}=${coefficientTex}${lettre}_n+${termeConstant}$.<br><br>
On définit la fonction Python suivante :<br>
${consolePython(programme)}
On exécute cette fonction avec l'appel ${texteCode(`${nomFonction}()`)}.<br>
Quelle valeur cet appel renvoie-t-il ?`

    this.reponse = this.versionQcm ? `$${rang}$` : rang
    this.distracteurs = [`$${rang - 1}$`, `$${rang + 1}$`, `$${rang + 2}$`]
    this.versionQcmOptions = {
      radio: true,
      vertical: false,
      dontKnow: this.sup4,
    }

    const rangs = valeurs.map((_, indice) => indice)
    const tableauVariables = tableauColonneLigne(
      [],
      ['n', lettre],
      [
        ...rangs.map((valeur) => texNombre(valeur)),
        ...valeurs.map((valeur) => texNombre(valeur)),
      ],
      1.2,
    )

    this.correction = `Les variables ${texteCode('n')} et ${texteCode(lettre)} sont initialisées avec le rang $0$ et le terme $${lettre}_0=${u0}$.<br><br>
Les valeurs de $${lettre}$ sont calculées avec la relation de récurrence :<br>
$${lettre}_1=${coefficientTex}\\times ${lettre}_0+${termeConstant}=${coefficientTex}\\times ${u0}+${termeConstant}=${valeurs[1]}$,<br>
$${lettre}_2=${coefficientTex}\\times ${lettre}_1+${termeConstant}=${coefficientTex}\\times ${valeurs[1]}+${termeConstant}=${valeurs[2]}$.<br>
Et ainsi de suite.<br><br>
Le tableau d'exécution donne les valeurs exactes des variables à chaque test de la condition du ${texteCode('while')} :<br><br>
${tableauVariables}<br><br>
Au rang $${rang - 1}$, on a $${lettre}_{${rang - 1}}=${texNombre(valeurAvantSeuil)}\\leqslant ${seuil}$ : la boucle continue.<br>
Au rang $${rang}$, on a $${lettre}_{${rang}}=${texNombre(valeurAuSeuil)}>${seuil}$ : la condition du ${texteCode('while')} devient fausse et la boucle s'arrête.<br>
La fonction exécute alors ${texteCode('return n')} et renvoie donc $${miseEnEvidence(String(rang))}$.`
  }

  constructor() {
    super()
    this.nbQuestions = 1
    this.besoinFormulaire4CaseACocher = ['Ajout de « Je ne sais pas »', false]
    this.sup4 = false
    this.nbQuestionsModifiable = true
    this.versionQcmDisponible = true
    this.versionQcm = true
    this.formatChampTexte = KeyboardType.clavierNumbers
  }
}
