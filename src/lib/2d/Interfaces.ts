/**
 * Interfaces pour typer les objets 2D sans importer les classes complètes.
 * Utiliser `import type { IRepere, IAxes, ... } from '../lib/2d/Interfaces'`
 * pour éviter les dépendances circulaires runtime.
 */

/**
 * Interface minimale pour Repere
 */
export interface IRepere {
  xUnite: number
  yUnite: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  grilleXMin: number
  grilleXMax: number
  grilleYMin: number
  grilleYMax: number
  objets?: any[]
  bordures?: [number, number, number, number]

  svg?(coeff: number): string
  tikz?(): string
  svgml?(coeff: number, amp: number): string
  tikzml?(amp: number): string
  addObjet?(objet: any): void
  trace?(): any[]
}

/**
 * Interface minimale pour Axes
 */
export interface IAxes {
  xUnite: number
  yUnite: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  xThickListe?: number[]
  yThickListe?: number[]
  xLabelListe?: string[]
  yLabelListe?: string[]
  xThickDistance?: number
  yThickDistance?: number
  xLegende?: string
  yLegende?: string
  axeXStyle?: string
  axeYStyle?: string
  pointTaille?: number
  labelsPerpendiculaires?: boolean

  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour DroiteGraduee
 */
export interface IDroiteGraduee {
  axeStyle?: string
  pointTaille?: number
  labelDistance?: number
  Unite?: number
  Min?: number
  Max?: number
  thickListe?: number[]
  thickOffset?: number
  thickDistance?: number
  thickColor?: string
  labelListe?: string[]
  labelsPerpendiculaires?: boolean
  step1?: number
  step2?: number

  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour Grille
 */
export interface IGrille {
  xUnite: number
  yUnite: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  xDistance?: number
  yDistance?: number
  opacite?: number
  couleur?: string
  pointilles?: number

  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour LectureImage
 */
export interface ILectureImage {
  xUnite: number
  yUnite: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  grilleXMin: number
  grilleXMax: number
  grilleYMin: number
  grilleYMax: number

  svg?(coeff: number): string
  tikz?(): string
}
/**
 * Interface minimale pour PointAbstrait
 */
export interface IPointAbstrait {
  nom: string
  x: number
  y: number
  positionLabel?: string
  bordures?: [number, number, number, number]
  typeObjet?: string

  xSVG?(coeff: number): number
  ySVG?(coeff: number): number
}

/**
 * Interface minimale pour Point (étend IPointAbstrait)
 */
export interface IPoint extends IPointAbstrait {
  estDansPolygone?(p: any): boolean
  estDansTriangle?(A: IPoint, B: IPoint, C: IPoint): boolean
  estDansPolygoneConvexe?(p: any): boolean
  estDansQuadrilatere?(A: IPoint, B: IPoint, C: IPoint, D: IPoint): boolean
  estSur?(objet: any): boolean
  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour Plot
 */
export interface IPlot {
  couleurDeRemplissage: string[]
  rayon: number
  x: number
  y: number
  opaciteDeRemplissage: number
  bordures?: [number, number, number, number]

  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour TracePoint
 */
export interface ITracePoint {
  taille: number
  tailleTikz: number
  points: any[]
  couleurDeRemplissage?: string[]
  epaisseur?: number
  opacite?: number
  style?: string
  bordures?: [number, number, number, number]

  svg?(coeff: number): string
  tikz?(): string
}

/**
 * Interface minimale pour TracePointSurDroite
 */
export interface ITracePointSurDroite {
  lieu: IPoint
  taille: number
  x: number
  y: number
  direction: IPoint
  bordures?: [number, number, number, number]

  svg?(coeff: number): string
  tikz?(): string
}
