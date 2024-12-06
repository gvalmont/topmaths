import { Point, point, pointSurDroite, tracePoint } from '../../lib/2d/points.js'
import { demiDroite, longueur } from '../../lib/2d/segmentsVecteurs.js'
import { rotation, translation2Points } from '../../lib/2d/transformations.js'
import Exercice from '../Exercice.js'
import { mathalea2d } from '../../modules/2dGeneralites.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import { Droite, droite, droiteParPointEtPente, droiteParPointEtPerpendiculaire } from '../../lib/2d/droites.js'
import { angleOriente, codageAngle } from '../../lib/2d/angles.js'
import { choixDeroulant } from '../../lib/interactif/questionListeDeroulante.js'
import { handleAnswers } from '../../lib/interactif/gestionInteractif.js'
import { fonctionComparaison } from '../../lib/interactif/comparisonFunctions.js'
import { range } from '../../lib/outils/nombres.js'
import { choice } from '../../lib/outils/arrayOutils.js'
import { bleuMathalea, vertMathalea } from '../../lib/colors.js'
import { number } from 'mathjs'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
import { context } from '../../modules/context'

export const interactifReady = true
export const interactifType = 'listeDeroulante'
export const titre = 'Connaître le vocabulaire sur les angles'
export const dateDePublication = '29/11/2024'

/**
 * Connaître le vocabulaire sur les angles
 * @author Éric Elter (sur un scénario voulu par Rémi Angot)
 */
export const uuid = '1f334'
export const refs = {
  'fr-fr': ['5G30-3'],
  'fr-ch': []
}

// Fonction pour vérifier si tous les points sont dans l'intervalle
function tousDansIntervalle (points: Point[]): boolean {
  return points.every(point => point.x >= -8 && point.x <= 8 && point.y >= -8 && point.y <= 8)
}

