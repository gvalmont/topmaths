import { UniverSheetElement } from 'univer-sheets-vite'
import type { CellSheetData, StyleSheets } from 'univer-sheets-vite/src/convert'
import { point } from '../../lib/2d/points'
import { polygone } from '../../lib/2d/polygones'
import { segment } from '../../lib/2d/segmentsVecteurs'
import { latex2d } from '../../lib/2d/textes'
import { ajouteFeedback } from '../../lib/interactif/questionMathLive'
import { choice, shuffle } from '../../lib/outils/arrayOutils'
import { listeDesDiviseurs } from '../../lib/outils/primalite'
import { colorToLatexOrHTML, mathalea2d } from '../../modules/2dGeneralites'
import { context } from '../../modules/context'
import {
  gestionnaireFormulaireTexte,
  listeQuestionsToContenu,
  randint,
} from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Programmer des calculs sur tableur'
export const dateDePublication = '12/08/2025'

export const interactifReady = true
export const interactifType = 'custom'
/*
 * Programmer des calculs sur tableur : New programme de 6eme 2025
 * @author Mickael Guironnet
 */

export const uuid = 'ae07c'

export const refs = {
  'fr-fr': ['6I1B-4'],
  'fr-2016': ['6I16'],
  'fr-ch': [],
}
export default class ExerciceTableur extends Exercice {
  destroyers: (() => void)[] = []

  constructor() {
    super()
    this.nbQuestions = 2
    this.besoinFormulaireNumerique = [
      "Nombre d'opérations (entre 2 et 5 ou bien 1 si vous laissez le hasard décider)",
      5,
    ]
    this.besoinFormulaire2Texte = [
      "Type d'opérations",
      [
        'Nombres séparés par des tirets  :',
        '1 : addition',
        '2 : soustraction',
        '3 : multiplication',
        '4 : division',
        '5 : mélange',
      ].join('\n'),
    ]
    this.sup = 3
    this.sup2 = 5
  }

  destroy() {
    // MGu quan l'exercice est supprimé par svelte : bouton supprimé
    this.destroyers.forEach((destroy) => destroy())
    this.destroyers.length = 0
  }

  static readonly colors = {
    orange: '#e6b457',
    vert: '#7adb7a',
    jaune: '#e6e66a',
    bleu: '#8181e6',
    violet: '#f8a3f8',
    rouge: '#eca2a2',
  }

  static readonly styles: StyleSheets = {
    style_id_rouge: {
      fs: 12,
      bg: ExerciceTableur.colors.rouge,
    },
    style_id_bleu: {
      fs: 12,
      bg: ExerciceTableur.colors.bleu,
    },
    style_id_orange: {
      fs: 12,
      bg: ExerciceTableur.colors.orange,
    },
    style_id_violet: {
      fs: 12,
      bg: ExerciceTableur.colors.violet,
    },
    style_id_vert: {
      fs: 12,
      bg: ExerciceTableur.colors.vert,
    },
    style_id_jaune: {
      fs: 12,
      bg: ExerciceTableur.colors.jaune,
    },
  }

