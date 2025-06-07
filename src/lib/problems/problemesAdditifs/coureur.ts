import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../interactif/claviers/keyboard'
import { prenomPronom } from '../../outils/Personne'
import { texNombre } from '../../outils/texNombre'
import type Probleme from '../Probleme'
import ProblemeAdditif from './problemesAdditifs'
/**
 * @author Jean-Claude Lhote
 */
export function coureur2 (decimal = true): Probleme {
  const personnage = prenomPronom()
  const nb1 = randint(350, 700) * 10
  const nb2 = randint(350, 300) * 10
  const data = { nb1, nb2 }
  const enonce = `${personnage.prenom} a réalisé un trail pendant aucours duquel il a couru sur $${texNombre(nb1, 0)}$ mètres et a marché sur $${texNombre(nb2, 0)}$ mètres.
  Quelle est la distance totale a-t-${personnage.pronom} parcourue ?`
  const correction = `${personnage.prenom} a couru sur $${texNombre(nb1, 0)}$ mètres et a marché sur $${texNombre(nb2, 0)}$ mètres.
  Donc, au total, ${personnage.pronom} a parcouru $${texNombre(nb1 + nb2, 0)}$ mètres.`
  const probleme = new ProblemeAdditif('coureur2', data)
  probleme.enonce = enonce
  probleme.correction = correction
  probleme.schema.lignes[1].barres[0].content = `$${texNombre(nb1, 0)}$ m`
  probleme.schema.lignes[1].barres[1].content = `$${texNombre(nb2, 0)}$ m`
  probleme.schema.lignes[0].barres[0].content = `$${texNombre(nb1 + nb2, 2)}$ m`
  if (probleme.schema.topBraces == null) {
    probleme.schema.topBraces = []
  }
  probleme.schema.topBraces[0].text = 'Distance totale'
  probleme.styleChampTexteMathlive = KeyboardType.college6eme
  probleme.reponse = `${texNombre(nb1 + nb2, 0)}km`
  probleme.styleChampTexteMathlive = KeyboardType.longueur
  probleme.optionsComparaison = { unite: true }
  return probleme
}
