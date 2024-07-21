import { panierDispo } from './store'
import type { ObjectiveExercise, ObjectiveObjective, CartItem, UnitObjective } from './types'
import { storage } from './storage'
import { estCoopmaths } from './outils'

export function toutAjouterAuPanier (exercices: ObjectiveExercise[], reference: string, nomsPanier: string[], indiceExercice = -1, exercicesDeBrevet = false) {
  if (exercices.length === 1) {
    ajouterAuPanier(exercices[0], reference, nomsPanier[0], exercicesDeBrevet, indiceExercice)
  } else {
    for (let i = 0; i < exercices.length; i++) {
      ajouterAuPanier(exercices[i], reference, nomsPanier[i], exercicesDeBrevet, i)
    }
  }
}

export function ajouterAuPanier (exercice: ObjectiveExercise, reference: string, nomPanier: string, exDeBrevet = false, exerciceIndex = -1) {
  if (!estCoopmaths(exercice.link)) {
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
  const panierActuel = storage.get('panier')
  const panierItem = {
    id: exercice.uuid,
    reference,
    objectif: nomPanier ?? '',
    description,
    slug: exercice.slug
  }
  if (!estPresentDansLePanier(panierItem.id, panierActuel) && (panierItem.slug.slice(0, 4) !== '')) {
    exercice.isInCart = true
    let panierTemp = <CartItem[]>[]
    if (panierActuel !== undefined) panierTemp = panierActuel
    panierTemp.push(panierItem)
    storage.set('panier', panierTemp)
  }
  panierDispo.set(true)
}

export function tousLesExercicesSontPresentsDansLePanier (objectif: ObjectiveObjective | UnitObjective, exDeBrevet = false) {
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
  panierActuel: CartItem[] = <CartItem[]>storage.get('panier')
) {
  if (panierActuel !== undefined) {
    for (const panierActuelItem of panierActuel) {
      if (panierActuelItem !== null && panierActuelItem.id === exerciceId) { return true }
    }
  }
  return false
}
