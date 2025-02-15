import { combinaisonListes } from '../../lib/outils/arrayOutils'
import { ecritureParentheseSiMoins } from '../../lib/outils/ecritures'
import { arrondi, nombreDeChiffresDansLaPartieEntiere } from '../../lib/outils/nombres'
import { texNombre } from '../../lib/outils/texNombre'
import Exercice from '../Exercice'
import { context } from '../../modules/context'
import { listeQuestionsToContenu, randint } from '../../modules/outils'
import { handleAnswers, setReponse } from '../../lib/interactif/gestionInteractif'
import { remplisLesBlancs } from '../../lib/interactif/questionMathLive'
import { KeyboardType } from '../../lib/interactif/claviers/keyboard'

export const interactifReady = true

export const dateDeModifImportante = '6/2/2024'
// Passage à remplis les blancs avec feedback pour les parenthèses
export const amcReady = true
export const amcType = 'AMCNum'
export const interactifType = 'mathLive'
export const titre = 'Trouver le terme manquant d\'une somme de nombres relatifs'

/**
 * Additions à trou dans les relatifs
 *
 *  @author Jean-Claude Lhote à partir de CM000 de Rémi Angot
 */
export const uuid = '61b4a'

export const refs = {
  'fr-fr': ['5R20-1'],
  'fr-ch': ['9NO9-4']
}
export default class TermeInconnuDeSomme extends Exercice {
  constructor () {
    super()
    this.besoinFormulaireNumerique = ['Niveau de difficulté', 2, '1 : Nombres entiers\n2 : Nombres décimaux']
    this.besoinFormulaire2Numerique = ['Valeur maximale', 9999]
    this.besoinFormulaire3Numerique = ["Type d'égalités", 2, '1 : Égalités à trou\n2 : Équations']
    this.nbQuestions = 5
    this.sup = 1
    this.sup3 = 1
    this.sup2 = 20 // additions|additions à trous|soustractions|soustractions à trous|mélange sans trou|mélange avec trou
    this.consigne = 'Calculer le terme manquant.'
    this.spacing = 2
    this.interactif = false

    this.amcType = amcType
    this.amcReady = amcReady
  }

  nouvelleVersion () {
    const typesDeQuestionsDisponibles = [1, 2, 3, 4]
    const listeTypeDeQuestions = combinaisonListes(typesDeQuestionsDisponibles, this.nbQuestions)
    let decimal
    if (this.sup === 1) {
      decimal = 1
    } else {
      decimal = 10
    }
    for (let i = 0, a, b, texte, texteCorr, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      if (!context.isAmc) {
        a = arrondi(randint(4 * decimal, this.sup2 * decimal) / decimal, 1)
        b = arrondi(randint(2 * decimal, this.sup2 * decimal) / decimal, 1)
      } else {
        a = arrondi(randint(4 * decimal, 20 * decimal) / decimal, 1)
        b = arrondi(randint(2 * decimal, 20 * decimal) / decimal, 1)
      }

      let feedback
      switch (listeTypeDeQuestions[i]) {
        case 1:
          if (a > b) feedback = feedbackNeedParentheses
          texte = remplisLesBlancs(this, i, `${texNombre(a)} + %{champ1} = ${texNombre(b)}`, KeyboardType.clavierDeBase, '\\ldots', { espaceDevant: true })
          texteCorr = `$${texNombre(a)} + ${ecritureParentheseSiMoins(texNombre(b - a))} = ${texNombre(b)}$`
          break

        case 2:
          texte = remplisLesBlancs(this, i, `%{champ1} + ${texNombre(a)} = ${texNombre(b)}`, KeyboardType.clavierDeBase, '\\ldots', { espaceDevant: true })
          texteCorr = `$${ecritureParentheseSiMoins(texNombre(b - a))} + ${texNombre(a)} = ${texNombre(b)}$`
          break

        case 3:
          if (a > b) feedback = feedbackNeedParentheses
          texte = remplisLesBlancs(this, i, `${texNombre(b)} = %{champ1} + ${texNombre(a)}`, KeyboardType.clavierDeBase, '\\ldots', { espaceDevant: true })
          texteCorr = `$${texNombre(b)}=${ecritureParentheseSiMoins(texNombre(b - a))} + ${texNombre(a)}$`
          break

        case 4:
        default:
          texte = remplisLesBlancs(this, i, `${texNombre(b)} = ${texNombre(a)} + %{champ1}`, KeyboardType.clavierDeBase, '\\ldots', { espaceDevant: true })
          texteCorr = `$${texNombre(b)}=${texNombre(a)} + ${ecritureParentheseSiMoins(texNombre(b - a))}$`
          break
      }
      texteCorr += `. En effet : $${texNombre(b)}-${texNombre(a)}=${texNombre(b - a)}$`

      if (this.questionJamaisPosee(i, a, b)) {
        this.listeQuestions[i] = texte
        this.listeCorrections[i] = texteCorr

        if (this.interactif) {
          handleAnswers(this, i, {
            champ1: { value: arrondi(b - a, 2) },
            feedback
          })
        } else if (context.isAmc) {
          setReponse(this, i, arrondi(b - a, 2), {
            signe: true,
            digits: Math.max(2, nombreDeChiffresDansLaPartieEntiere(b - a)),
            decimals: 0
          })
        }
        i++
      }
      cpt++
    }
    listeQuestionsToContenu(this)
  }
}

function feedbackNeedParentheses (input: Record<string, string>) {
  const champ1 = input.champ1
  if (champ1.length > 0 && !champ1.startsWith('\\lparen')) {
    return 'On ne peut pas écrire « +- ». Il faudrait mettra la réponse entre parenthèses.'
  }
  return ''
}
