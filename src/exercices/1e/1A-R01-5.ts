import { choice } from '../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { texNombre } from '../../lib/outils/texNombre'
import ExerciceQcmA from '../ExerciceQcmA'
export const dateDePublication = '22/12/2025'
export const uuid = '6850f'
// Author Gilles Mora
export const refs = {
  'fr-fr': ['1A-R01-5'],
  'fr-ch': [],
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Comparer  avec des pourcentages'
export default class AutoARO1e extends ExerciceQcmA {
  private appliquerLesValeurs(
    p1: number,
    n1: number,
    r1: number,
    p2: number,
    n2: number,
    r2: number,
    p3: number,
    n3: number,
    r3: number,
    p4: number,
    n4: number,
    r4: number,
    max: number,
  ): void {
    this.enonce = `Parmi les nombres suivants, lequel est le plus grand ?`

    let correctionTexte =
      "• Prendre $25\\,\\%$ d'une valeur revient à la diviser par $4$.<br>"
    correctionTexte +=
      "• Prendre $10\\,\\%$ d'une valeur revient à la diviser par $10$.<br>"
    correctionTexte +=
      "• Prendre $20\\,\\%$ d'une valeur revient à en prendre deux fois $10\\,\\%$.<br>"
    correctionTexte +=
      "• Prendre $5\\,\\%$ d'une valeur revient à en prendre la moitié de $10\\,\\%$.<br>"

    const calculs = [
      { pourcent: p1, nombre: n1, resultat: r1 },
      { pourcent: p2, nombre: n2, resultat: r2 },
      { pourcent: p3, nombre: n3, resultat: r3 },
      { pourcent: p4, nombre: n4, resultat: r4 },
    ]

    for (const calc of calculs) {
      if (calc.pourcent === 25) {
        correctionTexte += `$${calc.pourcent}\\,\\%$ de $${calc.nombre}=\\dfrac{${calc.nombre}}{4}=${texNombre(calc.resultat)}$<br>`
      } else if (calc.pourcent === 10) {
        correctionTexte += `$${calc.pourcent}\\,\\%$ de $${calc.nombre}=\\dfrac{${calc.nombre}}{10}=${texNombre(calc.resultat)}$<br>`
      } else if (calc.pourcent === 20) {
        const dixPourcent = calc.nombre / 10
        correctionTexte += `$${calc.pourcent}\\,\\%$ de $${calc.nombre}=2\\times \\dfrac{${calc.nombre}}{10}=2\\times ${texNombre(dixPourcent)}=${texNombre(calc.resultat)}$<br>`
      } else if (calc.pourcent === 5) {
        const dixPourcent = calc.nombre / 10
        correctionTexte += `$${calc.pourcent}\\,\\%$ de $${calc.nombre}=\\dfrac{1}{2}\\times \\dfrac{${calc.nombre}}{10}=\\dfrac{${dixPourcent}}{2}=${texNombre(calc.resultat)}$<br>`
      }
    }

    // Trouver quel calcul donne le max pour la conclusion
    let bonCalculTexte = ''
    if (r1 === max)
      bonCalculTexte = `$${miseEnEvidence(p1 + '\\,\\% \\text{ de } ' + n1)}$`
    else if (r2 === max)
      bonCalculTexte = `$${miseEnEvidence(p2 + '\\,\\% \\text{ de }' + n2)}$`
    else if (r3 === max)
      bonCalculTexte = `$${miseEnEvidence(p3 + '\\,\\% \\text{ de } ' + n3)}$`
    else if (r4 === max)
      bonCalculTexte = `$${miseEnEvidence(p4 + '\\,\\% \\text{ de } ' + n4)}$`

    correctionTexte += `Le plus grand résultat est donc donné par le calcul ${bonCalculTexte} $ =${texNombre(max)}$.`

    this.correction = correctionTexte

    // La première réponse est la bonne (celle qui donne max)
    let bonCalcul = ''
    if (r1 === max) bonCalcul = `$${p1}\\,\\%$ de $${n1}$`
    else if (r2 === max) bonCalcul = `$${p2}\\,\\%$ de $${n2}$`
    else if (r3 === max) bonCalcul = `$${p3}\\,\\%$ de $${n3}$`
    else if (r4 === max) bonCalcul = `$${p4}\\,\\%$ de $${n4}$`

    this.reponses = [
      bonCalcul,
      `$${p1}\\,\\%$ de $${n1}$`,
      `$${p2}\\,\\%$ de $${n2}$`,
      `$${p3}\\,\\%$ de $${n3}$`,
      `$${p4}\\,\\%$ de $${n4}$`,
    ].filter((item, index, self) => self.indexOf(item) === index)

    this.reponses = this.reponses.slice(0, 4)
  }

  versionOriginale: () => void = () => {
    // 25% de 72 = 18
    // 10% de 193 = 19.3 (max)
    // 5% de 350 = 17.5
    // 20% de 95 = 19
    this.appliquerLesValeurs(
      25,
      72,
      18,
      10,
      193,
      19.3,
      5,
      350,
      17.5,
      20,
      95,
      19,
      19.3,
    )
  }

  versionAleatoire: () => void = () => {
    const listeModeles = [
      // Modèle 1: max = 10%
      {
        base25: [68, 72, 76, 80],
        base10: [191, 192, 193, 194, 195, 196, 197],
        base5: [340, 350, 360, 370],
        base20: [90, 95, 100],
        maxType: 10,
      },

      // Modèle 2: max = 5%
      {
        base25: [80, 84, 88],
        base10: [220, 225, 227, 230],
        base5: [450, 460, 470, 480],
        base20: [105, 110],
        maxType: 5,
      },

      // Modèle 3: max = 10%
      {
        base25: [56, 60, 64],
        base10: [170, 173, 176, 179],
        base5: [310, 320, 330],
        base20: [80, 85, 90],
        maxType: 10,
      },

      // Modèle 4: max = 10%
      {
        base25: [92, 96, 100],
        base10: [268, 271, 274, 277],
        base5: [510, 520, 530],
        base20: [120, 125, 130],
        maxType: 10,
      },

      // Modèle 5: max = 20%
      {
        base25: [116, 120, 124],
        base10: [283, 287, 291],
        base5: [570, 580, 590],
        base20: [150, 155, 160],
        maxType: 20,
      },

      // Modèle 6: max = 10%
      {
        base25: [44, 48, 52],
        base10: [140, 143, 146, 149],
        base5: [250, 260, 270],
        base20: [65, 70, 75],
        maxType: 10,
      },

      // Modèle 7: max = 25%
      {
        base25: [88, 92, 96],
        base10: [210, 213, 216],
        base5: [430, 440, 450],
        base20: [105, 110, 115],
        maxType: 25,
      },

      // Modèle 8: max = 20%
      {
        base25: [60, 64, 68],
        base10: [178, 181, 184],
        base5: [330, 340, 350],
        base20: [90, 95, 100],
        maxType: 20,
      },

      // Modèle 9: max = 5%
      {
        base25: [100, 104, 108],
        base10: [250, 253, 256],
        base5: [550, 560, 570],
        base20: [130, 135, 140],
        maxType: 5,
      },

      // Modèle 10: max = 25%
      {
        base25: [60, 64, 68],
        base10: [144, 147, 150],
        base5: [290, 300, 310],
        base20: [70, 75, 80],
        maxType: 25,
      },

      // Modèle 11: max = 20%
      {
        base25: [72, 76, 80],
        base10: [194, 197, 200],
        base5: [370, 380, 390],
        base20: [115, 105, 110],
        maxType: 20,
      },

      // Modèle 12: max = 25%
      {
        base25: [92, 96, 100],
        base10: [224, 227, 230],
        base5: [450, 460, 470],
        base20: [110, 115, 120],
        maxType: 25,
      },
    ]

    const modele = choice(listeModeles)

    // Générer les valeurs aléatoires pour chaque type de calcul
    const n1 = choice(modele.base25)
    const r1 = n1 / 4

    const n2 = choice(modele.base10)
    const r2 = n2 / 10

    const n3 = choice(modele.base5)
    const r3 = n3 / 20

    const n4 = choice(modele.base20)
    const r4 = n4 / 5

    // Déterminer le max selon le type
    let max: number = r2
    if (modele.maxType === 25) max = r1
    else if (modele.maxType === 10) max = r2
    else if (modele.maxType === 5) max = r3
    else if (modele.maxType === 20) max = r4

    this.appliquerLesValeurs(25, n1, r1, 10, n2, r2, 5, n3, r3, 20, n4, r4, max)
  }

  constructor() {
    super()
    this.versionAleatoire()
    this.spacingCorr = 2.5
  }
}
