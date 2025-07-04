import { ObjetMathalea2D, colorToLatexOrHTML } from '../../modules/2dGeneralites'
import { point } from '../2d/points'
import { polygone } from '../2d/polygones'

/**
 * @author Erwan Duplessis et Jean-Claude Lhote
 * Attention !
 * Cette Classe définit un objet cube dans une représentation en perspective axonométrique paramétrée par alpha et beta
 * et non pas context.anglePerspective (contrairement à l'objet cube3d ci-dessus ou l'objet pave3d ci-dessous)
 * Il ne s'agit pas à proprement parler d'un objet 3d, c'est un objet 2d avec sa méthode svg() et sa méthode tikz()
 * Utilisée par exemple dans 6G43
 */

export class Cube extends ObjetMathalea2D {
  constructor (x: number, y: number, z: number, alpha: number, beta: number, colorD: string, colorT: string, colorG: string) {
    super()
    this.x = x
    this.y = y
    this.z = z
    this.alpha = alpha
    this.beta = beta
    this.colorD = colorToLatexOrHTML(colorD)
    this.colorG = colorToLatexOrHTML(colorG)
    this.colorT = colorToLatexOrHTML(colorT)

    this.lstPoints = []
    this.lstPolygone = []

    function proj (x: number, y: number, z: number, alpha: number, beta: number) {
      const cosa = Math.cos(alpha * Math.PI / 180)
      const sina = Math.sin(alpha * Math.PI / 180)
      const cosb = Math.cos(beta * Math.PI / 180)
      const sinb = Math.sin(beta * Math.PI / 180)
      return point(cosa * x - sina * y, -sina * sinb * x - cosa * sinb * y + cosb * z)
    }

    this.lstPoints.push(proj(this.x, this.y, this.z, this.alpha, this.beta)) // point 0 en bas
    this.lstPoints.push(proj(this.x + 1, this.y, this.z, this.alpha, this.beta)) // point 1
    this.lstPoints.push(proj(this.x + 1, this.y, this.z + 1, this.alpha, this.beta)) // point 2
    this.lstPoints.push(proj(this.x, this.y, this.z + 1, this.alpha, this.beta)) // point 3
    this.lstPoints.push(proj(this.x + 1, this.y + 1, this.z + 1, this.alpha, this.beta)) // point 4
    this.lstPoints.push(proj(this.x, this.y + 1, this.z + 1, this.alpha, this.beta)) // point 5
    this.lstPoints.push(proj(this.x, this.y + 1, this.z, this.alpha, this.beta)) // point 6
    let p
    p = polygone([this.lstPoints[0], this.lstPoints[1], this.lstPoints[2], this.lstPoints[3]], 'black')
    p.opaciteDeRemplissage = 1
    p.couleurDeRemplissage = this.colorD
    this.lstPolygone.push(p)
    p = polygone([this.lstPoints[2], this.lstPoints[4], this.lstPoints[5], this.lstPoints[3]], 'black')
    p.couleurDeRemplissage = this.colorG
    p.opaciteDeRemplissage = 1
    this.lstPolygone.push(p)
    p = polygone([this.lstPoints[3], this.lstPoints[5], this.lstPoints[6], this.lstPoints[0]], 'black')
    p.couleurDeRemplissage = this.colorT
    p.opaciteDeRemplissage = 1
    this.lstPolygone.push(p)
    this.c2d = this.lstPolygone
  }
}

export function cube (x = 0, y = 0, z = 0, alpha = 45, beta = -35, {
  colorD = 'green', colorT = 'white', colorG = 'gray'
} = {}) {
  return new Cube(x, y, z, alpha, beta, colorD, colorG, colorT)
}
