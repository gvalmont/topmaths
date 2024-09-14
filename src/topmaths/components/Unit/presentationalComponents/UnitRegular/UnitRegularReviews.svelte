<script lang="ts">
  import { buildGradeFromObjectiveReference, isReferenceIgnored } from '../../../../services/reference'
  import type { Reference, View } from '../../../../types/navigation'
  import type { Unit } from '../../../../types/unit'
  import ExercisesButtons from '../../../shared/ExercisesButtons.svelte'
  import Tooltip from '../../../shared/Tooltip.svelte'

  export let unit: Unit
  export let goToView: (event: MouseEvent, view: View, reference: Reference) => void

</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Révisions
</h2>
<div class="p-6 flex flex-col">
  {#each unit.objectives.filter(objective => !isReferenceIgnored(objective.reference)).map(objective => objective.lessonPlans).flat() as lessonPlan, i}
    {#if lessonPlan.consolidationLink !== '' || lessonPlan.prerequisiteLink !== ''}
      <div class="flex flex-row flex-wrap justify-center">
        Leçon {i + 1} :
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
          {#each lessonPlan.prerequisiteReviews as review}
            <a
              class="ml-2 md:ml-4"
              href="/?v=objective&ref={review.objectiveReference}"
              on:click={(event) => goToView(event, 'objective', review.objectiveReference)}
            >
              <Tooltip
                dropdownText="{review.description}"
              >
                <button
                  class="button is-{buildGradeFromObjectiveReference(review.objectiveReference)} border rounded
                    px-1 md:px-2
                    text-xs md:text-sm"
                >
                  {review.objectiveReference}
                </button>
              </Tooltip>
            </a>
          {/each}
        {/if}
      </div>
    {/if}
  {/each}
</div>
