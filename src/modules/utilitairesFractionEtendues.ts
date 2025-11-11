import { listeDesDiviseurs, pgcd } from '../lib/outils/primalite'

/**
 * Renvoie l'ensemble des fractions égales et simplifiées
 * Ne change pas et ne déplace pas les signes (s'il y a un "-" au dénominateur, il restera au dénominateur)
 */
export function listerFractionsSimplifiees(n: number, d: number): number[][] {
  if (pgcd(n, d) === 1) {
    return [[n, d]]
  } else {
    const liste: number[][] = []
    for (const diviseur of listeDesDiviseurs(pgcd(n, d))) {
      liste.push([n / diviseur, d / diviseur])
    }
    return liste
  }
}

/**
 * L'ensemble des écritures possibles d'une même fraction au format LaTeX
 */
export function texArrayReponsesFraction(
  numerateur: number,
  denominateur: number,
): string[] {
  const n = Math.abs(numerateur)
  const d = Math.abs(denominateur)
  if (d === 1) {
    return [(numerateur * denominateur).toString()]
  } else {
    if (numerateur * denominateur > 0) {
      return [
        `\\frac{${n}}{${d}}`,
        `\\frac{${-n}}{${-d}}`,
        `-\\frac{${-n}}{${d}}`,
        `-\\frac{${n}}{${-d}}`,
      ]
    } else if (numerateur * denominateur < 0) {
      return [
        `-\\frac{${n}}{${d}}`,
        `-\\frac{${-n}}{${-d}}`,
        `\\frac{${-n}}{${d}}`,
        `\\frac{${n}}{${-d}}`,
      ]
    } else {
      return ['0']
    }
  }
}

/**
 * Liste des couples de fractions (ou de leurs formes égales et simplifiées) au format 'frac1;frac2'
 */
export function texArrayReponsesCoupleDeFractions(
  n1: number,
  d1: number,
  n2: number,
  d2: number,
  egalesEtSimplifiees: boolean = false,
): string[] {
  let listeFraction1: string[]
  let listeFraction2: string[]
  if (egalesEtSimplifiees) {
    listeFraction1 = texArrayReponsesFractionsEgalesEtSimplifiees(n1, d1)
    listeFraction2 = texArrayReponsesFractionsEgalesEtSimplifiees(n2, d2)
  } else {
    listeFraction1 = texArrayReponsesFraction(n1, d1)
    listeFraction2 = texArrayReponsesFraction(n2, d2)
  }
  const listeCouples: string[] = []
  for (const ecriture1 of listeFraction1) {
    for (const ecriture2 of listeFraction2) {
      listeCouples.push(
        `${ecriture1};${ecriture2}`,
        `${ecriture2};${ecriture1}`,
      )
    }
  }
  return listeCouples
}

/**
 * Toutes les écritures LaTeX de toutes les fractions égales et simplifiées à n/d
 */
export function texArrayReponsesFractionsEgalesEtSimplifiees(
  n: number,
  d: number,
): string[] {
  const fractionsSimplifiees = listerFractionsSimplifiees(n, d)
  const liste: string[] = []
  for (const fractionSimplifiee of fractionsSimplifiees) {
    const reponses = texArrayReponsesFraction(
      fractionSimplifiee[0],
      fractionSimplifiee[1],
    )
    for (const reponse of reponses) {
      liste.push(reponse)
    }
  }
  return liste
}

/**
 * Couples 'frac1;frac2' pour toutes les formes égales et simplifiées des deux fractions
 */
export function texArrayReponsesCoupleDeFractionsEgalesEtSimplifiees(
  n1: number,
  d1: number,
  n2: number,
  d2: number,
): string[] {
  return texArrayReponsesCoupleDeFractions(n1, d1, n2, d2, true)
}
