import type { NestedObjetMathalea2dArray } from '../../../modules/2dGeneralites'
import { Shape2D } from '../Figures2D'
import { Shape3D, shapeCubeIso } from '../figures2d/Shape3d'
import type { ShapeName } from '../figures2d/shapes2d'

type Coord3d = [number, number, number, options?: { scale: number }]
/**
 * @author Jean-Claude Lhote
 *
 */

function filterCells (cells: Set<string>): Set<string> {
  function hasAllNeightbors (cell: string, cells: Set<string>): boolean {
    const [x, y, z] = cell.split(',').map(Number)
    // Vérifie si toutes les cellules voisines sont présentes
    return (
      cells.has(`${x + 1},${y},${z}`) &&
      cells.has(`${x},${y - 1},${z}`) &&
      cells.has(`${x},${y},${z + 1}`)
    )
  }
  const filteredCells = new Set<string>()
  for (const cell of cells) {
    if (!hasAllNeightbors(cell, cells)) {
      // Si la cellule a tous ses voisins, on la supprime
      filteredCells.add(cell)
    }
  }
  return filteredCells
}

export class VisualPattern3D {
  shape: Shape3D
  shapes: ShapeName[] // formes utilisées pour les cellules
  cells: Set<string> // ce sont des coordonnées sous forme de chaîne de caractères "x,y" car les ensembles ne peuvent pas contenir d'objets complexes comme des tableaux
  // on utilise un ensemble pour stocker les cellules, ce qui permet d'éviter les doublons et de faciliter la vérification de la présence d'une cellule
  // et la conversion en chaîne de caractères permet de les stocker efficacement dans un ensemble

  constructor (initialCells: Coord3d[] | string[] | Set<string>, shape?: Shape2D) {
    if (initialCells instanceof Set) {
      // si initialCells est déjà un Set, on l'utilise directement
      this.cells = initialCells
    } else if (Array.isArray(initialCells)) {
      if (typeof initialCells[0] === 'string') {
      // si initialCells est déjà un tableau de chaînes de caractères, on le convertit en Set directement
        this.cells = new Set(initialCells as string[])
      } else if (Array.isArray(initialCells[0]) && initialCells[0].length > 2) {
      // si initialCells est un tableau de coordonnées, on les convertit en chaînes de caractères
      // en utilisant la méthode coordToKey
        this.cells = new Set((initialCells as Coord3d[]).map(VisualPattern3D.coordToKey))
      } else if (initialCells.length === 0) {
        this.cells = new Set()
      } else {
        throw new Error('initialCells must be an array of coordinates or strings')
      }
    // on initialise l'ensemble des cellules avec les coordonnées initiales
    } else {
      throw new Error('initialCells must be a Set, an array of coordinates or an array of strings')
    }
    if (!(shape instanceof Shape3D) || shape !== undefined) {
      this.shape = shapeCubeIso()
      this.shapes = ['cube']
    } else {
      this.shape = shape
      this.shapes = [(shape as Shape3D).name] // forme par défaut pour les cellules sans forme spécifique
    }
  }

  hasCell (x: number, y: number, z:number, scale?:number): boolean {
    return this.cells.has(VisualPattern3D.coordToKey([x, y, z, { scale: scale ?? 1 }]))
  }

  iterate3d (this: VisualPattern3D, n:number): Set<string> {
    return this.cells // cette méthode doit être modifiée pour créer un motif changeant.
  }

  static coordToKey (coord: Coord3d): string {
    return `${coord[0]};${coord[1]};${coord[2]};${coord[3]?.scale ?? 1}`
  }

  static keyToCoord (key: string): Coord3d {
    const [x, y, z, scale] = key.split(';').map(Number)
    return [x, y, z, { scale: scale ?? 1 }] as Coord3d
  }

  render3d (n: number) {
    let cells: Set<string> = this.cells
    for (let i = 0; i < n; i++) {
      const newPattern = new VisualPattern3D(cells)
      newPattern.iterate3d = this.iterate3d.bind(newPattern)
      cells = newPattern.iterate3d(n)
    }
    return Array.from(filterCells(cells)).map(VisualPattern3D.keyToCoord)
  }

  render (n:number, dx: number, dy:number, angle:number): NestedObjetMathalea2dArray {
    let cells: Set<string> = this.cells
    const newPattern = new VisualPattern3D(cells)
    newPattern.iterate3d = this.iterate3d.bind(newPattern)
    cells = newPattern.iterate3d(n)
    if (cells.size === 0) {
      return []
    }
    if (cells.size > 1000) {
      console.warn('VisualPattern3d: le motif contient plus de 1000 cellules, l\'affichage peut être long')
    }
    if (cells.size > 10000) {
      console.warn('VisualPattern3d: le motif contient plus de 10000 cellules, l\'affichage peut être très long')
    }
    if (cells.size > 100000) {
      console.warn('VisualPattern3d: le motif contient plus de 100000 cellules, l\'affichage peut être très très long')
    }
    const objets: NestedObjetMathalea2dArray = []
    for (const cell of filterCells(cells)) {
      const [x, y, z, options] = VisualPattern3D.keyToCoord(cell)
      const scale = options?.scale ?? 1

      const newShape = this.shape.clone(x, y, z, angle ?? Math.PI / 6)
      newShape.scale = scale
      newShape.updateBordures()
      objets.push(newShape)
    }
    return objets
  }

  print (): string {
    return Array.from(this.cells).join(';')
  }
}
