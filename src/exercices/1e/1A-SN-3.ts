import { ecritureAlgebrique, ecritureParentheseSiNegatif, reduireAxPlusB } from '../../lib/outils/ecritures'
import { miseEnEvidence, texteEnCouleur } from '../../lib/outils/embellissements'
import FractionEtendue from '../../modules/FractionEtendue'
import { randint } from '../../modules/outils'
import ExerciceQcmA from '../ExerciceQcmA'
export const dateDePublication = '10/08/2025'
export const uuid = '61d27'
// Author Stéphane Guyon
export const refs = {
  'fr-fr': ['1A-SN-3'],
  'fr-ch': []
}
export const interactifReady = true
export const interactifType = 'qcm'
export const amcReady = 'true'
export const amcType = 'qcmMono'
export const titre = 'Calculer avec les suites arithmétiques et géométriques'
export default class Puissances extends ExerciceQcmA {
  versionOriginale: () => void = () => {
    let p = 10
    let up = 4
    let k = 25
    let r = 2
    this.enonce = `Soit $(u_n)$ une suite arithmétique.<br>On donne $u_{${p}}=${up}$ et $u_{${p+k} }=${up+k*r}$. <br>
    La raison de cette suite est $r=\\ldots$`
    this.correction = `Soit $(u_n)$ une suite arithmétique, de premier terme $u_0\\in \\mathbb{R}$ et de raison $r\\in \\mathbb{R}.$
    <br> On a alors pour tout $n\\in \\mathbb{N}$ et tout $p\\in \\mathbb{N}$ : $u_n=u_p+(n-p)r$.
<br>En particulier, avec l'énoncé, <br>$\\begin{aligned}
u_{${p+k}}&=u_{${p}}+(${p+k}-${p})\\times r\\\\
${k}\\times r&=u_{${p+k}}-u_{${p}}\\\\
r&=\\dfrac{${up+k*r}-${up}}{${k}}\\\\
r&=${r}
\\end{aligned}$.<br>
 ${texteEnCouleur(`La raison est donc r=${r}.`)} `
    this.reponses = [
      '$2$',
      '$50$',
      '$25$',
      '$5$',
    ]
  }

  versionAleatoire = () => {

  let up = randint(-5, 5,[0,1])
    let p = randint(3, 10)
  let k = randint(4, 10)
  let r= randint(-5, 5,[-1,0,1])

    this.enonce = `Soit $(u_n)$ une suite arithmétique.<br>On donne $u_{${p}}=${up}$ et $u_{${p+k} }=${up+k*r}$. <br>
    La raison de cette suite est $r=\\ldots$`
    this.correction = `Soit $(u_n)$ une suite arithmétique, de premier terme $u_0\\in \\mathbb{R}$ et de raison $r\\in \\mathbb{R}.$
    <br> On a alors pour tout $n\\in \\mathbb{N}$ et tout $p\\in \\mathbb{N}$ : $u_n=u_p+(n-p)r$.
<br>En particulier, avec l'énoncé, <br>$\\begin{aligned}
u_{${p+k}}&=u_{${p}}+(${p+k}-${p})\\times r\\\\
${k}\\times r&=u_{${p+k}}-u_{${p}}\\\\
r&=\\dfrac{${up+k*r}-${up}}{${k}}\\\\
r&=${r}
\\end{aligned}$.<br>
 ${texteEnCouleur(`La raison est donc r=${r}.`)} `
const distracteur = new FractionEtendue(k*r, k+1) 

   
    this.reponses = [
     `$${r}$`,
     ` $${p}$`,
     `$${-r}$`,
     `$${distracteur.texFractionSimplifiee}$`
    ]

  }

  constructor () {
    super()
     this.options = { vertical: false, ordered: false }
    this.versionAleatoire()
  }
}
