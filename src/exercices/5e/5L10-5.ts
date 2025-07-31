import { polygone } from '../../lib/2d/polygones'
import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d, type NestedObjetMathalea2dArray } from '../../modules/2dGeneralites'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { gestionnaireFormulaireTexte } from '../../modules/outils'
import { listeShapes2DInfos } from '../../lib/2d/figures2d/shapes2d'
import { listePatternAffine, listePatternDegre2, listePatternDegre3, listePatternLineaire, listePatternsPreDef, type PatternRiche, type PatternRiche3D } from '../../lib/2d/patterns/patternsPreDef'
import { texteParPosition } from '../../lib/2d/textes'
import { point } from '../../lib/2d/points'
// import type { VisualPattern } from '../../lib/2d/patterns/VisualPattern'
import { cubeDef, project3dIso, shapeCubeIso, updateCubeIso } from '../../lib/2d/figures2d/Shape3d'
import { VisualPattern3D } from '../../lib/2d/patterns/VisualPattern3D'
import { context } from '../../modules/context'
import { VisualPattern } from '../../lib/2d/patterns/VisualPattern'

export const titre = 'Définir une expression littérale à partir d\'un modèle figuratif'
export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '23/06/2025'

/**
 * Étudier les premiers termes d'une série de motifs afin de donner le nombre de formes du motif de rang n.
 * Les patterns sont des motifs figuratifs qui évoluent selon des règles définies.
 * Cet exercice contient des modèles issus de l'excellent site : https://www.visualpatterns.org/
 * @author Jean-Claude Lhote
 */
export const uuid = '328b4'

export const refs = {
  'fr-fr': ['5L10-5'],
  'fr-ch': []
}

