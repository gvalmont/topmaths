<script lang="ts">
  import { exerciseLinks, isTeacherMode } from '../../../services/store'
  import type TypeExercice from '../../../../exercices/Exercice'
  import type { SvelteComponent } from 'svelte'
  import ButtonImage from '../../shared/ButtonImage.svelte'

  export let exercise: TypeExercice | SvelteComponent
  export let exerciseIndex: number
  export let exerciseType: string
  export let isCorrectionVisible: boolean
  export let isMd: boolean
  export let nbCols: number
  export let newData: (exerciseIndex: number) => void
  export let switchCorrectionVisible: (exerciseIndex: number) => void
  export let navigatorShare: (exerciseIndex: number) => void
  export let columnsCountUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void
  export let spacingUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void
  export let zoomUpdate: (plusMinus: ('+' | '-'), exerciseIndex: number) => void

</script>

<div
  id="exercise{exerciseIndex}"
  class="print-hidden flex flex-row flex-wrap content-center items-center justify-center my-3 h-10
    text-xs md:text-base"
>
  <a href="#exercise{exerciseIndex}">
    <button class="inline-flex items-center justify-center font-semibold
      h-6 md:h-8
      w-6 md:w-8
      bg-coopmaths-action
      text-coopmaths-canvas
      lg:text-normal md:text-lg"
    >
      {exerciseIndex + 1}
    </button>
  </a>
  {#if exerciseType !== 'static' || $exerciseLinks.length > 1}
    <ButtonImage
      class="flex justify-center ml-2 border p-1 w-[119px] md:w-[160px] rounded {isMd ? '' : 'is-small'}"
      color="coopmaths"
      imageSrc="topmaths/img/cc0/refresh-reverse-svgrepo-com.svg"
      imageAlt="Flèches qui tournent en rond"
      imageClass="size-4 md:size-6"
      on:click={() => newData(exerciseIndex)}
    >
      <div class="text-xs md:text-base">Nouvel énoncé</div>
    </ButtonImage>
  {/if}
  {#if exerciseType === 'static'}
    <div class="flex justify-center items-center pt-2 ml-2">
      <a class="is-interactive is-coopmaths" href="https://www.apmep.fr/Brevet-{exercise.annee}" target="_blank" rel="noopener noreferrer">
        {`${exercise.typeExercice?.toUpperCase()} - ${exercise.mois || ''} ${exercise.annee} - ${exercise.lieu} - Ex. ${exercise.numeroInitial}`}
        <i class='bx bx-link-external' />
      </a>
    </div>
  {/if}
  {#if exerciseType !== 'html'}
    <ButtonImage
      class="flex justify-center ml-2 border p-1 w-[151px] md:w-[210px] rounded {isMd ? '' : 'is-small'}"
      color="green"
      imageSrc="topmaths/img/cc0/{isCorrectionVisible ? 'eye' : 'blind'}-svgrepo-com.svg"
      imageAlt="{isCorrectionVisible ? 'oeil' : 'oeil barré'}"
      imageClass="size-4 md:size-6"
      on:click={() => switchCorrectionVisible(exerciseIndex)}
    >
    <div class="text-xs md:text-base">{isCorrectionVisible ? 'Masquer la correction' : 'Voir la correction'}</div>
    </ButtonImage>
  {/if}
  <button
    class="is-coopmaths ml-3 is-interactive"
    on:click={() => navigatorShare(exerciseIndex)}
  >
    <img
      class="is-icon
      size-4 md:size-6"
      src="topmaths/img/cc0/share-2-svgrepo-com.svg"
      alt="icone de partage"
    />
  </button>
  {#if $isTeacherMode && exerciseType === 'mathalea'}
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
    </div>
  {/if}
  {#if exerciseType === 'mathalea'}
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
  {/if}
</div>
<div class="print-only hidden text-coopmaths-action font-semibold">
  Exercice {exerciseIndex + 1}
</div>

<style>
  button:focus {
    box-shadow: none !important;
  }
</style>
