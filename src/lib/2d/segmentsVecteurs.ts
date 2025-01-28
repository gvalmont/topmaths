import { colorToLatexOrHTML, fixeBordures, ObjetMathalea2D } from '../../modules/2dGeneralites'
import { context } from '../../modules/context'
import FractionEtendue from '../../modules/FractionEtendue'
import { arrondi } from '../outils/nombres'
import { angleOriente } from './angles'
import { Cercle } from './cercle'
import { Droite, droite } from './droites'
import { milieu, Point, point, pointIntersectionDD, pointIntersectionLC, pointSurSegment } from './points'
import { latex2d, texteParPosition } from './textes'
import { rotation, similitude, translation } from './transformations'
import MainLevee from './MainLevee'

/**
 * v = vecteur('V') // son nom
 * v = vecteur(x,y) // ses composantes
 * v = vecteur(A,B) // son origine et son extrémité (deux Points)
 * v = vecteur(x,y,'v') // son nom et ses composantes.
 * v.representant(E,'blue') // Dessine le vecteur v issu de E, en bleu.
 * Commenter toutes les méthodes possibles
 * @author Jean-Claude Lhote et Rémi Angot
 */
export class Vecteur {
  nom: string
  x: number
  y: number

  constructor (arg1: FractionEtendue | number | Point | string, arg2: FractionEtendue | number | Point, nom = '') {
    if (arguments.length === 1) {
      this.nom = String(arg1)
      this.x = 0
      this.y = 0
    } else {
      if (typeof arg1 === 'number' || arg1 instanceof FractionEtendue) {
        this.x = arg1 instanceof FractionEtendue ? arg1.valeurDecimale : arg1 as number
        this.y = arg2 instanceof FractionEtendue ? arg2.valeurDecimale : arg2 as number
      } else {
        this.x = (arg2 as Point).x - (arg1 as Point).x
        this.y = (arg2 as Point).y - (arg1 as Point).y
      }
      this.nom = nom
    }
  }

  norme () {
    return Math.sqrt(this.x ** 2 + this.y ** 2)
  }

  oppose () {
    this.x = -this.x
    this.y = -this.y
  }

  xSVG (coeff: number) {
    return this.x * coeff
  }

  ySVG (coeff: number) {
    return -this.y * coeff
  }

  representant (A: Point, color = 'black') {
    const B = point(A.x + this.x, A.y + this.y)
    const s = segment(A, B, color, '->')
    s.tailleExtremites = 5
    return s
  }

  representantNomme (A: Point, nom: string, taille = 1, color = 'black') {
    let s
    let v
    const B = point(A.x + this.x, A.y + this.y)
    const M = milieu(A, B)
    s = segment(A, B, color)
    const angle = s.angleAvecHorizontale
    v = similitude(this, A, 90, 0.5 / this.norme())
    if (Math.abs(angle) > 90) {
      s = segment(B, A, color)
      // angle = s.angleAvecHorizontale
      v = similitude(this, A, -90, 0.5 / this.norme())
    }
    const N = translation(M, v)
    return nomVecteurParPosition(nom, N.x, N.y, taille, 0, color)
  }
}

/**
 * @example v = vecteur('V') // son nom
 * @example v = vecteur(x,y) // ses composantes
 * @example v = vecteur(A,B) // son origine et son extrémité (deux Points)
 * @example v = vecteur(x,y,'v') // son nom et ses composantes.
 * @author Jean-Claude Lhote et Rémi Angot
 */
export function vecteur (arg1: FractionEtendue | number | Point | string, arg2: FractionEtendue | number | Point, nom = '') {
  return new Vecteur(arg1, arg2, nom)
}

/**
 * @author Jean-Claude Lhote le 31/01/2021
 * crée un nom de vecteur avec sa petite flèche
 * l'angle formé par avec l'horizontale est à donner comme argument, par défaut c'est 0
 * la taille impactera le nom et la flèche en proportion.
 * (x,y) sont les coordonnées du centre du nom.
 */