  nouvelleVersion(): void {
    // MGu quand l'exercice est modifié, on détruit les anciens listeners
    this.destroyers.forEach((destroy) => destroy())
    this.destroyers.length = 0

    const nbOperations =
      this.sup === 1 ? randint(2, 5) : Math.min(Math.max(2, this.sup), 5)
    const typesDeOperations = gestionnaireFormulaireTexte({
      saisie: this.sup2,
      min: 1,
      max: 4,
      melange: 5,
      defaut: 5,
      nbQuestions: nbOperations,
    })
    for (
      let q = 0, cpt = 0, texte, texteCorr: string;
      q < this.nbQuestions && cpt < 50;
      cpt++
    ) {
      const id = `univer${this.numeroExercice}_${q}`
      const { steps } = programmeCalcul(typesDeOperations as number[])
      const operStr = transformationsOper(steps)
      const data: CellSheetData = {
        0: {
          0: { v: steps[0].oldn, s: 'style_id_orange', t: 2 },
        },
      }
      const colorsArr = Object.entries(ExerciceTableur.colors)
      for (let i = 0; i < steps.length; i++) {
        data[0][i + 1] = {
          v: '',
          s: `style_id_${colorsArr[(i + 1) % colorsArr.length][0]}`,
        }
      }
      const rect: Record<string, { bg?: string; v?: string }> = {
        0: { v: steps[0].oldn.toString(), bg: colorsArr[0][1] },
      }
      for (let i = 0, k = 1; i < steps.length; i++, k += 2) {
        rect[`${k}`] = { v: operStr[i] }
        rect[`${k + 1}`] = { bg: colorsArr[(i + 1) % colorsArr.length][1] }
      }

      texte = 'On a créé le programme de calculs suivant :<br>'
      texte += createDigramm(Object.keys(rect).length, rect) + '<br>'

      texte += `On choisit un nombre dans la première case, ici ${steps[0].oldn} et on obtient un nombre à la fin de la chaîne.<br><br>
      On veut programmer cette suite de calculs dans un tableur. <br>
      Par exemple, la cellule B1 doit contenir la formule du premier calcul.<br>
      Faire de même pour les autres cellules. <br>
      Attention, les formules doivent fonctionner même si le nombre de départ change (Cellule A1).<br>
      `
      if (context.isHtml) {
        texte += `<div>
        <div style="flex:1;width:100%;height: 250px; min-width: 360px;display:flex; flex-direction:column;">
          <univer-sheet
            style='width:100%;height:100%;' id='${id}'
            data='{"rowCount":4,"columnCount":${steps.length + 1},"cellData":${JSON.stringify(data)},"styles":${JSON.stringify(ExerciceTableur.styles)}}'>
          </univer-sheet>
        </div>
        <div>
          <button id="runCode" class="px-6 py-2.5" style="box-sizing: border-box;${this.interactif ? 'display:none;' : ''}">▶️ Vérifier</button>
          <div id="message-faux" style="box-sizing: border-box; margin: 10px 10px 10px 10px; font-weight: bold; color: red; font-size: 1.2em;"></div>
        </div>
        </div>
        `
      } else {
        const options: {
          formule?: boolean
          formuleTexte?: string
          formuleCellule?: string
          firstColHeaderWidth?: string
        } = {}
        options.formule = true
        options.formuleTexte = '=?'
        options.formuleCellule = 'B1'
        texte += createTableurLatex(
          4,
          steps.length + 1,
          data,
          ExerciceTableur.styles,
          options,
        )
      }

      if (this.interactif) {
        texte += `<div class="ml-2 py-2" id="resultatCheckEx${this.numeroExercice}Q${q}"></div>`
        texte += ajouteFeedback(this, q)
      }
      texteCorr = 'Voici les formules à saisir dans le tableur :<br>'
      const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i]
        texteCorr += `$${step.oldn} ${operStr[i]} = ${step.result}$ devient en cellule ${alphabet[i + 1]}1 la formule suivante : "=${alphabet[i]}1${operStr[i].replace('\\times', '*').replace('\\div', '/')}"<br>`
      }

      function checkSolution() {
        const btn = document.getElementById(id) as UniverSheetElement
        if (btn) {
          const allMessages: string[] = []
          const messages =
            btn?.parentElement?.parentElement?.querySelector<HTMLElement>(
              '#message-faux',
            )
          for (let i = 0; i < steps.length; i++) {
            const step = steps[i]
            const value = btn.getA1NotationValue(`${alphabet.charAt(i + 1)}1`)
            const formula = btn.getA1NotationFormula(
              `${alphabet.charAt(i + 1)}1`,
            )
            if (
              value !== step.result ||
              (formula && formula.indexOf('=') !== 0) ||
              (formula && /[A-Z]/.test(formula) === false)
            ) {
              if (value !== step.result) {
                allMessages.push(
                  `La cellule ${alphabet.charAt(i + 1)}1 est incorrecte : résultat incorrect`,
                )
              } else if (
                (formula && formula.indexOf('=') !== 0) ||
                (formula && /[A-Z]/.test(formula) === false)
              ) {
                allMessages.push(
                  `La cellule ${alphabet.charAt(i + 1)}1 est incorrecte : formule incorrecte`,
                )
              }
            }
          }
          if (messages) {
            if (allMessages.length === 0) {
              messages.style.color = 'green'
              messages.innerHTML = 'Toutes les cellules sont correctes !'
            } else {
              messages.style.color = 'red'
              messages.innerHTML = allMessages.join('<br>')
            }
          }
        }
      }

