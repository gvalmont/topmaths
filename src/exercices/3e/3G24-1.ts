import { angleOriente, codageAngle, codageAngleDroit, markTypeArray, MarqueAngle } from '../../lib/2d/angles'
import { placeLatexSurSegment } from '../../lib/2d/codages'
import { point, pointAdistance } from '../../lib/2d/points'
import { barycentre, nommePolygone } from '../../lib/2d/polygones'
import { longueur, segment, vecteur, Segment, } from '../../lib/2d/segmentsVecteurs'
import { similitude, translation } from '../../lib/2d/transformations'
import { triangle2points2angles, triangle2points2longueurs } from '../../lib/2d/triangle'
import { choice, combinaisonListes, shuffleLettres } from '../../lib/outils/arrayOutils'
import { choisitLettresDifferentes } from '../../lib/outils/aleatoires'
import Exercice from '../Exercice'
import { fixeBordures, mathalea2d, vide2d } from '../../modules/2dGeneralites'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils'
import { context } from '../../modules/context'
import { labelPoint } from '../../lib/2d/textes'
import { texNombre } from '../../lib/outils/texNombre'
import FractionEtendue from '../../modules/FractionEtendue'
import { creerNomDePolygone } from '../../lib/outils/outilString'
import { arrondi } from '../../lib/outils/nombres'
export const titre = 'Triangles semblables'
export const dateDePublication = '16/05/2024' // La date de publication initiale au format 'jj/mm/aaaa' pour affichage temporaire d'un tag

/**
 * Deux triangles semblables sont codés, il faut reconnaître les côtés homologues
 * Mais aussi deux triangles sont ils semblables ? dans des cas variés : 2 angles donnés sur 3, 3 Longueurs données,
 * triangles rectangles imbriqués, triangles en configurations de thalès
 * @author Mickael Guironnet; Olivier Mimeau : passage TS

*/
export const uuid = 'f4b7e'

export const refs = {
  'fr-fr': ['3G24-1'],
  'fr-ch': []
}
export default class TrianglesSemblables extends Exercice {
  constructor () {
    super()

    this.nbQuestions = 3

    this.sup = 1

    this.besoinFormulaireTexte = ['Types de questions (nombre séparés par des tirets)', '1 : Trouver angles et côtés homologues\n2 : Démontrer semblables avec les angles\n3 : Démontrer semblables avec les longueurs\n4 : Démontrer semblables avec des triangles rectangles imbriqués\n5 : Démontrer semblables avec des configurations type Thalès']
  }

