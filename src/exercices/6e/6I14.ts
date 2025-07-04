import { shuffle } from '../../lib/outils/arrayOutils'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d, type NestedObjetMathalea2dArray } from '../../modules/2dGeneralites'
import { ajouteQuestionMathlive } from '../../lib/interactif/questionMathLive'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import { listeShapesDef } from '../../lib/2d/figures2d/shapes2d'
import { patternsRepetition, type PatternRicheRepetition } from '../../lib/2d/patterns/patternsPreDef'
import { createList } from '../../lib/format/lists'
import { texteParPosition } from '../../lib/2d/textes'
// import type { VisualPattern } from '../../lib/2d/patterns/VisualPattern'
import { emoji } from '../../lib/2d/figures2d/Emojis'
import { emojis } from '../../lib/2d/figures2d/listeEmojis'
import { VisualPattern } from '../../lib/2d/patterns/VisualPattern'

export const titre = 'Comprendre un algorithme répétitif'
export const interactifReady = true
export const interactifType = 'mathLive'

// Gestion de la date de publication initiale
export const dateDePublication = '29/06/2025'

/**
 * Étudier les premiers termes d'une série de motifs afin de donner le nombre de formes ${['e','a','é','i','o','u','y','è','ê'].includes(pattern.shapes[0][0]) ? 'd\'':'de'}${pattern.shapes[0]} du motif suivant.
 * Les patterns sont des motifs numériques qui évoluent selon des règles définies.
 * Cet exercice contient des patterns issus de l'excellent site : https://www.visualpatterns.org/
 * @author Jean-Claude Lhote
 */
export const uuid = '328c3'

export const refs = {
  'fr-fr': ['6I14'],
  'fr-ch': []
}

