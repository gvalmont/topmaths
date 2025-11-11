import { nomVecteurParPosition } from './NomVecteurParPosition'
import { Point, type PointAbstrait, point } from './PointAbstrait'
import { segment } from './segmentsVecteurs'
import { similitude, translation } from './transformations'
import { milieu } from './utilitairesPoint'
import type { Vecteur } from './Vecteur'

export function representant(
  v: Vecteur,
  A: Point | PointAbstrait,
  color = 'black',
) {
  const B = point(A.x + v.x, A.y + v.y)
  const s = segment(A, B, color, '->')
  s.tailleExtremites = 5
  return s
}

export function representantNomme(
  v: Vecteur,
  A: Point,
  nom: string,
  taille = 1,
  color = 'black',
) {
  let s
  let vTransformed
  const B = point(A.x + v.x, A.y + v.y)
  const M = milieu(A, B)
  s = segment(A, B, color)
  const angle = s.angleAvecHorizontale
  vTransformed = similitude(v, A, 90, 0.5 / v.norme())
  if (Math.abs(angle) > 90) {
    s = segment(B, A, color)
    vTransformed = similitude(v, A, -90, 0.5 / v.norme())
  }
  const N = translation(vTransformed, M)
  return nomVecteurParPosition(nom, N.x, N.y, taille, 0, color)
}
