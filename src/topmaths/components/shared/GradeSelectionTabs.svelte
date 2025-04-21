<script lang="ts">
  import { DEFAULT_GRADE, stringGradeValidKeys, type StringGrade } from '../../types/grade'

  export let activeLevelTab: string
  export let onClick: (grade: StringGrade) => void

</script>

<div class="print-hidden flex overflow-hidden overflow-x-auto
  mb-2 md:mb-4"
>
  <ul class="flex flex-grow justify-center">
    {#each stringGradeValidKeys as level}
      <li>
        <button
          on:click={() => onClick(level)}
          class="button is-light is-{level}
            text-base md:text-2xl
            my-1 md:my-4
            py-1 md:py-2
            px-3 md:px-5
            {level === DEFAULT_GRADE ? 'rounded-l-[1.5rem]' : ''}
            {level === stringGradeValidKeys[stringGradeValidKeys.length - 1] ? 'rounded-r-[1.5rem]' : ''}"
          class:is-active={activeLevelTab === level}
        >
          {level === DEFAULT_GRADE ? 'Tout' : level}
        </button
        >
      </li>
    {/each}
    <li />
  </ul>
</div>
