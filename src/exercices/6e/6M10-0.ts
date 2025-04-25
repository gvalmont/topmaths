import { point } from '../../lib/2d/points'
import { carre, Polyquad } from '../../lib/2d/polygones'
import { grille } from '../../lib/2d/reperes'
import { segment } from '../../lib/2d/segmentsVecteurs'
import { texteParPosition } from '../../lib/2d/textes'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { sp } from '../../lib/outils/outilString'
import { colorToLatexOrHTML, fixeBordures, mathalea2d } from '../../modules/2dGeneralites'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Trouver une aire ou un périmètre par comptage'
export const interactifReady = true
export const interactifType = 'mathLive'

export const dateDePublication = '20/04/2025'

/**
 * @author Jean-Claude Lhote
 */
export const uuid = '83be3'

export const refs = {
  'fr-fr': ['6M10-0'],
  'fr-ch': []
}
export default class AireParComptage extends Exercice {
  constructor () {
    super()
    this.comment = `Une version course aux nombres de cet exercice est disponible sous la référence can6M14 pour l'aire et can6M15 pour le périmètre. Dans les versions can, il n'y a qu'une figure.<br>
    Les figures sont générées aléatoirement à partir d'une aire choisie. Les possiblités sont nombreuses, mais aucune vérification n'a été faite afin d'éviter les doublons.`
    this.besoinFormulaireTexte = ['Aire maximale', 'Nombres séparés par des tirets\n1 : Inférieure à 10\n2 : Inférieure à 20\n3 : Inférieure à 30\n4 : Mélange']
    this.besoinFormulaire2Numerique = ['Mesures demandées', 3, '1 : Aire\n2 : Périmètre\n3 : Aire et périmètre']
    this.sup = '4'
    this.sup2 = 1
  }

