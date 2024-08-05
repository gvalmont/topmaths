<script lang="ts">
  import { stringGradeValidKeys, type StringGrade } from '../../types/grade'

  export let activeLevelTab: string
  export let onClick: (grade: StringGrade) => void

</script>

<div class="flex overflow-hidden overflow-x-auto
  mb-2 md:mb-4"
>
  <ul class="flex flex-grow justify-center">
    {#each stringGradeValidKeys as level}
      <li>
        <button
          on:click={() => onClick(level)}
          class="is-tabs-menu is-{level}
            text-base md:text-2xl
            my-1 md:my-4
            py-1 md:py-2
            px-3 md:px-5"
          class:is-active={activeLevelTab === level}
          class:is-first={level === stringGradeValidKeys[0]}
          class:is-last={level === stringGradeValidKeys[stringGradeValidKeys.length - 1]}
        >
          {level === 'tout' ? 'Tout' : level}
        </button
        >
      </li>
    {/each}
    <li />
  </ul>
</div>
