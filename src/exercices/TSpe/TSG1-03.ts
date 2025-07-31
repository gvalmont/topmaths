import ExerciceSimple from '../ExerciceSimple'
import { randint } from '../../modules/outils'
import { texNombre } from '../../lib/outils/texNombre'
import { miseEnEvidence } from '../../lib/outils/embellissements'
export const titre = 'Dénombrement.'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '20/4/2025'

export const uuid = '32fa3'
export const refs = {
  'fr-fr': ['TSG1-03'],
  'fr-ch': []
}
function factorielle (num: number): number {
  if (num === 0 || num === 1) return 1
  return num * factorielle(num - 1)
}
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Stéphane Guyon

*/
export default class NomExercice extends ExerciceSimple {
  constructor () {
    super()
    this.typeExercice = 'simple'
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    const n = randint(3, 6) // nombre de chiffres
    const p = randint(3, 5) // nombre de lettres du code
    const lettre = randint(p + 1, 8) // nombre de lettres possibles pour le code.
    const code = (() => {
      if (lettre === 3) return 'A, B, C'
      if (lettre === 4) return 'A, B, C, D'
      if (lettre === 5) return 'A, B, C, D, E'
      if (lettre === 6) return 'A, B, C, D, E, F'
      if (lettre === 7) return 'A, B, C, D, E, F, G'
      if (lettre === 8) return 'A, B, C, D, E, F, G, H'
      return ''
    })()
    this.question = `Un code secret est composé de ${n} chiffres (qui peuvent être identiques) suivis de ${p} lettres distinctes à choisir parmi ${code} .<br>`
    this.question += 'Combien de codes secrets différents peut-on former ?'

    const factorielleN = factorielle(p) * 10 ** n

    this.correction = `Soit $E=\\left\\{0;1;\\ldots ;9\\right\\}$ et $F=\\left\\{${code}\\right\\}$, <br>`
    this.correction += `L'ordre est important dans ce code. Il s'agit donc d'un ${n + p}-uplet composé de ${n} éléments de $E$ puis de ${p} éléments de $F$. <br>`
    this.correction += `Pour les ${n} chiffres, il y a répétition possible, donc il y a $10^${n}$ possibilités. <br>`
    this.correction += `Pour les ${p} lettres, il n'y a pas de répétition possible, elles sont distinctes. Il y a donc $${p}~!$ possibilités. <br>`
    this.correction += `Il y a au total $10^${n} \\times ${p}~!$ possibilités de code. <br>`
    this.correction += `Ce qui donne au total  $${miseEnEvidence(texNombre(factorielleN))}$ possibilités de code. <br>`
    this.reponse = factorielleN
  }
}
