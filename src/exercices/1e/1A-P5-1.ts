import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { Arbre, texProba } from '../../modules/arbres'
import { randint } from '../../modules/outils'
import ExerciceQcmA from '../ExerciceQcmA'
export const dateDePublication = '10/08/2025'
export const uuid = '3a5ab'
// Author Stéphane Guyon
export const refs = {
  'fr-fr': ['1A-P5-1'],
  'fr-ch': [],
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Utiliser un arbre pour calculer une probabilité (3)'
export default class Puissances extends ExerciceQcmA {
  versionOriginale: () => void = () => {
    let objets = []
    const rationnel = true
    const pA = 0.4
    const pAC = 0.6
    const pBC = 0.3
    const omega = new Arbre({
      racine: true,
      rationnel,
      nom: '',
      proba: 1,
      visible: false,
      alter: '',
      enfants: [
        new Arbre({
          rationnel,
          nom: 'A',
          proba: pA,
          enfants: [
            new Arbre({
              rationnel,
              nom: 'C',
              proba: pAC,
            }),
            new Arbre({
              rationnel,
              nom: '\\bar C',
              proba: Number(1 - pAC),
            }),
          ],
        }),
        new Arbre({
          rationnel,
          nom: '\\bar A',
          proba: Number(1 - pA),
          enfants: [
            new Arbre({
              rationnel,
              nom: 'C',
              proba: pBC,
              visible: true,
              // alter: 'x'
            }),
            new Arbre({
              rationnel,
              nom: '\\bar C',
              proba: Number(1 - pBC),
              visible: true,
              alter: '',
            }),
          ],
        }),
      ],
    })

    omega.setTailles() // On calcule les tailles des arbres.
    objets = omega.represente(0, 6, 0, 3, true, 1, 8)
    const Reponse = pA * pAC + (1 - pA) * pBC

    // Génère distracteur2 différent de distracteur1 et de la bonne réponse

    this.enonce = 'On donne l\'arbre de probabilités ci-dessous :<br>'
    this.enonce += mathalea2d(Object.assign({ style: 'inline' }, fixeBordures(objets)), objets)
    this.enonce += '<br>$p(C)=\\ldots$'
    this.correction = `On applique la formule de probabilité totale :<br> $\\begin{aligned}
    p(C)&=p(A)\\times p_A(C)+p(\\overline A)\\times p_{\\overline A}(C)\\\\
    &=${texProba(pA)}\\times ${texProba(pAC)}+${texProba(1 - pA)}\\times ${texProba(pBC)}\\\\
    &=${texProba(pA * pAC + (1 - pA) * pBC)}.
    \\end{aligned}$`
    this.reponses = [
      `$${texProba(pA * pAC + (1 - pA) * pBC)} $`,
      `$${texProba(0.44)}$ `,
      `$${texProba(0.61)}$ `,
      `$${texProba(0.39)}$ `,
    ]
  }

  versionAleatoire = () => {
    let objets = []
    const rationnel = true
    let pA = randint(1, 9)
    let pAC = randint(2, 8, pA)
    let pBC = randint(2, 8, pAC)
    pA = pA / 10
    pAC = pAC / 10
    pBC = pBC / 10
    // On définit l'arbre complet
    const omega = new Arbre({
      racine: true,
      rationnel,
      nom: '',
      proba: 1,
      visible: false,
      alter: '',
      enfants: [
        new Arbre({
          rationnel,
          nom: 'A',
          proba: pA,
          enfants: [
            new Arbre({
              rationnel,
              nom: 'C',
              proba: pAC,
            }),
            new Arbre({
              rationnel,
              nom: '\\bar C',
              proba: Number(1 - pAC),
            }),
          ],
        }),
        new Arbre({
          rationnel,
          nom: '\\bar A',
          proba: Number(1 - pA),
          enfants: [
            new Arbre({
              rationnel,
              nom: 'C',
              proba: pBC,
              visible: true,
              // alter: 'x'
            }),
            new Arbre({
              rationnel,
              nom: '\\bar C',
              proba: Number(1 - pBC),
              visible: true,
              alter: '',
            }),
          ],
        }),
      ],
    })

    omega.setTailles() // On calcule les tailles des arbres.
    objets = omega.represente(0, 6, 0, 3, true, 1, 8)
    const Reponse = pA * pAC + (1 - pA) * pBC
    const distracteur1 = Reponse + (randint(-1, 1, 0) * randint(5, 30)) / 100
    let distracteur2: number
    let distracteur3: number
    // Génère distracteur2 différent de distracteur1 et de la bonne réponse

    do {
      distracteur2 = Reponse + (randint(-1, 1, 0) * randint(5, 30)) / 100
    } while (distracteur2 === distracteur1 || distracteur2 === Reponse)
    do {
      distracteur3 = Reponse + (randint(-1, 1, 0) * randint(5, 30)) / 100
    } while (
      distracteur3 === distracteur1 ||
      distracteur3 === distracteur2 ||
      distracteur3 === Reponse
    )
    this.enonce = 'On donne l\'arbre de probabilités ci-dessous :<br>'
    this.enonce += mathalea2d(Object.assign({ style: 'inline' }, fixeBordures(objets)), objets)
    this.enonce += '<br>$p(C)=\\ldots$'
    this.correction = `On applique la formule de probabilité totale :<br> $\\begin{aligned}
    p(C)&=p(A)\\times p_A(C)+p(\\overline A)\\times p_{\\overline A}(C)\\\\
    &=${texProba(pA)}\\times ${texProba(pAC)}+${texProba(1 - pA)}\\times ${texProba(pBC)}\\\\
    &=${texProba(pA * pAC + (1 - pA) * pBC)}.
    \\end{aligned}$`
    this.reponses = [
      `$${texProba(pA * pAC + (1 - pA) * pBC)} $`,
      `$${texProba(distracteur1)}$ `,
      `$${texProba(distracteur2)}$ `,
      `$${texProba(distracteur3)}$ `,
    ]
  }

  constructor() {
    super()
    this.versionAleatoire()
  }
}