export class NomVecteurParPosition extends ObjetMathalea2D {
  nom: string
  x: number
  y: number
  angle: number
  taille: number
  constructor (nom: string, x: number, y: number, taille = 1, angle = 0, color = 'black') {
    super()
    this.nom = nom
    this.x = x
    this.y = y
    this.color = colorToLatexOrHTML(color)
    this.angle = angle
    this.taille = taille
    // @todo créer deux objets : vecteurI et vecteurJ pour ça.
    // if (this.nom === 'i') return latex2d('\\vec \\imath', this.x, this.y, { color })
    // if (this.nom === 'j') return latex2d('\\vec \\jmath', this.x, this.y, { color })

    const t = texteParPosition(this.nom, this.x, this.y, -this.angle, color, this.taille, 'milieu', true)
    const M = point(this.x, this.y)
    const P = point(M.x + 0.25 * this.nom.length, M.y)
    const M0 = similitude(P, M, 90 + this.angle, 1.5)
    const M1 = rotation(translation(M0, vecteur(P, M)), M0, this.angle)
    const M2 = similitude(M1, M0, 180, 1.5)
    const s = segment(M1, M2, color)
    s.styleExtremites = '->'
    s.tailleExtremites = 3
    this.objets = [t, s]
    const bordures = fixeBordures(this.objets, { rxmin: 0, rxmax: 0, rymin: 0, rymax: 0 })
    this.bordures = [bordures.xmin, bordures.ymin, bordures.xmax, bordures.ymax]
  }

  svg (coeff: number) {
    let code = ''
    if (this.objets == null) return code
    for (const objet of this.objets) {
      code += '\n\t' + objet.svg(coeff)
    }
    return code
  }

  tikz () {
    let code = ''
    if (this.objets == null) return code
    for (const objet of this.objets) {
      code += '\n\t' + objet.tikz()
    }
    return code
  }
}

export function nomVecteurParPosition (nom: string, x: number, y: number, taille = 1, angle = 0, color = 'black') {
  // Katex ne reconnais pas \\vec qui est une commande définie ailleurs.
  if (nom === 'i') return latex2d('\\vec{\\imath}', x, y, { color })
  if (nom === 'j') return latex2d('\\vec{\\jmath}', x, y, { color })
  return new NomVecteurParPosition(nom, x, y, taille, angle, color)
}

/**
 * s = segment(A, B) //Segment d'extrémités A et B
 * s = segment(A,B,'blue') //Segment d'extrémités A et B et de couleur bleue
 * s = segment(x1,y1,x2,y2) //Segment défini par les coordonnées des deux extrémités
 * s = segment(x1,y1,x2,y2,'blue') //Segment défini par les coordonnées des deux extrémités et de couleur bleue
 * @class
 * @author Rémi Angot
 */
