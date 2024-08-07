<script lang="ts">
  import type { ObjectiveExercise, ObjectiveVideo } from '../../../../types/objective'
  import BoutonsExercices from '../../../shared/BoutonsExercices.svelte'

  export let examExercises: ObjectiveExercise[]
  export let videos: ObjectiveVideo[]
  export let examExercisesLink: string
  export let isExamExercisesInCart: boolean
</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  En route vers le brevet
</h2>
<div class="pt-6
  text-sm md:text-base"
>
  Tu ne peux pas encore faire ces exercices en entier mais avec ce que tu
  as appris tu sais répondre à au moins une question de chacun
  d'entre eux !
</div>
<ul class="p-6">
  <li class="p-2">
    <BoutonsExercices
      exercices = {examExercises}
      videos = {videos}
      lienExercices = {examExercisesLink}
      panierRempli = {isExamExercisesInCart}
      titre = {'Lancer les exercices de brevet'}
      exercicesDeBrevet = {true}
    />
  </li>
</ul>
