<script lang="ts">
  import { buildGradeFromObjectiveReference } from '../../../../services/reference'
  import { getTitle } from '../../../../services/string'
  import type { Reference, View } from '../../../../types/navigation'
  import type {
    ObjectivePrerequisite,
    ObjectiveReference,
  } from '../../../../types/objective'
  import ButtonPrerequisitesVisualization from '../../../shared/ButtonPrerequisitesVisualization.svelte'

  export let prerequisites: ObjectivePrerequisite[]
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: Reference,
  ) => void
  export let objectiveReference: ObjectiveReference
  export let isTeacherMode: boolean
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Prérequis
</h2>
{#if prerequisites.length > 0}
  <p class="pt-8">
    Avant de viser cet objectif, il faut d'abord maîtriser {prerequisites.length >
    1
      ? 'les objectifs suivants'
      : "l'objectif suivant"} :
  </p>
{/if}
<ul class="pt-4">
  {#each prerequisites as prerequisite}
    <li
      class="p-2 is-{buildGradeFromObjectiveReference(
        prerequisite.objectiveReference,
      )}"
    >
      <a
        class="is-interactive"
        href="/?v=objective&ref={prerequisite.objectiveReference}"
        on:click={(event) =>
          goToView(event, 'objective', prerequisite.objectiveReference)}
      >
        {prerequisite.objectiveReference} : {getTitle(prerequisite)}
      </a>
    </li>
  {/each}
</ul>
<div class="pt-2 pb-6 flex justify-center">
  {#if isTeacherMode}
    <ButtonPrerequisitesVisualization
      {objectiveReference}
      gradeTeached={buildGradeFromObjectiveReference(objectiveReference)}
      text="Visualiser les prérequis&nbsp;"
    />
  {/if}
</div>