export default class PaternRepetitif extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.comment = `Étudier les premiers termes d'une série de formes afin de donner une forme de rang quelconque.\n
 Les patterns sont des motifs numériques qui évoluent selon des règles définies.\n
 Cet exercice contient des patterns créés par Jean-Claude Lhote d'après une idée de Sophie Roubin`
    this.besoinFormulaireCaseACocher = ['Nombre de formes augmenté', false]
    this.sup = false
    this.besoinFormulaire4Texte = ['Types de questions', 'Nombres séparés par des tirets\n1:forme suivante dans une liste\n2 : forme de rang pas trop éloigné\n3 : forme de rang important\n4 : 42e forme \n5 Question au hasard parmi les 4 précédentes']
    this.sup4 = '6'
    this.besoinFormulaire5Numerique = ['Numéro de pattern (uniquement si 1 seule question)', 100,]
    this.sup5 = 1
  }

  nouvelleVersion (): void {
    if (this.sup5 > patternsRepetition.length) {
      this.sup5 = patternsRepetition.length
    }
    if (this.sup5 < 1) {
      this.sup5 = 1
    }

    const listePreDef = this.nbQuestions === 1
      ? [patternsRepetition[Number(this.sup5) - 1]]
      : shuffle(patternsRepetition)
    const formeAdd = this.sup ? 1 : 0
    const typesQuestions = Array.from(new Set(gestionnaireFormulaireTexte({ saisie: this.sup4, min: 1, max: 4, defaut: 1, melange: 5, nbQuestions: 4, shuffle: false }).map(Number)))
    let indexInteractif = 0
    for (let i = 0; i < this.nbQuestions;) {
      const objetsCorr: NestedObjetMathalea2dArray = []
      const objets: NestedObjetMathalea2dArray = []
      const popped = listePreDef.pop()
      if (!popped) {
        continue
      }
      const pat = popped
      const pattern = new VisualPattern([])
      const nbFigures = pat.nbMotifMin + formeAdd
      const numeroPasTropLoin = randint(nbFigures + 5, nbFigures + 20)
      const numeroTresLoin = randint(6, 9) * 100 + randint(1, 99)

      const pat2D = pat as PatternRicheRepetition
      pattern.iterate = (pat as PatternRicheRepetition).iterate
      pattern.shapes = pat.shapes
      for (const forme of new Set(pat2D.shapes)) {
        if (forme in listeShapesDef) {
          objetsCorr.push(listeShapesDef[forme])
          objets.push(listeShapesDef[forme])
        } else {
          objetsCorr.push(emoji(forme, emojis[forme]).shapeDef)
          objets.push(emoji(forme, emojis[forme]).shapeDef)
        }
      }
      for (let j = 1; j <= nbFigures; j++) {
        objets.push(pattern.render(j, j, 0))
      }
      objetsCorr.push(pattern.render(nbFigures + 1, 0, 0))
      let texte = `Voici les ${nbFigures} premières formes d'une série. Ils évoluent selon des règles définies.<br>`
      objets.push(texteParPosition(`Les ${nbFigures} premières formes`, nbFigures / 2, 1.5, 0, 'black', 0.8, 'milieu'))
      texte += mathalea2d(Object.assign(fixeBordures(objets, { rxmin: 0, rymin: -1, rxmax: 0, rymax: 1 }), { pixelsParCm: 20, scale: 0.4, optionsTikz: 'transform shape' }), objets)
      let texteCorr = ''
      const listeQuestions: string[] = []
      const listeCorrections: string[] = []
      for (const q of typesQuestions) {
        switch (q) {
          case 1:
            listeQuestions.push(`\nQuelle est la prochaine forme de la série ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: indexInteractif++,
              objetReponse: { reponse: { value: pat.fonctionShape(nbFigures + 1) } },
              typeInteractivite: 'texte'
            }
          )}`)
            listeCorrections.push(`Voici le motif $${nbFigures + 1}$ :<br>
              ${mathalea2d(Object.assign(fixeBordures(objetsCorr, { rxmin: 0, rymin: -1, rxmax: 0, rymax: 1 }), { scale: 0.4, optionsTikz: 'transform shape' }), objetsCorr)}`)
            break
          case 2:
            listeQuestions.push(`\nQuelle sera la forme numéro $${numeroPasTropLoin}$ de la série (donner juste le nom sans article) ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: indexInteractif++,
              objetReponse: { reponse: { value: pat.fonctionShape(numeroPasTropLoin) } },
              typeInteractivite: 'texte'
            }
          )}`)
            listeCorrections.push(`La forme numéro $${numeroPasTropLoin}$ est en forme de ${texteEnCouleurEtGras(pat.fonctionShape(numeroPasTropLoin))}.<br>`)
            break
          case 3:
            listeQuestions.push(`\nQuelle sera la forme numéro $${numeroTresLoin}$ de la série (donner juste le nom sans article) ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: indexInteractif++,
              objetReponse: { reponse: { value: pat.fonctionShape(numeroTresLoin) } },
              typeInteractivite: 'texte'
            }
          )}`)
            listeCorrections.push(`La forme numéro $${numeroTresLoin}$ est en forme de ${texteEnCouleurEtGras(pat.fonctionShape(numeroTresLoin))}.<br>`)

            break
          case 4:
            listeQuestions.push(`\nQuelle sera la forme numéro $42$ de la série (donner juste le nom sans article) ?<br>${ajouteQuestionMathlive(
            {
exercice: this,
              question: indexInteractif++,
              objetReponse: { reponse: { value: pat.fonctionShape(42) } },
              typeInteractivite: 'texte'
            }
          )}`)
            listeCorrections.push(`La forme numéro $42$ est en forme de ${texteEnCouleurEtGras(pat.fonctionShape(42))}.<br>`)

            break
        }
      }
      texte += listeQuestions.length === 1
        ? listeQuestions[0]
        : createList({
          items: listeQuestions,
          style: 'alpha',
        })
      texteCorr += listeCorrections.length === 1
        ? listeCorrections[0]
        : createList({
          items: listeCorrections,
          style: 'alpha',
        })
      this.listeQuestions.push(texte)
      this.listeCorrections.push(texteCorr)
      i++
    }
  }
}
