<script lang="ts">
  import { buildGradeFromObjectiveReference } from '../../../../services/reference'
  import { getTitle } from '../../../../services/string'
  import type { Reference, View } from '../../../../types/navigation'
  import type { ObjectivePrerequisite } from '../../../../types/objective'

  export let prerequisites: ObjectivePrerequisite[]
  export let goToView: (event: MouseEvent, view: View, reference: Reference) => void
</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Prérequis
</h2>
<p class="pt-8">
  Avant de viser cet objectif, il faut d'abord maîtriser {prerequisites.length > 1 ? 'les objectifs suivants' : 'l\'objectif suivant'} :
</p>
<ul class="pt-4 pb-6">
  {#each prerequisites as prerequisite}
    <li class="p-2 is-{buildGradeFromObjectiveReference(prerequisite.objectiveReference)}">
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
