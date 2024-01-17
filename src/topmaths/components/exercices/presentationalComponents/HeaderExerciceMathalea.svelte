<script lang="ts">
  import { listeDesUrl, modeEnseignant } from '../../../services/store'
  import type TypeExercice from '../../../../exercices/ExerciceTs.js'

  export let exercise: TypeExercice
  export let exerciseIndex: number
  export let exerciseType: string
  export let isCorrectionVisible: boolean
  export let isMd: boolean
  export let nbCols: number
  export let newData: (exerciseIndex: number) => void
  export let switchCorrectionVisible: (exerciseIndex: number) => void
  export let copyLink: (exerciseIndex: number) => void
  export let columnsCountUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void
  export let spacingUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void
  export let zoomUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void

</script>

<div
  id="exercise{exerciseIndex}"
  class="flex flex-row content-center items-center justify-start my-3 text-xs md:text-base h-10"
>
  <a href="#exercise{exerciseIndex}">
    <div
      class="inline-flex items-center justify-center h-6 w-6 md:h-8 md:w-8 bg-coopmaths-action text-coopmaths-canvas lg:text-normal font-semibold md:text-lg"
    >
      {exerciseIndex + 1}
    </div>
  </a>
  &nbsp; &nbsp
  {#if exerciseType !== 'static' || ($listeDesUrl !== undefined && $listeDesUrl.length > 0)}
    <button
      class="button is-coopmaths is-outlined p-1 rounded {isMd ? '' : 'is-small'}"
      on:click={() => { newData(exerciseIndex) }}
    >
      <i class="flex-shrink-0">
        <img
          src="topmaths/img/cc0/refresh-reverse-svgrepo-com.svg"
          alt="Flèches qui tournent en rond"
          class="size-4 md:size-6"
        />
      </i>
      &nbsp;
      <div class="text-xs md:text-base">Nouvel énoncé</div>
    </button>
    &nbsp; &nbsp;
  {/if}
  {#if exerciseType === 'static'}
    <div class="flex justify-center items-center pt-2">
      <a class="text-coopmaths-action" href="https://www.apmep.fr/Brevet-{exercise.annee}" target="_blank" rel="noopener noreferrer">
        {`${exercise.typeExercice?.toUpperCase()} - ${exercise.mois || ''} ${exercise.annee} - ${exercise.lieu} - Ex. ${exercise.numeroInitial}`}
      </a>
    </div>
    &nbsp; &nbsp;
  {/if}
  <button
    class="button is-green is-outlined p-1 rounded {isMd ? '' : 'is-small'}"
    on:click={() => { switchCorrectionVisible(exerciseIndex) }}
  >
  <i class="flex-shrink-0">
    <img
      src="topmaths/img/cc0/{isCorrectionVisible ? 'eye' : 'blind'}-svgrepo-com.svg"
      alt={isCorrectionVisible ? 'oeil' : 'oeil barré'}
      class="size-4 md:size-6"
    />
  </i>
    &nbsp;
    <div class="text-xs md:text-base">{isCorrectionVisible ? 'Masquer la correction' : 'Voir la correction'}</div>
  </button>
  <div class="is-coopmaths ml-3">
    <button on:click={() => copyLink(exerciseIndex)}>
      <i>
        <img class="size-4 md:size-6" src="topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg" alt="Documents dupliqués" />
      </i>
    </button>
  </div>
  {#if $modeEnseignant && exerciseType === 'mathalea'}
    <div class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct">
      <button
        class:invisible={nbCols < 2}
        type="button"
        on:click={() => columnsCountUpdate('-', exerciseIndex)}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd ? 'bx-sm' : 'bx-xs'} bx-minus" />
      </button>
      <i class="bx ml-1 {isMd ? 'bx-sm' : 'bx-xs'} bx-columns" />
      <button
        type="button"
        on:click={() => columnsCountUpdate('+', exerciseIndex)}
      >
        <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd ? 'bx-sm' : 'bx-xs'} bx-plus" />
      </button>
      <div class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct">
        <button
          type="button"
          class:invisible={exercise.spacing < 0.1}
          on:click={() => spacingUpdate('-', exerciseIndex)}
        >
          <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd ? 'bx-sm' : 'bx-xs'} bx-minus" />
        </button>
        <i class="ml-1" style="filter: invert(34%) sepia(83%) saturate(426%) hue-rotate(159deg) brightness(94%) contrast(97%);">
          <img src="topmaths/img/gvalmont/three-lines.svg" class="size-4 md:size-6" alt="Trois lignes" />
        </i>
        <button
          type="button"
          on:click={() => spacingUpdate('+', exerciseIndex)}
        >
          <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd ? 'bx-sm' : 'bx-xs'} bx-plus" />
        </button>
      </div>
      <div class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct">
        <button
          type="button"
          class:invisible={exercise.spacing < 0.1}
          on:click={() => zoomUpdate('-', exerciseIndex)}
        >
          <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd ? 'bx-sm' : 'bx-xs'} bx-minus" />
        </button>
        <i class="ml-1" style="filter: invert(34%) sepia(83%) saturate(426%) hue-rotate(159deg) brightness(94%) contrast(97%);">
          <img src="topmaths/img/cc0/magnifying-glass-11-svgrepo-com.svg" class="size-4 md:size-6" alt="Loupe" />
        </i>
        <button
          type="button"
          on:click={() => zoomUpdate('+', exerciseIndex)}
        >
          <i class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd ? 'bx-sm' : 'bx-xs'} bx-plus" />
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  button:focus {
    box-shadow: none !important;
  }
</style>
