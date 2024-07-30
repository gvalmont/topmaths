import { isCartEmpty } from './store'
import type { ObjectiveExercise, Objective } from '../types/objective'
import { emptyCartItem, type CartItem } from '../types/cart'
import type { UnitObjective } from '../types/unit'
import { storage } from './storage'
import { isCoopmaths } from './outils'
import { deepCopy } from '../types/shared'

export function toutAjouterAuPanier (exercices: ObjectiveExercise[], reference: string, nomsPanier: string[], indiceExercice = -1, exercicesDeBrevet = false): void {
  if (exercices.length === 1) {
    ajouterAuPanier(exercices[0], reference, nomsPanier[0], exercicesDeBrevet, indiceExercice)
  } else {
    for (let i = 0; i < exercices.length; i++) {
      ajouterAuPanier(exercices[i], reference, nomsPanier[i], exercicesDeBrevet, i)
    }
  }
}

export function ajouterAuPanier (exercice: ObjectiveExercise, reference: string, nomPanier: string, exDeBrevet = false, exerciceIndex = -1): void {
  if (!isCoopmaths(exercice.link)) {
    console.error('L\'exercice n\'a pas été ajouté au panier car il n\'est pas un exercice MathALÉA')
    return
  }
  let description =
    exercice.description !== undefined && exercice.description !== ''
      ? exercice.description
      : exerciceIndex >= 0
        ? 'Ex. ' + (exerciceIndex + 1)
        : "Lancer l'exercice"
  if (exDeBrevet) description = exercice.slug.split('uuid=')[1].split('&')[0]
  const panierActuel = storage.get('cart')
  const panierItem = Object.assign(deepCopy(emptyCartItem), { id: exercice.id, reference, objective: nomPanier, description, slug: exercice.slug })
  if (!estPresentDansLePanier(panierItem.id, panierActuel) && (panierItem.slug.slice(0, 4) !== '')) {
    exercice.isInCart = true
    let panierTemp = <CartItem[]>[]
    if (panierActuel !== undefined) panierTemp = panierActuel
    panierTemp.push(panierItem)
    storage.set('cart', panierTemp)
  }
  isCartEmpty.set(false)
}

export function tousLesExercicesSontPresentsDansLePanier (objectif: Objective | UnitObjective, exDeBrevet = false): boolean {
  let exercices: ObjectiveExercise[]
  if (exDeBrevet) exercices = objectif.examExercises
  else exercices = objectif.exercises
  if (exercices !== undefined) {
    for (const exercice of exercices) {
      if (!exercice.isInCart) return false
    }
  }
  return true
}

export function estPresentDansLePanier (
  exerciceId: string,
  panierActuel: CartItem[] = <CartItem[]>storage.get('cart')
): boolean {
  if (panierActuel !== undefined) {
    for (const panierActuelItem of panierActuel) {
      if (panierActuelItem !== null && panierActuelItem.id === exerciceId) { return true }
    }
  }
  return false
}
