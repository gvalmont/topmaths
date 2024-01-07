import type { InterfaceParams } from '../../lib/types'
import refToUuid from '../../json/refToUuid.json'

export function getParamsFromUrl (urlString: string): InterfaceParams[] {
  const url = new URL(urlString)
  const entries = url.searchParams.entries()
  let indiceExercice = -1
  const newListeExercice: InterfaceParams[] = []
  let previousEntryWasUuid = false
  for (const entry of entries) {
    if (entry[0] === 'uuid') {
      indiceExercice++
      const uuid = entry[1]
      const id = (Object.keys(refToUuid) as (keyof typeof refToUuid)[]).find((key) => {
        return refToUuid[key] === uuid
      })
      if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = { uuid, id }
      newListeExercice[indiceExercice].uuid = uuid // string
      newListeExercice[indiceExercice].id = id // string
    } else if (entry[0] === 'id' && !previousEntryWasUuid) {
      // En cas de présence d'un uuid juste avant, on ne tient pas compte de l'id
      indiceExercice++
      const id = entry[1]
      const uuid = refToUuid[id as keyof typeof refToUuid]
      if (!newListeExercice[indiceExercice]) newListeExercice[indiceExercice] = { id, uuid }
    } else if (entry[0] === 'n') {
      newListeExercice[indiceExercice].nbQuestions = parseInt(entry[1]) // int
    } else if (entry[0] === 'd') {
      newListeExercice[indiceExercice].duration = parseInt(entry[1]) // int
    } else if (entry[0] === 's') {
      newListeExercice[indiceExercice].sup = entry[1]
    } else if (entry[0] === 's2') {
      newListeExercice[indiceExercice].sup2 = entry[1]
    } else if (entry[0] === 's3') {
      newListeExercice[indiceExercice].sup3 = entry[1]
    } else if (entry[0] === 's4') {
      newListeExercice[indiceExercice].sup4 = entry[1]
    } else if (entry[0] === 'alea') {
      newListeExercice[indiceExercice].alea = entry[1]
    } else if (entry[0] === 'cols') {
      newListeExercice[indiceExercice].cols = parseInt(entry[1])
    } else if (entry[0] === 'i' && entry[1] === '1') {
      newListeExercice[indiceExercice].interactif = '1'
    } else if (entry[0] === 'cd' && (entry[1] === '0' || entry[1] === '1')) {
      newListeExercice[indiceExercice].cd = entry[1]
    }
    if (entry[0] === 'uuid') previousEntryWasUuid = true
    else previousEntryWasUuid = false
  }
  return newListeExercice
}
