import { colorToLatexOrHTML } from './colorToLatexOrHtml'
import { xSVG, ySVG } from './courbes'
import { ObjetMathalea2D } from './ObjetMathalea2D'

export class BezierPath extends ObjetMathalea2D {
  xStart: number
  yStart: number
  listeOfTriplets: [number, number][][]
  constructor({
    xStart = 0,
    yStart = 0,
    listeOfTriplets = [
      [
        [1, 1],
        [-1, -1],
        [1, 1],
      ],
    ] as [number, number][][],
    color = 'black',
    epaisseur = 2,
    opacite = 1,
  }) {
    super()
    this.color = colorToLatexOrHTML(color)
    this.opacite = opacite
    this.epaisseur = epaisseur
    this.xStart = xStart
    this.yStart = yStart
    this.listeOfTriplets = listeOfTriplets
  }

  svg(coeff: number) {
    //
    let path = `<path fill="none" stroke="${this.color[0]}" stroke-width=${this.epaisseur} d="M${xSVG(this.xStart, coeff)},${ySVG(this.yStart, coeff)} c`
    for (const triplet of this.listeOfTriplets) {
      path += `${xSVG(triplet[0][0], coeff)},${ySVG(triplet[0][1], coeff)} ${xSVG(triplet[1][0], coeff)},${ySVG(triplet[1][1], coeff)} ${xSVG(triplet[2][0], coeff)},${ySVG(triplet[2][1], coeff)} `
    }
    path += '" />\n'
    return path
  }

  tikz() {
    let path = `\n\t\\draw[color = ${this.color[1]},line width = ${this.epaisseur}, opacity = ${this.opacite}](${this.xStart},${this.yStart})`
    // Pour tikz, les coordonnées du point initial et final doivent être en coordonnées absolues, seules les points de contrôles peuvent-être en relatif à leur noeud respectif
    let x0 = this.xStart
    let y0 = this.yStart
    for (const triplet of this.listeOfTriplets) {
      const x3 = x0 + triplet[2][0]
      const y3 = y0 + triplet[2][1]
      const dX2X3 = triplet[1][0] - triplet[2][0] // tikz prend comme origine le point final pour calculer les coordonnées relatives du point de contrôle 2 !
      const dY2Y3 = triplet[1][1] - triplet[2][1]
      path += ` .. controls +(${triplet[0][0].toFixed(2)},${triplet[0][1].toFixed(2)}) and +(${dX2X3.toFixed(2)},${dY2Y3.toFixed(2)})  .. (${x3.toFixed(2)},${y3.toFixed(2)})\n`
      x0 = x3 // Le nouveau point de départ est le point d'arrivée du tronçon précédent !
      y0 = y3
    }
    path += ';\n'
    return path
  }
}
