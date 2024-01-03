import { panierDispo } from './store'
import type { ObjectifExercice, ObjectifObjectif, PanierItem, SequenceObjectif } from './types'
import { storage } from './storage'
import { estCoopmaths } from './outils'

export function toutAjouterAuPanier (exercices: ObjectifExercice[], reference: string, nomsPanier: string[], indiceExercice = -1, exercicesDeBrevet = false) {
  if (exercices.length === 1) {
    ajouterAuPanier(exercices[0], reference, nomsPanier[0], exercicesDeBrevet, indiceExercice)
  } else {
    for (let i = 0; i < exercices.length; i++) {
      ajouterAuPanier(exercices[i], reference, nomsPanier[i], exercicesDeBrevet, i)
    }
  }
}

export function ajouterAuPanier (exercice: ObjectifExercice, reference: string, nomPanier: string, exDeBrevet = false, exerciceIndex = -1) {
  if (!estCoopmaths(exercice.lien)) {
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
    id: exercice.id,
    reference,
    objectif: nomPanier ?? '',
    description,
    slug: exercice.slug
  }
  if (!estPresentDansLePanier(panierItem.id, panierActuel) && (panierItem.slug.slice(0, 4) !== '')) {
    exercice.estDansLePanier = true
    let panierTemp = <PanierItem[]>[]
    if (panierActuel !== undefined) panierTemp = panierActuel
    panierTemp.push(panierItem)
    storage.set('panier', panierTemp)
  }
  panierDispo.set(true)
}

export function tousLesExercicesSontPresentsDansLePanier (objectif: ObjectifObjectif | SequenceObjectif, exDeBrevet = false) {
  let exercices: ObjectifExercice[]
  if (exDeBrevet) exercices = objectif.exercicesDeBrevet
  else exercices = objectif.exercices
  if (exercices !== undefined) {
    for (const exercice of exercices) {
      if (!exercice.estDansLePanier) return false
    }
  }
  return true
}

export function estPresentDansLePanier (
  exerciceId: string,
  panierActuel: PanierItem[] = <PanierItem[]>storage.get('panier')
) {
  if (panierActuel !== undefined) {
    for (const panierActuelItem of panierActuel) {
      if (panierActuelItem !== null && panierActuelItem.id === exerciceId) { return true }
    }
  }
  return false
}
