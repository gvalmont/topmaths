import { context } from '../../modules/context'
import './ShemasEnBoite.css'
import { texNombre } from './texNombre'

type AccoladeType = {
  start: number, // colonne de début (1 = première colonne)
  end: number, // colonne de fin = start + longueur de l'accolade
  text: string
}
type BarreSchemaType = {
  color: string
  length: number
  content: string
}
type LigneSchemaType = BarreSchemaType[]
type LigneAccoladeType = AccoladeType[]
export default class SchemaEnBoite {
  topBraces?: LigneAccoladeType
  bottomBraces?: LigneAccoladeType
  topBar: LigneSchemaType
  bottomBar: LigneSchemaType

  constructor ({ topBar, bottomBar, bottomBraces, topBraces }: { topBar: LigneSchemaType, bottomBar: LigneSchemaType, bottomBraces?: LigneAccoladeType, topBraces?: LigneAccoladeType } = { topBar: [], bottomBar: [] }) {
    this.topBar = topBar
    this.bottomBar = bottomBar
    if (bottomBraces) {
      this.bottomBraces = bottomBraces
    }
    if (topBraces) {
      this.topBraces = topBraces
    }
  }

  concat (boite: SchemaEnBoite): SchemaEnBoite {
    return new SchemaEnBoite({ topBar: this.topBar.concat(boite.topBar) ?? [], bottomBar: this.bottomBar.concat(boite.bottomBar) ?? [], bottomBraces: this.bottomBraces?.concat(boite.bottomBraces ?? []) ?? [], topBraces: this.topBraces?.concat(boite.topBraces ?? []) ?? [] })
  }

  display (): string {
    if (context.isHtml) {
      let ligneAccoladeH = ''
      if (this.topBraces) {
        for (let k = 0; k < this.topBraces.length; k++) {
          const accolade = this.topBraces[k]
          const start = accolade.start
          const end = accolade.end
          const texte = accolade.text
          if (start != null && end != null && texte != null) {
            ligneAccoladeH +=
            `<div class="SchemaTop" style="grid-row: 1; grid-column-start: ${start}; grid-column-end: ${end}; text-align:center; border: none">
            <div class="latexAccoladeTop">${texte}</div>
            <div class="braceTop">
              <div class="braceTopLeft">
                <div class="curlTopLeftLeft"></div>
                <div class="lineTopLeftMiddle"></div>
                <div class="curlTopLeftRight"></div>
              </div>
              <div class="braceTopRight">
                  <div class="curlTopRightLeft"></div>
                  <div class="lineTopRightMiddle"></div>
                  <div class="curlTopRightRight"></div>
              </div>
            </div>
            </div>\n`
          }
        }
      }
      let ligne1 = ''
      let start = 1
      for (let k = 0; k < this.topBar.length; k++) {
        ligne1 += `<div class="SchemaItem" style="grid-row: 2; grid-column-start: ${start}; grid-column-end: ${start + this.topBar[k].length}; background-color:${this.topBar[k].color}; text-align:center; ${k > 0 ? ' border-left: none;' : ''}">${this.topBar[k].content}</div>\n`
        start += this.topBar[k].length
      }
      let ligne2 = ''
      start = 1
      for (let k = 0; k < this.bottomBar.length; k++) {
        ligne2 += `<div class="SchemaItem" style="grid-row: 3; grid-column-start: ${start}; grid-column-end: ${start + this.bottomBar[k].length}; background-color:${this.bottomBar[k].color}; text-align:center; ${k > 0 ? ' border-left: none;' : ''}">${this.bottomBar[k].content}</div>\n`
        start += this.bottomBar[k].length
      }
      let ligneAccoladeB = ''
      if (this.bottomBraces) {
        for (let k = 0; k < this.bottomBraces.length; k++) {
          const brace = this.bottomBraces[k]
          const start = brace.start
          const end = brace.end
          const texte = brace.text
          if (start != null && end != null && texte != null) {
            ligneAccoladeB +=
            `<div class="SchemaBottom" style="grid-row: 4; grid-column-start: ${start}; grid-column-end: ${end}; text-align:center; border: none;">
            <div class="braceBottom">
              <div class="braceBottomLeft">
                <div class="curlBottomLeftLeft"></div>
                <div class="lineBottomLeftMiddle"></div>
                <div class="curlBottomLeftRight"></div>
              </div>
              <div class="braceBottomRight">
                  <div class="curlBottomRightLeft"></div>
                  <div class="lineBottomRightMiddle"></div>
                  <div class="curlBottomRightRight"></div>
              </div>
            </div>
             <div class="latexAccoladeBottom">${texte}</div>
            </div>\n`
          }
        }
      }
      return `<div class="SchemaContainer">${ligneAccoladeH}\n${ligne1}\n${ligne2}\n${ligneAccoladeB}</div>`
    } else { // latex
      let latex = '\\begin{tikzpicture}\n'
      if (this.topBraces) {
        for (let k = 0; k < this.topBraces.length; k++) {
          const brace = this.topBraces[k]
          const start = (brace.start - 1) / 2
          const end = (brace.end - 1) / 2
          const texte = brace.text
          if (start != null && end != null && texte != null) {
            latex += `\\draw[decorate,decoration={brace,amplitude=10pt},xshift=0pt,yshift=0pt] (${start},3) -- node[above=10pt] {${texte}} (${end},3);\n`
          }
        }
      }
      let start = 0
      for (let k = 0; k < this.topBar.length; k++) {
        const barre = this.topBar[k]
        const end = start + barre.length / 2
        latex += `\\draw[fill=${barre.color}] (${start},3) rectangle (${end},2) node[pos=.5] {${barre.content}};\n`
        start += barre.length / 2
      }
      start = 0
      for (let k = 0; k < this.bottomBar.length; k++) {
        const barre = this.bottomBar[k]
        const end = start + barre.length / 2
        latex += `\\draw[fill=${barre.color}] (${start},2) rectangle (${end},1) node[pos=.5] {${barre.content}};\n`
        start += barre.length / 2
      }
      if (this.bottomBraces) {
        for (let k = 0; k < this.bottomBraces.length; k++) {
          const brace = this.bottomBraces[k]
          const start = (brace.start - 1) / 2
          const end = (brace.end - 1) / 2
          const texte = brace.text
          if (start != null && end != null && texte != null) {
            latex += `\\draw[decorate,decoration={brace,mirror,amplitude=10pt},xshift=0pt,yshift=0pt] (${start},1) -- node[below=10pt] {${texte}} (${end},1);\n`
          }
        }
      }
      latex += '\\end{tikzpicture}'
      return latex
    }
  }

