import { tableauColonneLigne } from '../../lib/2d/tableau'
import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence, texteItalique } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import { randint } from '../../modules/outils'
import ExerciceQcmA from '../ExerciceQcmA'

export const uuid = 'bd0c9'
export const refs = { 'fr-fr': ['1A-R7'], 'fr-ch': [] }
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre =
  'Déterminer une valeur manquante dans un tableau de proportionnalité'
export const dateDePublication = '17/09/2025'

/**
 * Tableau 2x2 (lignes : x, y).
 * y = k*x.
 * La valeur dans l'une des cases est manquante.
 * x : entiers.
 * Un x ≤ 10 : x1 ∈ {2;4;6;8;10}.
 * Un x > 10 : x2 ∈ {20;30;40;50}.
 * y : entiers ou décimaux à 1 décimale (au plus un non-entier).
 * Coeffs k = p/q avec q ∈ {1,2,5,10} (décimaux "propres").
 * Correction : deux méthodes (via k ou produits en croix) + suggestion sans calculatrice.
 *
 * @author G.Marris
 */

// Types pour améliorer la lisibilité
interface CoeffPQ {
  p: number
  q: number
}

type PositionCase = 1 | 2 | 3 | 4 // 1:x1?, 2:x2?, 3:y1?, 4:y2?

// Fonction utilitaire du module
const formatRep = (n: number, d = 1, fixe = false): string =>
  `$${texNombre(n, d, fixe)}$`

// Fonction de calcul des trois distracteurs selon la case manquante
const calcDistracteurs = (
  pos: PositionCase,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  k: number,
): [number, number, number] => {
  switch (pos) {
    case 1: // x1 ? (bon: x1 = y1/k)
      return [(y2 * x2) / y1, y1 + x2, y1 * k]
    case 2: // x2 ? (bon: x2 = y2/k)
      return [(y1 * x1) / y2, y2 + x1, y2 * k]
    case 3: // y1 ? (bon: y1 = k*x1)
      return [(x2 * y2) / x1, x1 + y2, x1 / k]
    case 4: // y2 ? (bon: y2 = k*x2)
      return [(x1 * y1) / x2, x2 + y1, x2 / k]
    default:
      throw new Error(`Position invalide: ${pos}`)
  }
}

export default class Auto1AR7 extends ExerciceQcmA {
  private static readonly COEFFS_PQ: CoeffPQ[] = [
    { p: 1, q: 10 }, // 0.1
    { p: 1, q: 5 }, // 0.2
    { p: 1, q: 2 }, // 0.5
    { p: 3, q: 2 }, // 1.5
    { p: 2, q: 1 }, // 2
    { p: 5, q: 2 }, // 2.5
    { p: 3, q: 1 }, // 3
    { p: 4, q: 1 }, // 4
    { p: 5, q: 1 }, // 5
    { p: 10, q: 1 }, // 10
  ]

  private static readonly MAX_TENTATIVES_PU = 500
  private static readonly MAX_TENTATIVES_NC = 300

  versionOriginale: () => void = () => {
    const entetesColonnes: (string | number)[] = []
    const entetesLignes: (string | number)[] = ['x', 'y']
    const cellules: (string | number)[] = [
      texNombre(6),
      texNombre(14),
      texNombre(18),
      '?',
    ]

    this.enonce =
      'Les valeurs de $y$ sont proportionnelles à celles de $x$.<br>' +
      'Déterminer la valeur manquante (?) du tableau.<br><br>' +
      tableauColonneLigne(
        entetesColonnes,
        entetesLignes,
        cellules,
        1.6,
        true,
        0,
        1,
        false,
        { LC0: 'lightgray', classes: 'tableauXL' },
      )

    this.correction =
      'On a $y = k\\times x$.<br>' +
      texteItalique('Méthode 1 — avec le coefficient de proportionnalité') +
      ' :<br>' +
      'On calcule $k$ avec une colonne connue : $k = \\dfrac{18}{6} = 3$.<br>' +
      `Alors $\\,? = k\\times 14 = 3\\times 14 = ${miseEnEvidence(texNombre(42))}$.<br>` +
      texteItalique('Méthode 2 — par produit en croix') +
      ' :<br>' +
      `$6\\times ? = 14\\times 18$, donc $\\,? = \\dfrac{14\\times 18}{6} = ${miseEnEvidence(texNombre(42))}$.<br>` +
      'Vérification : $6\\times 42 = 252 \\text{ et } 14\\times 18 = 252$.<br>'

    this.reponses = [
      formatRep(42),
      formatRep(84),
      formatRep(32),
      formatRep(126),
    ]
  }