  // c'est ici que commence le code de l'exercice cette méthode crée une copie de l'exercice
  nouvelleVersion () {
    const zoom = context.vue === 'diap' ? 0.5 : 1
    const typeQuestionsDisponibles = gestionnaireFormulaireTexte({ saisie: this.sup, min: 1, max: 5, defaut: 1, melange: 6, nbQuestions: this.nbQuestions })

    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      // Boucle principale où i+1 correspond au numéro de la question
      const listeDeNomsDePolygonesDejaPris: string[] = []
      let texte = ''
      let texteCorr = ''
      const k = randint(8, 13, [10, 11, 9])
      let l1 = randint(6, 8)
      let l2 = randint(6, 9, l1)
      let l3 = randint(6, l1 + l2 - 1, [l1, l2])
      const angleA = randint(45, 80)
      const angleB = randint(45, 80, [90 - angleA])
      const coeff = k / 10
      l1 *= k / 10
      l2 *= k / 10
      l3 *= k / 10
      const A = point(0, 0)
      const B = pointAdistance(A, l1, randint(-60, 60))
      let p1 = triangle2points2longueurs(A, B, l2, l3)
      if (typeQuestionsDisponibles[i] === 2) {
        p1 = triangle2points2angles(A, B, angleA, angleB)
      }
      const C = p1.listePoints[2]
      const longueurAB = longueur(A, B) // l1
      const longueurAC = longueur(A, C)
      const longueurBC = longueur(B, C)
      const O = barycentre(p1)
      const v = vecteur(longueur(A, B) + 0.5, 0)
      const O2 = translation(O, v)
      let longueurDE = 0
      let longueurDF = 0
      let longueurEF = 0
      let p2, D, E, F, codeAB, codeDE, codeBC, codeEF, codeAC, codeDF, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nom1, nom2, nommeP1, nommeP2
      switch (typeQuestionsDisponibles[i]) { // Suivant le type de question, le contenu sera différent
        case 1: {
          const angle = randint(160, 200)
          const coeff = randint(8, 13, [10, 11, 9]) / 10
          p2 = similitude(p1, O2, angle, coeff)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          const codeAnglesHomologues = combinaisonListes(markTypeArray.slice(0, 4), 2)
          const RayonAngle = 1
          const codeAngleA = new MarqueAngle(C, A, B, { mark: codeAnglesHomologues[1], rayon: RayonAngle })
          const codeAngleB = new MarqueAngle(A, B, C, { mark: codeAnglesHomologues[0], rayon: RayonAngle })
          const codeAngleD = new MarqueAngle(F, D, E, { mark: codeAnglesHomologues[1], rayon: RayonAngle })
          const codeAngleE = new MarqueAngle(D, E, F, { mark: codeAnglesHomologues[0], rayon: RayonAngle })
          nom1 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          listeDeNomsDePolygonesDejaPris.push(nom1)
          const nom2 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          const objets = [p1, p2, codeAngleA, codeAngleB, codeAngleD, codeAngleE, nommeP1, nommeP2]
          texte = 'Compléter les phrases suivantes.<br>'
          texte += `Ci-dessous les triangles $${shuffleLettres(A.nom + B.nom + C.nom)}$ et $${shuffleLettres(D.nom + E.nom + F.nom)}$ sont semblables.<br>`
          texte += `$[${A.nom + B.nom}]$ et ............ sont homologues.<br>`
          texte += `$[${B.nom + C.nom}]$ et ............ sont homologues.<br>`
          texte += `$[${C.nom + A.nom}]$ et ............ sont homologues.<br>`
          texte += `$\\widehat{${A.nom + B.nom + C.nom}}$ et ...................... sont homologues.<br>`
          texte += `$\\widehat{${C.nom + A.nom + B.nom}}$ et ...................... sont homologues.<br>`
          texte += `$\\widehat{${B.nom + C.nom + A.nom}}$ et ...................... sont homologues.<br>`
          texte += mathalea2d(Object.assign({
            scale: 0.5,
            zoom
          }, fixeBordures(objets)), objets)
          texteCorr = `$[${A.nom + B.nom}]$ et $[${D.nom + E.nom}]$ sont homologues.<br>`
          texteCorr += `$[${B.nom + C.nom}]$ et $[${E.nom + F.nom}]$ sont homologues.<br>`
          texteCorr += `$[${C.nom + A.nom}]$ et $[${F.nom + D.nom}]$ sont homologues.<br>`
          texteCorr += `$\\widehat{${A.nom + B.nom + C.nom}}$ et $\\widehat{${D.nom + E.nom + F.nom}}$ sont homologues.<br>`
          texteCorr += `$\\widehat{${C.nom + A.nom + B.nom}}$ et $\\widehat{${F.nom + D.nom + E.nom}}$ sont homologues.<br>`
          texteCorr += `$\\widehat{${B.nom + C.nom + A.nom}}$ et $\\widehat{${E.nom + F.nom + D.nom}}$ sont homologues.<br>`
          break
        }
        case 2: {
          const ang = randint(160, 200)
          const coeff = randint(8, 13, [10, 11, 9]) / 10
          p2 = similitude(p1, O2, ang, coeff)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          // const sontSemblables = randint(0, 1) === 1
          const angleC = 180 - angleA - angleB
          // if (!sontSemblables) { angleC += choice([1, -1]) * randint(1, 5) * 2 }
          const hiddenAngle1 = randint(1, 3)
          const hiddenAngle2 = randint(4, 6, [hiddenAngle1 + 3])
          codeA1 = /* hiddenAngle1 === 1 ? vide2d() : */ codageAngle(A, B, C, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA3 = hiddenAngle1 === 2 ? vide2d() : codageAngle(B, C, A, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA5 = hiddenAngle1 === 3 ? vide2d() : codageAngle(C, A, B, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA2 = hiddenAngle2 === 4 ? vide2d() : codageAngle(D, E, F, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA4 = hiddenAngle2 === 5 ? vide2d() : codageAngle(E, F, D, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          codeA6 = hiddenAngle2 === 6 ? vide2d() : codageAngle(F, D, E, 0.8, '', 'black', 1, 1, 'none', 0.2, true)
          nom1 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          listeDeNomsDePolygonesDejaPris.push(nom1)
          const nom2 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          const objets = [p1, p2, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, nommeP2]
          const bordure1 = fixeBordures(objets)
          texte = `Les triangles $${shuffleLettres(A.nom + B.nom + C.nom)}$ et $${shuffleLettres(D.nom + E.nom + F.nom)}$ sont-ils semblables.<br>`
          texte += mathalea2d(Object.assign({
            scale: 0.5,
            zoom
          }, bordure1), objets)
          texteCorr = 'D\'après la règle des 180° dans un triangle, la somme des angles est égale à 180°. <br>'
          texteCorr += hiddenAngle1 === 1 ? `$\\widehat{${A.nom + B.nom + C.nom}} = 180^{\\circ} - ${texNombre(angleC, 0)}^{\\circ} - ${texNombre(angleA, 0)}^{\\circ}=${texNombre(angleB, 0)}^{\\circ}$. <br>` : ''
          texteCorr += hiddenAngle1 === 2 ? `$\\widehat{${B.nom + C.nom + A.nom}} = 180^{\\circ} - ${texNombre(angleB, 0)}^{\\circ} - ${texNombre(angleA, 0)}^{\\circ}=${texNombre(angleC, 0)}^{\\circ}$. <br>` : ''
          texteCorr += hiddenAngle1 === 3 ? `$\\widehat{${C.nom + A.nom + B.nom}} = 180^{\\circ} - ${texNombre(angleC, 0)}^{\\circ} - ${texNombre(angleB, 0)}^{\\circ}=${texNombre(angleA, 0)}^{\\circ}$. <br>` : ''
          texteCorr += hiddenAngle2 === 4 ? `$\\widehat{${D.nom + E.nom + F.nom}} = 180^{\\circ} - ${texNombre(angleC, 0)}^{\\circ} - ${texNombre(angleA, 0)}^{\\circ}=${texNombre(angleB, 0)}^{\\circ}$. <br>` : ''
          texteCorr += hiddenAngle2 === 5 ? `$\\widehat{${E.nom + F.nom + D.nom}} = 180^{\\circ} - ${texNombre(angleB, 0)}^{\\circ} - ${texNombre(angleA, 0)}^{\\circ}=${texNombre(angleC, 0)}^{\\circ}$. <br>` : ''
          texteCorr += hiddenAngle2 === 6 ? `$\\widehat{${F.nom + D.nom + E.nom}} = 180^{\\circ} - ${texNombre(angleB, 0)}^{\\circ} - ${texNombre(angleC, 0)}^{\\circ}=${texNombre(angleA, 0)}^{\\circ}$. <br>` : ''
          texteCorr += `$\\widehat{${A.nom + B.nom + C.nom}}$ = $\\widehat{${D.nom + E.nom + F.nom}}$.<br>`
          texteCorr += `$\\widehat{${C.nom + A.nom + B.nom}}$ = $\\widehat{${F.nom + D.nom + E.nom}}$.<br>`
          texteCorr += `$\\widehat{${B.nom + C.nom + A.nom}}$ = $\\widehat{${E.nom + F.nom + D.nom}}$.<br>`
          texteCorr += 'Les 3 paires d\'angles sont égales. Comme les angles sont égaux deux à deux, les deux triangles sont semblables.<br>'
          break
        }
        case 3: {
          const ang = randint(160, 200)
          const coeff = (k === 5 ? choice([12, 14]) : k === 6 ? choice([10, 15]) : k === 7 ? 10 : k === 8 ? choice([10, 15]) : k === 12 ? choice([5, 10]) : k === 13 ? 10 : k === 14 ? choice([10, 5]) : k === 15 ? choice([10, 5]) : 10) / 10
          p2 = similitude(p1, O2, ang, 10 * coeff / k)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          longueurDE = longueur(D, E)
          longueurDF = longueur(D, F)
          longueurEF = longueur(E, F)
          codeAB = angleOriente(C, A, B) > 0 ? placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, A, B) : placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, B, A)
          codeAC = angleOriente(B, C, A) > 0 ? placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, C, A) : placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, A, C)
          codeBC = angleOriente(A, B, C) > 0 ? placeLatexSurSegment(`${texNombre(longueurBC, 1)}\\text{ cm}`, B, C) : placeLatexSurSegment(`${texNombre(longueurBC, 1)}\\text{ cm}`, C, B)
          codeDE = angleOriente(F, D, E) > 0 ? placeLatexSurSegment(`${texNombre(longueurDE, 1)}\\text{ cm}`, D, E) : placeLatexSurSegment(`${texNombre(longueurDE, 1)}\\text{ cm}`, E, D)
          codeDF = angleOriente(E, F, D) > 0 ? placeLatexSurSegment(`${texNombre(longueurDF, 1)}\\text{ cm}`, F, D) : placeLatexSurSegment(`${texNombre(longueurDF, 1)}\\text{ cm}`, D, F)
          codeEF = angleOriente(D, E, F) > 0 ? placeLatexSurSegment(`${texNombre(longueurEF, 1)}\\text{ cm}`, E, F) : placeLatexSurSegment(`${texNombre(longueurEF, 1)}\\text{ cm}`, F, E)

          nom1 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          listeDeNomsDePolygonesDejaPris.push(nom1)
          const nom2 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          const objets = [p1, p2, codeAB, codeDE, codeBC, codeEF, codeAC, codeDF, nommeP1, nommeP2]
          texte = `Est-ce que les triangles $${shuffleLettres(A.nom + B.nom + C.nom)}$ et $${shuffleLettres(D.nom + E.nom + F.nom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d(Object.assign({
            scale: 0.5,
            zoom
          }, fixeBordures(objets)), objets)

          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          texteCorr += `$${texNombre(longueurAB, 1)} \\div  ${texNombre(longueurDE, 1)} = ${new FractionEtendue(arrondi(longueurAB, 1), arrondi(longueurDE, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${texNombre(longueurBC, 1)} \\div  ${texNombre(longueurEF, 1)} = ${new FractionEtendue(arrondi(longueurBC, 1), arrondi(longueurEF, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${texNombre(longueurAC, 1)} \\div  ${texNombre(longueurDF, 1)} = ${new FractionEtendue(arrondi(longueurAC, 1), arrondi(longueurDF, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += 'Les longueurs sont proportionnelles deux à deux donc les deux triangles sont semblables.<br>'
          break
        }
        case 4: {
          const tripletsPythagoriciens = [
            [3, 4, 5],
            [6, 8, 10],
            [8, 15, 17],
            [10, 24, 26],
            [5, 12, 13],
            [12, 16, 20],
            [20, 21, 29],
            [48, 55, 73],
            [28, 45, 53],
            [36, 77, 85],
            [39, 80, 89]
          ]
          const pindex = randint(1, 4)
          const A = point(0, 0)
          const B = pointAdistance(A, tripletsPythagoriciens[pindex][1])
          p1 = triangle2points2longueurs(A, B, tripletsPythagoriciens[pindex][0], tripletsPythagoriciens[pindex][2])
          const C = p1.listePoints[2]
          const k = tripletsPythagoriciens[pindex][1] / tripletsPythagoriciens[pindex][2]
          p2 = triangle2points2longueurs(A, B, tripletsPythagoriciens[pindex][0] * k, tripletsPythagoriciens[pindex][1] * k)
          D = p2.listePoints[0]
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          codeAB = vide2d() // angleOriente(C, A, B) > 0 ? afficheLongueurSegment(A, B) : afficheLongueurSegment(B, A)
          codeDE = vide2d() // angleOriente(F, D, E) > 0 ? afficheLongueurSegment(D, E) : afficheLongueurSegment(E, D)
          codeBC = vide2d() // angleOriente(A, B, C) > 0 ? afficheLongueurSegment(B, C) : afficheLongueurSegment(C, B)
          codeEF = vide2d() // angleOriente(D, E, F) > 0 ? afficheLongueurSegment(E, F) : afficheLongueurSegment(F, E)
          codeAC = vide2d() // angleOriente(B, C, A) > 0 ? afficheLongueurSegment(C, A) : afficheLongueurSegment(A, C)
          codeDF = vide2d() // angleOriente(E, F, D) > 0 ? afficheLongueurSegment(F, D) : afficheLongueurSegment(D, F)
          codeA1 = vide2d() // codageAngle(A, B, C, 0.8, '|')
          codeA2 = vide2d() // codageAngle(D, E, F, 0.8, '|')
          codeA3 = vide2d() // odageAngle(B, C, A, 0.8, 'X')
          codeA4 = codageAngleDroit(E, F, D)
          codeA5 = codageAngleDroit(C, A, B)
          codeA6 = vide2d() // codageAngle(F, D, E, 0.8, '||')
          nom1 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          listeDeNomsDePolygonesDejaPris.push(nom1)
          nom2 = String(nom1[0] + nom1[1] + choisitLettresDifferentes(1, listeDeNomsDePolygonesDejaPris.toString()))
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          const objets = [p1, p2, codeAB, codeDE, codeBC, codeEF, codeAC, codeDF, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, labelPoint(p2.listePoints[2])]
          texte = `Est-ce que les triangles $${shuffleLettres(A.nom + B.nom + C.nom)}$ et $${shuffleLettres(D.nom + E.nom + F.nom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d(Object.assign({
            scale: 0.5,
            zoom
          }, fixeBordures(objets)), objets
          )
          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          codeA4 = codageAngleDroit(E, F, D)
          codeA5 = codageAngleDroit(C, A, B)
          texteCorr += `$\\widehat{${C.nom + A.nom + B.nom}}$ = $\\widehat{${E.nom + F.nom + D.nom}}$ = 90° par codage.<br>`
          texteCorr += `$\\widehat{${A.nom + B.nom + C.nom}}$ = $\\widehat{${D.nom + E.nom + F.nom}}$ car les angles sont confondus.<br>`
          texteCorr += 'On a donc deux paires d\'angles égales donc la troisième paire aussi grâce à la règle des 180° dans un triangle (la somme des angles est égale à 180°). <br>'
          texteCorr += `$\\widehat{${B.nom + C.nom + A.nom}}$ = $\\widehat{${F.nom + D.nom + E.nom}}$.<br>`
          texteCorr += 'Les 3 paires d\'angles sont égales. Comme les angles sont égaux deux à deux, les deux triangles sont semblables.<br>'
          break
        }
        case 5: {
          const coeff = (k === 5 ? choice([12, 14]) : k === 6 ? choice([10, 15]) : k === 7 ? 10 : k === 8 ? choice([10, 15]) : k === 12 ? choice([5, 10]) : k === 13 ? 10 : k === 14 ? choice([10, 5]) : k === 15 ? choice([10, 5]) : 10) / 10
          const sign = choice([-1, 1])
          p2 = similitude(p1, A, 0, sign * 10 * coeff / k)
          E = p2.listePoints[1]
          F = p2.listePoints[2]
          const longueurAE = longueur(A, E)
          const longueurAF = longueur(A, F)
          longueurEF = longueur(E, F)
          codeAB = angleOriente(C, A, B) > 0 ? placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, A, B) : placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, B, A)
          codeAC = angleOriente(B, C, A) > 0 ? placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, C, A) : placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, A, C)
          codeBC = angleOriente(A, B, C) > 0 ? placeLatexSurSegment(`${texNombre(longueurBC, 1)}\\text{ cm}`, B, C) : placeLatexSurSegment(`${texNombre(longueurBC, 1)}\\text{ cm}`, C, B)
          codeDE = angleOriente(F, A, E) > 0 ? placeLatexSurSegment(`${texNombre(longueurAE, 1)}\\text{ cm}`, A, E) : placeLatexSurSegment(`${texNombre(longueurAE, 1)}\\text{ cm}`, E, A)
          codeDF = angleOriente(E, F, A) > 0 ? placeLatexSurSegment(`${texNombre(longueurAF, 1)}\\text{ cm}`, F, A) : placeLatexSurSegment(`${texNombre(longueurAF, 1)}\\text{ cm}`, A, F)
          codeEF = angleOriente(A, E, F) > 0 ? placeLatexSurSegment(`${texNombre(longueurEF, 1)}\\text{ cm}`, E, F) : placeLatexSurSegment(`${texNombre(longueurEF, 1)}\\text{ cm}`, F, E)
          let coteDF = segment(A, B)
          let coteDE = segment(A, B)
          if (k < 10 && sign > 0) {
            // agrandissement
            // codeDF = afficheCoteSegment(segment(F, A), `${longueurAF}`, -2, 'blue')
            coteDF = angleOriente(E, A, F) > 0 ? afficheCoteSegmentSansTexte(segment(A, F), 1, 'blue') : afficheCoteSegmentSansTexte(segment(A, F), -1, 'blue')
            coteDE = angleOriente(E, A, F) > 0 ? afficheCoteSegmentSansTexte(segment(A, E), -1, 'blue') : afficheCoteSegmentSansTexte(segment(A, E), 1, 'blue')
            codeDF = angleOriente(E, A, F) > 0 ? placeLatexSurSegment(`${texNombre(longueurAF, 1)}\\text{ cm}`, coteDF.extremite1, coteDF.extremite2) : placeLatexSurSegment(`${texNombre(longueurAF, 1)}\\text{ cm}`, coteDF.extremite2, coteDF.extremite1)
            codeDE = angleOriente(E, A, F) > 0 ? placeLatexSurSegment(`${texNombre(longueurAE, 1)}\\text{ cm}`, coteDE.extremite2, coteDE.extremite1) : placeLatexSurSegment(`${texNombre(longueurAE, 1)}\\text{ cm}`, coteDE.extremite1, coteDE.extremite2)
          } else if (k > 10 && sign > 0) {
            coteDF = angleOriente(C, A, B) > 0 ? afficheCoteSegmentSansTexte(segment(A, B), 1, 'blue') : afficheCoteSegmentSansTexte(segment(A, B), -1, 'blue')
            coteDE = angleOriente(C, A, B) > 0 ? afficheCoteSegmentSansTexte(segment(A, C), -1, 'blue') : afficheCoteSegmentSansTexte(segment(A, C), 1, 'blue')
            codeAB = angleOriente(C, A, B) > 0 ? placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, coteDF.extremite1, coteDF.extremite2) : placeLatexSurSegment(`${texNombre(longueurAB, 1)}\\text{ cm}`, coteDF.extremite2, coteDF.extremite1)
            codeAC = angleOriente(C, A, B) > 0 ? placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, coteDE.extremite2, coteDE.extremite1) : placeLatexSurSegment(`${texNombre(longueurAC, 1)}\\text{ cm}`, coteDE.extremite1, coteDE.extremite2)
          }
          nom1 = shuffleLettres(creerNomDePolygone(3, listeDeNomsDePolygonesDejaPris))
          listeDeNomsDePolygonesDejaPris.push(nom1)
          nom2 = String(nom1[0] + choisitLettresDifferentes(2, listeDeNomsDePolygonesDejaPris.toString())).replace(',', '')
          nommeP1 = nommePolygone(p1, nom1)
          nommeP2 = nommePolygone(p2, nom2)
          const objets = [p1, p2, codeAB, codeDE, codeBC, codeEF, codeAC, codeDF, coteDF, coteDE, nommeP1, labelPoint(p2.listePoints[2]), labelPoint(p2.listePoints[1])]

          texte = `Est-ce que les triangles $${shuffleLettres(A.nom + B.nom + C.nom)}$ et $${shuffleLettres(A.nom + E.nom + F.nom)}$ sont semblables? Justifier<br>`
          texte += mathalea2d(Object.assign({
            scale: 0.5,
            zoom
          }, fixeBordures(objets)), objets)
          texteCorr = 'On trie les longueurs des deux triangles afin de les comparer. <br>'
          texteCorr += `$${texNombre(longueurAB, 1)} \\div  ${texNombre(longueurAE, 1)} = ${new FractionEtendue(arrondi(longueurAB, 1), arrondi(longueurAE, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${texNombre(longueurBC, 1)} \\div  ${texNombre(longueurEF, 1)} = ${new FractionEtendue(arrondi(longueurBC, 1), arrondi(longueurEF, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += `$${texNombre(longueurAC, 1)} \\div  ${texNombre(longueurAF, 1)} = ${new FractionEtendue(arrondi(longueurAC, 1), arrondi(longueurAF, 1)).texFractionSimplifiee}$.<br>`
          texteCorr += 'Les longueurs sont proportionnelles deux à deux donc les deux triangles sont semblables.<br>'
          break
        }
      }
      //      if (this.questionJamaisPosee(i, longueur(A, B).toFixed(1), longueur(B, C).toFixed(1), longueur(C, A).toFixed(1), longueur(D, E).toFixed(1))) {
      if (this.questionJamaisPosee(i, longueur(A, B).toFixed(1), longueur(B, C).toFixed(1), longueur(C, A).toFixed(1), k, coeff)) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

function afficheCoteSegmentSansTexte (s: Segment, positionCote = 0.5, couleurCote = 'black'): Segment {
  const A = s.extremite1
  const B = s.extremite2
  const v = similitude(vecteur(A, B), A, 90, positionCote / s.longueur)
  const cote = segment(translation(A, v), translation(B, v), couleurCote)
  if (longueur(A, B) > 1) cote.styleExtremites = '<->'
  else cote.styleExtremites = '>-<'
  return cote
}
