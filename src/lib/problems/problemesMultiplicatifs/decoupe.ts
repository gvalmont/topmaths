import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../interactif/claviers/keyboard'
import { choice } from '../../outils/arrayOutils'
import { prenomPronom } from '../../outils/Personne'
import { texNombre } from '../../outils/texNombre'
import type Probleme from '../Probleme'
import ProblemeMultiplicatifs from './problemesMultiplicatifs'
/**
 * @author Jean-Claude Lhote
 */
export function decoupe1 (decimal = false): Probleme {
  const objet = choice(['ficelle', 'corde', 'tissu', 'cartoline', 'bois'])
  const personnage = prenomPronom()
  const nbFois = randint(2, 6)
  const longueur = decimal ? randint(13, 30) * 0.5 : randint(6, 15)
  const data = { nbFois, facteur: longueur }
  const enonce = `${personnage.prenom} a découpé ${nbFois} morceaux de ${objet} de longueur $${texNombre(longueur, 1)}$ cm. Quelle est la longueur totale de ${objet} utilisée ?`
  const correction = `${personnage.prenom} a découpé ${nbFois} morceaux de ${objet} de longueur $${texNombre(longueur, 1)}$ cm. Donc, la longueur totale de ${objet} utilisée est de $${texNombre(nbFois * longueur, 1)}$ cm.`
  const probleme = new ProblemeMultiplicatifs('decoupe1', data)
  probleme.enonce = enonce
  probleme.correction = correction
  probleme.schema.lignes[0].barres[0].content = `$${texNombre(longueur, 1)}$ cm`
  probleme.styleChampTexteMathlive = KeyboardType.longueur
  probleme.reponse = `${texNombre(nbFois * longueur, 1)}cm`
  probleme.optionsComparaison = { unite: true }
  return probleme
}
