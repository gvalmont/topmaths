<script lang="ts">
  import type TypeExercice from '../../../../../exercices/Exercice'
  import { mathaleaFormatExercice } from '../../../../../lib/mathalea.js'
  import {
    DEFAULT_LINE_HEIGHT,
    SPACING_MARGIN_RATIO,
  } from '../../../../services/environment'

  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let questionIndex: number
  export let isCorrectionVisible: boolean
</script>

<div
  style="break-inside:avoid"
  id="consigne{exerciseIndex}-{questionIndex}"
  class="mb-2"
>
  <li
    id="exercice{exerciseIndex}Q{questionIndex}"
    style="break-inside:avoid; line-height: {exercise.spacing ||
      DEFAULT_LINE_HEIGHT}; margin-bottom: {exercise.spacing *
      SPACING_MARGIN_RATIO || DEFAULT_LINE_HEIGHT * SPACING_MARGIN_RATIO}em;"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html mathaleaFormatExercice(exercise.listeQuestions[questionIndex])}
  </li>
  {#if isCorrectionVisible}
    <div
      class="relative self-start border-l-green-600 border-l-[3px] text-coopmaths-corpus dark:text-coopmathsdark-corpus my-5 lg:mb-0 ml-0 lg:ml-0 py-2 pl-4 lg:pl-6"
      id="correction${exerciseIndex}Q${questionIndex}"
    >
      <div
        class={exercise.consigneCorrection.length !== 0
          ? 'container bg-coopmaths-canvas dark:bg-coopmathsdark-canvas-dark px-4 py-2 mr-2 ml-6 mb-2 font-light relative w-2/3'
          : 'hidden'}
      >
        <div
          class="{exercise.consigneCorrection.length !== 0
            ? 'container absolute top-4 -left-4'
            : 'hidden'} "
        >
          <i
            class="bx bx-bulb scale-200 text-coopmaths-warn-dark dark:text-coopmathsdark-warn-dark"
          ></i>
        </div>
        <div
          style="break-inside:avoid; line-height: {exercise.spacing ||
            DEFAULT_LINE_HEIGHT};"
        >
          <!-- eslint-disable-next-line svelte/no-at-html-tags -->
          {@html exercise.consigneCorrection}
        </div>
      </div>
      <div
        class="container overflow-x-scroll overflow-y-hidden md:overflow-x-auto py-1"
        style="break-inside:avoid; line-height: {exercise.spacing ||
          DEFAULT_LINE_HEIGHT};"
      >
        <!-- eslint-disable-next-line svelte/no-at-html-tags -->
        {@html mathaleaFormatExercice(exercise.listeCorrections[questionIndex])}
      </div>
      <div
        class="absolute flex flex-row py-[1.5px] px-3 rounded-t-md justify-center items-center -left-[3px] -top-[15px] bg-green-600 font-semibold text-xs text-coopmaths-canvas dark:text-coopmathsdark-canvas"
      >
        Correction
      </div>
      <div
        class="absolute border-green-600 bottom-0 left-0 border-b-[3px] w-4"
      ></div>
    </div>
  {/if}
</div>

<style>
  li {
    break-inside: avoid;
  }
</style>