      const listener = function () {
        const btn = document.getElementById(id) as UniverSheetElement & {
          _eventsBound?: boolean
        }
        if (btn && !btn._eventsBound) {
          btn.parentElement?.parentElement
            ?.querySelector('#runCode')
            ?.addEventListener('click', checkSolution)
          btn._eventsBound = true
        }
        document.removeEventListener('exercicesAffiches', listener) // On retire l'écouteur pour éviter les doublons
      }
      document.addEventListener('exercicesAffiches', listener)

      /****************************************************/

      if (this.questionJamaisPosee(q, texte)) {
        this.listeQuestions[q] = texte
        this.listeCorrections[q] = texteCorr
        q++
      }
      listeQuestionsToContenu(this)
    }
  }

  correctionInteractive = (i: number) => {
    if (i === undefined) return ''
    if (this.answers === undefined) this.answers = {}
    let result = 'KO'
    const id: string = `univer${this.numeroExercice}_${i}`
    const tableur = document.getElementById(id) as UniverSheetElement
    if (tableur) {
      const jsonStr = tableur.toOneSheetJson() ?? '{ empty }'
      this.answers[`univerOneSheet${id}`] = jsonStr
    }

    const spanResultat = document.querySelector(
      `#resultatCheckEx${this.numeroExercice}Q${i}`,
    )
    const divFeedback = document.querySelector<HTMLElement>(
      `#feedbackEx${this.numeroExercice}Q${i}`,
    )
    if (spanResultat) spanResultat.innerHTML = ''

    if (tableur) {
      tableur.parentElement?.parentElement
        ?.querySelector<HTMLElement>('#runCode')
        ?.click()
      const messages =
        tableur.parentElement?.parentElement?.querySelector('#message-faux')
      if (messages?.innerHTML.includes('cellules sont correctes')) {
        result = 'OK'
        if (spanResultat) spanResultat.innerHTML = '😎'
      } else {
        if (spanResultat) spanResultat.innerHTML = '☹️'
        if (divFeedback) {
          divFeedback.innerHTML =
            'Il faut utiliser des formules avec des références'
          divFeedback.style.display = 'block'
        }
      }
    }
    return result
  }
}

function transformationsOper(
  steps: {
    oldn: number
    op: number
    val: number
    result: number
  }[],
) {
  function stepsToSymbols(
    steps: {
      oldn: number
      op: number
      val: number
      result: number
    }[],
  ) {
    const mapOps: Record<number, string> = {
      1: '+',
      2: '−', // tiret long pour la soustraction
      3: '\\times',
      4: '\\div',
    }
    return steps.map((step) => (mapOps[step.op] || '?') + step.val)
  }
  return stepsToSymbols(steps)
}

