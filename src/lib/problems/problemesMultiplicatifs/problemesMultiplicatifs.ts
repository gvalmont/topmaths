import { randint } from '../../../modules/outils'
import SchemaEnBoite from '../../outils/SchemaEnBoite'
import { texNombre } from '../../outils/texNombre'
import Probleme from '../Probleme'
import { coureur1 } from './coureur'
import { decoupe1 } from './decoupe'
import { gateaux1 } from './gateaux'
/**
 * @author Jean-Claude Lhote
 */
export default class ProblemeMultiplicatifs extends Probleme {
  constructor (name: string = '', data?: { nbFois: number, facteur: number }) {
    data = data == null ? { nbFois: randint(2, 5), facteur: randint(2, 5) * 5 } : data
    if (data.nbFois < 2) {
      throw new Error('La valeur de nbFois doit être supérieure ou égale à 2.')
    }
    if (data.nbFois > 7) {
      throw new Error('La valeur de nbFois doit être inférieure à 8.')
    }
    if (data.nbFois % 1 !== 0 || data.facteur % 1 !== 0) {
      throw new Error('La valeur  de nbFois doit être un entier.')
    }
    super(name, data)
    this.schema = new SchemaEnBoite({
      topBraces: [{
        start: 1,
        end: 2 * data.nbFois + 1,
        text: `$${data.nbFois}$ fois`
      }],
      bottomBraces: [],
      rightBraces: [],
      lignes: [
        {
          barres: [
            {
              content: `$${data.facteur}$`,
              length: 2,
              color: 'lightgray'
            },
            ...Array.from({ length: data.nbFois - 1 }, () => ({
              content: '$\\ldots$',
              length: 2,
              color: 'lightgray'
            }))
          ]
        },
        {
          barres: [
            {
              content: '?',
              length: 2 * data.nbFois,
              color: 'lightgray'
            }
          ]
        }
      ]
    })
    this.enonce = `Combien coûte ${data.nbFois} fois un produit à $${data.facteur}$ € ?`
    this.correction = `Le coût de ${data.nbFois} fois un produit à $${data.facteur}$ € est de $${data.nbFois * data.facteur}$ €`
    this.reponse = texNombre(data.nbFois * data.facteur, 4)
  }
}

export const listeDeProblemesMultiplicatifs = [
  gateaux1,
  decoupe1,
  coureur1
]
