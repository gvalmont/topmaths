import { polygone } from '../../lib/2d/polygones'
import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d, type NestedObjetMathalea2dArray } from '../../modules/2dGeneralites'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { listeShapesDef, type ShapeName } from '../../lib/2d/figures2d/shapes2d'
import { listePatternRatio, type PatternRiche } from '../../lib/2d/patterns/patternsPreDef'
import { texteParPosition } from '../../lib/2d/textes'
import { point } from '../../lib/2d/points'
// import type { VisualPattern } from '../../lib/2d/patterns/VisualPattern'
import { VisualPattern } from '../../lib/2d/patterns/VisualPattern'
import { miseEnEvidence } from '../../lib/outils/embellissements'

export const titre = 'Trouver le ratio d\'évolution d\'un motif numérique'
export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '26/06/2025'

/**
 * Étudier les premiers termes d'une série de motifs afin de donner le nombre de formes du motif de rang n sous forme de ratio.
 * Les patterns sont des motifs numériques qui évoluent selon des règles définies.
 * Cet exercice contient des patterns issus de l'excellent site : https://www.visualpatterns.org/
 * @author Jean-Claude Lhote
 */
export const uuid = '328b8'

export const refs = {
  'fr-fr': ['5P12-2'],
  'fr-ch': []
}
const pluriels: Record<ShapeName, string> = {
  carré: 'carrés',
  triangle: 'triangles',
  rond: 'ronds',
  losange: 'losanges',
  hexagone: 'hexagones',
  carréBleu: 'carrés bleus',
  redCross: 'croix rouges',
  carréRond: 'carrés ronds',
  étoile: 'étoiles',
  soleil: 'soleils',
  chat: 'chats',
  tortue: 'tortues',
  hexagoneBlanc: 'hexagones blancs',
}

export default class PaternNum1 extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.comment = 'Cet exercice contient des patterns issus de l\'excellent site : https://www.visualpatterns.org/'
    this.besoinFormulaireNumerique = ['Nombre de figures par question', 4]
    this.sup = 3
  }

  nouvelleVersion (): void {
    const listePat: PatternRiche[] = shuffle(listePatternRatio).filter(pat => pat.pattern instanceof VisualPattern) as PatternRiche[]
    const nbFigures = Math.max(2, this.sup)
    for (let i = 0; i < this.nbQuestions;) {
      const objetsCorr: NestedObjetMathalea2dArray = []
      const popped = listePat.pop()
      if (!popped) {
        continue
      }
      const pat = popped
      const pattern = new VisualPattern([])
      pattern.iterate = pat.iterate
      pattern.shapes = pat.shapes

      //  patterns.push(pattern)

      for (const name of pat.shapes) {
        objetsCorr.push(listeShapesDef[name])
      }
      const rendered = pattern.render(nbFigures + 1, 0, 0)
      objetsCorr.push(...rendered)
      let yMax = 0
      let yMin = 0
      let texte = `Voici les ${nbFigures} premiers motifs d'une série de motifs numériques. Ils évoluent selon des règles définies.<br>`
      const figures: NestedObjetMathalea2dArray[] = []
      for (let j = 0; j < nbFigures; j++) {
        figures[j] = []
        for (const name of pat.shapes) {
          figures[j].push(listeShapesDef[name])
        }

        let xmin = Infinity
        let ymin = Infinity
        let xmax = -Infinity
        let ymax = -Infinity

        figures[j].push(...pattern.render(j + 1, 0, 0))
        ;({ xmin, ymin, xmax, ymax } = fixeBordures(figures[j]))
        figures[j].push(texteParPosition(`Motif ${j + 1}`, (xmax + xmin + 1) / 2, ymin - 1.5, 0, 'black', 0.8, 'milieu'))
        const cadre = polygone(point(xmin - 2, ymin - 2), point(xmax + 2, ymin - 2), point(xmax + 2, ymax + 2), point(xmin - 2, ymax + 2))
        cadre.pointilles = 4
        figures[j].push(cadre)
        yMax = Math.max(yMax, ymax)
        yMin = Math.min(yMin, ymin)
      }
      texte += figures.map((fig, index) => mathalea2d(Object.assign(fixeBordures(fig, { rxmin: 0, rymin: -1, rxmax: 0, rymax: 1 }), { id: `Motif${i}F${index}`, pixelsParCm: 20, yMax, yMin, scale: 0.4, style: 'display: inline-block', optionsTikz: 'transform shape' }), fig)).join('\n')
      let texteCorr = ''
      texte += `<br>Donner le ratio "${pat.shapes.map(name => pluriels[name]).join(' : ')}" dans le motif au rang $${nbFigures + 1}$ ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: i,
              objetReponse: { reponse: { value: pat.formule } },
              typeInteractivite: 'mathlive'
            }
          )}`
      if (!pat.fonctionRatio) {
        throw new Error(`La fonction ratio n'est pas définie pour le pattern ${JSON.stringify(pat)}`)
      }
      const ratio = pat.fonctionRatio(nbFigures + 1)
      texteCorr += `Au rang $${nbFigures + 1}$ le ratio "${pat.shapes.join(' : ')}" sera $${miseEnEvidence(ratio.toLatex())}$.<br>`
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
  }
}
