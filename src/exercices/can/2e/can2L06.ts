import { choice } from '../../../lib/outils/arrayOutils'
import Exercice from '../../Exercice'
import { listeQuestionsToContenu, randint } from '../../../modules/outils'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { handleAnswers } from '../../../lib/interactif/gestionInteractif'
import { reduirePolynomeDegre3 } from '../../../lib/outils/ecritures'
import { ajouteChampTexteMathLive } from '../../../lib/interactif/questionMathLive'
import { miseEnEvidence } from '../../../lib/outils/embellissements'
export const titre = 'Développer avec les égalités remarquables'
export const interactifReady = true
export const interactifType = 'mathLive'
export const dateDePublication = '25/10/2021'

/**
 * utilisation des égalités remarquables pour développer
 * @author Gilles Mora

*/
export const uuid = '4c675'

export const refs = {
  'fr-fr': ['can2L06'],
  'fr-ch': []
}
export default class DevelopperEgalitesRemarquables extends Exercice {
  constructor () {
    super()
    this.formatChampTexte = KeyboardType.clavierDeBaseAvecVariable
    //  this.typeExercice = 'simple'
    this.nbQuestions = 1
  }

  nouvelleVersion () {
    let a, b, texte, texteCorr, inconnue
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      inconnue = choice(['x', 'y', 'a'])
      a = randint(1, 9)
      b = randint(2, 5)
      switch (randint(1, 6)) { //, 'b'
        case 1 :
          texte = `Développer $(${inconnue}+${a})^2$.` // (x+a)²
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)
          texteCorr = `On utilise l'égalité remarquable $(a+b)^2=a^2+2ab+b^2$ avec $a=${inconnue}$ et $b=${a}$.<br>
$\\begin{aligned}
           (${inconnue}+${a})^2&=${inconnue}^2+2 \\times ${a} \\times ${inconnue}+${a}^2\\\\
            &=${miseEnEvidence(`${inconnue}^2+${2 * a}${inconnue}+${a * a}`)}
            \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, 1, 2 * a, a ** 2, inconnue), options: { developpementEgal: true } } })
          break
        case 2 :
          texte = ` Développer $(${inconnue}-${a})^2$.` // (x-a)²
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)
          texteCorr = `On utilise l'égalité remarquable $(a-b)^2=a^2-2ab+b^2$ avec $a=${inconnue}$ et $b=${a}$.<br>
      $\\begin{aligned}
            (${inconnue}-${a})^2&=${inconnue}^2-2 \\times ${a} \\times ${inconnue}+${a}^2\\\\
            &=${miseEnEvidence(`${inconnue}^2-${2 * a}${inconnue}+${a * a}`)}
            \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, 1, -2 * a, a ** 2, inconnue), options: { developpementEgal: true } } })
          break

        case 3 :
          texte = `Développer $(${inconnue}-${a})(${inconnue}+${a})$.` // (x-a)(x+a)
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)

          texteCorr = `On utilise l'égalité remarquable $(a+b)(a-b)=a^2-b^2$ avec $a=${inconnue}$ et $b=${a}$.<br>
 $\\begin{aligned}
           (${inconnue}-${a})(${inconnue}+${a})&=${inconnue}^2-${a}^2\\\\
            &=${miseEnEvidence(`${inconnue}^2-${a * a}`)}
            \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, 1, 0, -1 * a ** 2, inconnue), options: { developpementEgal: true } } })

          break

        case 4 :
          texte = `Développer $(${b}${inconnue}+${a})^2$.` // (bx+a)²  b>1
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)
          texteCorr = `On utilise l'égalité remarquable $(a+b)^2=a^2+2ab+b^2$ avec $a=${b}${inconnue}$ et $b=${a}$.<br>
 $\\begin{aligned}
         (${b}${inconnue}+${a})^2&=(${b}${inconnue})^2+2 \\times ${b}${inconnue} \\times ${a} + ${a}^2\\\\
            &=${miseEnEvidence(`${b * b}${inconnue}^2+${2 * b * a}${inconnue}+${a * a}`)}
            \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, b ** 2, 2 * a * b, a ** 2, inconnue), options: { developpementEgal: true } } })
          break

        case 5 :

          texte = `Développer $(${b}${inconnue}-${a})^2$.` // (bx-a)² b>1
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)
          texteCorr = `On utilise l'égalité remarquable $(a-b)^2=a^2-2ab+b^2$ avec $a=${b}${inconnue}$ et $b=${a}$.<br>
        $\\begin{aligned}
         (${b}${inconnue}-${a})^2&=(${b}${inconnue})^2-2 \\times ${b}${inconnue} \\times ${a} + ${a}^2\\\\
            &=${miseEnEvidence(`${b * b}${inconnue}^2-${2 * b * a}${inconnue}+${a * a}`)}
            \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, b ** 2, -2 * a * b, a ** 2, inconnue), options: { developpementEgal: true } } })

          break

        case 6 :
        default:
          texte = `Développer $(${b}${inconnue}-${a})(${b}${inconnue}+${a})$.` // (bx-a)(bx+a) b>1
          texte += '<br>' + ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBaseAvecVariable)

          texteCorr = `On utilise l'égalité remarquable $(a+b)(a-b)=a^2-b^2$ avec $a=${b}${inconnue}$ et $b=${a}$.<br>
   $\\begin{aligned}
             (${b}${inconnue}-${a})(${b}${inconnue}+${a})&=(${b}${inconnue})^2-${a}^2\\\\
              &=${miseEnEvidence(`${b ** 2}${inconnue}^2-${a * a}`)}
              \\end{aligned}$`
          handleAnswers(this, i, { reponse: { value: reduirePolynomeDegre3(0, b ** 2, 0, -1 * a ** 2, inconnue), options: { developpementEgal: true } } })

          break
      }
      if (this.questionJamaisPosee(i, a)) {
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