/**
 * Génère une suite d'opérations arithmétiques (+, −, ×, ÷) appliquées à un nombre de départ,
 * en s’assurant que chaque opération est valide et que le résultat reste dans des limites acceptables.
 *
 * La fonction mélange aléatoirement l’ordre des opérations et choisit les opérandes de façon à ce que
 * chaque étape soit faisable (par exemple : pas de résultats négatifs, division donnant un entier, etc.).
 * Elle essaie jusqu’à 20 fois de trouver une suite valide.
 *
 * @param operations - Un tableau de nombres représentant les opérations à effectuer :
 *   1 pour addition (+), 2 pour soustraction (−), 3 pour multiplication (×), 4 pour division (÷).
 *   Par défaut : [1, 2, 3, 4].
 *
 * @returns Un objet contenant :
 *   - `ops` : L’ordre final des opérations utilisées.
 *   - `steps` : Un tableau d’objets représentant chaque étape, avec :
 *       - `oldn` : Le nombre avant l’opération.
 *       - `op` : L’opération effectuée.
 *       - `val` : L’opérande utilisée.
 *       - `result` : Le résultat après l’opération.
 *   - `final` : Le résultat final après toutes les opérations, ou `null` si échec.
 * @example
 *
 * const resultat = programmeCalcul([1, 2, 3, 4]);
 *
 *
 * {
 *   ops: [3, 1, 4, 2], // ordre : × puis + puis ÷ puis −
 *   steps: [
 *     { oldn: 5, op: 3, val: 4, result: 20 }, // 5 × 4 = 20
 *     { oldn: 20, op: 1, val: 3, result: 23 }, // 20 + 3 = 23
 *     { oldn: 23, op: 4, val: 1, result: 23 }, // 23 ÷ 1 = 23
 *     { oldn: 23, op: 2, val: 5, result: 18 }  // 23 − 5 = 18
 *   ],
 *   final: 18
 * }
 */

function programmeCalcul(operations: number[] = [1, 2, 3, 4]) {
  let steps: {
    oldn: number
    op: number
    val: number
    result: number
  }[] = []
  let final = null
  let ops: number[] = operations

  let k = 0
  let success = false
  while (!success && k < 20) {
    ops = shuffle(ops) // ordre aléatoire des opérations
    let n = randint(5, 20) // nombre de départ
    steps = [] // les étapes de calcul
    success = true
    for (let ind = 0, tt = 0; ind < ops.length && tt < 4; ) {
      if (tt > 0) {
        // tt : le nombre de tentatives
        // on change l'ordre des opérations si ça bloque
        const firstPart = ops.slice(0, ind)
        const shuffledPart = shuffle(ops.slice(ind))
        ops = [...firstPart, ...shuffledPart]
      }
      const op = ops[ind]
      const oldn = n
      let val: number = 1
      const oldval: number = ind > 0 ? steps[ind - 1].val : 1
      if (op === 1) {
        // +
        if (50 - n < 2 || (50 - n === 2 && oldval === 2)) {
          tt++
          continue
        } else {
          val = randint(2, 50 - n, [oldval])
          n += val
          ind++
          tt = 0
        }
      } else if (op === 2) {
        // -
        if (n < 2 || (n === 2 && oldval === 2)) {
          tt++
          continue
        } else {
          val = randint(2, n, [oldval])
          n -= val
          ind++
          tt = 0
        }
      } else if (op === 3) {
        // ×
        const maxMult = n < 1 ? 5 : Math.floor(50 / n)
        if (maxMult < 2 || (maxMult === 2 && oldval === 2)) {
          tt++
          continue
        } else {
          val = randint(2, maxMult, [oldval])
          n *= val
          ind++
          tt = 0
        }
      } else if (op === 4) {
        // ÷
        const divs = listeDesDiviseurs(n).filter((d) => d > 1 && d < n)
        if (divs.length === 0 || (divs.length === 1 && divs[0] === oldval)) {
          tt++
          continue
        } else {
          val = choice<number>(divs, [oldval])
          n /= val
          ind++
          tt = 0
        }
      }

      // sécurité bornes
      if (n < 0 || n > 50 || !Number.isInteger(n)) {
        tt += 10 // on devrait jamais être ici! donc on sort
        continue
      }
      steps.push({ oldn, op, val, result: n })
    }
    if (steps.length !== ops.length) {
      success = false
    }
    if (success) final = n
    k++
  }

  return { ops, steps, final }
}

