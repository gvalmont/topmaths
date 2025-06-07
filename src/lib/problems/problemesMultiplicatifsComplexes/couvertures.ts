import { randint } from '../../../modules/outils'
import { choice } from '../../outils/arrayOutils'
import type Probleme from '../Probleme'
import ProblemeMultiplicatifsComplexes from './problemesMultiplicatifsComplexes'
/**
 * @author Jean-Claude Lhote
 */
export function couverture (decimal = false): Probleme {
  const nb1Fois = randint(3, 7) * 5 // nombre de livres
  const part1 = choice([30, 35, 40, 45]) // longueur plastique par livre
  const part2 = randint(4, 6) * 100 // longueur du rouleau en cm
  const part2EnM = part2 / 100 // longueur du rouleau en mètre
  const data = { nb1Fois, part1, part2 }
  const probleme = new ProblemeMultiplicatifsComplexes('couverture', data)
  probleme.enonce = probleme.enonce.replace(`$${data.part2}$ m`, `$${part2EnM}$ m`)
  probleme.correction = probleme.correction.replace(`$${data.part2}$ m`, `$${part2EnM}$ m, soit ${data.part2} cm`)
  return probleme
}
