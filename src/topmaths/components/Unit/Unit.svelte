<script lang="ts">
  import { reference } from '../../services/store'
  import Sps1 from './presentationalComponents/specialUnits/SPS1.svelte'
  import Sps2 from './presentationalComponents/specialUnits/SPS2.svelte'
  import UnitRegular from './UnitRegular.svelte'
  import UnitSelection from './UnitSelection.svelte'

</script>

{#if $reference === 'SPS1'}
  <Sps1 />
{:else if $reference === 'SPS2'}
  <Sps2 />
{:else if $reference !== ''}
  <UnitRegular unitReference={$reference} />
{:else}
  <UnitSelection />
{/if}
