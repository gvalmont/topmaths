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
  <div class="flex flex-row justify-center">
    Séance {i + 1} :
    <ExercisesButtons
      class="ml-2"
      exercisesLink= {lessonPlan.consolidationLink}
    >
      Consolidation
    </ExercisesButtons>
    <ExercisesButtons
      class="ml-4"
      exercisesLink= {lessonPlan.prerequisiteLink}
    >
      Prérequis
    </ExercisesButtons>
  </div>
  {/each}
</div>