  versionAleatoire: () => void = () => {
    // On fait un (ou plusieurs) essai(s)
    // et on recommence tant que les 4 propositions ne sont pas distinctes.
    // PU : Propositions Uniques
    // NB : (essaiPU = 500) est un événement quasi impossible
    //      puisque sur un test de 100 énoncés successifs, cela n'a jamais dépassé 2 !
    for (let essaiPU = 0; essaiPU < Auto1AR7.MAX_TENTATIVES_PU; essaiPU++) {
      let x1 = 0
      let x2 = 0
      let y1 = 0
      let y2 = 0
      let p = 1
      let q = 1
      let k = 1

      // On fait un (ou plusieurs) essai(s)
      // et on recommence tant que l'on n'a pas au plus un y non-entier.
      // NC : Nombres Conformes aux attentes
      // NB : là aussi, (essaiNC = 300) est un événement quasi impossible.
      for (let essaiNC = 0; essaiNC < Auto1AR7.MAX_TENTATIVES_NC; essaiNC++) {
        const tirage = choice(Auto1AR7.COEFFS_PQ)
        p = tirage.p
        q = tirage.q
        k = p / q

        // Après de nombreuses simplifications,
        // pour éviter que les élèves ne soient confrontés à des calculs trop difficiles mentalement,
        // j'en viens à réduire fortement le nombre de cas !
        // Les valeurs possibles pour x1 sont réduites à 2, 4, 6, 8 et 10.
        // Les valeurs possibles pour x2 sont réduites à 20, 30, 40 et 50.
        x1 = 2 * randint(1, 5) // x1 ∈ {2,4,6,8,10}
        x2 = 10 * randint(2, 5) // x2 ∈ {20,30,40,50}

        // Calcul des valeurs y
        y1 = (x1 * p) / q
        y2 = (x2 * p) / q

        // Vérification : au moins un y doit être entier
        // On teste si y*10 est entier (pas de décimales au-delà du dixième)
        const y1Int = (y1 * 10) % 1 === 0
        const y2Int = (y2 * 10) % 1 === 0
        if (y1Int || y2Int) {
          // au moins un doit être entier
          break
        }
      }

      const pos = randint(1, 4) as PositionCase // 1:x1?, 2:x2?, 3:y1?, 4:y2?
      const bonne = pos === 1 ? x1 : pos === 2 ? x2 : pos === 3 ? y1 : y2

      // DISTRACTEURS (erreurs classiques)
      const [d1, d2, d3] = calcDistracteurs(pos, x1, x2, y1, y2, k)

      // 4 propositions formatées
      const propStr = [
        formatRep(bonne),
        formatRep(d1),
        formatRep(d2),
        formatRep(d3),
      ]

      // Vérifier que les 4 propositions sont distinctes
      if (new Set(propStr).size !== 4) continue // pas 4 distinctes : on retente !

      // -------- ÉNONCÉ --------
      const entetesColonnes: (string | number)[] = []
      const entetesLignes: (string | number)[] = ['x', 'y']
      const X1c = pos === 1 ? '?' : texNombre(x1, 1)
      const X2c = pos === 2 ? '?' : texNombre(x2, 1)
      const Y1c = pos === 3 ? '?' : texNombre(y1, 1)
      const Y2c = pos === 4 ? '?' : texNombre(y2, 1)
      const cellules: (string | number)[] = [X1c, X2c, Y1c, Y2c]

      this.enonce =
        'Les valeurs de $y$ sont proportionnelles à celles de $x$.<br>' +
        'Déterminer la valeur manquante (?) du tableau.<br><br>' +
        tableauColonneLigne(
          entetesColonnes,
          entetesLignes,
          cellules,
          1.6,
          true,
          0,
          1,
          false,
          { LC0: 'lightgray', classes: 'tableauXL' },
        )

      // -------- CORRECTION (deux méthodes + astuce) --------
      // colonne connue pour k
      const kTex =
        pos === 1 || pos === 3
          ? `\\dfrac{${texNombre(y2, 1)}}{${texNombre(x2, 1)}} = ${texNombre(k, 1)}`
          : `\\dfrac{${texNombre(y1, 1)}}{${texNombre(x1, 1)}} = ${texNombre(k, 1)}`

      // Méthode 1
      let methode1 = ''
      switch (pos) {
        case 1:
          methode1 = `$\\,? = \\dfrac{${texNombre(y1, 1)}}{${texNombre(k, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 2:
          methode1 = `$\\,? = \\dfrac{${texNombre(y2, 1)}}{${texNombre(k, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 3:
          methode1 = `$\\,? = ${texNombre(k, 1)}\\times ${texNombre(x1, 1)} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 4:
          methode1 = `$\\,? = ${texNombre(k, 1)}\\times ${texNombre(x2, 1)} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
      }

      // Méthode 2
      let methode2 = ''
      switch (pos) {
        case 1:
          methode2 = `$?\\times ${texNombre(y2, 1)} = ${texNombre(x2, 1)}\\times ${texNombre(y1, 1)}$, donc $\\,? = \\dfrac{${texNombre(x2, 1)}\\times ${texNombre(y1, 1)}}{${texNombre(y2, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 2:
          methode2 = `$${texNombre(x1, 1)}\\times ${texNombre(y2, 1)} = ?\\times ${texNombre(y1, 1)}$, donc $\\,? = \\dfrac{${texNombre(x1, 1)}\\times ${texNombre(y2, 1)}}{${texNombre(y1, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 3:
          methode2 = `$${texNombre(x1, 1)}\\times ${texNombre(y2, 1)} = ${texNombre(x2, 1)}\\times ?$, donc $\\,? = \\dfrac{${texNombre(x1, 1)}\\times ${texNombre(y2, 1)}}{${texNombre(x2, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
        case 4:
          methode2 = `$${texNombre(x1, 1)}\\times ? = ${texNombre(x2, 1)}\\times ${texNombre(y1, 1)}$, donc $\\,? = \\dfrac{${texNombre(x2, 1)}\\times ${texNombre(y1, 1)}}{${texNombre(x1, 1)}} = ${miseEnEvidence(texNombre(bonne, 1))}$`
          break
      }

      // Vérification (égalité des produits en croix) — affichage formaté
      const vX1 = pos === 1 ? bonne : x1
      const vX2 = pos === 2 ? bonne : x2
      const vY1 = pos === 3 ? bonne : y1
      const vY2 = pos === 4 ? bonne : y2
      const verification = `$${texNombre(vX1, 1)}\\times ${texNombre(vY2, 1)} = ${texNombre(vX1 * vY2, 1)} \\text{ et } ${texNombre(vX2, 1)}\\times ${texNombre(vY1, 1)} = ${texNombre(vX2 * vY1, 1)}$`

      this.correction =
        'On a $y = k\\times x$.<br>' +
        texteItalique('Méthode 1 — avec le coefficient de proportionnalité') +
        ' :<br>' +
        `On calcule $k$ avec une colonne connue : $k = ${kTex}$.<br>` +
        `${methode1}<br>` +
        texteItalique('Méthode 2 — les produits en croix sont égaux') +
        ' :<br>' +
        `${methode2}.<br>` +
        `Vérification : ${verification}<br>` +
        texteItalique('Astuce : sans calculatrice') +
        ", un ordre de grandeur du produit en croix à obtenir permet souvent de déterminer la seule proposition qui permet de l'approcher."

      this.reponses = propStr // 4 propositions forcément distinctes...
      return // ... donc inutile de continuer à faire des essais.
    }

    // Fallback si échec
    console.warn(
      'Impossible de générer des propositions uniques, utilisation de la version originale',
    )
    this.versionOriginale()
  }

  constructor() {
    super()
    this.versionAleatoire()
    this.spacing = 1.5
    this.spacingCorr = 1.5
  }
}
