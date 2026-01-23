<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { CartItem } from '../../../../types/cart'
  import type {
    ObjectiveExercise,
    ObjectiveReference,
    ObjectiveVideo,
  } from '../../../../types/objective'
  import ExercisesButtons from '../../../shared/ExercisesButtons.svelte'

  export let examExercises: ObjectiveExercise[]
  export let videos: ObjectiveVideo[]
  export let examExercisesLink: string
  export let objectiveReference: ObjectiveReference

  let itemsToAddToCart: CartItem[]
  onMount(async () => {
    await tick() // else is doesn't work on page reload
    itemsToAddToCart = examExercises.map((exercise) => {
      return {
        exercise,
        label: exercise.slug.split('uuid=')[1].split('&')[0],
        objectiveReference,
        unitReference: '',
      }
    })
  })
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  En route vers le brevet
</h2>
<div
  class="pt-6
  text-sm md:text-base"
>
  Tu ne peux pas encore faire ces exercices en entier mais avec ce que tu as
  appris tu sais répondre à au moins une question de chacun d'entre eux !
</div>
<ul class="p-6">
  <li class="p-2">
    <ExercisesButtons
      {itemsToAddToCart}
      {videos}
      exercisesLink={examExercisesLink}
    />
  </li>
</ul>
