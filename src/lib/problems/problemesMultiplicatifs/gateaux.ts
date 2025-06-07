import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../interactif/claviers/keyboard'
import { choice } from '../../outils/arrayOutils'
import { prenomPronom } from '../../outils/Personne'
import type Probleme from '../Probleme'
import ProblemeMultiplicatifs from './problemesMultiplicatifs'
/**
 * @author Jean-Claude Lhote
 */
export function gateaux1 (decimal = false): Probleme {
  const personnage = prenomPronom()
  const nbPaquets = randint(2, 5)
  const nbGateauxParPaquet = choice([10, 12, 15, 16, 18, 20, 24, 30])
  const data = { nbFois: nbPaquets, facteur: nbGateauxParPaquet }
  const enonce = `Pour son goûter d'anniversaire, ${personnage.prenom} a acheté ${nbPaquets} paquets de gâteaux. Chaque paquet contient ${nbGateauxParPaquet} gâteaux. Combien de gâteaux a-t-${personnage.pronom} au total ?`
  const correction = `${personnage.prenom} a acheté ${nbPaquets} paquets de gâteaux, chacun contenant ${nbGateauxParPaquet} gâteaux. Donc, au total, ${personnage.pronom} a ${nbPaquets * nbGateauxParPaquet} gâteaux.`
  const probleme = new ProblemeMultiplicatifs('gateaux1', data)
  probleme.enonce = enonce
  probleme.correction = correction
  probleme.schema.lignes[0].entete = { content: 'gâteaux', longueur: 3 }
  if (probleme.schema.topBraces == null) {
    probleme.schema.topBraces = []
  }
  probleme.schema.topBraces[0].start = 4
  probleme.schema.topBraces[0].end = 2 * nbPaquets + 4
  probleme.styleChampTexteMathlive = KeyboardType.college6eme
  return probleme
}
