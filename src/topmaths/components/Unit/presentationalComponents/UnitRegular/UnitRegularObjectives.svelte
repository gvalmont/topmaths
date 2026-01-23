<script lang="ts">
  import { isReferenceIgnored } from '../../../../services/reference'
  import { getTitle } from '../../../../services/string'
  import type { Reference, View } from '../../../../types/navigation'
  import type { Unit } from '../../../../types/unit'
  import ButtonPrerequisitesVisualization from '../../../shared/ButtonPrerequisitesVisualization.svelte'

  export let unit: Unit
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: Reference,
  ) => void
  export let isTeacherMode: boolean
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Objectifs
</h2>
<ul class="m-6">
  {#each unit.objectives.filter((objective) => !isReferenceIgnored(objective.reference)) as objective}
    <li class="py-1 md:py-2 flex justify-center">
      <a
        class="is-interactive"
        href="/?v=objective&ref={objective.reference}"
        on:click={(event) => goToView(event, 'objective', objective.reference)}
      >
        {objective.reference} : {getTitle(objective)}
      </a>
      {#if isTeacherMode}
        <ButtonPrerequisitesVisualization
          objectiveReference={objective.reference}
          gradeTeached={unit.grade}
        />
      {/if}
    </li>
  {/each}
</ul>