export class Segment extends ObjetMathalea2D {
  tailleExtremites: number
  styleExtremites: string
  angleAvecHorizontale: number
  x1: number
  y1: number
  x2: number
  y2: number
  extremite1: Point
  extremite2: Point
  longueur: number
  constructor (arg1: number | Point, arg2: number | Point, arg3?: number | string, arg4?: number | string, color?: string, styleExtremites = '') {
    super()
    this.bordures = [0, 0, 0, 0]
    this.typeObjet = 'segment'
    this.styleExtremites = styleExtremites
    this.tailleExtremites = 4
    if (arguments.length === 2) {
      if (isNaN((arg1 as Point).x) || isNaN((arg1 as Point).y) || isNaN((arg2 as Point).x) || isNaN((arg2 as Point).y)) {
        window.notify('Segment : (attendus : A et B) les arguments de sont pas des points valides', {
          arg1,
          arg2
        })
      }
      this.x1 = (arg1 as Point).x
      this.y1 = (arg1 as Point).y
      this.x2 = (arg2 as Point).x
      this.y2 = (arg2 as Point).y
    } else if (arguments.length === 3) {
      if (Number.isNaN((arg1 as Point).x) || Number.isNaN((arg1 as Point).y) || Number.isNaN((arg2 as Point).x) || Number.isNaN((arg2 as Point).y)) {
        window.notify('Segment : (attendus : A, B et "couleur") les arguments de sont pas des points valides', {
          arg1,
          arg2
        })
      }
      this.x1 = (arg1 as Point).x
      this.y1 = (arg1 as Point).y
      this.x2 = (arg2 as Point).x
      this.y2 = (arg2 as Point).y
      this.color = colorToLatexOrHTML(arg3 as string)
    } else if (arguments.length === 4) {
      if (typeof arg3 !== 'number') {
        this.x1 = (arg1 as Point).x
        this.y1 = (arg1 as Point).y
        this.x2 = (arg2 as Point).x
        this.y2 = (arg2 as Point).y
        this.color = colorToLatexOrHTML(String(arg3))
        this.styleExtremites = String(arg4)
      } else {
        if (Number.isNaN(arg1) || Number.isNaN(arg2) || Number.isNaN(arg3) || Number.isNaN(arg4)) {
          window.notify('Segment : (attendus : x1, y1, x2 et y2) les arguments de sont pas des nombres valides', {
            arg1,
            arg2
          })
        }
        this.x1 = Number(arg1)
        this.y1 = Number(arg2)
        this.x2 = Number(arg3)
        this.y2 = Number(arg4)
      }
    } else {
      // Au moins 5 arguments
      if (Number.isNaN(arg1) || Number.isNaN(arg2) || Number.isNaN(arg3) || Number.isNaN(arg4)) {
        window.notify('Segment : (attendus : x1, y1, x2, y2 et "couleur") les arguments de sont pas des nombres valides', {
          arg1,
          arg2
        })
      }
      this.x1 = Number(arg1)
      this.y1 = Number(arg2)
      this.x2 = Number(arg3)
      this.y2 = Number(arg4)
      this.color = colorToLatexOrHTML(String(color))
      this.styleExtremites = styleExtremites
    }

    this.x1 = arrondi(this.x1, 2)
    this.y1 = arrondi(this.y1, 2)
    this.x2 = arrondi(this.x2, 2)
    this.y2 = arrondi(this.y2, 2)

    this.epaisseur = 1
    this.opacite = 1
    this.pointilles = 0

    this.bordures = [Number(Math.min(this.x1, this.x2)),
      Number(Math.min(this.y1, this.y2)),
      Number(Math.max(this.x1, this.x2)),
      Number(Math.max(this.y1, this.y2))]
    this.extremite1 = point(this.x1, this.y1)
    this.extremite2 = point(this.x2, this.y2)
    this.longueur = Math.sqrt((this.x2 - this.x1) ** 2 + (this.y2 - this.y1) ** 2)
    // utiliser les fonctions de calcul d'angle avec un segment de longueur nulle est une erreur ! Je blinde en retournant un angle nul
    this.angleAvecHorizontale = this.longueur < 1e-8
      ? 0
      : angleOriente(
        point(this.x1 + 1, this.y1),
        this.extremite1,
        this.extremite2,
        5
      )
  }

  svg (coeff: number) {
    if (this.epaisseur !== 1) {
      this.style += ` stroke-width="${this.epaisseur}" `
    }
    switch (this.pointilles) {
      case 1:
        this.style += ' stroke-dasharray="6 10" '
        break
      case 2:
        this.style += ' stroke-dasharray="6 3" '
        break
      case 3:
        this.style += ' stroke-dasharray="3 2 6 2 " '
        break
      case 4:
        this.style += ' stroke-dasharray="1 2" '
        break
      case 5:
        this.style += ' stroke-dasharray="5 5" '
        break
    }

    if (this.opacite !== 1) {
      this.style += ` stroke-opacity="${this.opacite}" `
    }
    let code = this.codeExtremitesSVG(coeff)
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)

    code += `\n\t<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(coeff)}" x2="${B.xSVG(
      coeff
    )}" y2="${B.ySVG(coeff)}" stroke="${this.color[0]}" ${this.style} />`

    if (this.styleExtremites.length > 0) {
      code = `<g id="${this.id}">${code}</g>`
    } else {
      code = code.replace('/>', `id="${this.id}" />`)
    }

