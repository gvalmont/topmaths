import { polygone } from '../../lib/2d/polygones'
import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d, type NestedObjetMathalea2dArray } from '../../modules/2dGeneralites'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../lib/outils/embellissements'
import { gestionnaireFormulaireTexte } from '../../modules/outils'
import { balleDef, carreDef, carreRondDef, hexagoneDef, listeShapes2DNames, listeShapesDef, losangeDef, redCrossDef, rondDef, triangleEquilateralDef } from '../../lib/2d/figures2d/shapes2d'
import { listePatternAffine, listePatternAutres, listePatternDegre2, listePatternDegre3, listePatternLineaire, listePatternsPreDef, type PatternRiche, type PatternRiche3D } from '../../lib/2d/patterns/patternsPreDef'
import { texteParPosition } from '../../lib/2d/textes'
import { point } from '../../lib/2d/points'
// import type { VisualPattern } from '../../lib/2d/patterns/VisualPattern'
import { cubeDef, project3dIso, Shape3D, shapeCubeIso, updateCubeIso } from '../../lib/2d/figures2d/Shape3d'
import { VisualPattern3D } from '../../lib/2d/patterns/VisualPattern3D'
import { context } from '../../modules/context'
import { emoji } from '../../lib/2d/figures2d/Emojis'
import { emojis } from '../../lib/2d/figures2d/listeEmojis'
import { VisualPattern } from '../../lib/2d/patterns/VisualPattern'

export const titre = 'Définir une expression littérale à partir d\'un pattern numérique'
export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '23/06/2025'

