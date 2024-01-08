<script lang="ts">
  import {
    mathaleaGenerateSeed,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaLoadExerciceFromUuid
  } from '../../../lib/mathalea'
  import referentielStatic from '../../../json/referentielStatic.json'
  import { SvelteComponent, onDestroy, onMount, tick } from 'svelte'
  import type { InterfaceParams } from '../../../lib/types'
  import uuidToUrl from '../../../json/uuidsToUrl.json'
  import ExerciceStatic from './presentationalComponents/exerciceStatic/ExerciceStatic.svelte'
  import Exercice from '../../../exercices/ExerciceTs'
  import ExerciceHtml from './presentationalComponents/exerciceHtml/ExerciceHtml.svelte'
  import ExerciceMathalea from './exerciceMathalea/ExerciceMathalea.svelte'
  import { getParamsFromUrl, updateUrlFromParams } from '../../services/mathalea'
  import { listeDesUrl, urlExercice } from '../../services/store'
  import HeaderExerciceMathalea from './presentationalComponents/HeaderExerciceMathalea.svelte'
  import seedrandom from 'seedrandom'
  import { randint } from '../../../modules/outils'

  type ExerciseType = 'mathalea' | 'static' | 'html' | 'svelte'
  type ExerciseWithMeta = {
    uuid: string
    exerciseIndex: number
    lastExerciseIndex: number
    exerciseType: string
    exercise: Exercice | SvelteComponent | undefined
    isCorrectionVisible: boolean
    nbCols: number
  }

  let exercisesWithMeta: ExerciseWithMeta[] = []
  let exercicesParams: InterfaceParams[] = []
  let innerWidth: number
  let isMd: boolean

  const apiGeomUuids = getApiGeomUuids()

  onMount(async () => {
    let url: string
    if ($listeDesUrl.length > 0) url = $listeDesUrl[randint(0, $listeDesUrl.length - 1)]
    else if ($urlExercice !== '') url = $urlExercice
    else url = window.location.href
    initComponent(url)
    addEventListener('popstate', () => initComponent(window.location.href, false))
  })

  onDestroy(() => removeEventListener('popstate', () => initComponent(window.location.href, false)))

  $: isMd = innerWidth >= 768

  function getApiGeomUuids () {
    return Object.entries(uuidToUrl)
      .filter(([uuid, url]) => url.startsWith('geodyn'))
      .map(([uuid]) => uuid)
  }

  async function initComponent (url: string, withUrlUpdate: boolean = true) {
    const tempExercicesWithMeta = []
    exercicesParams = getParamsFromUrl(url)
    let i = 0
    for (const paramsExercice of exercicesParams) {
      const exerciseWithMeta = await getExerciseWithMeta(paramsExercice, i, exercicesParams.length - 1)
      if (exerciseWithMeta.exercise !== undefined && exerciseWithMeta.exercise.uuid !== undefined) updateRoutine(exerciseWithMeta.exercise as Exercice, i, withUrlUpdate)
      tempExercicesWithMeta.push(exerciseWithMeta)
      i++
    }
    exercisesWithMeta = tempExercicesWithMeta // Permet d'éviter un flash au chargement de la page
  }

  async function getExerciseWithMeta (paramsExercice: InterfaceParams, exerciseIndex: number, lastExerciseIndex: number): Promise<ExerciseWithMeta> {
    let exerciseType: string
    let exercise: SvelteComponent | Exercice | undefined
    if (isStatic(paramsExercice.uuid)) {
      exerciseType = 'static'
      exercise = getExerciceByUuid(referentielStatic, paramsExercice.uuid) ?? new Exercice()
    } else if (isSvelte(paramsExercice.uuid)) {
      exerciseType = 'svelte'
      exercise = await getSvelteComponent(paramsExercice)
    } else {
      exercise = await getExercise(paramsExercice, exerciseIndex)
      exerciseType = await getExerciseType(exercise)
    }
    return {
      exercise,
      exerciseIndex,
      exerciseType,
      isCorrectionVisible: false,
      lastExerciseIndex,
      nbCols: 1,
      uuid: paramsExercice.uuid
    }
  }

