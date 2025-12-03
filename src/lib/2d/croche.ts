import { arc } from './Arc'
import { colorToLatexOrHTML } from './colorToLatexOrHtml'
import { point } from './PointAbstrait'

/**
 * crée un petit demi-cercle en x,y pour marquer une courbe sur un intervalle ouvert
 * @param {number} x
 * @param {number} y
 * @param {'gauche'|'droite'} sens 'gauche' par défaut
 * @param {number} rayon
 * @param {string} couleur
 * @returns {Arc}
 */

export function croche(
  x: number,
  y: number,
  sens = 'gauche',
  rayon = 0.1,
  couleur = 'black',
) {
  const centre = point(x + (sens === 'gauche' ? -rayon : rayon), y)
  const dessous = point(x + (sens === 'gauche' ? -rayon : rayon), y - rayon)
  const dessus = point(x + (sens === 'gauche' ? -rayon : rayon), y + rayon)
  const croche =
    sens === 'gauche'
      ? arc(dessous, centre, dessus)
      : arc(dessus, centre, dessous)
  croche.color = colorToLatexOrHTML(couleur)
  return croche
}