export default class PaternNum1 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.comment = 'Cet exercice contient des modèles issus de l\'excellent site : https://www.visualpatterns.org/'
    this.besoinFormulaireNumerique = ['Nombre de figures par question', 4]
    this.sup = 3
    this.besoinFormulaire2Texte = ['Types de formules au menu (cumulatif)', 'Nombres séparés par des tirets\n1 : Linéaire\n2 : Affine\n3 : Quadratique\n4 : Cubique\n5 : Mélange']
    this.sup2 = '1-2'
    this.besoinFormulaire5Numerique = ['Numéro de modèle (uniquement si 1 seule question)', 100,]
    this.sup5 = 1
  }

  nouvelleVersion (): void {
    if (this.sup5 > listePatternsPreDef.length) {
      this.sup5 = listePatternsPreDef.length
    }
    if (this.sup5 < 1) {
      this.sup5 = 1
    }
    const listeSelection: (PatternRiche | PatternRiche3D)[] = []
    const numbers = new Set(gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: this.nbQuestions }).map(Number))
    for (const n of numbers) {
      switch (n) {
        case 1:
          listeSelection.push(...listePatternLineaire)
          break
        case 2:
          listeSelection.push(...listePatternAffine)
          break
        case 3:
          listeSelection.push(...listePatternDegre2)
          break
        case 4:
          listeSelection.push(...listePatternDegre3)
          break
        case 5:
        default:
          listeSelection.push(...listePatternsPreDef)
          break
      }
    }
    const listePreDef = this.nbQuestions === 1
      ? [listePatternsPreDef[Number(this.sup5) - 1]]
      : shuffle(listeSelection)
    const nbFigures = Math.max(2, this.sup)
    for (let i = 0; i < this.nbQuestions;) {
      const objetsCorr: NestedObjetMathalea2dArray = []
      const popped = listePreDef.pop()
      if (!popped) {
        continue
      }
      const pat = popped
      const pattern = ('iterate3d' in pat) ? new VisualPattern3D({ initialCells: [], prefixId: `Ex${this.numeroExercice}Q${i}`, shapes: pat.shapes, type: 'iso' }) : new VisualPattern([])

      if ('iterate3d' in pattern) {
        pattern.shape = shapeCubeIso()
        pattern.iterate3d = (pat as PatternRiche3D).iterate3d
        objetsCorr.push(cubeDef(`cubeIsoQ${i}F0`))
      } else {
        const pat2D = pat as PatternRiche
        pattern.iterate = (pat as PatternRiche).iterate
        pattern.shapes = pat2D.shapes || ['carré', 'carré']

        if (pat2D.shapes[0] in listeShapes2DInfos) objetsCorr.push(listeShapes2DInfos[pat2D.shapes[0]].shapeDef)
        else {
          console.warn(`Shape ${pat2D.shapes[0]} n'est pas dans listeShapesDef ou emojis`)
        }
        if (pat2D.shapes[1] && pat2D.shapes[1] !== pat2D.shapes[0]) {
          if (pat2D.shapes[1] in listeShapes2DInfos) objetsCorr.push(listeShapes2DInfos[pat2D.shapes[1]].shapeDef)
          else {
            console.warn(`Shape ${pat2D.shapes[1]} n'est pas dans listeShapesDef ou emojis`)
          }
        }
      }

      const rendered = pattern.render(nbFigures + 1, 0, 0, Math.PI / 6)
      objetsCorr.push(...rendered)
      let yMax = 0
      let yMin = 0
      const angle = Math.PI / 6
      let texte = `Voici les ${nbFigures} premiers motifs d'une série de motifs figuratifs. Les motifs se succèdent selon une règle bien définie.<br>`
      const figures: NestedObjetMathalea2dArray[] = []
      for (let j = 0; j < nbFigures; j++) {
        figures[j] = []
        if ('iterate3d' in pattern) {
          figures[j].push(cubeDef(`cubeIsoQ${i}F${j}`))
        } else {
          const pat2D = pat as PatternRiche
          for (const shape of pat2D.shapes) {
            if (shape in listeShapes2DInfos) figures[j].push(listeShapes2DInfos[shape].shapeDef)
            else {
              console.warn(`Shape ${shape} n'est pas dans listeShapesDef ou emojis.`)
            }
          }
        }

        let xmin = Infinity
        let ymin = Infinity
        let xmax = -Infinity
        let ymax = -Infinity
        if ('iterate3d' in pattern) {
          if (context.isHtml) {
            updateCubeIso({ pattern, i, j, angle, inCorrectionMode: false })
            if (pattern.shape == null) {
              pattern.shape = shapeCubeIso(`cubeIsoQ${i}F${j}`, 0, 0, { fillStyle: '#ffffff', strokeStyle: '#000000', lineWidth: 1, opacite: 1, scale: 1 })
            }
            pattern.shape.codeSvg = `<use href="#cubeIsoQ${i}F${j}"></use>`
            const cells = (pattern as VisualPattern3D).update3DCells(j + 1)
            // Ajouter les SVG générés par svg() de chaque objet
            cells.forEach(cell => {
              const [px, py] = project3dIso(cell[0], cell[1], cell[2], angle)
              const obj = shapeCubeIso(`cubeIsoQ${i}F${j}`, px, py)
              figures[j].push(obj)
              ymin = Math.min(ymin, -py / 20)
              ymax = Math.max(ymax, -py / 20)
              xmin = Math.min(xmin, px / 20)
              xmax = Math.max(xmax, px / 20)
            })
            xmin -= 1
            xmax += 1
          } else {
            figures[j].push(...(pattern as VisualPattern3D).render(j + 1, 0, 0, Math.PI / 6))
            ;({ xmin, ymin, xmax, ymax } = fixeBordures(figures[j]))
          }
        } else {
          figures[j].push(...pattern.render(j + 1, 0, 0))
          ;({ xmin, ymin, xmax, ymax } = fixeBordures(figures[j]))
        }
        figures[j].push(texteParPosition(`Motif ${j + 1}`, (xmax + xmin + 1) / 2, ymin - 1.5, 0, 'black', 0.8, 'milieu'))
        const cadre = polygone(point(xmin - 1, ymin - 2), point(xmax + 2, ymin - 2), point(xmax + 2, ymax + 2), point(xmin - 1, ymax + 2))
        cadre.pointilles = 4
        figures[j].push(cadre)
        yMax = Math.max(yMax, ymax)
        yMin = Math.min(yMin, ymin)
      }
      texte += figures.map((fig, index) => mathalea2d(Object.assign(fixeBordures(fig, { rxmin: 0, rymin: -1, rxmax: 0, rymax: 1 }), { id: `Motif${i}F${index}`, pixelsParCm: 20, yMax, yMin, scale: 0.4, style: 'display: inline-block', optionsTikz: 'transform shape' }), fig)).join('\n')
      let texteCorr = ''

      const nbFormes = pat.fonctionNb(nbFigures + 1)
      const nbTex = miseEnEvidence(nbFormes)
      texteCorr += `Le motif de rang $n$ contient $${nbTex}$ formes.<br>`
      texteCorr += `En effet, la formule pour trouver le nombre de formes est : $${miseEnEvidence(pat.formule.replaceAll('n', 'n'))}$.<br>`
      texte += `<br>Quel sera le nombre de formes dans le motif au rang $n$ en fonction de $n$ ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: i,
              objetReponse: { reponse: { value: pat.formule } },
              typeInteractivite: 'mathlive'
            }
          )}`

      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
  }
}
