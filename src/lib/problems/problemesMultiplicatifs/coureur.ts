import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../interactif/claviers/keyboard'
import { choice } from '../../outils/arrayOutils'
import { prenomPronom } from '../../outils/Personne'
import type Probleme from '../Probleme'
import ProblemeMultiplicatifs from './problemesMultiplicatifs'
/**
 * @author Jean-Claude Lhote
 */
export function coureur1 (decimal = false): Probleme {
  const personnage = prenomPronom()
  const nbFoisParSemaine = randint(2, 5)
  const nbKmParJour = choice([10, 12, 15, 16, 18, 20, 24, 30])
  const data = { nbFois: nbFoisParSemaine, facteur: nbKmParJour }
  const enonce = `Pour entretenir sa bonne santé, ${personnage.prenom} court ${nbFoisParSemaine} jours par semaine. Chaque fois ${personnage.pronom} court ${nbKmParJour} km. Combien de km parcourt-${personnage.pronom} au total chaque semaine ?`
  const correction = `${personnage.prenom} court ${nbFoisParSemaine} jours par semaine. Chaque jour, ${personnage.pronom} court ${nbKmParJour} km. Donc, au total, ${personnage.pronom} parcourt ${nbFoisParSemaine * nbKmParJour} km chaque semaine.`
  const probleme = new ProblemeMultiplicatifs('coureur1', data)
  probleme.enonce = enonce
  probleme.correction = correction
  probleme.schema.lignes[0].barres[0].content = `$${nbKmParJour}$ km`
  probleme.styleChampTexteMathlive = KeyboardType.longueur
  probleme.reponse = `${nbFoisParSemaine * nbKmParJour}km`
  probleme.optionsComparaison = { unite: true }
  return probleme
}
