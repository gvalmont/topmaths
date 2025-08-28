import {
  choice,
  combinaisonListes,
  shuffle,
} from '../../lib/outils/arrayOutils'
import { sommeDesTermesParSigne } from '../../lib/outils/calculs'
import {
  ecritureAlgebrique,
  ecritureAlgebriquec,
  ecritureNombreRelatif,
  ecritureNombreRelatifc,
  ecritureParentheseSiNegatif,
} from '../../lib/outils/ecritures'
import {
  nombreDeChiffresDansLaPartieEntiere,
  signe,
  triePositifsNegatifs,
} from '../../lib/outils/nombres'
import { lettreDepuisChiffre, sp } from '../../lib/outils/outilString'
import { texNombre, texNombreCoul } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import { ajouteChampTexteMathLive } from '../../lib/interactif/questionMathLive'
import { handleAnswers } from '../../lib/interactif/gestionInteractif'
import { orangeMathalea } from 'apigeom/src/elements/defaultValues'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const titre =
  "Effectuer un enchaînement d'additions et de soustractions de nombres relatifs"
export const interactifReady = true
export const interactifType = 'mathLive'
export const amcReady = true
export const amcType = 'AMCHybride'

/**
 * Effectuer la somme ou la différence de plusieurs relatifs
 *
 * * On peut paramétrer les distances à zéro qui sont par défaut inférieures à 20
 * * On peut utiliser des écritures simplifiées (ce qui n'est pas le cas par défaut)
 * @author Rémi Angot modifications par Jean-Claude Lhote (Correction optimisée par Eric Elter)
 */
export const uuid = 'f6ea7'

export const refs = {
  'fr-fr': ['5R22'],
  'fr-ch': ['9NO9-15'],
}
export default class ExerciceAdditionsSoustractionRelatifsV2 extends Exercice {
  constructor(max = 20) {
    super()
    this.sup = max

    this.sup2 = 1
    this.sup3 = false
    this.nbCols = 2
    this.nbColsCorr = 2
    this.nbQuestions = 6 // Pour que les colonnes soient équilibrées !
    this.listeAvecNumerotation = false
    this.besoinFormulaireNumerique = ['Valeur maximale', 99999]
    this.besoinFormulaire2Numerique = [
      'Type de questions',
      5,
      'Tous les nombres entre parenthèses, correction avec des parenthèses \n2 : Seuls les termes négatifs sont entre parenthèses, correction avec des parenthèses \n3 : Seuls les termes négatifs sont entre parenthèses, correction avec des écritures simplifiées \n4 : Écriture simplifiée \n5 : Tous les nombres entre parenthèses, correction  avec des écritures simplifiées',
    ]
    this.besoinFormulaire3CaseACocher = ['Avec des nombres décimaux']
  }