function isStatic (uuid: string) {
  return uuid.startsWith('crpe-') ||
    uuid.startsWith('dnb_') ||
    uuid.startsWith('e3c_') ||
    uuid.startsWith('bac_') ||
    uuid.startsWith('2nd_')
}
function getExerciceByUuid (root: object, targetUUID: string): Exercice | null {
  if ('uuid' in root) {
    if (root.uuid === targetUUID) {
      return root
    }
  }
  for (const child in root) {
    if (child in root) {
      if (typeof root[child] !== 'object') continue
      const foundObject = getExerciceByUuid(root[child], targetUUID)
      if (foundObject) {
        return foundObject
      }
    }
  }

  return null
}

  function isSvelte (uuid: string) {
    const urlExercice = uuidToUrl[uuid as keyof typeof uuidToUrl]
    return urlExercice && urlExercice.includes('.svelte')
  }

  async function getSvelteComponent (paramsExercice: InterfaceParams) {
    const urlExercice = uuidToUrl[paramsExercice.uuid as keyof typeof uuidToUrl]
    // Pour l'instant tous les exercices Svelte doivent être dans le dossier src/exercicesInteractifs
    return (await import('../../../exercicesInteractifs/' + urlExercice.replace('.svelte', '') + '.svelte')).default
  }

  async function getExercise (paramsExercice: InterfaceParams, indiceExercice: number): Promise<Exercice> {
    const exercise = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
    exercise.numeroExercice = indiceExercice
    mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
    if (paramsExercice.duration) exercise.duree = paramsExercice.duration
    return exercise
  }

  async function getExerciseType (exercise: Exercice): Promise<ExerciseType> {
    if (exercise.typeExercice && exercise.typeExercice.includes('html')) {
      return 'html'
    } else {
      return 'mathalea'
    }
  }

async function updateRoutine (exercise: Exercice, exerciseIndex: number, withUrlUpdate: boolean = true) {
  initiateExercise(exercise, exerciseIndex)
  exercicesParams[exerciseIndex].alea = exercise.seed
  if (withUrlUpdate) updateUrlFromParams('exercices', exercicesParams)
  await adjustMathalea2dFiguresWidth()
  updateChildrenComponents()
}

function initiateExercise (exercise: Exercice, exerciseIndex: number) {
  exercise.numeroExercice = exerciseIndex
  if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
  seedrandom(exercise.seed, { global: true })
  if (exercise.typeExercice === 'simple') mathaleaHandleExerciceSimple(exercise, isApiGeom(exercise), exerciseIndex)
  else if (typeof exercise.nouvelleVersion === 'function') exercise.nouvelleVersion(exerciseIndex)
}

function isApiGeom (exercise: Exercice) {
  return exercise.uuid !== '' && apiGeomUuids.includes(exercise.uuid)
}

/**
 * Recherche toutes les figures ayant la classe `mathalea2d` et réduit leur largeur à 95% de la valeur
 * maximale du div reperé par l'ID `consigne<X>-0` où `X` est l'indice de l'exercice
 * @param {boolean} initialDimensionsAreNeeded si `true`, les valeurs initiales sont rechargées ()`false` par défaut)
 * @author sylvain
 */
async function adjustMathalea2dFiguresWidth (initialDimensionsAreNeeded: boolean = false) {
  const mathalea2dFigures = document.getElementsByClassName('mathalea2d')
  if (mathalea2dFigures.length !== 0) {
    await tick()
    const body = document.getElementsByTagName('body')[0]
    for (let k = 0; k < mathalea2dFigures.length; k++) {
      if (initialDimensionsAreNeeded) {
        // réinitialisation
        const initialWidth = mathalea2dFigures[k].getAttribute('data-width-initiale')
        const initialHeight = mathalea2dFigures[k].getAttribute('data-height-initiale')
        mathalea2dFigures[k].setAttribute('width', initialWidth ?? '')
        mathalea2dFigures[k].setAttribute('height', initialHeight ?? '')
      }
      if (mathalea2dFigures[k].clientWidth > body.clientWidth) {
        const coef = (body.clientWidth * 0.9) / mathalea2dFigures[k].clientWidth
        const newFigWidth = body.clientWidth * 0.9
        const newFigHeight = mathalea2dFigures[k].clientHeight * coef
        mathalea2dFigures[k].setAttribute('width', newFigWidth.toString())
        mathalea2dFigures[k].setAttribute('height', newFigHeight.toString())
      }
    }
  }
}

function updateChildrenComponents () {
  exercisesWithMeta = exercisesWithMeta
}

function columnsCountUpdate (plusMinus: ('+' | '-'), exerciseIndex: number) {
  let cols = exercisesWithMeta[exerciseIndex].nbCols ?? 1
  if (plusMinus === '+') cols++
  if (plusMinus === '-') cols--
  exercisesWithMeta[exerciseIndex].nbCols = cols > 1 ? cols : 1
}

