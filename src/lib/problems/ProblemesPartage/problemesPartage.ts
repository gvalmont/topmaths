import { randint } from '../../../modules/outils'
import SchemaEnBoite from '../../outils/SchemaEnBoite'
import { texNombre } from '../../outils/texNombre'
import Probleme from '../Probleme'
import { courses2 } from './courses'
import { mariage1 } from './mariage'
/**
 * @author Jean-Claude Lhote
 */
export default class ProblemePartage extends Probleme {
  constructor (name: string = '', data?: { nbFois: number, quotité: number, reste?: number }) {
    const nbFois = data?.nbFois ?? randint(2, 5)
    const reste = data?.reste ?? 0
    const quotité = data?.quotité ?? randint(10, 20)
    const total = nbFois * quotité + reste
    data = data == null ? { nbFois, quotité: randint(5, 10) } : data
    super(name, data)
    this.schema = new SchemaEnBoite({

      bottomBraces: [{
        start: 3,
        end: 13,
        text: String(nbFois)
      }],
      lignes: [
        {
          barres: [
            {
              content: `$${nbFois * quotité + reste}$`,
              length: 12,
              color: 'lightgray'
            }
          ]
        },
        {
          barres: [
            {
              content: String(reste),
              length: 2,
              color: 'lightgray'
            },
            {
              content: String(quotité),
              length: 2,
              color: 'lightgray'
            },
            {
              content: '',
              length: 6,
              color: 'lightgray',
              type: 'flèche'
            },
            {
              content: String(quotité),
              length: 2,
              color: 'lightgray'
            }
          ]
        }
      ]
    })
    this.enonce = `Nous avons ${total} objets. Après en avoir mis ${reste} de côté, nous formons ${nbFois} paquets. Combien y a-t-il d'objets par paquets ?`
    this.correction = `Nous avons ${total} objets. Après en avoir mis ${reste} de côté, il en reste ${total - reste}. Donc, il y a $${texNombre((total - reste) / nbFois, 2)}$ objets par paquet.`
    this.reponse = texNombre((total - reste) / nbFois, 2)
  }
}

export const listeDeProblemesPartage = [
  mariage1,
  courses2
]