    return code
  }

  tikz () {
    let optionsDraw = ''
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color =${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }
    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }
    switch (this.pointilles) {
      case 1:
        tableauOptions.push(' dash dot ')
        break
      case 2:
        tableauOptions.push(' densely dash dot dot ')
        break
      case 3:
        tableauOptions.push(' dash dot dot ')
        break

      case 4:
        tableauOptions.push(' dotted ')
        break
      case 5:
        tableauOptions.push(' dashed ')
        break
    }

    if (this.styleExtremites.length > 1) {
      if (this.styleExtremites === '->') {
        tableauOptions.push('>=latex,->')
      } else {
        if (this.styleExtremites.includes('[') || this.styleExtremites.includes(']')) {
          tableauOptions.push('{' + this.styleExtremites + '}')
        } else {
          tableauOptions.push(this.styleExtremites)
        }
      }
    }
    if (tableauOptions.length > 0) {
      optionsDraw = '[' + tableauOptions.join(',') + ']'
    }
    return `\\draw${optionsDraw} (${this.x1},${this.y1})--(${this.x2},${this.y2});`
  }

  svgml (coeff: number, amplitude: number) {
    const mainLevee = MainLevee.create() // mainLevee permet d'accéder aux méthodes pour créer les objets roughjs
    if (mainLevee != null) {
      const A = point(this.x1, this.y1)
      const B = point(this.x2, this.y2)
      let code = this.codeExtremitesSVG(coeff)
      code += mainLevee.line(A.xSVG(coeff), A.ySVG(coeff), B.xSVG(coeff), B.ySVG(coeff), { color: this.color[0], epaisseur: this.epaisseur })
      if (this.styleExtremites.length > 0) {
        code = `<g id="${this.id}">${code}</g>`
      } else {
        code = code.replace('/>', `id="${this.id}" />`)
      }
      mainLevee.destroy() // ne pas oublier de faire ça, sinon, il va trainer un svg qui ne sert à rien dans le DOM
      return code
    } else return ''
  }

  tikzml (amp: number) {
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    let optionsDraw = ''
    const tableauOptions = []
    if (this.color[1].length > 1 && this.color[1] !== 'black') {
      tableauOptions.push(`color =${this.color[1]}`)
    }
    if (this.epaisseur !== 1) {
      tableauOptions.push(`line width = ${this.epaisseur}`)
    }

    if (this.opacite !== 1) {
      tableauOptions.push(`opacity = ${this.opacite}`)
    }
    if (this.styleExtremites.length > 1) {
      if (this.styleExtremites.includes('[') || this.styleExtremites.includes(']')) {
        tableauOptions.push('{' + this.styleExtremites + '}')
      } else {
        tableauOptions.push(this.styleExtremites)
      }
    }
    tableauOptions.push(`decorate,decoration={random steps , amplitude = ${amp}pt}`)
    optionsDraw = '[' + tableauOptions.join(',') + ']'

    const code = `\\draw${optionsDraw} (${A.x},${A.y})--(${B.x},${B.y});`
    return code
  }

  codeExtremitesSVG (coeff: number) {
    let code = ''
    const A = point(this.x1, this.y1)
    const B = point(this.x2, this.y2)
    const h = this.tailleExtremites
    if (this.styleExtremites.length > 1) {
      const fin = this.styleExtremites.slice(-1)
      if (fin === '|') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = rotation(M, B, 90)
        const B2 = rotation(M, B, -90)
        code += `<line x1="${B1.xSVG(coeff)}" y1="${B1.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
      }
      if (fin === '>') {
        // si ça termine par > on rajoute une flèche en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(B, M, 90, 0.7)
        const B2 = similitude(B, M, -90, 0.7)
        code += `<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B1.xSVG(coeff)}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]}" stroke-width="${this.epaisseur}" />`
      }
      if (fin === '<') {
        // si ça termine par < on rajoute une flèche inversée en B
        const M = pointSurSegment(B, A, -h / context.pixelsParCm)
        const B1 = similitude(B, M, 90, 0.7)
        const B2 = similitude(B, M, -90, 0.7)
        code += `<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B1.xSVG(coeff)}" y2="${B1.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${B.xSVG(coeff)}" y1="${B.ySVG(
          coeff
        )}" x2="${B2.xSVG(coeff)}" y2="${B2.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
      }
      if (fin === '[') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(M, B, 90, 1)
        const B2 = similitude(M, B, -90, 1)
        const C1 = similitude(B, B1, -90, 0.3)
        const C2 = similitude(B, B2, 90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      if (fin === ']') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(B, A, h / context.pixelsParCm)
        const B1 = similitude(M, B, 90, 1)
        const B2 = similitude(M, B, -90, 1)
        const C1 = similitude(B, B1, 90, 0.3)
        const C2 = similitude(B, B2, -90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      const debut = this.styleExtremites[0]
      if (debut === '[') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const B1 = similitude(M, A, 90, 1)
        const B2 = similitude(M, A, -90, 1)
        const C1 = similitude(A, B1, 90, 0.3)
        const C2 = similitude(A, B2, -90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      if (debut === ']') {
        // si ça termine par | on le rajoute en B
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const B1 = similitude(M, A, 90, 1)
        const B2 = similitude(M, A, -90, 1)
        const C1 = similitude(A, B1, -90, 0.3)
        const C2 = similitude(A, B2, 90, 0.3)
        code += `<polyline points="${C2.xSVG(coeff)},${C2.ySVG(coeff)} ${B2.xSVG(coeff)},${B2.ySVG(coeff)} ${B1.xSVG(coeff)},${B1.ySVG(coeff)} ${C1.xSVG(coeff)},${C1.ySVG(coeff)}" fill="none" stroke="${this.color[0]}" ${this.style} id="${this.id}" stroke-width="${this.epaisseur}" />`
      }
      if (debut === '<') {
        // si ça commence par < on rajoute une flèche en A
        const M = pointSurSegment(A, B, h / context.pixelsParCm)
        const A1 = similitude(A, M, 90, 0.7)
        const A2 = similitude(A, M, -90, 0.7)
        code += `<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A1.xSVG(coeff)}" y2="${A1.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
      }
      if (debut === '>') {
        // si ça commence par > on rajoute une flèche inversée en A
        const M = pointSurSegment(A, B, -h / context.pixelsParCm)
        const A1 = similitude(A, M, 90, 0.7)
        const A2 = similitude(A, M, -90, 0.7)
        code += `<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A1.xSVG(coeff)}" y2="${A1.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
        code += `\n\t<line x1="${A.xSVG(coeff)}" y1="${A.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
      }
      if (debut === '|') {
        // si ça commence par | on le rajoute en A
        const N = pointSurSegment(A, B, h / context.pixelsParCm)
        const A1 = rotation(N, A, 90)
        const A2 = rotation(N, A, -90)
        code += `<line x1="${A1.xSVG(coeff)}" y1="${A1.ySVG(
          coeff
        )}" x2="${A2.xSVG(coeff)}" y2="${A2.ySVG(coeff)}" stroke="${this.color[0]
          }" stroke-width="${this.epaisseur}" />`
      }
    }
    return code
  }

  /**
     * Teste si un segment coupe un cercle, une droite, une demi-cercle ou un autre segment
     * @memberof Segment
     * @param {Segment | Droite | DemiDroite | Cercle} objet Objet géométrique dont on veut tester l'intersection avec le segment
     * @example s1.estSecant(d1) // Renvoie true si s1 est sécant avec d1, false sinon
     * @author Jean-Claude Lhote
     * @return {boolean}
     */
  // JSDOC Validee par EE Aout 2022
  estSecant (objet: any) {
    // Si le segment est de longueur nulle, on ne peut définir sa direction et ça pose problème pour les calculs d'intersection
    // On regarde si la première extémité (qui est aussi la deuxième est sur l'objet)
    if (Math.abs(this.x1 - this.x2) < 0.01 && Math.abs(this.y1 - this.y2) < 0.01) {
      const P1 = point(this.x1, this.y1)
      return P1.estSur(objet)
    }

    const ab = droite(this.extremite1, this.extremite2)
    if (objet instanceof Cercle) {
      const P1 = pointIntersectionLC(ab, objet, '', 1)
      const P2 = pointIntersectionLC(ab, objet, '', 2)
      return ((P1 instanceof Point && P1.estSur(this)) || (P2 instanceof Point && P2.estSur(this)))
    }
    let I: Point | boolean
    if (objet instanceof Droite) {
      I = pointIntersectionDD(ab, objet)
    } else {
      const cd = droite(objet.extremite1, objet.extremite2)
      I = pointIntersectionDD(ab, cd)
      if (typeof I === 'boolean') {
        I = objet.extremite1.estSur(this) || objet.extremite2.estSur(this) ||
        this.extremite1.estSur(segment(objet.extremite1, objet.extremite2)) ||
        this.extremite2.estSur(segment(objet.extremite1, objet.extremite2))
      }
    }
    if (typeof I === 'boolean') return (I)
    return I.estSur(objet) && I.estSur(this)
  }
}
/**
 * @param {...any} args Points ou coordonnées + couleur facultative en dernier
 * @example segment(A,B,'blue') // Segment [AB] de couleur bleu
 * @example segment(x1,y1,x2,y2,'#f15929') // Segment dont les extrémités sont respectivement (x1,y1) et (x2,y2), de couleur orange (#f15929)
 * @author Rémi Angot
 */

