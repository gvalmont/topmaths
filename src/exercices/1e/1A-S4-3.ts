import { choice } from '../../lib/outils/arrayOutils'
import { texNombre } from '../../lib/outils/texNombre'
import { randint } from '../../modules/outils'
import { nombreElementsDifferents } from '../ExerciceQcm'
// import ExerciceQcmA from '../../ExerciceQcmA'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = 'bd806'
export const refs = {
  'fr-fr': ['1A-S4-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Déterminer la valeur manquante d\'une série dont on connaît la moyenne.'
export const dateDePublication = '02/08/2025'
// Ceci est un exemple de QCM avec version originale et version aléatoire
/**
 *
 * @author Stéphane Guyon
 *
 */

export default class MoyenneQCM extends ExerciceQcmA {
  // Ceci est la fonction qui s'occupe d'écrire l'énoncé, la correction et les réponses
  // Elle factorise le code qui serait dupliqué dans versionAleatoire et versionOriginale
  private appliquerLesValeurs (p1: number, p2: number):
  void {
    const effectif = choice([4, 5])
    const valeurs = []

    for (let i = 0; i < effectif; i++) {
      valeurs.push(randint(5, 15, 0))
    }
    const somme = valeurs.reduce((a, b) => a + b, 0)
    const moyenne1 = somme / effectif
    let moyenne: number
    if (moyenne1 > 11) {
      moyenne = Math.floor(moyenne1) - 1
    } else {
      moyenne = Math.floor(moyenne1) + 1
    }
    const x = moyenne * (effectif + 1) - somme
    function genererDistracteurs (x: number): {
      distracteur2: number,
      distracteur3: number,
      distracteur4: number
    } {
      // Génère les valeurs autour de x (±1, ±2, ±3)
      const deltas = [-3, -2, -1, 1, 2, 3]
      const candidates = deltas
        .map(delta => x + delta)
        .filter(val => val > 0) // Garde seulement les positifs

      // Mélange les candidats
      shuffleArray(candidates)

      if (candidates.length < 3) {
        throw new Error('Pas assez de valeurs positives autour de x pour générer 3 distracteurs')
      }

      const [distracteur2, distracteur3, distracteur4] = candidates.slice(0, 3)

      return { distracteur2, distracteur3, distracteur4 }
    }

    // Mélange un tableau (Fisher–Yates)
    function shuffleArray<T> (array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]
      }
    }
    const { distracteur2, distracteur3, distracteur4 } = genererDistracteurs(x)
    this.reponses = [
     `$${texNombre(x)}$`,
    `$${texNombre(distracteur2)}$`,
`$${texNombre(distracteur3)}$`,
      `$${texNombre(distracteur4)}$`,
    ]

    this.enonce = `On donne la série suivante  : ${valeurs.join(' ; ')}.<br>
    Quelle valeur faut-il ajouter à la série pour que sa moyenne soit égale à $${texNombre(moyenne)}$ ?`

    this.correction = ` Appelons $x$ la valeur cherchée.<br>
    On commence par calculer la somme des valeurs de la série de l'énoncé :<br>
    $${valeurs.join(' + ')} = ${somme}$.<br>
    Comme la série de l'énoncé contient $${effectif}$ valeurs, la nouvelle série avec $x$ en contient $${effectif + 1}$.
    <br>On peut calculer sa moyenne avec l'expression :$ \\dfrac{${somme} + x}{${effectif} + 1}$<br>
   Comme cette moyenne vaut $${texNombre(moyenne)}$ d'après l'énoncé, il faut alors résoudre l'équation : <br>
    $ \\dfrac{${somme} + x}{${effectif + 1} } = ${texNombre(moyenne)}$
    <br>
    $${somme} + x = ${texNombre(moyenne)} \\times ${effectif + 1}$
    <br>
    $x = ${texNombre(moyenne)} \\times ${effectif + 1} - ${somme}$
    <br>$x = ${texNombre(x)}$.`
    this.reponses[0] = `$${texNombre(x)}$`
  }

  // S'occupe de passser les données originales à la fonction appliquerLesValeurs

  // s'occupe d'aléatoiriser les valeurs à passer à la fonction appliquerLesValeurs en vérifiant qu'on a bien 3 réponses différentes
  // Pour un qcm à n réponses, il faudrait vérifier que nombreElementsDifferents(this.reponses) < n
  versionAleatoire: () => void = () => {
    const n = 4 // nombre de réponses différentes voulues (on rappelle que la première réponse est la bonne)
    do {
      const p1 = randint(-6, 6, 0) * 10
      const p2 = randint(-6, 6, 0) * 10// On génère un polynôme de degré 2 ax^2+c

      this.appliquerLesValeurs(p1, p2)
    } while (nombreElementsDifferents(this.reponses) < n)
  }

  // Ici il n'y a rien à faire, on appelle juste la version aleatoire (pour un qcm aleatoirisé, c'est le fonctionnement par défaut)
  constructor () {
    super()
    this.options = { vertical: false, ordered: false }
    this.versionAleatoire()
  }
}