function spacingUpdate (plusMinus: ('+' | '-'), exerciseIndex: number) {
  const exercise = exercisesWithMeta[exerciseIndex].exercise
  if (exercise !== undefined) {
    let spacing = exercise.spacing ?? 1
    if (plusMinus === '+') spacing = Number.parseFloat((spacing + 0.3).toFixed(1))
    if (plusMinus === '-') spacing = Math.max(Number.parseFloat((spacing - 0.3).toFixed(1)), 0.01)
    exercise.spacing = spacing
    updateChildrenComponents()
  }
}

async function newData (exerciseIndex: number) {
  if ($listeDesUrl.length > 0) {
    initComponent($listeDesUrl[randint(0, $listeDesUrl.length - 1)])
  } else {
    const exercise = exercisesWithMeta[exerciseIndex].exercise
    if (exercise !== undefined && exercise.uuid !== undefined) {
      exercise.isDone = false
      if (exercisesWithMeta[exerciseIndex].isCorrectionVisible) switchCorrectionVisible(exerciseIndex)
      const seed = mathaleaGenerateSeed()
      exercise.seed = seed
      updateRoutine(exercise as Exercice, exerciseIndex)
      const divScore = document.getElementById(`divScoreEx${exerciseIndex}`)
      if (divScore !== null) divScore.innerHTML = ''
    }
  }
}

function switchCorrectionVisible (exerciseIndex: number) {
  const masterExercise = exercisesWithMeta[exerciseIndex]
  const exercise = masterExercise.exercise
  if (exercise !== undefined) {
    masterExercise.isCorrectionVisible = !masterExercise.isCorrectionVisible
    if (masterExercise.isCorrectionVisible && window.localStorage !== undefined && exercise.id !== undefined) {
      window.localStorage.setItem(`${exercise.id}|${exercise.seed}`, 'true')
    }
    if (exercise.interactif && !masterExercise.isCorrectionVisible && !exercise.isDone) {
      newData(exerciseIndex)
    }
    adjustMathalea2dFiguresWidth()
    updateChildrenComponents()
  }
}
</script>

<svelte:window bind:innerWidth />
<div
  id="exercises-list"
  class="p-4 columns-1 text-left"
>
  {#each exercisesWithMeta as exerciseWithMeta}
    <div class="flex flex-col justify-start items-start" id="exercice{exerciseWithMeta.exerciseIndex}">
      <HeaderExerciceMathalea
        exerciseType={exerciseWithMeta.exerciseType}
        exerciseIndex={exerciseWithMeta.exerciseIndex}
        exercise={exerciseWithMeta.exercise ?? new Exercice()}
        bind:isCorrectionVisible={exerciseWithMeta.isCorrectionVisible}
        {isMd}
        nbCols={exerciseWithMeta.nbCols}
        {columnsCountUpdate}
        {newData}
        {spacingUpdate}
        {switchCorrectionVisible}
      />
      <div class="break-inside-avoid-column">
        {#if exerciseWithMeta.exerciseType === 'static'}
          <ExerciceStatic
            exerciseIndex={exerciseWithMeta.exerciseIndex}
            isCorrectionVisible={exerciseWithMeta.isCorrectionVisible}
            uuid={exerciseWithMeta.uuid}
            zoomFactor={'1'}
          />
        {:else if exerciseWithMeta.exerciseType === 'html'}
          <ExerciceHtml
            exercise={exerciseWithMeta.exercise ?? new Exercice()}
            indiceExercice={exerciseWithMeta.exerciseIndex}
            indiceLastExercice={exerciseWithMeta.lastExerciseIndex}
          />
        {:else if exerciseWithMeta.exerciseType === 'svelte'}
          <svelte:component
            this={exerciseWithMeta.exercise}
            indiceExercice={exerciseWithMeta.exerciseIndex}
            indiceLastExercice={exerciseWithMeta.lastExerciseIndex}
          />
        {:else if exerciseWithMeta.exerciseType === 'mathalea'}
          <ExerciceMathalea
            exercise={exerciseWithMeta.exercise ?? new Exercice()}
            exerciseIndex={exerciseWithMeta.exerciseIndex}
            {adjustMathalea2dFiguresWidth}
            nbCols={exerciseWithMeta.nbCols}
            {isMd}
            {newData}
            isCorrectionVisible={exerciseWithMeta.isCorrectionVisible}
          />
        {/if}
      </div>
    </div>
  {/each}
</div>

<style>
</style>
