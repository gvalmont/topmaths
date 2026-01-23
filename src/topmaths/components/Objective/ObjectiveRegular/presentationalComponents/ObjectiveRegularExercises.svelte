<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { CartItem } from '../../../../types/cart'
  import type {
    ObjectiveExercise,
    ObjectiveReference,
    ObjectiveVideo,
  } from '../../../../types/objective'
  import ExercisesButtons from '../../../shared/ExercisesButtons.svelte'

  export let reference: ObjectiveReference
  export let exercises: ObjectiveExercise[]
  export let videos: ObjectiveVideo[]
  export let exercisesLink: string
  export let objectiveTitle: string

  let itemsToAddToCart: CartItem[]
  onMount(async () => {
    await tick() // else is doesn't work on page reload
    itemsToAddToCart = exercises.map((exercise) => {
      return {
        exercise,
        label: exercise.description || objectiveTitle,
        objectiveReference: reference,
        unitReference: '',
      }
    })
  })
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  <ExercisesButtons {itemsToAddToCart} {videos} {exercisesLink}>
    S'entraîner
  </ExercisesButtons>
</h2>
<ul class="p-6">
  {#each exercises as exercice, i}
    <li class="p-1 md:p-2">
      <ExercisesButtons
        itemsToAddToCart={[
          {
            exercise: exercises[i],
            label: exercises[i].description || objectiveTitle,
            objectiveReference: reference,
            unitReference: '',
          },
        ]}
        {videos}
        exercisesLink={exercice.link}
        exerciseIndex={i}
      >
        {exercice.description !== ''
          ? exercice.description
          : exercises.length > 1
            ? 'Exercices de niveau ' + (i + 1)
            : "Lancer l'exercice"}
      </ExercisesButtons>
    </li>
  {/each}
</ul>