  /**
   *
   * @param nb1 Le premier facteur (celui de la ligne du haut)
   * @param nb2 Le deuxième facteur (celui de l'accolade)
   * @param precision Le nombre de décimales
   * @returns
   */
  static multiplication (nb1: number, nb2: number, precision: number): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBraces: [
        {
          start: 1,
          end: 8 + precision * 2,
          text: `$${nb2}$ fois`,
        }
      ], /* // Pour les test d'ajustement css (J-C)
      bottomBraces: [
        {
          start: 1,
          end: 8 + precision * 2,
          text: 'produit',
        }
      ], */
      topBar: [
        {
          length: 1 + precision,
          color: 'white',
          content: `${nb1}`,
        },
        {
          length: 5,
          color: 'white',
          content: '\\ldots',
        },
        {
          length: 1 + precision,
          color: 'white',
          content: `${nb1}`,
        }
      ],
      bottomBar: [
        {
          length: 7 + precision * 2,
          color: 'white',
          content: '?' // `${nb1 * nb2}`,
        }
      ]
    })
    return seb
  }

  /**
 *
 * @param dividende Le dividende (écrit dans la case du dessous)
 * @param nbFois Le diviseur (nombre entier de fois écrit sur l'accolade)
 * @param diviseur Le diviseur (écrit dans les cases du dessus)
 * @param precision nombre de chiffres après la virgule du dividende et du diviseur
 * @returns
 */
  static division (dividende: number | undefined, nbFois: number | undefined, diviseur: number | undefined, precision: number): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBraces: [
        {
          start: 1,
          end: 8 + 2 * precision,
          text: nbFois == null ? '? fois' : `${texNombre(nbFois, 0)} fois`,
        }
      ],
      topBar: [
        { color: 'lightgray', length: 2 + precision, content: diviseur == null ? '?' : `$${texNombre(diviseur, precision)}$` },
        { color: 'lightgray', length: 3, content: '\\ldots' },
        { color: 'lightgray', length: 2 + precision, content: diviseur == null ? '?' : `$${texNombre(diviseur, precision)}$` },
      ],
      bottomBar: [
        { color: 'white', length: 7 + 2 * precision, content: dividende == null ? '?' : `$${texNombre(dividende, precision)}$` },
      ]
    })
    return seb
  }

  /**
   *
   * @param nb1 diviseur (est écrit dans les cases du dessus)
   * @param nb2 dividende (est écrit dans la case du dessous, mettre undefined pour avoir un ?)
   * @param nbFois Le nombre de fois écrit sur l'accolade (un string qui peut être égal à '?')
   * @param reste Le reste de la division (un string qui peut être égal à '?')
   * @param precision
   * @returns
   */
  static divisionAvecReste (nb1: number | undefined, nb2: number | undefined, nbFois: number | undefined, precision: number, reste?: string): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBraces: [
        {
          start: 1,
          end: 8 + 2 * precision,
          text: nbFois == null ? '? fois' : `$${nbFois}$ fois`,
        }
      ],
      topBar: [
        { color: 'lightgray', length: 2 + precision, content: nb1 == null ? '?' : `$${texNombre(nb1, precision)}$` },
        { color: 'lightgray', length: 3, content: '\\ldots' },
        { color: 'lightgray', length: 2 + precision, content: nb1 == null ? '?' : `$${texNombre(nb1, precision)}$` },
        { color: 'lightgray', length: 2, content: reste ?? '?' }
      ],
      bottomBar: [
        { color: 'white', length: 9 + 2 * precision, content: nb2 == null ? '?' : `$${texNombre(nb2, precision)}$` },
      ]
    })
    return seb
  }

  /**
 *
 * @param nb1 Le diviseur (écrit dans la case du dessus
 * @param nb2 Le dividende (écrit dans la case du dessous peut être unedfined pour avoir un ?)
 * @param nb3 Le nombre de fois écrit sur l'accolade (un
 * @param precision
 * @param reste
 * @returns
 */
  divisionPartitionAvecReste (nb1: number | undefined, nb2: number | undefined, nb3: number | undefined, precision: number, reste?: string): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBraces: [
        {
          start: 1,
          end: 8 + 2 * precision,
          text: nb3 == null ? '?' : `${texNombre(nb3, 0)} fois`,
        }
      ],
      topBar: [
        { color: 'lightgray', length: 2 + precision, content: nb1 == null ? '?' : `$${texNombre(nb1, precision)}$` },
        { color: 'lightgray', length: 3, content: '\\ldots' },
        { color: 'lightgray', length: 2 + precision, content: nb1 == null ? '?' : `$${texNombre(nb1, precision)}$` },
        { color: 'lightgray', length: 2, content: reste ?? '?' }
      ],
      bottomBar: [
        { color: 'white', length: 9 + 2 * precision, content: nb2 == null ? '?' : `$${texNombre(nb2, precision)}$` },
      ]
    })
    return seb
  }

  static addition (nb1: number, nb2: number, precision: number): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBar: [
        { color: 'lightgray', length: 2 + precision, content: `$${texNombre(nb1, precision)}$` },
        { color: 'lightgray', length: 2 + precision, content: `$${texNombre(nb2, precision)}$` },
      ],
      bottomBar: [
        { color: 'white', length: 4 + precision * 2, content: '?' },
      ]
    })
    return seb
  }

  static soustraction (terme1: number | undefined, difference: number | undefined, terme2: number | undefined, precision: number): SchemaEnBoite {
    const seb = new SchemaEnBoite({
      topBar: [
        { color: 'lightgray', length: 2 + precision, content: terme2 == null ? '?' : `$${texNombre(terme2, precision)}$` },
        { color: 'lightgray', length: 2 + precision, content: difference == null ? '?' : `$${texNombre(difference, precision)}$` },
      ],
      bottomBar: [
        { color: 'white', length: 4 + precision * 2, content: terme1 == null ? '?' : `$${texNombre(terme1, precision)}$` },
      ]
    })
    return seb
  }
}
