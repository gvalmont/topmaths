<script lang="ts">
  import { onMount, type SvelteComponent } from 'svelte'
  import type TypeExercice from '../../../../exercices/Exercice'
  import { goToView } from '../../../services/navigation'
  import { getUnitReferenceFromExamUuid } from '../../../services/reference'
  import { exerciseLinks, isTeacherMode } from '../../../services/store'
  import type { ObjectiveReference } from '../../../types/objective'
  import type { UnitReference } from '../../../types/unit'
  import ButtonImage from '../../shared/ButtonImage.svelte'

  export let exercise: TypeExercice | SvelteComponent
  export let exerciseIndex: number
  export let exerciseType: string
  export let isCorrectionVisible: boolean
  export let sourceObjective: ObjectiveReference | undefined
  export let sourceUnit: UnitReference | undefined
  export let isMd: boolean
  export let nbCols: number
  export let zoom: number = 1
  export let newData: (exerciseIndex: number) => void
  export let switchCorrectionVisible: (exerciseIndex: number) => void
  export let navigatorShare: (exerciseIndex: number) => void
  export let columnsCountUpdate: (
    plusMinus: '+' | '-',
    exerciseIndex: number,
  ) => void
  export let spacingUpdate: (
    plusMinus: '+' | '-',
    exerciseIndex: number,
  ) => void
  export let zoomUpdate: (plusMinus: '+' | '-', exerciseIndex: number) => void

  let unitReference: UnitReference | undefined = undefined

  $: if (exercise.uuid)
    unitReference = getUnitReferenceFromExamUuid(exercise.uuid)

  onMount(() => {
    if (exercise && exerciseType === 'static') {
      unitReference = getUnitReferenceFromExamUuid(exercise.uuid)
    }
  })
</script>

<div
  id="exercise{exerciseIndex}"
  class="print-hidden flex flex-row flex-wrap content-center items-center justify-center
    text-xs md:text-base"
