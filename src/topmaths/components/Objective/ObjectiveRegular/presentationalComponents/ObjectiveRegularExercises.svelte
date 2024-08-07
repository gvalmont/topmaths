<script lang="ts">
  import type { ObjectiveExercise, ObjectiveReference, ObjectiveVideo } from '../../../../types/objective'
  import BoutonsExercices from '../../../shared/BoutonsExercices.svelte'

  export let reference: ObjectiveReference
  export let exercises: ObjectiveExercise[]
  export let videos: ObjectiveVideo[]
  export let exercisesLink: string
  export let isAllExercisesInCart: boolean

</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  <BoutonsExercices
    reference = {reference}
    exercices = {exercises}
    videos = {videos}
    lienExercices = {exercisesLink}
    panierRempli = {isAllExercisesInCart}
    titre = {'S\'entraîner'}
  />
</h2>
<ul class="p-6">
  {#each exercises as exercice, i}
    <li class="p-1 md:p-2">
      <BoutonsExercices
        reference = {reference}
        exercices = {[exercises[i]]}
        videos = {videos}
        lienExercices = {exercice.link}
        panierRempli = {exercice.isInCart}
        titre = {exercice.description !== ''
          ? exercice.description
          : exercises.length > 1
            ? 'Exercices de niveau ' + (i + 1)
            : "Lancer l'exercice"}
        indiceExercice = {i}
      />
    </li>
  {/each}
</ul>