  nouvelleVersion() {
    // Rétrocompatibilité avec les liens vers les exercices quand c'était des cases à cocher
    if (this.sup2 === false) {
      this.sup2 = 1
    } else if (this.sup2 === true) {
      this.sup2 = 4
    }
    this.consigne = this.interactif
      ? 'Calculer (mentalement ou au brouillon) et indiquer seulement le résultat final.'
      : 'Calculer, en détaillant les calculs.'
    let relatifs
    let sommesSignees
    for (
      let i = 0, a, b, c, d, e, texte, texteCorr, cpt = 0;
      i < this.nbQuestions && cpt < 50;

    ) {
      // On limite le nombre d'essais pour chercher des valeurs nouvelles
      relatifs = []
      sommesSignees = []
      a = -1
      b = choice([-1, 1])
      if (a === -1 && b === -1) {
        c = 1
      } else {
        // On s'assure que les 3 premières termes n'ont pas le même signe
        c = choice([-1, 1])
      }
      const partieDecimaleAUnChiffre = combinaisonListes(
        [true, true, false],
        this.nbQuestions,
      )
      let CoefDecimales = this.sup3 ? 10 : 1
      a = (randint(1, this.sup * CoefDecimales) / CoefDecimales) * a
      b = (randint(1, this.sup * CoefDecimales) / CoefDecimales) * b
      c = (randint(1, this.sup * CoefDecimales) / CoefDecimales) * c
      CoefDecimales = this.sup3 ? (partieDecimaleAUnChiffre[i] ? 10 : 100) : 1
      d =
        (randint(1, this.sup * CoefDecimales) / CoefDecimales) * choice([-1, 1])
      e =
        (randint(1, this.sup * CoefDecimales) / CoefDecimales) * choice([-1, 1])
      if (choice([true, false])) {
        ;[a, b, c, d, e] = shuffle([a, b, c, d, e])
      }
      const s1 = choice([-1, 1])
      const s2 = choice([-1, 1])
      const s4 = choice([-1, 1])
      let s3
      if (s1 === 1 && s2 === 1) {
        // On s'assure que les 3 premières opérations ne sont pas identiques
        s3 = -1
      } else if (s1 === -1 && s2 === -1) {
        s3 = 1
      } else {
        s3 = choice([-1, 1])
      }
      switch (this.sup2) {
        case 4: {
          texte = `$ ${lettreDepuisChiffre(i + 1)} = ${texNombre(a, 2)}${ecritureAlgebrique(b)}${ecritureAlgebrique(c)}${ecritureAlgebrique(d)}${ecritureAlgebrique(e)}$`
          if (this.interactif && context.isHtml) {
            texte +=
              `$${sp(1)} = $` +
              ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
          }
          if (!context.isHtml && !context.isAmc) {
            texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
          }
          relatifs = triePositifsNegatifs([a, b, c, d, e])
          texteCorr = `$ ${lettreDepuisChiffre(i + 1)}=${texNombreCoul(a, 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(b)}${ecritureAlgebriquec(c)}${ecritureAlgebriquec(d)}${ecritureAlgebriquec(e)}$<br>`
          texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
          if (
            sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0 &&
            sommeDesTermesParSigne([a, b, c, d, e])[1] !== 0
          ) {
            texteCorr += `${texNombreCoul(relatifs[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(relatifs[1])}${ecritureAlgebriquec(relatifs[2])}${ecritureAlgebriquec(relatifs[3])}${ecritureAlgebriquec(relatifs[4])}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
            texteCorr += `${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1])}$<br>`
            texteCorr += `$${lettreDepuisChiffre(i + 1)}=`
            texteCorr += `${texNombreCoul(a + b + c + d + e, 'blue', '#f15929', 'black', 2)} $`
          } else if (sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0) {
            texteCorr += `${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}$`
          } else {
            texteCorr += `${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1], 'blue')}$`
          }
          break
        }
        case 2: {
          /// texNombreCoul (nombre: number | Decimal, positif = 'green', negatif = 'red', nul = 'black', precision: number)
          texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${texNombre(a, 2)}${signe(s1)}${ecritureParentheseSiNegatif(b)}${signe(s2)}${ecritureParentheseSiNegatif(c)}${signe(s3)}${ecritureParentheseSiNegatif(d)}${signe(s4)}${ecritureParentheseSiNegatif(e)}$`
          if (this.interactif && context.isHtml) {
            texte +=
              `$${sp(1)} = $` +
              ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
          }
          if (!context.isHtml && !context.isAmc) {
            texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
          }
          texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${texNombre(a, 2)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${texNombreCoul(a, 'blue', 'green', 'black', 2)}+${ecritureNombreRelatifc(s1 * b)}+${ecritureNombreRelatifc(s2 * c)}+${ecritureNombreRelatifc(s3 * d)}+${ecritureNombreRelatifc(s4 * e)} $`
          relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])
          if (relatifs[0] > 0 && relatifs[4] < 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${texNombreCoul(relatifs[0], 'blue', 'green', 'black', 2)}+${ecritureNombreRelatifc(relatifs[1])}+${ecritureNombreRelatifc(relatifs[2])}+${ecritureNombreRelatifc(relatifs[3])}+${ecritureNombreRelatifc(relatifs[4])} $`
          }
          sommesSignees = sommeDesTermesParSigne([
            relatifs[0],
            relatifs[1],
            relatifs[2],
            relatifs[3],
            relatifs[4],
          ])
          if (sommesSignees[0] !== 0 && sommesSignees[1] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${texNombreCoul(sommesSignees[0], 'blue', 'green', 'black', 2)}+${ecritureNombreRelatifc(sommesSignees[1])} $`
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureAlgebriquec(a + s1 * b + s2 * c + s3 * d + s4 * e, orangeMathalea)} $<br>`
          } else if (sommesSignees[0] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[0], orangeMathalea)}$`
          } else {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[1], orangeMathalea)}$<br>`
          }
          break
        }
        case 3: {
          /// texNombreCoul (nombre: number | Decimal, positif = 'green', negatif = 'red', nul = 'black', precision: number)
          texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${texNombre(a, 2)}${signe(s1)}${ecritureParentheseSiNegatif(b)}${signe(s2)}${ecritureParentheseSiNegatif(c)}${signe(s3)}${ecritureParentheseSiNegatif(d)}${signe(s4)}${ecritureParentheseSiNegatif(e)}$`
          if (this.interactif && context.isHtml) {
            texte +=
              `$${sp(1)} = $` +
              ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
          }
          if (!context.isHtml && !context.isAmc) {
            texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
          }
          texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${texNombre(a, 2)}${signe(s1)}${ecritureParentheseSiNegatif(b)}${signe(s2)}${ecritureParentheseSiNegatif(c)}${signe(s3)}${ecritureParentheseSiNegatif(d)}${signe(s4)}${ecritureParentheseSiNegatif(e)}$<br>`
          relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])
          texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=${texNombreCoul(a, 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(s1 * b)}${ecritureAlgebriquec(s2 * c)}${ecritureAlgebriquec(s3 * d)}${ecritureAlgebriquec(s4 * e)}$<br>`
          texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
          b = s1 * b
          c = s2 * c
          d = s3 * d
          e = s4 * e
          if (
            sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0 &&
            sommeDesTermesParSigne([a, b, c, d, e])[1] !== 0
          ) {
            texteCorr += `$ ${texNombreCoul(relatifs[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(relatifs[1])}${ecritureAlgebriquec(relatifs[2])}${ecritureAlgebriquec(relatifs[3])}${ecritureAlgebriquec(relatifs[4])}$<br>`
            texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
            texteCorr += `$ ${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1])}$<br>`
            texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
            texteCorr += `$ ${texNombreCoul(a + b + c + d + e, 'blue', '#f15929', 'black', 2)} $`
          } else if (sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0) {
            texteCorr += `$ ${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}$`
          } else {
            texteCorr += `$ ${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1], '#f15929')}$`
          }
          break
        }
        case 5: {
          texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
          if (this.interactif && context.isHtml) {
            texte +=
              `$ ${sp(1)} = $` +
              ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
          }
          if (!context.isHtml && !context.isAmc) {
            texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
          }
          texteCorr = `$ ${lettreDepuisChiffre(i + 1)} = ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$<br>`
          relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])
          texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=${texNombreCoul(a, 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(s1 * b)}${ecritureAlgebriquec(s2 * c)}${ecritureAlgebriquec(s3 * d)}${ecritureAlgebriquec(s4 * e)}$<br>`
          texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
          b = s1 * b
          c = s2 * c
          d = s3 * d
          e = s4 * e
          if (
            sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0 &&
            sommeDesTermesParSigne([a, b, c, d, e])[1] !== 0
          ) {
            texteCorr += `$ ${texNombreCoul(relatifs[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(relatifs[1])}${ecritureAlgebriquec(relatifs[2])}${ecritureAlgebriquec(relatifs[3])}${ecritureAlgebriquec(relatifs[4])}$<br>`
            texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
            texteCorr += `$ ${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1])}$<br>`
            texteCorr += `$ ${lettreDepuisChiffre(i + 1)}=$`
            texteCorr += `$ ${texNombreCoul(a + b + c + d + e, 'blue', '#f15929', 'black', 2)} $`
          } else if (sommeDesTermesParSigne([a, b, c, d, e])[0] !== 0) {
            texteCorr += `$ ${texNombreCoul(sommeDesTermesParSigne([a, b, c, d, e])[0], 'blue', '#f15929', 'black', 2)}$`
          } else {
            texteCorr += `$ ${ecritureAlgebriquec(sommeDesTermesParSigne([a, b, c, d, e])[1], '#f15929')}$`
          }
          /*           texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(a)}+${ecritureNombreRelatifc(s1 * b)}+${ecritureNombreRelatifc(s2 * c)}+${ecritureNombreRelatifc(s3 * d)}+${ecritureNombreRelatifc(s4 * e)} $`

          relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])

          if (relatifs[0] > 0 && relatifs[4] < 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(relatifs[0])}+${ecritureNombreRelatifc(relatifs[1])}+${ecritureNombreRelatifc(relatifs[2])}+${ecritureNombreRelatifc(relatifs[3])}+${ecritureNombreRelatifc(relatifs[4])} $`
          }
          sommesSignees = sommeDesTermesParSigne([relatifs[0], relatifs[1], relatifs[2], relatifs[3], relatifs[4]])
          if (sommesSignees[0] !== 0 && sommesSignees[1] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(sommesSignees[0])}+${ecritureNombreRelatifc(sommesSignees[1])} $`
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureAlgebriquec(a + s1 * b + s2 * c + s3 * d + s4 * e, orangeMathalea)} $<br>`
          } else if (sommesSignees[0] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[0], orangeMathalea)}$`
          } else {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[1], orangeMathalea)}$<br>`
          }
 */ break
        }
        case 1:
        default: {
          texte = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
          if (this.interactif && context.isHtml) {
            texte +=
              `$ ${sp(1)} = $` +
              ajouteChampTexteMathLive(this, i, KeyboardType.clavierDeBase)
          }
          if (!context.isHtml && !context.isAmc) {
            texte += `<br>$ ${lettreDepuisChiffre(i + 1)} =$`
          }
          texteCorr = `$ ${lettreDepuisChiffre(i + 1)} =  ${ecritureNombreRelatif(a)}${signe(s1)}${ecritureNombreRelatif(b)}${signe(s2)}${ecritureNombreRelatif(c)}${signe(s3)}${ecritureNombreRelatif(d)}${signe(s4)}${ecritureNombreRelatif(e)}$`
          texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(a)}+${ecritureNombreRelatifc(s1 * b)}+${ecritureNombreRelatifc(s2 * c)}+${ecritureNombreRelatifc(s3 * d)}+${ecritureNombreRelatifc(s4 * e)} $`

          relatifs = triePositifsNegatifs([a, s1 * b, s2 * c, s3 * d, s4 * e])

          if (relatifs[0] > 0 && relatifs[4] < 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(relatifs[0])}+${ecritureNombreRelatifc(relatifs[1])}+${ecritureNombreRelatifc(relatifs[2])}+${ecritureNombreRelatifc(relatifs[3])}+${ecritureNombreRelatifc(relatifs[4])} $`
          }
          sommesSignees = sommeDesTermesParSigne([
            relatifs[0],
            relatifs[1],
            relatifs[2],
            relatifs[3],
            relatifs[4],
          ])
          if (sommesSignees[0] !== 0 && sommesSignees[1] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureNombreRelatifc(sommesSignees[0])}+${ecritureNombreRelatifc(sommesSignees[1])} $`
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}= ${ecritureAlgebriquec(a + s1 * b + s2 * c + s3 * d + s4 * e, orangeMathalea)} $<br>`
          } else if (sommesSignees[0] !== 0) {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[0], orangeMathalea)}$`
          } else {
            texteCorr += `<br>$ ${lettreDepuisChiffre(i + 1)}=${ecritureAlgebriquec(sommesSignees[1], orangeMathalea)}$<br>`
          }
          break
        }
      }
      if (this.questionJamaisPosee(i, a, b, c, d, e)) {
        // Si la question n'a jamais été posée, on en créé une autre
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr

        if (this.sup2 < 4) {
          handleAnswers(this, i, {
            reponse: {
              value: a + s1 * b + s2 * c + s3 * d + s4 * e,
              options: { resultatSeulementEtNonOperation: true },
            },
          })
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCOpen',

                  propositions: [
                    {
                      enonce: this.consigne + '<br>' + texte,
                      texte: texteCorr,
                      statut: 3,
                      pointilles: true,
                    },
                  ],
                },
                {
                  type: 'AMCNum',

                  propositions: [
                    {
                      texte: '',
                      statut: '',
                      reponse: {
                        texte: 'Résultat',
                        valeur: [a + s1 * b + s2 * c + s3 * d + s4 * e],
                        param: {
                          digits: Math.max(
                            2,
                            nombreDeChiffresDansLaPartieEntiere(
                              a + s1 * b + s2 * c + s3 * d + s4 * e,
                            ),
                          ),
                          decimals: 0,
                          signe: true,
                          exposantNbChiffres: 0,
                          exposantSigne: false,
                          approx: 0,
                        },
                      },
                    },
                  ],
                },
              ],
            }
          }
        } else {
          handleAnswers(this, i, {
            reponse: {
              value: a + b + c + d + e,
              options: { resultatSeulementEtNonOperation: true },
            },
          })
          if (context.isAmc) {
            this.autoCorrection[i] = {
              enonce: '',
              enonceAvant: false,
              options: { multicols: true },
              propositions: [
                {
                  type: 'AMCOpen',

                  propositions: [
                    {
                      enonce: this.consigne + '<br>' + texte,
                      texte: texteCorr,
                      statut: 3,
                      pointilles: true,
                    },
                  ],
                },
                {
                  type: 'AMCNum',

                  propositions: [
                    {
                      texte: '',
                      statut: '',
                      reponse: {
                        texte: 'Résultat',
                        valeur: [a + b + c + d + e],
                        param: {
                          digits: Math.max(
                            2,
                            nombreDeChiffresDansLaPartieEntiere(
                              a + b + c + d + e,
                            ),
                          ),
                          decimals: 0,
                          signe: true,
                          exposantNbChiffres: 0,
                          exposantSigne: false,
                          approx: 0,
                        },
                      },
                    },
                  ],
                },
              ],
            }
          }
        }

        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}
