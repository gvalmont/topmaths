import { choice } from '../../../lib/outils/arrayOutils'
import { miseEnEvidence, texteEnCouleur } from '../../../lib/outils/embellissements'
import { texNombre } from '../../../lib/outils/texNombre'
import Exercice from '../../deprecatedExercice.js'
import { KeyboardType } from '../../../lib/interactif/claviers/keyboard'
import { fonctionComparaison } from '../../../lib/interactif/comparisonFunctions'
import { randint, } from '../../../modules/outils.js'
import { bleuMathalea } from '../../../lib/colors'
export const titre = 'Calculer avec +/-99 ou +/-999'
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCNum'
/**
 * Modèle d'exercice très simple pour la course aux nombres
 * @author Gille Mora
 * Créé pendant l'été 2021
*/
export const uuid = 'ad0ee'
export const ref = 'can6C23'
export const refs = {
  'fr-fr': ['can6C23'],
  'fr-ch': []
}
export default function CalculAvec99 () {
  Exercice.call(this)
  this.typeExercice = 'simple'
  this.nbQuestions = 1
  this.tailleDiaporama = 2
  this.compare = fonctionComparaison
  this.optionsDeComparaison = { nombreDecimalSeulement: true }
  this.formatChampTexte = KeyboardType.clavierNumbers
  this.nouvelleVersion = function () {
    let a
    switch (choice(['a', 'b', 'c', 'd', 'e'])) { //
      case 'a':
        a = randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)
        this.question = `Calculer $${texNombre(a)}+99$.`
        this.correction = `$${texNombre(a)}+99=${miseEnEvidence(texNombre(a + 99))}$<br>`
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour ajouter $99$, on ajoute $100$ et on retranche $1$<br>
       $${texNombre(a)}+99=${texNombre(a)}+\\underbrace{100-1}_{99}=${texNombre(a + 100)}-1=${texNombre(a + 99)}$.
          `, bleuMathalea)
        this.reponse = a + 99
        break
      case 'b':
        a = randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)
        this.question = `Calculer $${texNombre(a)}+999$.`
        this.correction = `$${texNombre(a)}+999=${miseEnEvidence(texNombre(a + 999))}$<br>`
        this.reponse = a + 999
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour ajouter $999$, on ajoute $${texNombre(1000)}$ et on retranche $1$<br>
       $${texNombre(a)}+999=${texNombre(a)}+\\underbrace{1000-1}_{999}=${texNombre(a + 1000)}-1=${texNombre(a + 999)}$.
          `, bleuMathalea)
        break

      case 'c':
        a = randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)
        this.question = `Calculer $${texNombre(a)}-999$.`
        this.correction = `$${texNombre(a)}-999=${miseEnEvidence(texNombre(a - 999))}$<br>`
        this.reponse = a - 999
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour retrancher $999$, on retranche $${texNombre(1000)}$ et on ajoute $1$<br>
       $${texNombre(a)}-999=${texNombre(a)}\\underbrace{-1000+1}_{-999}=${texNombre(a - 1000)}+1=${texNombre(a - 999)}$.
          `, bleuMathalea)
        break
      case 'd':
        a = randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)
        this.question = `Calculer $${texNombre(a)}-99$.`
        this.correction = `$${texNombre(a)}-99=${miseEnEvidence(texNombre(a - 99))}$<br>`
        this.reponse = a - 99
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
       Pour retrancher $99$, on retranche $100$ et on ajoute $1$<br>
       $${texNombre(a)}-99=${texNombre(a)}\\underbrace{-100+1}_{-99}=${texNombre(a - 100)}+1=${texNombre(a - 99)}$.
          `, bleuMathalea)
        break
      case 'e':
        a = randint(1, 9) * 1000 + randint(1, 9) * 100 + randint(1, 9) * 10 + randint(1, 9)
        this.question = `Calculer $${texNombre(a)}+99$.`
        this.correction = `$${texNombre(a)}+99=${miseEnEvidence(texNombre(a + 99))}$<br>`
        this.reponse = a + 99
        this.correction += texteEnCouleur(`<br> Mentalement : <br>
        Pour ajouter $99$, on ajoute $100$ et on retranche $1$<br>
        $${texNombre(a)}+99=${texNombre(a)}+\\underbrace{100-1}_{99}=${texNombre(a + 100)}-1=${texNombre(a + 99)}$.
           `, bleuMathalea)
        break
    }
    this.canEnonce = this.question
    this.canReponseACompleter = ''
  }
}
