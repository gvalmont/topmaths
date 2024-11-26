import { codageAngle } from '../../lib/2d/angles.js'
import { codageSegment } from '../../lib/2d/codages.js'
import { point, pointAdistance } from '../../lib/2d/points.js'
import { barycentre, nommePolygone } from '../../lib/2d/polygones.js'
import { vecteur } from '../../lib/2d/segmentsVecteurs.js'
import { rotation, translation } from '../../lib/2d/transformations.js'
import { triangle2points2longueurs } from '../../lib/2d/triangle.js'
import { texteEnCouleur } from '../../lib/outils/embellissements.js'
import { creerNomDePolygone } from '../../lib/outils/outilString.js'
import { fixeBordures, mathalea2d } from '../../modules/2dGeneralites.js'
import { gestionnaireFormulaireTexte, listeQuestionsToContenu, randint } from '../../modules/outils.js'
import Exercice from '../Exercice.js'
export const titre = 'Justifier que deux triangles sont égaux'

/**
 * Deux triangles égaux sont codés, il faut reconnaître les côtés homologues
 * @author Rémi Angot
 * Référence 5G24-1
*/
export const uuid = 'b9a52'
export const ref = '5G24-2'
export const refs = {
  'fr-fr': ['5G24-2'],
  'fr-ch': []
}
export default class TrianglesEgaux extends Exercice {
  constructor () {
    super()
    this.consigne = 'Les triangles sont-ils égaux ? S\'ils sont égaux, justifier la réponse.'
    this.nbQuestions = 4
    this.sup = 6
    this.spacing = 2
    this.besoinFormulaireTexte = ['Choix des questions', 'Nombres séparés par des tirets\n1 : CCC\n2 : CAC\n3 : ACA\n4 : AAA\n5 : CC\n6 : mélange']
  }

  nouvelleVersion () {
    const listeTypeQuestions = gestionnaireFormulaireTexte({
      saisie: this.sup,
      max: 5,
      melange: 6,
      defaut: 6,
      nbQuestions: this.nbQuestions,
      listeOfCase: ['CCC', 'CAC', 'ACA', 'AAA', 'CC']
    })
    for (let i = 0, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const listeDeNomsDePolygones: string[] = []
      texte = ''
      texteCorr = ''
      if (i % 3 === 0) listeDeNomsDePolygones.push('QD')
      // Boucle principale où i+1 correspond au numéro de la question
      let l1 = randint(40, 70)
      let l2 = randint(40, 80, l1)
      let l3 = randint(40, l1 + l2 - 10, [l1, l2])
      l1 /= 10
      l2 /= 10
      l3 /= 10
      const A = point(0, 0)
      const B = pointAdistance(A, l1)
      const p1 = triangle2points2longueurs(A, B, l2, l3)
      const C = p1.listePoints[2]
      const O = barycentre(p1)
      const v = vecteur(Math.max(Math.abs(A.x - B.x), Math.abs(C.x - B.x), Math.abs(A.x - C.x)) + 4, 0)
      const O2 = translation(O, v)
      const temp = translation(p1, v)
      temp.isVisible = false
      const p2 = rotation(temp, O2, randint(0, 360))
      const D = p2.listePoints[0]
      const E = p2.listePoints[1]
      const F = p2.listePoints[2]
      const code1 = codageSegment(A, B, '|')
      const code2 = codageSegment(D, E, '|')
      const code3 = codageSegment(B, C, '||')
      const code4 = codageSegment(E, F, '||')
      const code5 = codageSegment(C, A, '|||')
      const code6 = codageSegment(F, D, '|||')
      const codeA1 = codageAngle(A, B, C, 0.8, '|')
      const codeA2 = codageAngle(D, E, F, 0.8, '|')
      const codeA3 = codageAngle(B, C, A, 0.8, '||')
      const codeA4 = codageAngle(E, F, D, 0.8, '||')
      const codeA5 = codageAngle(C, A, B, 0.8, '|||')
      const codeA6 = codageAngle(F, D, E, 0.8, '|||')
      const nom1 = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom1)
      const nom2 = creerNomDePolygone(3, listeDeNomsDePolygones)
      listeDeNomsDePolygones.push(nom2)
      const nommeP1 = nommePolygone(p1, nom1)
      const nommeP2 = nommePolygone(p2, nom2)
      const objetsAAfficher = []
      switch (listeTypeQuestions[i]) { // Suivant le type de question, le contenu sera différent
        case 'CCC':
          objetsAAfficher.push(p1, p2, code1, code2, code3, code4, code5, code6, nommeP1, nommeP2)
          texteCorr = `$${A.nom}${B.nom} = ${D.nom}${E.nom}$<br>
            $${B.nom}${C.nom} = ${E.nom}${F.nom}$<br>
            $${C.nom}${A.nom} = ${F.nom}${D.nom}$<br>
            Les triangles ${nom1} et ${nom2} ont leurs trois côtés deux à deux de même longueur.<br>
            Ils sont donc égaux.`
          break
        case 'CAC':
          objetsAAfficher.push(p1, p2, code1, code2, code3, code4, codeA1, codeA2, nommeP1, nommeP2)
          texteCorr = `$${A.nom}${B.nom} = ${D.nom}${E.nom}$<br>
            $${B.nom}${C.nom} = ${E.nom}${F.nom}$<br>
            $\\widehat{${A.nom}${B.nom}${C.nom}} = \\widehat{${D.nom}${E.nom}${F.nom}}$<br>
            Les triangles ${nom1} et ${nom2} ont un angle de même mesure compris entre deux côtés deux à deux de même longueur.<br>
            Ils sont donc égaux.`
          break
        case 'ACA':
          objetsAAfficher.push(p1, p2, code1, code2, codeA1, codeA2, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = `$${A.nom}${B.nom} = ${D.nom}${E.nom}$<br>
            $\\widehat{${B.nom}${A.nom}${C.nom}} = \\widehat{${E.nom}${D.nom}${F.nom}}$<br>
            $\\widehat{${A.nom}${B.nom}${C.nom}} = \\widehat{${D.nom}${E.nom}${F.nom}}$<br>
            Les triangles ${nom1} et ${nom2} ont un côté de même longueur compris entre deux angles deux à deux de même mesure.<br>
            Ils sont donc égaux.`
          break
        case 'AAA':
          objetsAAfficher.push(p1, p2, codeA1, codeA2, codeA3, codeA4, codeA5, codeA6, nommeP1, nommeP2)
          texteCorr = `On ne peut pas déterminer si ces triangles sont égaux. Ils ont la même forme mais leurs longueurs peuvent être différentes. On dit qu'ils sont ${texteEnCouleur('semblables')}.`
          break
        case 'CC':
          objetsAAfficher.push(p1, p2, code1, code2, code5, code6, nommeP1, nommeP2)
          texteCorr = 'On ne peut pas déterminer si ces triangles sont égaux (il manque une troisième information).'
          break
      }
      texte = mathalea2d(Object.assign({ scale: 0.3, optionsTikz: ['baseline=(current bounding box.north)'] }, fixeBordures(objetsAAfficher)), objetsAAfficher)
      if (this.listeQuestions.indexOf(texte) === -1) {
        // Si la question n'a jamais été posée, on en crée une autre
        this.listeQuestions.push(texte)
        this.listeCorrections.push(texteCorr)
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
