import { randint } from '../../../modules/outils'
import { KeyboardType } from '../../interactif/claviers/keyboard'
import { choice } from '../../outils/arrayOutils'
import { prenomPronom } from '../../outils/Personne'
import { texNombre } from '../../outils/texNombre'
import type Probleme from '../Probleme'
import ProblemeAdditif from './problemesAdditifs'
/**
 * @author Jean-Claude Lhote
 */
export function recette1 (decimal = false): Probleme {
  const recettes = [
    { ingredient1: { nom: 'farine', masseMini: 100, masseMaxi: 500 }, ingredient2: { nom: 'sucre', masseMini: 25, masseMaxi: 50 }, nomRecette: 'crêpes' },
    { ingredient1: { nom: 'pâtes', masseMini: 200, masseMaxi: 800 }, ingredient2: { nom: 'sauce tomate', masseMini: 100, masseMaxi: 300 }, nomRecette: 'pâtes à la sauce tomate' },
    { ingredient1: { nom: 'riz', masseMini: 150, masseMaxi: 600 }, ingredient2: { nom: 'légumes', masseMini: 100, masseMaxi: 400 }, nomRecette: 'riz aux légumes' },
  ]
  const recette = choice(recettes)
  const masse1 = randint(recette.ingredient1.masseMini, recette.ingredient1.masseMaxi)
  const masse2 = randint(recette.ingredient2.masseMini, recette.ingredient2.masseMaxi)
  const nomRecette = recette.nomRecette
  const personnage = prenomPronom()
  const enonce = `${personnage.prenom} prépare des ${nomRecette} avec ${masse1} g de ${recette.ingredient1.nom} et ${masse2} g de ${recette.ingredient2.nom}. 
  Quelle est la masse totale des ingrédients utilisés ?`
  const data = { nb1: masse1, nb2: masse2 }
  const correction = `${personnage.prenom} prépare des ${nomRecette} avec ${masse1} g de ${recette.ingredient1.nom} et ${masse2} g de ${recette.ingredient2.nom}.
Donc, la masse totale des ingrédients utilisés est de ${texNombre(masse1 + masse2, 0)} g.`
  const probleme = new ProblemeAdditif('recette1', data)
  probleme.enonce = enonce
  probleme.correction = correction
  probleme.schema.lignes[1].barres[0].content = `$${texNombre(masse1, 2)}$ g`
  probleme.schema.lignes[1].barres[1].content = `$${texNombre(masse2, 2)}$ g`
  probleme.schema.lignes[0].barres[0].content = `$${texNombre(masse1 + masse2, 2)}$ g`
  probleme.styleChampTexteMathlive = KeyboardType.masse
  probleme.reponse = `${texNombre(masse1 + masse2, 2)}g`
  probleme.optionsComparaison = { unite: true }
  return probleme
}
