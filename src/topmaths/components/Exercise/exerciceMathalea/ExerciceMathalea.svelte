<script lang="ts">
  import { afterUpdate, onMount, tick } from 'svelte'
  import Keyboard from '../../../../components/keyboard/Keyboard.svelte'
  import type TypeExercice from '../../../../exercices/Exercice'
  import {
    exerciceInteractif,
    prepareExerciceCliqueFigure,
  } from '../../../../lib/interactif/gestionInteractif'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { loadMathLive } from '../../../../modules/loaders'
  import { DEFAULT_LINE_HEIGHT } from '../../../services/environment'
  import Question from './presentationalComponents/Question.svelte'
  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let isCorrectionVisible: boolean
  export let nbCols: number = 1
  export let adjustMathalea2dFiguresWidth: (
    initialDimensionsAreNeeded?: boolean,
  ) => Promise<void>
  export let newData: (exerciseIndex: number) => void
  export let zoom: number

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let numberOfAnswerFields: number = 0
  let hasVerifiableAnswers = false

  // Evènement indispensable pour pointCliquable par exemple
  const exercicesAffiches = new window.Event('exercicesAffiches', {
    bubbles: true,
  })

  onMount(async () => {
    await tick()
    countMathField()
  })

  afterUpdate(async () => {
    if (exercise) await renderExercise()
    applyZoomOnScratch()
    document.dispatchEvent(exercicesAffiches)
  })

  $: {
    if (exercise.interactif && buttonScore) initButtonScore()
  }

  $: hasVerifiableAnswers =
    exercise.interactifReady ||
    (Array.isArray(exercise.autoCorrection) &&
      exercise.autoCorrection.some((entry) => entry != null))

  async function countMathField(): Promise<void> {
    const answerFields = document.querySelectorAll(
      `[id^='champTexteEx${exerciseIndex}']`,
    ) // IDs de la forme 'champTexteEx1Q0'
    numberOfAnswerFields = answerFields.length
  }

  async function renderExercise(): Promise<void> {
    await tick()
    if (exercise.interactif) {
      loadMathLive(divExercice)
      if (exercise.interactifType === 'cliqueFigure')
        prepareExerciceCliqueFigure(exercise)
      if (isCorrectionSeen()) newData(exerciseIndex)
    }
    mathaleaRenderDiv(divExercice, zoom)
    adjustMathalea2dFiguresWidth()
  }

  function isCorrectionSeen(): boolean {
    try {
      if (
        window.localStorage != null &&
        exercise.id !== undefined &&
        exercise.seed !== undefined &&
        window.localStorage.getItem(`${exercise.id}|${exercise.seed}`) != null
      ) {
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  function applyZoomOnScratch(): void {
    const scratchDivs = divExercice.getElementsByClassName('scratchblocks')
    for (const scratchDiv of scratchDivs) {
      const svgDivs = scratchDiv.getElementsByTagName('svg')
      for (const svg of svgDivs) {
        if (svg.hasAttribute('data-width') === false) {
          const originalWidth = svg.getAttribute('width')
          svg.dataset.width = originalWidth ?? ''
        }
        if (svg.hasAttribute('data-height') === false) {
          const originalHeight = svg.getAttribute('height')
          svg.dataset.height = originalHeight ?? ''
        }
        const w = Number(svg.getAttribute('data-width')) * Number(zoom)
        const h = Number(svg.getAttribute('data-height')) * Number(zoom)
        svg.setAttribute('width', w.toString())
        svg.setAttribute('height', h.toString())
      }
    }
  }

  function verifExerciceVueEleve(): void {
    exercise.isDone = true
    isCorrectionVisible = true
    exerciceInteractif(exercise, divScore, buttonScore)
  }

  function initButtonScore(): void {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.id = `buttonScoreEx${exerciseIndex}`
    buttonScore.classList.add(
      'inline-block',
      'border-is-green',
      'text-is-green',
      'hover:bg-is-green',
      'hover:text-white',
      'w-fit',
      'rounded',
      'text-base',
      'w-32.5',
      'md:w-45',
      'ml-2',
      'border',
      'p-1',
      'transform',
      'transition',
      'duration-150',
      'ease-in-out',
      'checkReponses',
    )
  }

  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = () => adjustMathalea2dFiguresWidth(true)
</script>

<div
  bind:this={divExercice}
  class="z-0 flex-1
    {exercise.spacing < 1 ? '' : 'mb-10 md:mb-20'}"
>
  <div class="flex flex-col">
    <article
      class="text-2xl relative"
      style="font-size: {(zoom || 1).toString()}rem;
        line-height: calc({zoom || 1});"
    >
      <div class="flex flex-col">
        {#if typeof exercise.consigne !== 'undefined' && exercise.consigne.length !== 0}
          <div>
            <p
              class="my-2
              ml-2 lg:ml-6
              text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              style="break-inside:avoid; line-height: {exercise.spacing ||
                DEFAULT_LINE_HEIGHT};"
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html exercise.consigne}
            </p>
          </div>
        {/if}
        {#if exercise.introduction}
          <div>
            <p
              class="my-2
              ml-2 lg:ml-6
              text-coopmaths-corpus dark:text-coopmathsdark-corpus"
              style="break-inside:avoid; line-height: {exercise.spacing ||
                DEFAULT_LINE_HEIGHT};"
            >
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html exercise.introduction}
            </p>
          </div>
        {/if}
      </div>
      <div style="columns: {nbCols.toString()}">
        <ul
          class="list-inside my-2
            {exercise.listeQuestions.length === 1 ||
          !exercise.listeAvecNumerotation
            ? 'list-none'
            : 'list-decimal'}
            mx-4 md:mx-6
            marker:font-bold
            marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct"
        >
          <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
          {#each exercise.listeQuestions as question, questionIndex (questionIndex)}
            <Question
              {exercise}
              {questionIndex}
              {exerciseIndex}
              {isCorrectionVisible}
            />
          {/each}
        </ul>
        <div id="divScoreEx{exerciseIndex}" bind:this={divScore}></div>
      </div>
    </article>
    {#if exercise.interactif && hasVerifiableAnswers && !isCorrectionVisible}
      <button
        type="submit"
        on:click={verifExerciceVueEleve}
        bind:this={buttonScore}
        class="hidden"
      >
        Vérifier {numberOfAnswerFields > 1 ? 'les réponses' : 'la réponse'}
      </button>
    {/if}
  </div>
</div>

<Keyboard />