export default class VocabulaireAngles extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 3
    this.besoinFormulaireTexte = [
      'Vocabulaire de l\'exercice',
        `Nombres séparés par des tirets :
    1 : Correspondants
    2 : Alternes-internes
    3 : Supplémentaires
    4 : Opposés par le sommet
    5 : Complémentaires
    6 : Côté
    7 : Sommet
    8 : Adjacent
    9 : Mélange`
    ]
    this.besoinFormulaire2CaseACocher = ['Avec distracteur', false]
    this.sup = 9
  }

  nouvelleVersion () {
    const typesDeQuestionsDisponibles = gestionnaireFormulaireTexte({
      saisie: this.sup,
      min: 1,
      max: 8,
      melange: 9,
      defaut: 9,
      nbQuestions: this.nbQuestions
    })

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      let texteCorr = ''
      const objets = []

      const origine = point(0, 0)

      let ARot, BRot, CRot, DRot, IRot, JRot, E, F, G, H, d1Rot, d2Rot, d3Rot, d4Rot
      const distracteur = this.sup2
      do {
        const xA = randint(4, 8)
        const yA = randint(4, 8)
        const xB = xA * (-1)
        const yB = yA * (-1)

        const A = point(xA, yA)
        const B = point(xB, yB)
        const d1 = droiteParPointEtPente(A, 0.5)
        const d2 = droiteParPointEtPente(B, 0.3)
        let C
        do {
          C = pointSurDroite(d1, randint(-4, 4, [0]), 'C')
        } while (longueur(A, C) < 0.5)
        const D = pointSurDroite(d2, 1.5, 'D')
        const d3 = droite(C, D, '', 'red')
        const d4 = droiteParPointEtPerpendiculaire(C, d3)

        const choix = randint(0, 3) * 90

        ARot = rotation(A, origine, choix)
        BRot = rotation(B, origine, choix)
        CRot = rotation(C, origine, choix)
        DRot = rotation(D, origine, choix)
        d1Rot = rotation(d1, origine, choix) as Droite
        d2Rot = rotation(d2, origine, choix) as Droite
        d3Rot = rotation(d3, origine, choix) as Droite
        d4Rot = rotation(d4, origine, choix) as Droite
        E = translation2Points(CRot, ARot, CRot)
        F = translation2Points(DRot, BRot, DRot)
        G = translation2Points(CRot, DRot, CRot)
        H = translation2Points(DRot, CRot, DRot)

        // I et J sont sur la droite perpendiculaire, leur usage sera en fonction des angles affichés pour éviter la superposition
        // I = pointSurDroite(d4, ((C.x + A.x) / 2), 'I')
        // J = pointSurDroite(d4, ((C.x + E.x) / 2), 'J')
        // IRot = rotation(I, origine, choix)
        // JRot = rotation(J, origine, choix)
        IRot = pointSurDroite(d4Rot, ((CRot.x + ARot.x) / 2), 'I')
        JRot = pointSurDroite(d4Rot, ((CRot.x + E.x) / 2), 'I')
      } while (!tousDansIntervalle([ARot, BRot, CRot, DRot, E, F, G, H])) // Afin de ne pas avoir de placements de points qui puissent changer le format de la fenêtre prévue
      const tracePts = tracePoint(ARot, BRot, CRot, DRot, E, F, G, H, IRot, JRot, 'red') // Variable qui trace les points avec une croix
      tracePts.epaisseur = 2

      const tabAngles = []
      const choixQuestion = number(typesDeQuestionsDisponibles[i]) - 1
      // const choixQuestion = 7
      let texteSousFigure = ''
      switch (choixQuestion) {
        case 0:
          // Angles correspondants
          texteCorr = `Ce sont des angles ${texteEnCouleurEtGras('correspondants')}.`
          // tabAngles contient deux angles correspondants puis un angle droit qui ne chevauche pas ces angles
          tabAngles.push([
            codageAngle(E, CRot, G, 2, '', 'red', 2, 1, 'red'),
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(E, CRot, DRot, 2, '', 'red', 2, 1, 'red'),
            codageAngle(BRot, DRot, H, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(G, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(ARot, CRot, DRot, 2, '', 'red', 2, 1, 'red'),
            codageAngle(F, DRot, H, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(G, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(ARot, CRot, G, 2, '', 'red', 2, 1, 'red'),
            codageAngle(F, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles bleu et rouge ? '
          break
        case 1:
          // Angles alternes-internes
          texteCorr = `Ce sont des angles ${texteEnCouleurEtGras('alternes-internes')}.`
          // tabAngles contient deux angles alternes-internes puis un angle droit qui ne chevauche pas ces angles
          tabAngles.push([
            codageAngle(ARot, CRot, DRot, 2, '', 'red', 2, 1, 'red'),
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(G, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(E, CRot, DRot, 2, '', 'red', 2, 1, 'red'),
            codageAngle(CRot, DRot, F, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(G, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles bleu et rouge ? '
          break
        case 2:
          // Angles supplémentaires
          texteCorr = `Ce sont des angles  ${texteEnCouleurEtGras('supplémentaires')} car la somme de leurs mesures est égale à 180° (angle plat).`
          // tabAngles contient deux angles supplémentaires puis un angle droit qui ne chevauche pas ces angles
          tabAngles.push([
            codageAngle(G, DRot, BRot, 2, '', 'red', 2, 1, 'red'),
            codageAngle(F, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(F, DRot, H, 2, '', 'red', 2, 1, 'red'),
            codageAngle(F, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(ARot, CRot, G, 2, '', 'red', 2, 1, 'red'),
            codageAngle(ARot, CRot, DRot, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(ARot, CRot, G, 2, '', 'red', 2, 1, 'red'),
            codageAngle(E, CRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles adjacents bleu et rouge ? '
          break
        case 3:
          // Angles opposés par le sommet
          texteCorr = `Ce sont des angles  ${texteEnCouleurEtGras('opposés')} par le sommet.`
          // tabAngles contient deux angles opposés par le sommet puis un angle droit qui ne chevauche pas ces angles
          if (Math.abs(angleOriente(G, CRot, ARot)) < 90) {
            tabAngles.push([
              codageAngle(G, CRot, ARot, 2, '', 'red', 2, 1, 'red'),
              codageAngle(E, CRot, H, 2, '', bleuMathalea, 2, 1, bleuMathalea),
              codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          }
          tabAngles.push([
            codageAngle(F, DRot, G, 2, '', 'red', 2, 1, 'red'),
            codageAngle(BRot, DRot, H, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(F, DRot, H, 2, '', 'red', 2, 1, 'red'), // OK
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles bleu et rouge ? '
          break
        case 4:
          // Angles complémentaires
          texteCorr = `Ce sont des angles  ${texteEnCouleurEtGras('complémentaires')} car la somme de leurs mesures est égale à 90° (angle droit).`
          // tabAngles contient deux angles complémentaires puis un angle droit qui chevauche ou pas ces angles selon si c'est un distracteur ou pas
          if (Math.abs(angleOriente(IRot, CRot, ARot)) + Math.abs(angleOriente(G, CRot, ARot)) === 90) {
            tabAngles.push([
              codageAngle(IRot, CRot, ARot, 3, '', 'red', 2, 1, 'red'),
              codageAngle(G, CRot, ARot, 3, '', bleuMathalea, 2, 1, bleuMathalea),
              codageAngle(G, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          } else if (Math.abs(angleOriente(IRot, CRot, ARot)) + Math.abs(angleOriente(DRot, CRot, ARot)) === 90) {
            tabAngles.push([
              codageAngle(DRot, CRot, ARot, 3, '', 'red', 2, 1, 'red'),
              codageAngle(IRot, CRot, ARot, 3, '', bleuMathalea, 2, 1, bleuMathalea),
              codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          } else {
            tabAngles.push([
              codageAngle(DRot, CRot, E, 3, '', 'black', 2, 1, 'red'),
              codageAngle(IRot, CRot, E, 3, '', bleuMathalea, 2, 1, bleuMathalea),
              codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          }
          if (distracteur) {
            if (Math.abs(angleOriente(G, CRot, ARot)) > 90) {
              tabAngles.push([
                codageAngle(IRot, CRot, ARot, 3, '', 'red', 2, 1, 'red'),
                codageAngle(DRot, CRot, ARot, 3, '', bleuMathalea, 2, 1, bleuMathalea),
                codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
              ])
            } else {
              tabAngles.push([
                codageAngle(JRot, CRot, E, 3, '', 'red', 2, 1, 'red'),
                codageAngle(DRot, CRot, E, 3, '', bleuMathalea, 2, 1, bleuMathalea),
                codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
              ])
            }
          }
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles adjacents bleu et rouge ? '
          break
        case 5:
          // Côté de l'angle
          texteCorr = `C'est un  ${texteEnCouleurEtGras('côté')} de l'angle, une demi-droite.`
          // tabAngles contient un angle et un de ses côtés puis un angle droit qui ne chevauche pas l'angle
          tabAngles.push([
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            demiDroite(DRot, BRot, 'red'),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            demiDroite(DRot, G, 'red'),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(E, CRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            demiDroite(CRot, G, 'red'),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(E, CRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            demiDroite(CRot, E, 'red'),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise la demi-droite en couleur pour l\'angle ? '
          break
        case 6:
          // Sommet de  l'angle
          texteCorr = `C'est le  ${texteEnCouleurEtGras('sommet')} de l'angle, un point.`
          // tabAngles contient un angle et le sommet de l'angle puis un angle droit qui ne chevauche pas l'angle
          tabAngles.push([
            codageAngle(BRot, DRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            point(DRot.x, DRot.y),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          tabAngles.push([
            codageAngle(E, CRot, G, 2, '', bleuMathalea, 2, 1, bleuMathalea),
            point(CRot.x, CRot.y),
            codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
          ])
          texteSousFigure = 'Qu\'est-ce qui caractérise le point en couleur pour l\'angle ? '
          break
        case 7:
          // Angles adjacents (non complémentaires)
          texteCorr = `Ce sont des angles  ${texteEnCouleurEtGras('adjacents')} car ils ont un sommet commun, ils ont un côté en commun et sont de part et d'autre de ce sommet.`
          // tabAngles contient deux angles adjacents (non complémentaires) puis un angle droit qui ne chevauche pas ces angles
          if (Math.abs(angleOriente(G, CRot, ARot)) > 90) {
            tabAngles.push([
              codageAngle(G, CRot, E, 3, '', 'red', 2, 1, 'red'),
              codageAngle(JRot, CRot, E, 3, '', bleuMathalea, 2, 1, bleuMathalea, undefined, undefined, true),
              codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
            tabAngles.push([
              codageAngle(G, CRot, E, 3, '', 'red', 2, 1, 'red'),
              codageAngle(IRot, CRot, G, 3, '', bleuMathalea, 2, 1, bleuMathalea, undefined, undefined, true),
              codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
            tabAngles.push([
              codageAngle(IRot, CRot, ARot, 3, '', 'red', 2, 1, 'red'),
              codageAngle(IRot, CRot, G, 3, '', bleuMathalea, 2, 1, bleuMathalea, undefined, undefined, true),
              codageAngle(DRot, CRot, JRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          } else {
            tabAngles.push([
              codageAngle(ARot, CRot, G, 3, '', 'red', 2, 1, 'red'),
              codageAngle(JRot, CRot, G, 3, '', bleuMathalea, 2, 1, bleuMathalea, undefined, undefined, true),
              codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
            tabAngles.push([
              codageAngle(JRot, CRot, E, 3, '', 'red', 2, 1, 'red'),
              codageAngle(JRot, CRot, G, 3, '', bleuMathalea, 2, 1, bleuMathalea, undefined, undefined, true),
              codageAngle(DRot, CRot, IRot, 1, '', vertMathalea, 2, 1, vertMathalea)
            ])
          }
          texteSousFigure = 'Qu\'est-ce qui caractérise les angles bleu et rouge ? '
          break
      }
      const choixPossibilitesAngles = range(tabAngles.length - 1)
      const choixAngle = choice(choixPossibilitesAngles)
      // const choixAngle = 0
      const ang1 = tabAngles[choixAngle][0]
      let objet2 = tabAngles[choixAngle][1] // objet2 est soit un angle, soit un segement
      if (choixQuestion === 5) objet2.epaisseur = 3
      else if (choixQuestion === 6) {
        objet2 = tracePoint(objet2, 'red')
        objet2.epaisseur = 2
        objet2.taille = 5
      }
      const ang3 = tabAngles[choixAngle][2]

      /*
      // Ne pas effacer : utile pour le débuggage
      const labelA = latexParPoint('A', ARot, 'red', 10, 12, '', 10)
      const labelB = latexParPoint('B', BRot, 'red', 10, 12, '', 10)
      const labelC = latexParPoint('C', CRot, 'red', 10, 12, '', 10)
      const labelD = latexParPoint('D', DRot, 'red', 10, 12, '', 10)
      const labelE = latexParPoint('E', E, 'red', 10, 12, '', 10)
      const labelF = latexParPoint('F', F, 'red', 10, 12, '', 10)
      const labelG = latexParPoint('G', G, 'red', 10, 12, '', 10)
      const labelH = latexParPoint('H', H, 'red', 10, 12, '', 10)

      const labelI = latexParPoint('I', IRot, 'red', 10, 12, '', 10)
      const labelJ = latexParPoint('J', JRot, 'red', 10, 12, '', 10)
      objets.push(tracePts, labelA, labelB, labelC, labelD, labelE, labelF, labelG, labelH, labelI, labelJ)
      */

      switch (choixQuestion) {
        case 0 :
        case 1 :
          if (distracteur) {
            objets.push(ang3, d4Rot)
          }
          objets.push(d1Rot, d2Rot)
          break
        case 2 :
          if (choixAngle < 2) objets.push(d2Rot)
          else objets.push(d1Rot)
          if (distracteur) {
            objets.push(ang3, d1Rot, d2Rot, d4Rot)
          }
          break
        case 3 :
          if (distracteur) {
            objets.push(ang3, d1Rot, d2Rot, d4Rot)
          }
          if (choixAngle === 0 && tabAngles.length === 3) objets.push(d1Rot)
          else objets.push(d2Rot)
          break
        case 4 :
          if (distracteur) {
            objets.push(d2Rot)
          }
          objets.push(ang3, d1Rot, d4Rot)
          break
        case 5:
          if (choixAngle < 2) objets.push(d2Rot)
          else objets.push(d1Rot)
          if (distracteur) {
            objets.push(ang3, d4Rot, d1Rot, d2Rot)
          }
          break
        case 6:
          if (choixAngle < 1) objets.push(d2Rot)
          else objets.push(d1Rot)
          if (distracteur) {
            objets.push(ang3, d4Rot)
          }
          break
        case 7 :
          if (distracteur) {
            objets.push(ang3, d2Rot)
          }
          objets.push(d1Rot, d4Rot)
          break
      }
      objets.push(ang1, objet2, d3Rot)

      const choixTypeAngles = ['correspondants', 'alternes-internes', 'supplémentaires', 'opposés par le sommet', 'complémentaires', 'côté', 'sommet']
      if (choixQuestion !== 2 && choixQuestion !== 4) choixTypeAngles.push('adjacents')
      if (this.interactif) {
        texteSousFigure += choixDeroulant(this, i, choixTypeAngles, 'la réponse la plus adaptée')
        handleAnswers(this, i, {
          bareme: (listePoints: number[]) => [Math.min(listePoints[0], listePoints[1]), 1],
          reponse: { value: choixTypeAngles[choixQuestion], compare: fonctionComparaison, options: { texteSansCasse: true } }
        }, { formatInteractif: 'listeDeroulante' })
      }

      // On impose xmin et le reste pour avoir toujours la même taille de fenêtre.
      let texte = context.isHtml ? '<br>' : ''
      texte += mathalea2d({ zoom: 1, scale: 0.25, xmin: -8, xmax: 8, ymin: -8, ymax: 8, optionsTikz: ['baseline=(current bounding box.north)'] }, objets) // On trace le graphique
      texte += '<br>' + texteSousFigure
      if (this.questionJamaisPosee(i, ARot.x, ARot.y, BRot.x, BRot.y, CRot.x, CRot.y, choixQuestion)) { // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