export function segment (...args: [number | Point, number | Point, (string | number | undefined)?, (string | number | undefined)?, (string | undefined)?]) {
  if (args.length === 2) {
    return new Segment(args[0], args[1])
  }
  if (args.length === 3) {
    return new Segment(args[0], args[1], args[2])
  }
  if (args.length === 4) {
    return new Segment(args[0], args[1], args[2], args[3])
  }
  return new Segment(...args)
}

/**
 * @param {...args} args Points ou coordonnées
 * @param {string} color Facultatif
 * @example segmentAvecExtremites(A,B,'blue')
 * @example segmentAvecExtremites(x1,y1,x2,y2,'#f15929')
 * @author Rémi Angot
 */
export function segmentAvecExtremites (...args: [number | Point, number | Point, (string | number | undefined)?, (string | number | undefined)?, (string | undefined)?]) {
  const s = segment(...args)
  s.styleExtremites = '|-|'
  return s
}

/**  Trace la demi-droite d'origine A passant par B
 * @param {Point} A Origine de la droite
 * @param {Point} B Point de la demi-droite, autre que l'origine
 * @param {string} [color = 'black'] Couleur de la demi-droite : du type 'blue' ou du type '#f15929'
 * @param {boolean} [extremites = false] Trace (ou pas) l'origine de la demi-droite
 * @property {string} color Couleur de la demi-droite. À associer obligatoirement à colorToLatexOrHTML().
 * @property {number} opacite
 * @property {number} pointilles (0 pour pas de pointillés)
 * @author Rémi Angot
 * @class
 */
