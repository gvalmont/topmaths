import { courbeInterpolee } from '../../lib/2d/courbes'
import { point, tracePoint } from '../../lib/2d/points'
import { repere } from '../../lib/2d/reperes'
import { texteParPosition } from '../../lib/2d/textes'
import { tableauDeVariation } from '../../lib/mathFonctions/etudeFonction'
import { choice, combinaisonListes } from '../../lib/outils/arrayOutils'
import { mathalea2d } from '../../modules/2dGeneralites'

import { listeQuestionsToContenu, randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Dresser un tableau de variations à partir d\'une courbe'
export const dateDePublication = '14/02/2023'
/**
 * Lintage et typage incomplet à cause de tableauDeVariation qui est mal typé
 * @author Gilles Mora

 */
export const uuid = '05b52'

export const refs = {
  'fr-fr': ['2F30-1'],
  'fr-ch': []
}
export default class VariationsCourbe extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireNumerique = ['Choix des questions', 3, '1 : Avec un repère classique\n2 : Avec des grandes valeurs\n3 : Mélange des cas précédents']

    this.nbQuestions = 1

    this.sup = 1
  }

  nouvelleVersion () {
    let typeDeQuestionsDisponibles
    if (this.sup === 1) {
      typeDeQuestionsDisponibles = ['typeE1', 'typeE2', 'typeE3', 'typeE4', 'typeE5', 'typeE6']// 'typeE1', 'typeE2',
    } else if (this.sup === 2) {
      typeDeQuestionsDisponibles = ['typeE7']
    } else {
      typeDeQuestionsDisponibles = ['typeE1', 'typeE2', 'typeE3', 'typeE4', 'typeE5', 'typeE6', 'typeE7']
    }
    //
    const listeTypeQuestions = combinaisonListes(typeDeQuestionsDisponibles, this.nbQuestions)
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const nomF = [
        ['f'], ['g'], ['h'], ['u'],
        ['v'], ['w']
      ]
      let texte = ''
      let texteCorr = ''
      const variables: number[] = []
      const typeDeQuestions = listeTypeQuestions[i]
      switch (typeDeQuestions) {
        case 'typeE1':{ // croissante, décroissante
          const x0 = randint(-6, -3)
          const y0 = randint(-4, -2)
          const x1 = randint(-2, 2)
          const y1 = randint(-1, 5)// max de y
          const x2 = randint(4, 5)
          const y2 = y1 - randint(1, 4)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const Tk = tracePoint(A0, A1, A2)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: Math.min(y2 - 1, y0 - 1),
            yMax: y1 + 2,
            xMax: 6,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: y0,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: Math.min(y0 - 1, y2 - 1),
            grilleXMax: 6,
            grilleYMax: y1 + 2
          })

          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: 6
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: 6,
            ymin: Math.min(y0 - 1, y2 - 1),
            ymax: y1 + 2,
            pixelsParCm: 30,
            scale: 0.8,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
            Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x2}]$.<br>
            Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `-/$${y0}$`, 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10]],
            colorBackground: '',
            espcl: 2, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 2.5, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }) + '<br>'

          variables.push(x0, x1, x2, y0, y1, y2)
        }
          break

        case 'typeE2':{ // décroissante, croissante
          const x0 = randint(-6, -3)
          const y0 = randint(2, 4)
          const x1 = randint(-2, 2)
          const y1 = randint(-5, 1)// min de y
          const x2 = randint(4, 5)
          const y2 = y1 + randint(1, 4)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const Tk = tracePoint(A0, A1, A2)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: y1 - 2,
            yMax: Math.max(y2 + 1, y0 + 1),
            xMax: 6,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: y1 - 1,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: y1 - 2,
            grilleXMax: 6,
            grilleYMax: Math.max(y2 + 1, y0 + 1)
          })
          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: 6
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: 6,
            ymin: y1 - 2,
            ymax: Math.max(y2 + 1, y0 + 1),
            pixelsParCm: 30,
            scale: 0.8,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x2}]$.<br>
        Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `+/$${y0}$`, 10, `-/$${y1}$`, 10, `+/$${y2}$`, 10]],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }) + '<br>'
          variables.push(x0, x1, x2, y0, y1, y2)
        }
          break

        case 'typeE3':{ // décroissante, croissante, décroissante
          const x0 = randint(-6, -4)
          const y0 = randint(3, 5)
          const x1 = randint(-2, 1)
          const y1 = y0 - randint(5, 8)
          const x2 = randint(3, 4)
          const y2 = y1 + randint(2, 7)
          const x3 = randint(5, 6)
          const y3 = y2 - randint(1, 4)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const A3 = point(x3, y3)
          const Tk = tracePoint(A0, A1, A2, A3)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: Math.min(y1 - 1, y3 - 1),
            yMax: Math.max(y2 + 1, y0 + 1),
            xMax: 7,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: y1 - 1,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: Math.min(y1 - 1, y3 - 1),
            grilleXMax: 7,
            grilleYMax: Math.max(y2 + 1, y0 + 1)
          })
          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2], [x3, y3]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: 6
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: 7,
            ymin: Math.min(y1 - 1, y3 - 1),
            ymax: Math.max(y2 + 1, y0 + 1),
            pixelsParCm: 30,
            scale: 0.8,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x3}]$.<br>
        Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `+/$${y0}$`, 10, `-/$${y1}$`, 10, `+/$${y2}$`, 10, `-/$${y3}$`, 10]],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }) + '<br>'
          variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
        }
          break

        case 'typeE4':{ // croissante, décroissante, croissante
          const x0 = randint(-6, -5)
          const y0 = randint(-5, -3)
          const x1 = randint(-3, 2)
          const y1 = y0 + randint(5, 8)
          const x2 = randint(4, 5)
          const y2 = y1 - randint(2, 7)
          const x3 = randint(7, 9)
          const y3 = y2 + randint(1, 4)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const A3 = point(x3, y3)
          const Tk = tracePoint(A0, A1, A2, A3)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: Math.min(y2 - 1, y0 - 1),
            yMax: Math.max(y1 + 1, y3 + 1),
            xMax: x3 + 1,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: Math.min(y2 - 1, y0 - 1) + 1,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: Math.min(y2 - 1, y0 - 1),
            grilleXMax: x3 + 1,
            grilleYMax: Math.max(y1 + 1, y3 + 1)
          })
          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2], [x3, y3]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: x3 + 1
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: x3 + 1,
            ymin: Math.min(y2 - 1, y0 - 1),
            ymax: Math.max(y1 + 1, y3 + 1),
            pixelsParCm: 30,
            scale: 0.7,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x3}]$.<br>
        Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `-/$${y0}$`, 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10, `+/$${y3}$`, 10]],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }) + '<br>'
          variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
        }
          break

        case 'typeE5':{ // croissante, décroissante, croissante, décroissante
          const x0 = randint(-6, -5)
          const y0 = randint(-5, -3)
          const x1 = randint(-3, -1)
          const y1 = y0 + randint(5, 8)
          const x2 = randint(1, 3)
          const y2 = y1 - randint(2, 7)
          const x3 = randint(4, 6)
          const y3 = y2 + randint(1, 4)
          const x4 = randint(7, 9)
          const y4 = y3 - randint(1, 4)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const A3 = point(x3, y3)
          const A4 = point(x4, y4)
          const Tk = tracePoint(A0, A1, A2, A3, A4)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: Math.min(y2 - 1, y0 - 1, y4 - 1),
            yMax: Math.max(y1 + 1, y3 + 1),
            xMax: x4 + 1,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: Math.min(y2 - 1, y0 - 1, y4 - 1) + 1,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: Math.min(y2 - 1, y0 - 1, y4 - 1),
            grilleXMax: x4 + 1,
            grilleYMax: Math.max(y1 + 1, y3 + 1)
          })
          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: x4 + 1
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: x4 + 1,
            ymin: Math.min(y2 - 1, y0 - 1, y4 - 1),
            ymax: Math.max(y1 + 1, y3 + 1),
            pixelsParCm: 25,
            scale: 0.7,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x4}]$.<br>
        Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10, `$${x4}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `-/$${y0}$`, 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10, `+/$${y3}$`, 10, `-/$${y4}$`, 10]],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          }) + '<br>'
          variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
        }
          break

        case 'typeE6':{ // décroissante, croissante, décroissante, croissante
          const x0 = randint(-6, -4)
          const y0 = randint(3, 5)
          const x1 = randint(-2, 1)
          const y1 = y0 - randint(5, 8)
          const x2 = randint(2, 3)
          const y2 = y1 + randint(2, 7)
          const x3 = randint(4, 5)
          const y3 = y2 - randint(1, 4)
          const x4 = randint(7, 8)
          const y4 = y3 + randint(1, 5)
          const A0 = point(x0, y0)
          const A1 = point(x1, y1)
          const A2 = point(x2, y2)
          const A3 = point(x3, y3)
          const A4 = point(x4, y4)
          const Tk = tracePoint(A0, A1, A2, A3, A4)
          Tk.epaisseur = 2
          const nom = choice(nomF)
          const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)
          const r1 = repere({
            xMin: x0 - 1,
            yMin: Math.min(y1 - 2, y3 - 2),
            yMax: Math.max(y2 + 1, y0 + 1, y4 + 1),
            xMax: x4 + 1,
            xUnite: 1,
            yUnite: 1,
            xThickDistance: 1,
            yThickDistance: 1,
            xLabelMin: x0,
            yLabelMin: y1 - 1,
            yLabelEcart: 0.6,
            grilleXDistance: 1,
            grilleYDistance: 1,
            grilleXMin: x0 - 1,
            grilleYMin: Math.min(y1 - 2, y3 - 2),
            grilleXMax: x4 + 1,
            grilleYMax: Math.max(y2 + 1, y0 + 1, y4 + 1)
          })
          const gr = courbeInterpolee(
            [
              [x0, y0], [x1, y1], [x2, y2], [x3, y3], [x4, y4]
            ],
            {
              color: 'blue',
              epaisseur: 2,
              repere: r1,
              xMin: x0 - 1,
              xMax: x4 + 1
            })
          const graphique = mathalea2d({
            xmin: x0 - 1,
            xmax: x4 + 1,
            ymin: Math.min(y1 - 2, y3 - 2),
            ymax: Math.max(y2 + 1, y0 + 1, y4 + 1),
            pixelsParCm: 25,
            scale: 0.7,
            style: 'margin: auto'
          }, r1, o, gr, Tk)
          texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
          texte += `${graphique}`

          texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x4}]$.<br>
        Son tableau de variations est : <br><br>`
          texteCorr += tableauDeVariation({
            tabInit: [
              [
                // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
              ],
              // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
              [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10, `$${x4}$`, 10]
            ],
            // tabLines ci-dessous contient les autres lignes du tableau.
            tabLines: [['Var', 10, `+/$${y0}$`, 10, `-/$${y1}$`, 10, `+/$${y2}$`, 10, `-/$${y3}$`, 10, `+/$${y4}$`, 10]],
            colorBackground: '',
            espcl: 3, // taille en cm entre deux antécédents
            deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
            lgt: 3, // taille de la première colonne en cm
            hauteurLignes: [15, 15]
          })
          variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
        }
          break

        case 'typeE7':
        default: // avec des grandes valeurs
          if (choice([true, false])) { // croissante, décroissante, croissante
            const nom = choice(nomF)
            const x0 = randint(0, 10) * 10
            const y0 = randint(0, 15) * 2
            const x1 = randint(20, 40) * 10
            const y1 = randint(20, 50) * 2
            const x2 = randint(50, 60) * 10
            const y2 = randint(0, 10) * 2
            const x3 = randint(70, 80) * 10
            const y3 = randint(20, 40) * 2
            const A0 = point(x0 * 0.03, y0 * 0.15)
            const A1 = point(x1 * 0.03, y1 * 0.15)
            const A2 = point(x2 * 0.03, y2 * 0.15)
            const A3 = point(x3 * 0.03, y3 * 0.15)

            const Tk = tracePoint(A0, A1, A2, A3)
            Tk.epaisseur = 2
            const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)

            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 100,
              xMax: 800,
              xUnite: 0.03,
              yUnite: 0.15,
              xThickDistance: 50,
              yThickDistance: 10,
              xLabelMin: 0,
              yLabelMin: 0,
              yLabelEcart: 1,
              grilleXDistance: 50,
              grilleYDistance: 10,
              grilleXMin: 0,
              grilleYMin: 0,
              grilleXMax: 800,
              grilleYMax: 100,
              grilleSecondaireX: true,
              grilleSecondaireXDistance: 10,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 800,
              grilleSecondaireXOpacite: 0.1,
              grilleSecondaireY: true,
              grilleSecondaireYDistance: 2,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 100,
              grilleSecondaireYOpacite: 0.1
            })

            const gr = courbeInterpolee(
              [
                [x0, y0], [x1, y1], [x2, y2], [x3, y3]
              ],
              {
                color: 'blue',
                epaisseur: 2,
                repere: r1,
                xMin: 0,
                xMax: 800
              })

            const graphique = mathalea2d({
              xmin: -2,
              xmax: 24,
              ymin: -2,
              ymax: 16,
              pixelsParCm: 20,
              scale: 0.5,
              style: 'margin: auto'
            }
            , r1, o, gr, Tk)
            texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
        Dresser son tableau de variations sur son ensemble de définition.<br><br>`
            texte += `${graphique}`

            texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x3}]$.<br>
            Son tableau de variations est : <br><br>`
            texteCorr += tableauDeVariation({
              tabInit: [
                [
                  // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                  ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
                ],
                // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10]
              ],
              // tabLines ci-dessous contient les autres lignes du tableau.
              tabLines: [['Var', 10, `-/$${y0}$`, 10, `+/$${y1}$`, 10, `-/$${y2}$`, 10, `+/$${y3}$`, 10]],
              colorBackground: '',
              espcl: 3, // taille en cm entre deux antécédents
              deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
              lgt: 3, // taille de la première colonne en cm
              hauteurLignes: [15, 15]
            })
            variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
          } else { // décroissante, croissante, décroissante
            const nom = choice(nomF)
            const x0 = randint(0, 10) * 10
            const y0 = randint(20, 40) * 2
            const x1 = randint(20, 40) * 10
            const y1 = randint(0, 10) * 2
            const x2 = randint(50, 60) * 10
            const y2 = randint(20, 50) * 2
            const x3 = randint(70, 80) * 10
            const y3 = randint(0, 15) * 2
            const A0 = point(x0 * 0.03, y0 * 0.15)
            const A1 = point(x1 * 0.03, y1 * 0.15)
            const A2 = point(x2 * 0.03, y2 * 0.15)
            const A3 = point(x3 * 0.03, y3 * 0.15)

            const Tk = tracePoint(A0, A1, A2, A3)
            Tk.epaisseur = 2
            const o = texteParPosition('O', -0.3, -0.3, 0, 'black', 1)

            const r1 = repere({
              xMin: 0,
              yMin: 0,
              yMax: 100,
              xMax: 800,
              xUnite: 0.03,
              yUnite: 0.15,
              xThickDistance: 50,
              yThickDistance: 10,
              xLabelMin: 0,
              yLabelMin: 0,
              yLabelEcart: 1,
              grilleXDistance: 50,
              grilleYDistance: 10,
              grilleXMin: 0,
              grilleYMin: 0,
              grilleXMax: 800,
              grilleYMax: 100,
              grilleSecondaireX: true,
              grilleSecondaireXDistance: 10,
              grilleSecondaireXMin: 0,
              grilleSecondaireXMax: 800,
              grilleSecondaireXOpacite: 0.1,
              grilleSecondaireY: true,
              grilleSecondaireYDistance: 2,
              grilleSecondaireYMin: 0,
              grilleSecondaireYMax: 100,
              grilleSecondaireYOpacite: 0.1
            })

            const gr = courbeInterpolee(
              [
                [x0, y0], [x1, y1], [x2, y2], [x3, y3]
              ],
              {
                color: 'blue',
                epaisseur: 2,
                repere: r1,
                xMin: 0,
                xMax: 800
              })

            const graphique = mathalea2d({
              xmin: -2,
              xmax: 24,
              ymin: -2,
              ymax: 16,
              pixelsParCm: 20,
              scale: 0.5,
              style: 'margin: auto'
            }
            , r1, o, gr, Tk)
            texte = `  Voici la courbe représentative d'une fonction $${nom}$.<br>
            Dresser son tableau de variations sur son ensemble de définition.<br><br>`
            texte += `${graphique}`

            texteCorr = `La fonction $${nom}$ est définie sur $[${x0}\\,;\\,${x3}]$.<br>
                Son tableau de variations est : <br><br>`
            texteCorr += tableauDeVariation({
              tabInit: [
                [
                  // Première colonne du tableau avec le format [chaine d'entête, hauteur de ligne, nombre de pixels de largeur estimée du texte pour le centrage]
                  ['$x$', 1.5, 10], [`$${nom}(x)$`, 4, 30]
                ],
                // Première ligne du tableau avec chaque antécédent suivi de son nombre de pixels de largeur estimée du texte pour le centrage
                [`$${x0}$`, 10, `$${x1}$`, 10, `$${x2}$`, 10, `$${x3}$`, 10]
              ],
              // tabLines ci-dessous contient les autres lignes du tableau.
              tabLines: [['Var', 10, `+/$${y0}$`, 10, `-/$${y1}$`, 10, `+/$${y2}$`, 10, `-/$${y3}$`, 10]],
              colorBackground: '',
              espcl: 3, // taille en cm entre deux antécédents
              deltacl: 1, // distance entre la bordure et les premiers et derniers antécédents
              lgt: 3, // taille de la première colonne en cm
              hauteurLignes: [15, 15]
            })
            variables.push(x0, x1, x2, x3, y0, y1, y2, y3)
          }

          break
      }
      if (this.questionJamaisPosee(i, variables.map(String).join(''))) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