  nouvelleVersion () {
    const typeDeQuestion = gestionnaireFormulaireTexte({ saisie: this.sup, nbQuestions: this.nbQuestions, min: 1, max: 3, melange: 4, defaut: 4 })
    for (let i = 0; i < this.nbQuestions; i++) {
      const aire = typeDeQuestion[i] === 1
        ? randint(5, 9)
        : typeDeQuestion[i] === 2
          ? randint(10, 19)
          : randint(20, 29)
      const aire2 = typeDeQuestion[i] === 1
        ? randint(5, 9)
        : typeDeQuestion[i] === 2
          ? randint(10, 19)
          : randint(20, 29)
      const tetris = new Polyquad(aire, 0, 0)
      const tetris2 = new Polyquad(aire2, tetris.rectangle.xMax + 1, 0)
      const xmin = tetris.rectangle.xMin
      const ymin = tetris.rectangle.yMin
      const decalage = tetris.rectangle.xMax
      const xmax = tetris2.rectangle.xMax + decalage + 4
      const ymax = Math.max(tetris.rectangle.yMax, tetris2.rectangle.yMax)
      const fig1 = texteParPosition('Figure 1', (tetris.rectangle.xMin + tetris.rectangle.xMax) / 2, tetris.rectangle.yMin - 0.5)
      const fig2 = texteParPosition('Figure 2', (tetris2.rectangle.xMin + tetris2.rectangle.xMax) / 2 + decalage, tetris2.rectangle.yMin - 0.5)
      const uniteAire = carre(point(xmax - 2, ymax - 2), point(xmax - 1, ymax - 2))
      uniteAire.couleurDeRemplissage = colorToLatexOrHTML('gray')
      const uniteLongueur = segment(point(xmax - 2, ymax - 4), point(xmax - 1, ymax - 4))
      uniteLongueur.epaisseur = 2
      uniteLongueur.styleExtremites = '|-|'
      const texteUniteAire = texteParPosition('u.a', xmax - 1.5, ymax - 2.5)
      const texteUniteLongueur = texteParPosition('u.l', xmax - 1.5, ymax - 4.5)

      const objets = [grille(xmin, ymin, xmax, ymax), tetris.poly, tetris2.poly, fig1, fig2, uniteAire, uniteLongueur, texteUniteAire, texteUniteLongueur]
      const figure = mathalea2d(Object.assign({ pixelsParCm: 20, scale: 0.5 }, fixeBordures(objets, { rxmin: -0.1, rymin: -0.1, rxmax: 0.1, rymax: 0.1 })), objets)
      const texte = this.sup2 === 1
        ? `${figure}
Quelles sont les aires des figures ci-dessus ?<br>
 ${ajouteQuestionMathlive({ exercice: this, question: 2 * i, typeInteractivite: 'mathlive', texteAvant: 'figure 1 : ', texteApres: ` u.a ${sp(17)} `, objetReponse: { reponse: { value: aire } } })}
 ${ajouteQuestionMathlive({ exercice: this, question: 2 * i + 1, typeInteractivite: 'mathlive', texteAvant: 'figure 2 : ', texteApres: ' u.a.', objetReponse: { reponse: { value: aire2 } } })}`
        : this.sup2 === 2
          ? `${figure}
 Quels sont les périmètres des figures ci-dessus ?<br>
  ${ajouteQuestionMathlive({ exercice: this, question: 2 * i, typeInteractivite: 'mathlive', texteAvant: 'figure 1 : ', texteApres: ` u.l ${sp(6)}`, objetReponse: { reponse: { value: tetris.poly.perimetre } } })}
  ${ajouteQuestionMathlive({ exercice: this, question: 2 * i + 1, typeInteractivite: 'mathlive', texteAvant: 'figure 2 : ', texteApres: ' u.l.', objetReponse: { reponse: { value: tetris2.poly.perimetre } } })}`
          : `${figure}
  Quels sont les aires et les périmètres des figures ci-dessus ?<br>
  ${ajouteQuestionMathlive({ exercice: this, question: 4 * i, typeInteractivite: 'mathlive', texteAvant: ' Aire figure 1 : ', texteApres: `u.a ${sp(17)}`, objetReponse: { reponse: { value: aire } } })}
  ${ajouteQuestionMathlive({ exercice: this, question: 4 * i + 1, typeInteractivite: 'mathlive', texteAvant: 'Aire figure 2 : ', texteApres: 'u.a.', objetReponse: { reponse: { value: aire2 } } })}${this.interactif ? '<br>' : ''}
  ${ajouteQuestionMathlive({ exercice: this, question: 4 * i + 2, typeInteractivite: 'mathlive', texteAvant: 'Périmètre figure 1 : ', texteApres: `u.l ${sp(6)}`, objetReponse: { reponse: { value: tetris.poly.perimetre } } })}
  ${ajouteQuestionMathlive({ exercice: this, question: 4 * i + 3, typeInteractivite: 'mathlive', texteAvant: 'Périmètre figure 2 : ', texteApres: 'u.l.', objetReponse: { reponse: { value: tetris2.poly.perimetre } } })}`
      const texteCorr = this.sup2 === 1
        ? `L'aire de la figure 1 est $${miseEnEvidence(aire)}$ u.a et celle de la figure 2 est  $${miseEnEvidence(aire2)}$ u.a.`
        : this.sup2 === 2
          ? `Le périmètre de la figure 1 est $${miseEnEvidence(tetris.poly.perimetre)}$ u.l et celui de la figure 2 est $${miseEnEvidence(tetris2.poly.perimetre)}$ u.l.`
          : `L'aire de la figure 1 est $${miseEnEvidence(aire)}$ u.a, celle de la figure 2 est $${miseEnEvidence(aire2)}$ u.a<br>
          Le périmètre de la figure 1 est $${miseEnEvidence(tetris.poly.perimetre)}$ u.l et celui de la figure 2 est $${miseEnEvidence(tetris2.poly.perimetre)}$ u.l.`
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
    }
  }
}
