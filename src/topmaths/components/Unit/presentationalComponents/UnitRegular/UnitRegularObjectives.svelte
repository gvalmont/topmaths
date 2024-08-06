<script lang="ts">
  import { UNLISTED_THEMES } from '../../../../services/environment'
  import { getTitle } from '../../../../services/shared'
  import type { Reference, View } from '../../../../types/navigation'
  import type { Unit } from '../../../../types/unit'

  export let unit: Unit
  export let goToView: (event: MouseEvent, view: View, reference: Reference) => void

</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Objectifs
</h2>
<ul class="m-6">
  {#each unit.objectives as objective}
    {#if !UNLISTED_THEMES.includes(objective.theme)}
      <li class="p-1 md:p-2 ">
        <a
          href="/?v=objective&ref={objective.reference}"
          on:click={(event) => goToView(event, 'objective', objective.reference)}
        >
          {objective.reference} : {getTitle(objective)}
        </a>
      </li>
    {/if}
  {/each}
</ul>