/**
 * Étudier les premiers termes d'une série de motifs afin de donner le nombre de formes du motif de rang n.
 * Les patterns sont des motifs numériques qui évoluent selon des règles définies.
 * Cet exercice contient des patterns issus de l'excellent site : https://www.visualpatterns.org/
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
    this.comment = 'Cet exercice contient des patterns issus de l\'excellent site : https://www.visualpatterns.org/'
    this.besoinFormulaireNumerique = ['Nombre de figures par question', 4]
    this.sup = 3
    this.besoinFormulaire2Texte = ['Types de formules au menu (cumulatif)', 'Nombres séparés par des tirets\n1 : Linéaire\n2 : Affine\n3 : Quadratique\n4 : Cubique\n5 : Autre\n6 : Mélange']
    this.sup2 = '1-2'
    this.besoinFormulaire3Texte = ['formes', 'Nombres séparés par des tirets\n1: Carrés\n2 : Étoile\n3 : Carrés arrondis\n4: Chat\n5 : Soleil\n6 : Losange\n7 : Hexagone\n8: Cercle\n9: Balle de tennis\n10 : Mélange']
    this.sup3 = '10'
    this.besoinFormulaire5Numerique = ['Numéro de pattern (uniquement si 1 seule question)', 100,]
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
    const numbers = this.sup2.split('-').map(Number)
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
          listeSelection.push(...listePatternAutres)
          break
        case 6:
        default:
          listeSelection.push(...listePatternsPreDef)
          break
      }
    }
    const listePreDef = this.nbQuestions === 1
      ? [listePatternsPreDef[Number(this.sup5) - 1]]
      : shuffle(listeSelection)
    const nbFigures = Math.max(2, this.sup)
    // const typesMotifs = gestionnaireFormulaireTexte({ saisie: this.sup2, min: 1, max: 2, defaut: 3, melange: 3, nbQuestions: this.nbQuestions }).map(Number)
    const formes = gestionnaireFormulaireTexte({ saisie: this.sup3, min: 1, max: 9, defaut: 10, melange: 10, nbQuestions: this.nbQuestions }).map(Number)
    // const patterns : (VisualPattern | VisualPattern3D)[] = [] à voir si on le réactive pour apiGeom.
    for (let i = 0; i < this.nbQuestions;) {
      const objetsCorr: NestedObjetMathalea2dArray = []
      const popped = listePreDef.pop()
      if (!popped) {
        continue
      }
      const pat = popped
      const pattern = ('shapeDefault' in pat && pat.shapeDefault) ? new VisualPattern3D([]) : new VisualPattern([])

      //  patterns.push(pattern)

      if (pattern instanceof VisualPattern3D) {
        pattern.shape = (pat as PatternRiche3D).shapeDefault as Shape3D ?? shapeCubeIso() as Shape3D
        pattern.iterate3d = (pat as PatternRiche3D).iterate3d
        objetsCorr.push(cubeDef(`cubeIsoQ${i}F0`))
      } else {
        const pat2D = pat as PatternRiche
        pattern.iterate = (pat as PatternRiche).iterate
        if (pat2D.shapes[0] === pat2D.shapes[1] || !pat2D.shapes[1]) {
          pattern.shapes = [listeShapes2DNames[formes[i]]]
          switch (formes[i]) {
            case 2:
              pattern.shapes[0] = 'étoile'
              pattern.shapes[1] = 'étoile'
              objetsCorr.push(emoji('étoile', emojis['étoile']).shapeDef)
              break
            case 3:
              pattern.shapes[0] = 'carréRond'
              pattern.shapes[1] = 'carréRond'
              objetsCorr.push(carreRondDef)
              break
            case 4:
              pattern.shapes[0] = 'chat'
              pattern.shapes[1] = 'chat'
              objetsCorr.push(emoji('chat', emojis['chat']).shapeDef)
              break
            case 5:
              pattern.shapes[0] = 'soleil'
              pattern.shapes[1] = 'soleil'
              objetsCorr.push(emoji('soleil', emojis['soleil']).shapeDef)
              break
            case 6:
              pattern.shapes[0] = 'losange'
              pattern.shapes[1] = 'losange'
              objetsCorr.push(losangeDef)
              break
            case 7:
              pattern.shapes[0] = 'hexagone'
              pattern.shapes[1] = 'hexagone'
              objetsCorr.push(hexagoneDef)
              break
            case 8:
              pattern.shapes[0] = 'rond'
              pattern.shapes[1] = 'rond'
              objetsCorr.push(rondDef)
              break
            case 9:
              pattern.shapes[0] = 'balle'
              pattern.shapes[1] = 'balle'
              objetsCorr.push(balleDef)
              break
            case 10:
              pattern.shapes[0] = 'tortue'
              pattern.shapes[1] = 'tortue'
              objetsCorr.push(emoji('tortue', emojis['tortue']).shapeDef)
              break
            case 11:
              pattern.shapes[0] = 'triangle'
              pattern.shapes[1] = 'triangle'
              objetsCorr.push(triangleEquilateralDef)
              break
            case 12:
              pattern.shapes[0] = 'redCross'
              pattern.shapes[1] = 'redCross'
              objetsCorr.push(redCrossDef)
              break
            case 1:
            default:
              pattern.shapes[0] = 'carré'
              pattern.shapes[1] = 'carré'
              objetsCorr.push(carreDef)
              break
          }
        } else {
          if (pat2D.shapes[0] in listeShapesDef) {
            objetsCorr.push(listeShapesDef[pat2D.shapes[0]])
            if (pat2D.shapes[1] in listeShapesDef) {
              if (pat2D.shapes[1] !== pat2D.shapes[0]) {
                if (pat2D.shapes[1] in listeShapesDef) objetsCorr.push(listeShapesDef[pat2D.shapes[1]])
                else if (Object.keys(emojis).includes(pat2D.shapes[1])) objetsCorr.push(emoji(pat2D.shapes[1], emojis[pat2D.shapes[1]]).shapeDef)
              }
            } else if (Object.keys(emojis).includes(pat2D.shapes[1])) {
              const code = emojis[pat2D.shapes[1]]
              objetsCorr.push(emoji(pat2D.shapes[1], code).shapeDef)
            } else {
              console.warn(`Shape ${pat2D.shapes[1]} n'est pas dans listeShapesDef ou emojis`)
            }
          } else if (Object.keys(emojis).includes(pat2D.shapes[0])) {
            const code = emojis[pat2D.shapes[0]]
            objetsCorr.push(emoji(pat2D.shapes[0], code).shapeDef)
          }
        }
      }

      const rendered = pattern.render(nbFigures + 1, 0, 0, Math.PI / 6)
      objetsCorr.push(...rendered)
      let yMax = 0
      let yMin = 0
      const angle = Math.PI / 6
      let texte = `Voici les ${nbFigures} premiers motifs d'une série de motifs numériques. Ils évoluent selon des règles définies.<br>`
      const figures: NestedObjetMathalea2dArray[] = []
      for (let j = 0; j < nbFigures; j++) {
        figures[j] = []
        if (pattern instanceof VisualPattern3D) {
          figures[j].push(cubeDef(`cubeIsoQ${i}F${j}`))
        } else {
          const pat2D = pat as PatternRiche
          if (pat2D.shapes[0] === pat2D.shapes[1] || !pat2D.shapes[1]) {
            switch (formes[i]) {
              case 2:
                figures[j].push(emoji('étoile', emojis['étoile']).shapeDef)
                break
              case 3:
                figures[j].push(carreRondDef)
                break
              case 4:
                figures[j].push(emoji('chat', emojis['chat']).shapeDef)
                break
              case 5:
                figures[j].push(emoji('soleil', emojis['soleil']).shapeDef)
                break
              case 6:
                figures[j].push(losangeDef)
                break
              case 7:
                figures[j].push(hexagoneDef)
                break
              case 8:
                figures[j].push(rondDef)
                break
              case 9:
                figures[j].push(balleDef)
                break
              case 10:
                figures[j].push(emoji('tortue', emojis['tortue']).shapeDef)
                break
              case 11:
                figures[j].push(triangleEquilateralDef)
                break
              case 12:
                figures[j].push(redCrossDef)
                break
              case 1:
              default:
                figures[j].push(carreDef)
                break
            }
          } else {
            if (pat2D.shapes[0] in listeShapesDef) figures[j].push(listeShapesDef[pat2D.shapes[0]])
            else if (Object.keys(emojis).includes(pat2D.shapes[0])) {
              const code = emojis[pat2D.shapes[0]]
              figures[j].push(emoji(pat2D.shapes[0], code).shapeDef)
            } else {
              console.warn(`Shape ${pat2D.shapes[0]} n'est pas dans listeShapesDef ou emojis`)
            }
            if (pat2D.shapes[1] !== pat2D.shapes[0]) {
              if (pat2D.shapes[1] in listeShapesDef) figures[j].push(listeShapesDef[pat2D.shapes[1]])
              else if (Object.keys(emojis).includes(pat2D.shapes[1])) {
                const code = emojis[pat2D.shapes[1]]
                figures[j].push(emoji(pat2D.shapes[1], code).shapeDef
                )
              } else {
                console.warn(`Shape ${pat2D.shapes[1]} n'est pas dans listeShapesDef ou emojis`)
              }
            }
          }
        }

        let xmin = Infinity
        let ymin = Infinity
        let xmax = -Infinity
        let ymax = -Infinity
        if (pattern instanceof VisualPattern3D) {
          if (context.isHtml) {
            updateCubeIso(pattern, i, j, angle)
            pattern.shape.codeSvg = `<use href="#cubeIsoQ${i}F${j}"></use>`
            const cells = (pattern as VisualPattern3D).render3d(j + 1)
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
      texte += `<br>Quel sera le nombre ${['e', 'a', 'é', 'i', 'o', 'u', 'y', 'è', 'ê'].includes(pattern.shapes[0]) ? 'd\'' : 'de '}${pattern.shapes}s dans le motif au rang $n$ en fonction de $n$ ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: i,
              objetReponse: { reponse: { value: pat.formule } },
              typeInteractivite: 'mathlive'
            }
          )}`

      texteCorr += `Le motif de rang $n$ contiendra $${miseEnEvidence(pat.formule)}$ formes ${['e', 'a', 'é', 'i', 'o', 'u', 'y', 'è', 'ê'].includes(pattern.shapes[0]) ? 'd\'' : 'de '}${pattern.shapes[0]}s.<br>`
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
  }
}
