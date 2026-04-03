import { get } from 'svelte/store'
import refToUuid2016 from '../../json/refToUuidFR-2016.json'
import refToUuid from '../../json/refToUuidFR.json'
import type { VueType } from '../../lib/VueType'
import { globalOptions } from '../../lib/stores/globalOptions'
import type { InterfaceParamsWithMeta } from '../../lib/types'
import { isObjectiveReference } from '../types/objective'
import { isUnitReference } from '../types/unit'
import { isDoubleView, isTeacherMode } from './store'
let urlToWrite: URL
let timerId: ReturnType<typeof setTimeout> | undefined

export function buildParamsFromUrl(
  urlString: string,
): InterfaceParamsWithMeta[] {
  const url = new URL(urlString)
  const entries = url.searchParams.entries()
  let indiceExercice = -1
  const newListeExercice: InterfaceParamsWithMeta[] = []
  let previousEntryWasUuid = false
  for (const entry of entries) {
    if (entry[0] === 'uuid') {
      indiceExercice++
      const uuid = entry[1]
      const id = (Object.keys(refToUuid) as (keyof typeof refToUuid)[]).find(
        (key) => {
          return refToUuid[key] === uuid
        },
      )
      if (!newListeExercice[indiceExercice])
        newListeExercice[indiceExercice] = { uuid, id }
      newListeExercice[indiceExercice].uuid = uuid // string
      newListeExercice[indiceExercice].id = id // string
    } else if (entry[0] === 'id' && !previousEntryWasUuid) {
      // En cas de présence d'un uuid juste avant, on ne tient pas compte de l'id
      indiceExercice++
      const id = entry[1]
      const uuid =
        refToUuid[id as keyof typeof refToUuid] ||
        refToUuid2016[id as keyof typeof refToUuid2016]
      if (!newListeExercice[indiceExercice])
        newListeExercice[indiceExercice] = { id, uuid }
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
    } else if (entry[0] === 'o') {
      const sourceObjectiveCandidate = entry[1]
      if (isObjectiveReference(sourceObjectiveCandidate)) {
        newListeExercice[indiceExercice].sourceObjective =
          sourceObjectiveCandidate
      }
    } else if (entry[0] === 'u') {
      const sourceUnitCandidate = entry[1]
      if (isUnitReference(sourceUnitCandidate)) {
        newListeExercice[indiceExercice].sourceUnit = sourceUnitCandidate
      }
    }
    if (entry[0] === 'uuid') previousEntryWasUuid = true
    else previousEntryWasUuid = false
  }
  return newListeExercice
}

export function buildUrlFromParams(
  v: VueType,
  exercicesParams: InterfaceParamsWithMeta[],
): URL {
  const url = new URL(window.location.protocol + '//' + window.location.host)
  const defaultInteractiveValue = get(isTeacherMode) ? '0' : '1'
  for (const ex of exercicesParams) {
    url.searchParams.append('uuid', ex.uuid)
    if (ex.id != null) url.searchParams.append('id', ex.id)
    if (ex.nbQuestions !== undefined)
      url.searchParams.append('n', ex.nbQuestions.toString())
    if (ex.duration != null)
      url.searchParams.append('d', ex.duration.toString())
    if (ex.sup != null) url.searchParams.append('s', ex.sup)
    if (ex.sup2 != null) url.searchParams.append('s2', ex.sup2)
    if (ex.sup3 != null) url.searchParams.append('s3', ex.sup3)
    if (ex.sup4 != null) url.searchParams.append('s4', ex.sup4)
    if (ex.alea != null) url.searchParams.append('alea', ex.alea)
    url.searchParams.append('i', ex.interactif ?? defaultInteractiveValue)
    if (ex.cd != null) url.searchParams.append('cd', ex.cd)
    if (ex.cols != null) url.searchParams.append('cols', ex.cols.toString())
    if (ex.sourceObjective != null) {
      url.searchParams.append('o', ex.sourceObjective)
    }
    if (ex.sourceUnit != null) {
      url.searchParams.append('u', ex.sourceUnit)
    }
  }
  url.searchParams.append('v', v)
  if (get(isDoubleView)) url.searchParams.append('dv', 'true')
  return url
}

export function updateUrl(v: VueType, urlToWrite: string): void {
  // On ne met à jour l'url qu'une fois toutes les 0,1 s
  // pour éviter l'erreur Attempt to use history.pushState() more than 100 times per 30 seconds
  if (timerId === undefined) {
    timerId = setTimeout(() => {
      window.history.pushState({}, '', urlToWrite)
      timerId = undefined
      globalOptions.update((options) => {
        options.v = v
        return options
      })
    }, 100)
  }
}

export function updateUrlFromParams(
  v: VueType,
  exercicesParams: InterfaceParamsWithMeta[],
): void {
  urlToWrite = buildUrlFromParams(v, exercicesParams)
  if (urlToWrite.href !== window.location.href) {
    updateUrl(v, urlToWrite.href)
  }
}
