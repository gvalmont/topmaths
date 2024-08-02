<script lang="ts">
  import { stringGradeValidKeys, type StringGrade } from '../../types/grade'

  export let activeLevelTab: string
  export let onLevelsTabsMenuClicked: (grade: StringGrade) => void

</script>

<div class="flex overflow-hidden overflow-x-auto">
  <ul class="flex flex-grow justify-center mb-6">
    {#each stringGradeValidKeys as level}
      <li>
        <button
          on:click={() => onLevelsTabsMenuClicked(level)}
          class="is-hoverable is-{level === 'all' ? 'tout' : level}
            text-base md:text-2xl
            py-1 md:py-2
            px-3 md:px-5"
          class:is-active={activeLevelTab === level}
          class:rounded-l-3xl={level === stringGradeValidKeys[0]}
          class:rounded-r-3xl={level === stringGradeValidKeys[stringGradeValidKeys.length - 1]}
        >
          {level === 'all' ? 'Tout' : level}
        </button
        >
      </li>
    {/each}
    <li />
  </ul>
</div>