>
  <a href="#exercise{exerciseIndex}">
    <button
      class="inline-flex items-center justify-center font-semibold
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
      class="flex justify-center ml-2 border p-1 w-[130px] md:w-[180px] rounded {isMd
        ? ''
        : 'is-small'}"
      color="coopmaths"
      imageSrc="topmaths/img/cc0/refresh-reverse-svgrepo-com.svg"
      imageAlt="Flèches qui tournent en rond"
      imageClass="size-4 md:size-6"
      on:click={() => newData(exerciseIndex)}
    >
      <div class="text-xs md:text-base">
        Nouvel {$exerciseLinks.length > 1 ? 'exercice' : 'énoncé'}
      </div>
    </ButtonImage>
  {/if}
  {#if exerciseType !== 'html'}
    <ButtonImage
      class="flex justify-center ml-2 border p-1 w-[130px] md:w-[180px] rounded {isMd
        ? ''
        : 'is-small'}"
      color="green"
      imageSrc="topmaths/img/cc0/{isCorrectionVisible
        ? 'eye'
        : 'blind'}-svgrepo-com.svg"
      imageAlt={isCorrectionVisible ? 'oeil' : 'oeil barré'}
      imageClass="size-4 md:size-6"
      on:click={() => switchCorrectionVisible(exerciseIndex)}
    >
      <div class="text-xs md:text-base">
        {isCorrectionVisible ? 'Cacher la correction' : 'Voir la correction'}
      </div>
    </ButtonImage>
  {/if}
  {#if exerciseType === 'static'}
    {#if unitReference}
      <a href="?v=unit&ref={unitReference}">
        <ButtonImage
          class="flex justify-center ml-2 border p-1 w-[130px] md:w-[180px] rounded {isMd
            ? ''
            : 'is-small'}"
          color="info-darker"
          imageSrc="topmaths/img/cc0/guest-book-svgrepo-com.svg"
          imageAlt="Livre ouvert"
          imageClass="size-4 md:size-6"
          on:click={(mouseEvent) => goToView(mouseEvent, 'unit', unitReference)}
        >
          <div class="text-xs md:text-base">Voir la séquence</div>
        </ButtonImage>
      </a>
    {/if}
    <a
      class="is-interactive is-coopmaths"
      href="https://www.apmep.fr/Brevet-{exercise.annee}"
      target="_blank"
      rel="noopener noreferrer"
    >
      <ButtonImage
        class="flex justify-center ml-2 my-2 border p-1 rounded {isMd
          ? ''
          : 'is-small'}"
        color="coopmaths"
        imageSrc="topmaths/img/cc0/external-link-svgrepo-com.svg"
        imageAlt="Lien externe"
        imageClass="ml-2 size-3 md:size-4"
      >
        <div class="text-xs md:text-base">
          {`Sujet ${exercise.lieu} - ${exercise.mois || ''} ${exercise.annee}`}
        </div>
      </ButtonImage>
    </a>
  {:else}
    {#if sourceUnit}
      <a href="?v=unit&ref={sourceUnit}">
        <ButtonImage
          class="flex justify-center ml-2 border p-1 w-[130px] md:w-[180px] rounded {isMd
            ? ''
            : 'is-small'}"
          color="info-darker"
          imageSrc="topmaths/img/cc0/guest-book-svgrepo-com.svg"
          imageAlt="Livre ouvert"
          imageClass="size-4 md:size-6"
          on:click={(mouseEvent) => goToView(mouseEvent, 'unit', sourceUnit)}
        >
          <div class="text-xs md:text-base">Voir la séquence</div>
        </ButtonImage>
      </a>
    {/if}
    {#if sourceObjective}
      <a href="?v=objective&ref={sourceObjective}">
        <ButtonImage
          class="flex justify-center ml-2 border p-1 w-[130px] md:w-[180px] rounded {isMd
            ? ''
            : 'is-small'}"
          color="link"
          imageSrc="topmaths/img/cc0/study-2-svgrepo-com.svg"
          imageAlt="Personne lisant un livre"
          imageClass="size-4 md:size-6"
          on:click={(mouseEvent) =>
            goToView(mouseEvent, 'objective', sourceObjective)}
        >
          <div class="text-xs md:text-base">Voir le cours</div>
        </ButtonImage>
      </a>
    {/if}
  {/if}
  <div class="flex flex-row justify-start items-center ml-3">
    <button
      class="is-coopmaths is-interactive"
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
      <div
        class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        <button
          class:invisible={nbCols < 2}
          type="button"
          on:click={() => columnsCountUpdate('-', exerciseIndex)}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-minus"
          ></i>
        </button>
        <i class="bx ml-1 {isMd ? 'bx-sm' : 'bx-xs'} bx-columns"></i>
        <button
          type="button"
          on:click={() => columnsCountUpdate('+', exerciseIndex)}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-plus"
          ></i>
        </button>
      </div>
    {/if}
    {#if exerciseType === 'mathalea'}
      <div
        class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        <button
          type="button"
          class:invisible={exercise.spacing < 0.1}
          on:click={() => spacingUpdate('-', exerciseIndex)}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-minus"
          ></i>
        </button>
        <i
          class="ml-1"
          style="filter: invert(34%) sepia(83%) saturate(426%) hue-rotate(159deg) brightness(94%) contrast(97%);"
        >
          <img
            src="topmaths/img/gvalmont/three-lines.svg"
            class="size-4 md:size-6"
            alt="Trois lignes"
          />
        </i>
        <button
          type="button"
          on:click={() => spacingUpdate('+', exerciseIndex)}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-plus"
          ></i>
        </button>
      </div>
      <div
        class="flex flex-row justify-start items-center text-coopmaths-struct dark:text-coopmathsdark-struct"
      >
        <button
          type="button"
          class:invisible={zoom < 0.8}
          on:click={() => zoomUpdate('-', exerciseIndex)}
        >
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-2 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-minus"
          ></i>
        </button>
        <i
          class="ml-1"
          style="filter: invert(34%) sepia(83%) saturate(426%) hue-rotate(159deg) brightness(94%) contrast(97%);"
        >
          <img
            src="topmaths/img/cc0/magnifying-glass-11-svgrepo-com.svg"
            class="size-4 md:size-6"
            alt="Loupe"
          />
        </i>
        <button type="button" on:click={() => zoomUpdate('+', exerciseIndex)}>
          <i
            class="text-coopmaths-action hover:text-coopmaths-action-darkest dark:text-coopmathsdark-action dark:hover:text-coopmathsdark-action-darkest bx ml-1 {isMd
              ? 'bx-sm'
              : 'bx-xs'} bx-plus"
          ></i>
        </button>
      </div>
    {/if}
  </div>
</div>
<div class="print-only hidden text-coopmaths-action font-semibold">
  Exercice {exerciseIndex + 1}
</div>

<style>
  button:focus {
    box-shadow: none !important;
  }
</style>
