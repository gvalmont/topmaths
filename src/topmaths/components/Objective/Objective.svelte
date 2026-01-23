<script lang="ts">
  import { reference } from '../../services/store'
  import { isObjectiveReference } from '../../types/objective'
  import ObjectiveRegular from './ObjectiveRegular/ObjectiveRegular.svelte'
  import ObjectiveSelection from './ObjectiveSelection.svelte'
</script>

<div class="w-full max-w-screen-lg">
  {#if isObjectiveReference($reference)}
    <ObjectiveRegular objectiveReference={reference} />
  {:else}
    <ObjectiveSelection />
  {/if}
</div>