function createDigramm(
  nbre: number,
  rects: Record<string, { bg?: string; v?: string }>,
) {
  const longueur = 1.8
  const largeur = 1.5
  const gap = 0.8
  const objets = []
  for (let i = 0; i < nbre; i++) {
    const A = point(i * longueur + i * gap, 0)
    const B = point(A.x + longueur, 0)
    const C = point(B.x, largeur)
    const D = point(A.x, largeur)
    const rect = rects[i]
    const rectangle = polygone(A, B, C, D)
    if (rect && rect.bg) {
      rectangle.couleurDeRemplissage = colorToLatexOrHTML(rect.bg)
      rectangle.opaciteDeRemplissage = 1
    }
    objets.push(rectangle)
    if (rect && rect.v) {
      const tex = latex2d(`${rect.v}`, (A.x + B.x) / 2, (A.y + D.y) / 2, {
        color: 'red',
        backgroundColor: 'none',
        letterSize: context.isHtml ? 'small' : 'normalsize',
        orientation: 0,
        opacity: 1,
      })
      objets.push(tex)
    }
    if (i > 0) {
      const seg = segment(A.x - gap, largeur / 2, A.x, largeur / 2, '#f15929')
      seg.styleExtremites = '->'
      objets.push(seg)
    }
  }
  const xmin = -0.5
  const ymin = -0.5
  const xmax = +longueur * nbre + gap * (nbre - 1) + 0.5
  const ymax = largeur + 0.5
  return mathalea2d(
    {
      xmin,
      ymin,
      xmax,
      ymax,
      mainlevee: false,
      scale: context.isHtml ? 1 : 0.5,
      style: 'margin: auto',
      optionsTikz: ['baseline=(current bounding box.north)'],
    },
    objets,
  )
}

function createTableurLatex(
  rowNbr: number,
  colNbr: number,
  data: CellSheetData,
  styles: StyleSheets,
  options: {
    formule?: boolean
    formuleTexte?: string
    formuleCellule?: string
    firstColHeaderWidth?: string
  } = {},
) {
  let output = `\\begin{tabularx}{0.9\\linewidth}
  {|>{\\cellcolor{lightgray}}c|
  ${options.firstColHeaderWidth ? `>{\\centering \\arraybackslash}p{${options.firstColHeaderWidth}}|` : '>{\\centering \\arraybackslash}X|'}
  *{${colNbr - 1}}{>{\\centering \\arraybackslash}X|}}\\hline\n`

  if (options.formule) {
    output += `\\multicolumn{1}{|l}{${options.formuleCellule}}&\\multicolumn{1}{r|}{▼}&\\multicolumn{${colNbr - 1}}{l|}{${options.formuleTexte}}\\\\ \\hline\n`
  }
  // en-tête
  output += '\\rowcolor{lightgray} &'
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let colIndex = 0; colIndex < colNbr - 1; colIndex++) {
    output += `\\textbf{\\sffamily ${alphabet[colIndex]}}  & `
  }
  output += `\\textbf{\\sffamily ${alphabet[colNbr - 1]}} \\\\ \\hline\n`

  for (let rowIndex = 0; rowIndex < rowNbr; rowIndex++) {
    const rowData = data[rowIndex] || {}
    output += `\\textbf{\\sffamily ${rowIndex + 1}} &`
    for (let colIndex = 0; colIndex < colNbr; colIndex++) {
      const cell = rowData[colIndex] || {}
      const styleCell = styles[cell.s ?? ''] || {}
      let color = ''
      if (styleCell.bg?.startsWith('#')) {
        color = `\\cellcolor[HTML]{${styleCell.bg.replace('#', '')}}`
      } else if (styleCell.bg) {
        color = `\\cellcolor{${styleCell.bg}}`
      }
      if (cell?.t === 1) {
        // texte
        output += `\\raggedright ${color} ${cell.v || ''}  &`
      } else if (cell?.t === 2) {
        // number
        output += `\\raggedleft ${color} ${cell.v || ''}  &`
      } else if (cell?.t === 3) {
        // boolean
        output += `\\centering ${color} ${cell.v ? 'VRAI' : 'FAUX'}  &`
      } else {
        output += `${color} ${cell.v || ''}  &`
      }
    }
    output = output.slice(0, -1) // enlever le dernier &
    output += '\\\\ \\hline\n'
  }
  output += '\\end{tabularx}\n'
  return output
}
