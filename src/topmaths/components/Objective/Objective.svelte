<script lang="ts">
  import { reference } from '../../services/store'
  import ObjectiveRegular from './ObjectiveRegular.svelte'
  import ObjectiveSelection from './ObjectiveSelection.svelte'

</script>

{#if $reference === ''}
  <ObjectiveSelection />
{:else}
  <ObjectiveRegular objectiveReference={$reference} />
{/if}