// JSDOC Validee par EE Aout 2022
export class DemiDroite extends Segment {
  constructor (A: Point, B: Point, color = 'black', extremites = false) {
    super(A, B)
    this.opacite = 1
    this.pointilles = 0
    this.epaisseur = 1
    const B1 = pointSurSegment(B, A, -10)
    this.x2 = B1.x
    this.y2 = B1.y
    this.color = colorToLatexOrHTML(color)
    if (extremites) this.styleExtremites = '|-'
  }
}

/**  Trace la demi-droite d'origine A passant par B
 * @param {Point} A
 * @param {Point} B
 * @param {string} [color='black'] Facultatif, 'black' par défaut
 * @param {boolean} [extremites = false] Trace (ou pas) l'origine de la demi-droite
 * @example demiDroite(M, N) // Trace la demi-droite d'origine M passant par N et de couleur noire
 * @example demiDroite(M, N, 'blue', true) // Trace la demi-droite d'origine M passant par N et de couleur bleue, en traçant le trait signifiant l'origine de la demi-droite
 * @author Rémi Angot
 * @return {DemiDroite}
 */
// JSDOC Validee par EE Aout 2022
export function demiDroite (A: Point, B: Point, color = 'black', extremites = false) {
  return new DemiDroite(A, B, color, extremites)
}

/**
 * Renvoie la distance de A à B
 * @param {Point} A
 * @param {Point} B
 * @param {number} [precision] Nombre de chiffres après la virgule.
 * (ne sert à rien car si le number correspondant à l'arrondi ne tombe pas sur un flottant convertible en bianire sans erreur, il y aura 18 chiffres significatifs dans le number retourné
 * C'est à la fonction d'affichage de limiter le nombre de chiffres
 * @author Rémi Angot
 */
export function longueur (A: Point, B: Point, precision = 2) {
  return arrondi(Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2), precision ?? 6)
  // j chiffres après la virgule pour l'arrondi sachant que c'est à la fonction d'affichage de limiter le nombre de chiffres.
}

/**
 * norme(V) renvoie la norme du vecteur
 *
 * @author Rémi Angot
 */
export function norme (v: Vecteur) {
  return Math.sqrt(v.x ** 2 + v.y ** 2)
}
