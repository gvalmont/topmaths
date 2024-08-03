<script lang="ts">
  import { reference } from '../../services/store'
  import { isObjectiveReference } from '../../types/objective'
  import ObjectiveRegular from './ObjectiveRegular.svelte'
  import ObjectiveSelection from './ObjectiveSelection.svelte'

</script>

{#if isObjectiveReference($reference)}
  <ObjectiveRegular objectiveReference={$reference} />
{:else}
  <ObjectiveSelection />
{/if}
