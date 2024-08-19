<script lang="ts">
  import type { Unit } from '../../../../types/unit'
  import ExercisesButtons from '../../../shared/ExercisesButtons.svelte'

  export let unit: Unit

</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Révisions
</h2>
<div class="p-6 flex flex-col">
  {#each unit.objectives.map(objective => objective.lessonPlans).flat() as lessonPlan, i}
    {#if lessonPlan.consolidationLink !== '' || lessonPlan.prerequisiteLink !== ''}
      <div class="flex flex-row justify-center">
        Séance {i + 1} :
        {#if lessonPlan.consolidationLink !== ''}
          <ExercisesButtons
            class="ml-2"
            exercisesLink= {lessonPlan.consolidationLink}
          >
            Consolidation
          </ExercisesButtons>
        {/if}
        {#if lessonPlan.prerequisiteLink !== ''}
          <ExercisesButtons
            class="ml-4"
            exercisesLink= {lessonPlan.prerequisiteLink}
          >
            Prérequis
          </ExercisesButtons>
        {/if}
      </div>
    {/if}
  {/each}
</div>
