import { prenomF, prenomM } from '../../lib/outils/Personne'
import SchemaEnBoite from '../../lib/outils/SchemaEnBoite'
import { texNombre } from '../../lib/outils/texNombre'
import { gestionnaireFormulaireTexte, randint } from '../../modules/outils'
import Exercice from '../Exercice'

export const titre = 'Schemas en boite'
export const uuid = 'sebseb'

export default class BetaSchemaEnBoite extends Exercice {
  constructor () {
    super()
    this.nbQuestions = 4
    this.besoinFormulaireTexte = ['Types de problèmes', [
      'Nombres séparés par des tirets  :',
      '1 : Somme dont on cherche le résultat',
      '2 : Soustraction dont on cherche un terme',
      '3 : Multiplication dont on cherche le résultat',
      '4 : Division partition ou quotition exacte',
      '5 : Division dont on cherche le reste',
      '6 : Division avec reste dont on cherche le dividende ou le quotient',
      '7 : Mélange'
    ].join('\n')]
    this.sup = '1'
  }

  nouvelleVersion (numeroExercice?: number): void {
    for (let i = 0, cpt = 0; i < this.nbQuestions && cpt < 50;) {
      const type: number[] = gestionnaireFormulaireTexte({ nbQuestions: this.nbQuestions, saisie: this.sup, min: 1, max: 6, defaut: 1, melange: 7 }).map(Number)
      const lea = prenomF(1)
      const eric = prenomM(1)
      let texte: string
      let seb: SchemaEnBoite
      let nb1: number
      let nb2: number
      switch (type[i]) {
        case 1: { // Addition dont on cherche le résultat
          const hl1 = randint(3, 5)
          const hl2 = 8 - hl1
          const coef = randint(2, 8)
          nb1 = hl1 * coef
          nb2 = hl2 * coef
          // const somme = nb1 + nb2

          texte = `${lea} a ${nb1} bonbons et ${eric} a ${nb2} bonbons. Combien ont-ils de bonbons en tout ?`
          seb = SchemaEnBoite.addition(nb1, nb2, 2) // J'ai mis 2 en précision pour que les cases soient plus grandes
        }
          break
        case 2: { // Soustraction dont on cherche un terme
          const hl1 = randint(3, 5)
          const hl2 = 8 - hl1
          const coef = randint(2, 8)
          nb1 = hl1 * coef
          nb2 = hl2 * coef
          const somme = nb1 + nb2
          switch (randint(1, 3)) {
            case 1:
              texte = `${lea} a donné ${nb1} bonbons à ${eric} et maintenant il lui en reste ${nb2}. Combien ${lea} avait-elle de bonbons au départ ?`
              seb = SchemaEnBoite.addition(nb1, nb2, 2)

              break
            case 2:
              {
                const hl1 = randint(3, 5)
                const hl2 = 8 - hl1
                const coef = randint(2, 8)
                nb1 = hl1 * coef
                nb2 = hl2 * coef
                const somme = nb1 + nb2
                texte = `${lea} a ${nb1} bonbons et, avec ${eric}, ils en ont ${somme}. Combien ${eric} a-t-il de bonbons ?`
                seb = SchemaEnBoite.soustraction(somme, undefined, nb1, 2)
              }
              break
            default:
              texte = `${lea} a ${somme} bonbons. Après en avoir donné à ${eric}, il lui en reste ${nb1}. Combien de bonbons a-t-elle donnés ?`
              seb = SchemaEnBoite.soustraction(somme, nb1, undefined, 2)
          }
          break
        }
        case 3: { // Multiplication dont on cherche le résultat
          const nbFois = randint(15, 30)
          nb1 = randint(2, 8)
          nb2 = nb1 * nbFois

          texte = `${lea} a distribué ${nb1} bonbons à chacun de ses ${nbFois} élèves. Combien de bonbons a-t-elle distribués en tout ?`
          seb = SchemaEnBoite.multiplication(nb1, nbFois, 2, undefined) // J'ai mis 2 en précision pour que les cases soient plus grandes
        }
          break
        case 4: // Division partition ou quotition exacte
          switch (randint(1, 2)) {
            case 1: {
              const nbFois = randint(15, 30)
              nb1 = randint(2, 8)
              nb2 = nb1 * nbFois
              texte = `${lea} avait ${nb2} bonbons. Elle les a distribués équitablement à chacun de ses ${nbFois} élèves. Combien de bonbons a reçu chaque élève ?`
              seb = SchemaEnBoite.division(nb2, undefined, nbFois, 2)
            }
              break
            default: {
              const nbFois = randint(15, 30)
              nb1 = randint(2, 8)
              nb2 = nb1 * nbFois
              texte = `${lea} a distribué ${nb1} bonbons à chacun de ses élèves. En tout, elle a distribué ${nb2} bonbons. Combien d'élèves a-t-elle ?`
              seb = SchemaEnBoite.division(nb2, nb1, undefined, 2)
            }
          }
          break

        case 5: { // Division dont on cherche le reste
          const nbFois = randint(15, 30)
          nb1 = randint(2, 8)
          nb2 = nb1 * nbFois + randint(1, nb1 - 1)
          texte = `${lea} avait ${nb2} bonbons. Elle a distribué ${nb1} bonbons à chacun de ses ${nbFois} élèves. Combien de bonbons lui reste-t-il ?`
          seb = SchemaEnBoite.divisionAvecReste(nb2, nb1, nbFois, 0, '?')
        }
          break
        default: { // Division dont on cherche le dividende
          switch (randint(1, 2)) {
            case 1: {
              const nbFois = randint(15, 30)
              nb1 = randint(2, 8)
              const reste = randint(1, nb1 - 1)
              nb2 = nb1 * nbFois + reste
              texte = `${lea} a distribué ${nb1} bonbons à chacun de ses ${nbFois} élèves. Il lui en reste ${reste}. Combien en avait-elle avant la distribution ?`
              seb = SchemaEnBoite.divisionAvecReste(undefined, nb1, nbFois, 0, `$${texNombre(reste, 0)}$`)
            }
              break
            default: {
              const nbFois = randint(15, 30)
              nb1 = randint(2, 8)
              const reste = randint(1, nb1 - 1)
              nb2 = nb1 * nbFois + reste
              texte = `${lea} avait ${nb2} bonbons. Elle a distribué ${nb1} bonbons à chacun de ses élèves. Il lui reste ${reste} bonbons. Combien d'élèves a-t-elle ?`
              seb = SchemaEnBoite.divisionAvecReste(nb2, nb1, undefined, 0, `$${texNombre(reste, 0)}$`)
            }
              break
          }
        }
      }
      if (this.questionJamaisPosee(i, nb1, nb2)) {
        this.listeQuestions[i] = `${texte}<br>${seb.display()}`
        this.listeCorrections[i] = ''
        i++
      }
      cpt++
    }
  }
}
