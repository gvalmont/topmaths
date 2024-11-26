import { context } from '../../modules/context'

type BarreSchemaType = {
    color: string
    longueur: number
    content: string
}
type LigneSchemaType = BarreSchemaType[]
export default class SchemaEnBoite {
  haut: LigneSchemaType
  bas: LigneSchemaType

  constructor ({ haut, bas }: { haut: LigneSchemaType, bas: LigneSchemaType } = { haut: [], bas: [] }) {
    this.haut = haut
    this.bas = bas
  }

  concat (boite: SchemaEnBoite): SchemaEnBoite {
    return new SchemaEnBoite({ haut: this.haut.concat(boite.haut) ?? [], bas: this.bas.concat(boite.bas) ?? [] })
  }

  display (): string {
    if (context.isHtml) {
      let ligne1 = ''
      let start = 1
      for (let k = 0; k < this.haut.length; k++) {
        ligne1 += `<div class="SchemaItem" style="grid-row: 1; grid-column-start: ${start}; grid-column-end: ${start + this.haut[k].longueur}; background-color:${this.haut[k].color}; text-align:center;">${this.haut[k].content}</div>\n`
        start += this.haut[k].longueur
      }
      let ligne2 = ''
      start = 1
      for (let k = 0; k < this.bas.length; k++) {
        ligne2 += `<div class="SchemaItem" style="grid-row: 2; grid-column-start: ${start}; grid-column-end: ${start + this.bas[k].longueur}; background-color:${this.bas[k].color}; text-align:center;">${this.bas[k].content}</div>\n`
        start += this.bas[k].longueur
      }
      return `<div class="SchemaContainer">${ligne1}\n${ligne2}</div>`
    } else {
      const ligne1 = this.haut.map(barre => `${barre.color} ${barre.longueur} "${barre.content}"`).join(' ') ?? ''
      const ligne2 = this.bas.map(barre => `${barre.color} ${barre.longueur} "${barre.content}"`).join(' ') ?? ''
      return `\\ModeleBarre{${ligne1}}{${ligne2}}`
    }
  }
}
