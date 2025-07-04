import { point } from '../../../lib/2d/points'
import { carre, Polygone, polygone, Polyquad } from '../../../lib/2d/polygones'
import { grille } from '../../../lib/2d/reperes'
import { texteParPosition } from '../../../lib/2d/textes'
import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
import { colorToLatexOrHTML, fixeBordures, mathalea2d, type NestedObjetMathalea2dArray } from '../../../modules/2dGeneralites'
import { randint } from '../../../modules/outils'
import Exercice from '../../Exercice'
export const titre = 'Mesurer différence d\'aire par comptage'
export const dateDePublication = '26/04/2024'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true

/**
 * @author Jean-Claude Lhote
 * Créé le 25/04/2024

 */
export const uuid = 'a17d6'

export const refs = {
  'fr-fr': ['can6M17'],
  'fr-ch': ['9GM1-11']
}
export default class DifferenceAireParComptageCan extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 1
    this.typeExercice = 'simple'
    this.besoinFormulaire2CaseACocher = ['Avec grille', true]
    this.sup = 1
    this.sup2 = true
    this.spacing = 3
  }

  nouvelleVersion () {
    let aireDiff = 0
    let aireTetris = 0
    let aireRectangle = 0
    let aire = 0
    do {
      aire = randint(10, 15)
      const tetris = new Polyquad(aire, 0, 0)
      if (tetris.rectangle.xMax < tetris.rectangle.yMax) tetris.rotate(choice([true, false]))
      const xmin = tetris.rectangle.xMin
      const ymin = tetris.rectangle.yMin
      const xmax = tetris.rectangle.xMax + 3
      const ymax = tetris.rectangle.yMax
      const rectangle = polygone(point(tetris.rectangle.xMin, tetris.rectangle.yMin), point(tetris.rectangle.xMax, tetris.rectangle.yMin), point(tetris.rectangle.xMax, tetris.rectangle.yMax), point(tetris.rectangle.xMin, tetris.rectangle.yMax))
      const nomFigure = (tetris.rectangle.xMax === tetris.rectangle.yMax) ? 'carré' : 'rectangle'
      aireRectangle = rectangle.aire
      aireTetris = tetris.poly.aire
      aireDiff = aireRectangle - aireTetris
      // rectangle.couleurDeRemplissage = colorToLatexOrHTML('gray')
      const grid = grille(xmin, ymin, xmax - 3, ymax)
      const uniteAire = carre(point(xmax - 2, ymax - 1), point(xmax - 1, ymax - 1))
      uniteAire.couleurDeRemplissage = colorToLatexOrHTML('gray')
      const texteUniteAire = texteParPosition('u.a', xmax - 1.5, ymax - 1.8)

      tetris.poly.opaciteDeRemplissage = 1
      rectangle.opaciteDeRemplissage = aireTetris > aireDiff ? 0.5 : 1
      tetris.poly.opacite = 1
      tetris.poly.epaisseur = 1
      rectangle.opacite = aireTetris > aireDiff ? 0.5 : 1
      rectangle.hachures = 'north east lines'
      rectangle.couleurDeRemplissage = colorToLatexOrHTML('white')
      rectangle.couleurDesHachures = colorToLatexOrHTML('gray')
      rectangle.distanceDesHachures = 5

      const objets: NestedObjetMathalea2dArray = []
      if (this.sup2) {
        if (aireDiff > aireTetris) {
          const pavage = tetris.render()
          pavage.forEach((p) => {
            if (p instanceof Polygone) p.opaciteDeRemplissage = 1
          })
          objets.push(rectangle, ...pavage, uniteAire, texteUniteAire)
        } else {
          objets.push(grid, rectangle, tetris.poly, uniteAire, texteUniteAire)
        }
      } else {
        objets.push(rectangle, tetris.poly, uniteAire, texteUniteAire)
      }

      const fig1 = mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5, style: 'display: inline-block' }, fixeBordures(objets, { rxmin: -0.1, rymin: -0.1, rxmax: 0.1, rymax: 0.1 })), objets)
      this.question = `L'aire du ${nomFigure} est : ${aireRectangle} u.a.<br>
       ${aireDiff <= aireTetris
            ? 'Quelle est l\'aire de la zone non hachurée ?'
            : 'Quele est l\'aire de la zone hachurée ?'}<br>
      
            ${fig1}`
    } while (aireTetris < 10 || aireDiff < 3 || Math.abs(aireDiff - aireTetris) < 5)
    this.optionsChampTexte = { texteApres: ' u.a' }
    this.reponse = aire
    this.correction = `${aireDiff <= aireTetris
            ? `L'aire de la zone non hachurée est $${aireRectangle}\\text{ u.a} - ${aireDiff}\\text{ u.a} = ${miseEnEvidence(aireTetris)}\\text{ u.a}$`
            : `L'aire de la zone hachurée est $${aireRectangle}\\text{ u.a} - ${aireTetris}\\text{ u.a} = ${miseEnEvidence(aireDiff)}\\text{ u.a}$`}`
  }
}
