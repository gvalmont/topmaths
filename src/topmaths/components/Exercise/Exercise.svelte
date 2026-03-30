<script lang="ts">
  import seedrandom from 'seedrandom'
  import { onMount } from 'svelte'
  import Exercice from '../../../exercices/Exercice'
  import referentielStatic from '../../../json/referentielStaticFR.json'
  import uuidToUrl from '../../../json/uuidsToUrlFR.json'
  import {
    mathaleaGenerateSeed,
    mathaleaHandleExerciceSimple,
    mathaleaHandleParamOfOneExercice,
    mathaleaLoadExerciceFromUuid,
  } from '../../../lib/mathalea'
  import { premiereLettreEnMajuscule } from '../../../lib/outils/outilString'
  import type { InterfaceParamsWithMeta } from '../../../lib/types'
  import { randint } from '../../../modules/outils'
  import {
    buildParamsFromUrl,
    buildUrlFromParams,
    updateUrlFromParams,
  } from '../../services/mathalea'
  import { exerciseLinks, isDoubleView } from '../../services/store'
  import { copyToClipboard } from '../../services/url'
  import ExerciceMathalea from './exerciceMathalea/ExerciceMathalea.svelte'
  import ExerciceHtml from './presentationalComponents/exerciceHtml/ExerciceHtml.svelte'
  import ExerciceStatic from './presentationalComponents/exerciceStatic/ExerciceStatic.svelte'
  import HeaderExerciceMathalea from './presentationalComponents/HeaderExerciceMathalea.svelte'

  export let isMd: boolean
  export let url: string = ''

  type ExerciseType = 'mathalea' | 'static' | 'html' | 'svelte'
  type ExerciseWithMeta = {
    uuid: string
    exerciseIndex: number
    lastExerciseIndex: number
    exerciseType: string
    exercise: Exercice | undefined
    isCorrectionVisible: boolean
    nbCols: number
    zoom: number
  }

  let exercisesWithMeta: ExerciseWithMeta[] = []
  let exercicesParams: InterfaceParamsWithMeta[] = []
  let currentIndex = 0

  const apiGeomUuids = getApiGeomUuids()

  onMount(async () => {
    let selectedUrl: string
    if (url && url.length > 0) {
      selectedUrl = url
    } else if ($exerciseLinks.length > 0) {
      selectedUrl = $exerciseLinks[randint(0, $exerciseLinks.length - 1)]
    } else {
      selectedUrl = window.location.href
    }
    initComponent(selectedUrl)
    if (url && url.length > 0) {
      return
    }
    updateUrlFromParams('exercise', exercicesParams)
  })

  function getApiGeomUuids(): string[] {
    return (
      Object.entries(uuidToUrl)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_uuid, url]) => url.startsWith('geodyn'))
        .map(([uuid]) => uuid)
    )
  }

  async function initComponent(url: string): Promise<void> {
    const tempExercicesWithMeta = []
    exercicesParams = buildParamsFromUrl(url)
    let i = 0
    for (const paramsExercice of exercicesParams) {
      const exerciseWithMeta = await getExerciseWithMeta(
        paramsExercice,
        i,
        exercicesParams.length - 1,
      )
      if (
        exerciseWithMeta.exercise !== undefined &&
        exerciseWithMeta.exercise.uuid !== undefined
      )
        updateRoutine(exerciseWithMeta.exercise as Exercice, i)
      tempExercicesWithMeta.push(exerciseWithMeta)
      i++
    }
    exercisesWithMeta = tempExercicesWithMeta // Permet d'éviter un flash au chargement de la page
  }

  async function getExerciseWithMeta(
    paramsExercice: InterfaceParamsWithMeta,
    exerciseIndex: number,
    lastExerciseIndex: number,
  ): Promise<ExerciseWithMeta> {
    let exerciseType: string
    let exercise: Exercice | undefined
    if (isStatic(paramsExercice.uuid)) {
      exerciseType = 'static'
      exercise =
        getExerciceByUuid(referentielStatic, paramsExercice.uuid) ??
        new Exercice()
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
      uuid: paramsExercice.uuid,
      zoom: isMd ? 1.4 : 1,
    }
  }

  function isStatic(uuid: string): boolean {
    return (
      uuid.startsWith('crpe-') ||
      uuid.startsWith('dnb_') ||
      uuid.startsWith('dnbpro_') ||
      uuid.startsWith('e3c_') ||
      uuid.startsWith('bac_') ||
      uuid.startsWith('2nd_')
    )
  }
  function getExerciceByUuid(
    root: object,
    targetUUID: string,
  ): Exercice | null {
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

  function isSvelte(uuid: string): boolean {
    const urlExercice = uuidToUrl[uuid as keyof typeof uuidToUrl]
    return !!urlExercice && urlExercice.includes('.svelte')
  }

  async function getSvelteComponent(
    paramsExercice: InterfaceParamsWithMeta,
  ): Promise<any> {
    const urlExercice = uuidToUrl[paramsExercice.uuid as keyof typeof uuidToUrl]
    // Pour l'instant tous les exercices Svelte doivent être dans le dossier src/exercicesInteractifs
    return (
      await import(
        '../../../exercicesInteractifs/' +
          urlExercice.replace('.svelte', '') +
          '.svelte'
      )
    ).default
  }

  async function getExercise(
    paramsExercice: InterfaceParamsWithMeta,
    indiceExercice: number,
  ): Promise<Exercice> {
    const exercise = await mathaleaLoadExerciceFromUuid(paramsExercice.uuid)
    exercise.numeroExercice = indiceExercice
    mathaleaHandleParamOfOneExercice(exercise, paramsExercice)
    if (paramsExercice.duration) exercise.duree = paramsExercice.duration
    return exercise
  }

  async function getExerciseType(exercise: Exercice): Promise<ExerciseType> {
    if (exercise.typeExercice && exercise.typeExercice.includes('html')) {
      return 'html'
    } else {
      return 'mathalea'
    }
  }

  async function updateRoutine(
    exercise: Exercice,
    exerciseIndex: number,
  ): Promise<void> {
    initiateExercise(exercise, exerciseIndex)
    exercicesParams[exerciseIndex].alea = exercise.seed
    await adjustMathalea2dFiguresWidth()
    updateChildrenComponents()
  }

  function initiateExercise(exercise: Exercice, exerciseIndex: number): void {
    exercise.numeroExercice = exerciseIndex
    if (exercise.seed === undefined) exercise.seed = mathaleaGenerateSeed()
    seedrandom(exercise.seed, { global: true })
    if (exercise.typeExercice === 'simple')
      mathaleaHandleExerciceSimple(exercise, exercise.interactif, exerciseIndex)
    else if (typeof exercise.nouvelleVersionWrapper === 'function')
      exercise.nouvelleVersionWrapper(exerciseIndex)
  }

  /**
   * Recherche toutes les figures ayant la classe `mathalea2d` et réduit leur largeur à 95% de la valeur
   * maximale du div reperé par l'ID `consigne<X>-0` où `X` est l'indice de l'exercice
   * @param {boolean} initialDimensionsAreNeeded si `true`, les valeurs initiales sont rechargées ()`false` par défaut)
   * @author sylvain
   */
  async function adjustMathalea2dFiguresWidth(
    initialDimensionsAreNeeded: boolean = false,
  ) {
    const mathalea2dFigures =
      document.querySelectorAll<SVGElement>('.mathalea2d')
    if (mathalea2dFigures != null) {
      if (mathalea2dFigures.length !== 0) {
        // await tick()
        // console.log('adjustMathalea2dFiguresWidth:' + initialDimensionsAreNeeded)
        for (let k = 0; k < mathalea2dFigures.length; k++) {
          const exerciseContainer = mathalea2dFigures[k].closest('[id^="exercice"]')
          const exerciseIndexMatch = exerciseContainer?.id.match(/^exercice(\d+)/)
          const exerciseIndex = exerciseIndexMatch
            ? Number(exerciseIndexMatch[1])
            : Number.NaN
          const zoom =
            Number.isInteger(exerciseIndex) &&
            exercisesWithMeta[exerciseIndex] !== undefined
              ? exercisesWithMeta[exerciseIndex].zoom
              : 1
          if (initialDimensionsAreNeeded) {
            // réinitialisation
            const initialWidth = mathalea2dFigures[k].getAttribute(
              'data-width-initiale',
            )
            const initialHeight = mathalea2dFigures[k].getAttribute(
              'data-height-initiale',
            )
            mathalea2dFigures[k].setAttribute(
              'width',
              (Number(initialWidth) * zoom).toString(),
            )
            mathalea2dFigures[k].setAttribute(
              'height',
              (Number(initialHeight) * zoom).toString(),
            )
            // les éléments Katex des figures SVG
            if (
              mathalea2dFigures[k] != null &&
              mathalea2dFigures[k].parentElement != null
            ) {
              const eltsInFigures =
                mathalea2dFigures[
                  k
                ].parentElement?.querySelectorAll<HTMLElement>(
                  'div.divLatex',
                ) || []
              for (const elt of eltsInFigures) {
                const e = elt
                e.style.setProperty(
                  'top',
                  (Number(e.dataset.top) * zoom).toString() + 'px',
                )
                e.style.setProperty(
                  'left',
                  (Number(e.dataset.left) * zoom).toString() + 'px',
                )
              }
            }
          }
          /* Mickael:
        Ne surtout pas mettre la référence de l'exercice dans la requête suivante,
        car dans svelte, la référence est liée au dernier exercice chargé, ce qui bug!
        */
          const consigneDiv = mathalea2dFigures[k]
            .closest('article')
            ?.querySelector('[id^="consigne"]')
          // const consigneDiv = document.getElementById('consigne' + exnumero + '-0')
          if (
            consigneDiv &&
            mathalea2dFigures[k].clientWidth > consigneDiv.clientWidth
          ) {
            const coef =
              (consigneDiv.clientWidth * 0.95) /
              mathalea2dFigures[k].clientWidth
            // console.log('coef:' + coef )
            const width = mathalea2dFigures[k].getAttribute('width')
            const height = mathalea2dFigures[k].getAttribute('height')
            if (!mathalea2dFigures[k].dataset.widthInitiale && width != null)
              mathalea2dFigures[k].dataset.widthInitiale = width
            if (!mathalea2dFigures[k].dataset.heightInitiale && height != null)
              mathalea2dFigures[k].dataset.heightInitiale = height
            const newHeight = (
              Number(mathalea2dFigures[k].dataset.heightInitiale) *
              zoom *
              coef
            ).toString()
            const newWidth = (
              Number(mathalea2dFigures[k].dataset.widthInitiale) *
              zoom *
              coef
            ).toString()
            if (width !== newWidth) {
              mathalea2dFigures[k].setAttribute('width', newWidth)
            }
            if (height !== newHeight) {
              mathalea2dFigures[k].setAttribute('height', newHeight)
            }

            if (
              mathalea2dFigures[k] != null &&
              mathalea2dFigures[k].parentElement !== null
            ) {
              const eltsInFigures =
                mathalea2dFigures[
                  k
                ].parentElement?.querySelectorAll<HTMLElement>(
                  'div.divLatex',
                ) || []
              for (const elt of eltsInFigures) {
                const e = elt
                const initialTop = Number(e.dataset.top) ?? 0
                const initialLeft = Number(e.dataset.left) ?? 0
                e.style.setProperty(
                  'top',
                  (initialTop * coef * zoom).toString() + 'px',
                )
                e.style.setProperty(
                  'left',
                  (initialLeft * coef * zoom).toString() + 'px',
                )
              }
            }
          }
        }
      }
    }
  }

  function updateChildrenComponents(): void {
    exercisesWithMeta = exercisesWithMeta
  }

  function columnsCountUpdate(
    plusMinus: '+' | '-',
    exerciseIndex: number,
  ): void {
    let cols = exercisesWithMeta[exerciseIndex].nbCols ?? 1
    if (plusMinus === '+') cols++
    if (plusMinus === '-') cols--
    exercisesWithMeta[exerciseIndex].nbCols = cols > 1 ? cols : 1
  }

  function spacingUpdate(plusMinus: '+' | '-', exerciseIndex: number): void {
    const exercise = exercisesWithMeta[exerciseIndex].exercise
    if (exercise !== undefined) {
      let spacing = exercise.spacing ?? 1
      if (plusMinus === '+')
        spacing = Number.parseFloat((spacing + 0.3).toFixed(1))
      if (plusMinus === '-')
        spacing = Math.max(Number.parseFloat((spacing - 0.3).toFixed(1)), 0.01)
      exercise.spacing = spacing
      updateChildrenComponents()
    }
  }

  async function newData(exerciseIndex: number): Promise<void> {
    if ($exerciseLinks.length > 1) {
      initComponent($exerciseLinks[currentIndex])
      currentIndex = (currentIndex + 1) % $exerciseLinks.length
    } else {
      const exercise = exercisesWithMeta[exerciseIndex].exercise
      if (exercise !== undefined && exercise.uuid !== undefined) {
        exercise.isDone = false
        if (exercisesWithMeta[exerciseIndex].isCorrectionVisible)
          switchCorrectionVisible(exerciseIndex)
        const seed = mathaleaGenerateSeed()
        exercise.seed = seed
        updateRoutine(exercise as Exercice, exerciseIndex)
        const divScore = document.getElementById(`divScoreEx${exerciseIndex}`)
        if (divScore !== null) divScore.innerHTML = ''
      }
    }
  }

  function switchCorrectionVisible(exerciseIndex: number): void {
    const masterExercise = exercisesWithMeta[exerciseIndex]
    const exercise = masterExercise.exercise
    if (exercise !== undefined) {
      masterExercise.isCorrectionVisible = !masterExercise.isCorrectionVisible
      if (
        masterExercise.isCorrectionVisible &&
        window.localStorage !== undefined &&
        exercise.id !== undefined
      ) {
        window.localStorage.setItem(`${exercise.id}|${exercise.seed}`, 'true')
      }
      if (
        exercise.interactif &&
        !masterExercise.isCorrectionVisible &&
        !exercise.isDone
      ) {
        newData(exerciseIndex)
      }
      adjustMathalea2dFiguresWidth()
      updateChildrenComponents()
    }
  }

  function navigatorShare(exerciseIndex: number): void {
    const title =
      exercisesWithMeta[exerciseIndex].exercise?.titre ??
      exercicesParams[exerciseIndex].id
    const url = buildUrlFromParams('exercise', [
      exercicesParams[exerciseIndex],
    ]).href
    copyToClipboard(url)
    if (navigator.share) {
      navigator.share({ title, url })
    }
  }

  function zoomUpdate(plusMinus: '+' | '-', exerciseIndex: number): void {
    const actualZoom = exercisesWithMeta[exerciseIndex].zoom
    let newZoom = actualZoom
    if (plusMinus === '+')
      newZoom = Number.parseFloat((actualZoom + 0.1).toFixed(1))
    if (plusMinus === '-')
      newZoom = Number.parseFloat((actualZoom - 0.1).toFixed(1))
    exercisesWithMeta[exerciseIndex].zoom = newZoom
  }
</script>

<svelte:head>
  <title>
    {exercisesWithMeta
      .map((exerciseWithMeta) =>
        premiereLettreEnMajuscule(exerciseWithMeta.exercise?.titre),
      )
      .join(' - ')}
  </title>
</svelte:head>

<div
  id="exercises-list"
  class="text-left w-full max-w-screen-lg
    {$isDoubleView ? '' : 'p-4'}"
>
  {#each exercisesWithMeta as exerciseWithMeta (exerciseWithMeta.exercise?.key + '-' + exerciseWithMeta.exerciseIndex)}
    <div
      class="flex flex-col justify-start items-start"
      id="exercice{exerciseWithMeta.exerciseIndex}"
    >
      {#if exerciseWithMeta.exerciseType !== 'html' || $exerciseLinks.length > 1}
        <HeaderExerciceMathalea
          sourceObjective={exercicesParams[exerciseWithMeta.exerciseIndex]
            .sourceObjective}
          sourceUnit={exercicesParams[exerciseWithMeta.exerciseIndex]
            .sourceUnit}
          exerciseType={exerciseWithMeta.exerciseType}
          exerciseIndex={exerciseWithMeta.exerciseIndex}
          exercise={exerciseWithMeta.exercise ?? new Exercice()}
          bind:isCorrectionVisible={exerciseWithMeta.isCorrectionVisible}
          {isMd}
          nbCols={exerciseWithMeta.nbCols}
          zoom={exercisesWithMeta[exerciseWithMeta.exerciseIndex].zoom}
          {columnsCountUpdate}
          {newData}
          {spacingUpdate}
          {switchCorrectionVisible}
          {navigatorShare}
          {zoomUpdate}
        />
      {/if}
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
          {newData}
          isCorrectionVisible={exerciseWithMeta.isCorrectionVisible}
          zoom={exerciseWithMeta.zoom}
        />
      {/if}
    </div>
  {/each}
</div>

<style>
</style>
