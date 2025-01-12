import Exercice from '../Exercice'
import { context } from '../../modules/context'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { texteEnCouleurEtGras } from '../../lib/outils/embellissements'
export const interactifReady = true
export const interactifType = 'mathLive'
export const titre = 'Trouver la position d\'un lutin grâce à des instructions conditionnelles (scratch)'
export const dateDePublication = '24/11/2020'
export const dateDeModifImportante = '02/01/2025'

/**
 * * Instructions conditionnelles
 * @author Erwan Duplessy (rendu interactif par Eric Elter)
 */
export const uuid = '8cbd6'

export const refs = {
  'fr-fr': ['3I1'],
  'fr-ch': []
}
export default class InstructionConditionnelle extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireNumerique = ['Variante', 3, '1 : Sans condition imbriquée\n2 : Avec une condition imbriquée\n3 : Avec deux conditions imbriquées']
    this.sup = 1
    this.nbQuestions = 1
    this.consigne = 'Donner les coordonnées de la position finale du lutin.'
    this.typeExercice = 'Scratch'
    this.nbCols = 2
    this.nbQuestionsModifiable = false
  }

  nouvelleVersion () {
    function scratchblocksTikz (codeSvg, codeTikz) {
      if (context.isHtml) {
        return codeSvg
      } else {
        return codeTikz
      }
    }

    let texte = "La position initiale d'un lutin dans un repère est (0,0).<br> Dans le programme, x désigne l'abscisse, et y désigne l'ordonnée d'un lutin. <br>" // texte de l'énoncé
    texte += 'Une variable a été créée, elle s\'appelle <code class="b">(var) :: ring</code>. <br>'
    let texteCorr = ' ' // texte du corrigé
    let codeTikz = '' // code pour dessiner les blocs en tikz
    let codeSvg = '' // code pour dessiner les blocs en svg
    let xLutin = 0
    let yLutin = 0

    codeTikz += '\\medskip \\\\ \\begin{scratch} <br>'
    codeSvg += '<pre class=\'blocks\'>'

    const n1 = randint(1, 10)
    const n2 = randint(1, 10)
    const n3 = randint(1, 10)
    const n4 = randint(1, 10)
    const xLutin1 = randint(1, 10) * 10
    const xLutin2 = randint(1, 10) * 10
    const yLutin1 = randint(1, 10) * 10
    const yLutin2 = randint(1, 10) * 10

    codeTikz += '\\blockmove{aller à x: \\ovalnum{0} y: \\ovalnum{0}}'
    codeSvg += 'quand le drapeau vert pressé <br>'
    codeSvg += 'Aller à x:(0) y:(0) <br>'
    codeSvg += `mettre (var) à (${n1}) <br>`
    codeSvg += ` si <(var) < [${n2}]> alors <br>`
    codeSvg += ` ajouter (${xLutin1}) à x <br>`
    if (this.sup > 1) {
      codeSvg += ` si <(var) > [${n3}]> alors <br>`
      codeSvg += ` ajouter (${xLutin2}) à x <br>`
      codeSvg += ' fin <br>'
    }
    codeSvg += ' sinon <br>'
    codeSvg += ` ajouter (${yLutin1}) à y <br>`
    if (this.sup > 2) {
      codeSvg += ` si <(var) > [${n4}]> alors <br>`
      codeSvg += ` ajouter (${yLutin2}) à y <br>`
      codeSvg += ' fin <br>'
    }
    codeSvg += ' fin <br>'

    codeSvg += '</pre>'
    codeTikz += '\\end{scratch}'

    texte += scratchblocksTikz(codeSvg, codeTikz)
    if (n1 < n2) {
      texteCorr += `Comme l'inégalité "${n1} < ${n2}" est vraie, alors on ajoute ${xLutin1} à l'abscisse du lutin. <br>`
      xLutin += xLutin1
      if (this.sup > 1) {
        if (n1 > n3) {
          texteCorr += `Comme l'inégalité "${n1} > ${n3}" est vraie, alors on ajoute ${xLutin2} à l'abscisse du lutin. <br>`
          xLutin += xLutin2
        } else {
          texteCorr += `Comme l'inégalité "${n1} > ${n3}" est fausse, alors on ne change pas l'abscisse du lutin. <br>`
        }
      }
    } else {
      texteCorr += `Comme l'inégalité "${n1} < ${n2}" est fausse, alors on ajoute ${yLutin1} à l'ordonnée du lutin. <br>`
      yLutin += yLutin1
      if (this.sup > 2) {
        if (n1 > n4) {
          texteCorr += `Comme l'inégalité "${n1} > ${n4}" est vraie, on ajoute ${yLutin2} à l'ordonnée du lutin. <br>`
          yLutin += yLutin2
        } else {
          texteCorr += `Comme l'inégalité "${n1} > ${n4}" est fausse, alors on ne change pas l'ordonnée du lutin. <br>`
        }
      }
    }
    texteCorr += ` La position finale est donc : (${texteEnCouleurEtGras(xLutin)} ; ${texteEnCouleurEtGras(yLutin)}).`
    if (this.interactif) {
      texte += '<br>La position finale du lutin est : ' + remplisLesBlancs(this, 0, ' (~%{champ1}~;~%{champ2}~).', KeyboardType.clavierDeBase)
    }
    handleAnswers(this, 0, {
      // bareme: (listePoints: number[]) => [Math.min(listePoints[0], listePoints[1]), 1],
      champ1: { value: xLutin },
      champ2: { value: yLutin }
    },
    { formatInteractif: 'fillInTheBlank' }
    )

    this.listeQuestions.push(texte)
    this.listeCorrections.push(texteCorr)
    listeQuestionsToContenu(this)
  }
}
