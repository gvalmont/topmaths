<script lang="ts">
  import { afterUpdate, onMount, tick } from 'svelte'
  import type TypeExercice from '../../../../exercices/ExerciceTs.js'
  import { exerciceInteractif, prepareExerciceCliqueFigure } from '../../../../lib/interactif/gestionInteractif'
  import { loadMathLive } from '../../../../modules/loaders'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import Question from './presentationalComponents/Question.svelte'
  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let isCorrectionVisible: boolean
  export let nbCols: number = 1
  export let adjustMathalea2dFiguresWidth: (initialDimensionsAreNeeded?: boolean) => Promise<void>
  export let newData: (exerciseIndex: number) => void
  export let zoom: number

  let divExercice: HTMLDivElement
  let divScore: HTMLDivElement
  let buttonScore: HTMLButtonElement
  let numberOfAnswerFields: number = 0

  // Evènement indispensable pour pointCliquable par exemple
  const exercicesAffiches = new window.Event('exercicesAffiches', { bubbles: true })

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

  async function countMathField () {
    const answerFields = document.querySelectorAll(`[id^='champTexteEx${exerciseIndex}']`) // IDs de la forme 'champTexteEx1Q0'
    numberOfAnswerFields = answerFields.length
  }

  async function renderExercise () {
    await tick()
    if (exercise.interactif) {
      loadMathLive()
      if (exercise.interactifType === 'cliqueFigure') prepareExerciceCliqueFigure(exercise)
      if (isCorrectionSeen()) newData(exerciseIndex)
    }
    mathaleaRenderDiv(divExercice, zoom)
    adjustMathalea2dFiguresWidth()
  }

  function isCorrectionSeen () {
    try {
      if (window.localStorage != null && exercise.id !== undefined && exercise.seed !== undefined && window.localStorage.getItem(`${exercise.id}|${exercise.seed}`) != null) {
        return true
      }
    } catch (e) {
      console.error(e)
    }
    return false
  }

  function applyZoomOnScratch () {
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

  function verifExerciceVueEleve () {
    exercise.isDone = true
    isCorrectionVisible = true
    exerciceInteractif(exercise, divScore, buttonScore)
  }

  function initButtonScore () {
    buttonScore.classList.remove(...buttonScore.classList)
    buttonScore.id = `buttonScoreEx${exerciseIndex}`
    buttonScore.classList.add(
      'inline-block',
      'px-6',
      'py-2.5',
      'mr-10',
      'my-5',
      'ml-6',
      'bg-coopmaths-action',
      'dark:bg-coopmathsdark-action',
      'text-coopmaths-canvas',
      'dark:text-coopmathsdark-canvas',
      'font-medium',
      'text-xs',
      'leading-tight',
      'uppercase',
      'rounded',
      'shadow-md',
      'transform',
      'hover:bg-coopmaths-action-lightest',
      'dark:hover:bg-coopmathsdark-action-lightest',
      'hover:shadow-lg',
      'focus:bg-coopmaths-action-lightest',
      'dark:focus:bg-coopmathsdark-action-lightest',
      'focus:shadow-lg',
      'focus:outline-none',
      'focus:ring-0',
      'active:bg-coopmaths-action-lightest',
      'dark:active:bg-coopmathsdark-action-lightest',
      'active:shadow-lg',
      'transition',
      'duration-150',
      'ease-in-out',
      'checkReponses'
    )
  }

  // pour recalculer les tailles lors d'un changement de dimension de la fenêtre
  window.onresize = () => adjustMathalea2dFiguresWidth(true)
</script>

<div class="z-0 flex-1 w-full {exercise.spacing < 1 ? '' : 'mb-10 md:mb-20'}" bind:this={divExercice}>
  <div class="flex flex-col">
    <article class="text-2xl relative w-full" style="font-size: {(zoom || 1).toString()}rem;  line-height: calc({zoom || 1});">
      <div class="flex flex-col w-full">
        {#if typeof exercise.consigne !== 'undefined' && exercise.consigne.length !== 0}
          <div>
            <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html exercise.consigne}
            </p>
          </div>
        {/if}
        {#if exercise.introduction}
          <div>
            <p class="mt-2 mb-2 ml-2 lg:mx-6 text-coopmaths-corpus dark:text-coopmathsdark-corpus">
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              {@html exercise.introduction}
            </p>
          </div>
        {/if}
      </div>
      <div style="columns: {nbCols.toString()}">
        <ul
          class="{exercise.listeQuestions.length === 1 || !exercise.listeAvecNumerotation
            ? 'list-none'
            : 'list-decimal'} list-inside my-2 mx-4 md:mx-6 marker:text-coopmaths-struct dark:marker:text-coopmathsdark-struct marker:font-bold"
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
    {#if exercise.interactif && !isCorrectionVisible}
      <button type="submit" on:click={verifExerciceVueEleve} bind:this={buttonScore}>Vérifier {numberOfAnswerFields > 1 ? 'les réponses' : 'la réponse'}</button>
    {/if}
  </div>
</div>
