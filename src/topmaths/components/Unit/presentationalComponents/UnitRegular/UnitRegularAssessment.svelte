<script lang="ts">
  import { onMount, tick } from 'svelte'
  import { getTitle } from '../../../../services/string'
  import type { CartItem } from '../../../../types/cart'
  import type { Unit } from '../../../../types/unit'
  import ExercisesButtons from '../../../shared/ExercisesButtons.svelte'

  export let unit: Unit

  let itemsToAddToCart: CartItem[]
  onMount(async () => {
    await tick() // else it doesn't work on page reload
    itemsToAddToCart = unit.objectives
      .map((objective) =>
        objective.exercises.map((exercise) => {
          return {
            exercise,
            label: exercise.description || getTitle(objective),
            objectiveReference: objective.reference,
            unitReference: unit.reference,
          }
        }),
      )
      .flat()
  })
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Évaluation
</h2>
<div class="p-6 flex flex-col">
  <div class="p-1 md:p-2">
    <ExercisesButtons
      {itemsToAddToCart}
      exercisesLink={unit.assessmentLink}
      unitReference={unit.reference}
    >
      S'entraîner pour l'évaluation{unit.assessmentExamLink
        ? ' (Automatismes)'
        : ''}
    </ExercisesButtons>
  </div>
  {#if unit.assessmentExamLink}
    <div class="p-1 md:p-2">
      <ExercisesButtons
        exercisesLink={unit.assessmentExamLink}
        unitReference={unit.reference}
      >
        S'entraîner pour l'évaluation{unit.assessmentExamLink
          ? ' (Brevet)'
          : ''}
      </ExercisesButtons>
    </div>
  {/if}
</div>
