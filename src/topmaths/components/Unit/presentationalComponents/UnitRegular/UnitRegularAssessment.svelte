<script lang="ts">
  import { getTitle } from '../../../../services/shared'
  import type { Unit } from '../../../../types/unit'
  import BoutonsExercices from '../../../shared/BoutonsExercices.svelte'

  export let unit: Unit

</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Évaluation
</h2>
<div class="p-6 flex flex-col">
  <div class="p-1 md:p-2">
    <BoutonsExercices
      exercices = {unit.objectives.map(objectif => objectif.exercises).flat()}
      lienExercices = {unit.assessmentLink}
      titre = {`S'entraîner pour l'évaluation${unit.assessmentExamLink ? ' (Automatismes)' : ''}`}
      reference = {unit.reference}
      nomsPanier = {unit.objectives.map(objectif => `${objectif.reference} ${getTitle(objectif)}`)}
    />
  </div>
  {#if unit.assessmentExamLink}
    <div class="p-1 md:p-2">
      <BoutonsExercices
        exercices = {[]}
        reference = {unit.reference + ' Brevet '}
        nomsPanier = {[unit.reference]}
        lienExercices = {unit.assessmentExamLink}
        titre = {'S\'entraîner pour l\'évaluation (Exercices de brevet)'}
      />
    </div>
  {/if}
</div>
