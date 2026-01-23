<script lang="ts">
  import { goToView } from '../../services/navigation'
  import { reference } from '../../services/store'
  import { isUnitReference } from '../../types/unit'
  import Sps1 from './presentationalComponents/specialUnits/SPS1.svelte'
  import Sps2 from './presentationalComponents/specialUnits/SPS2.svelte'
  import SPS3 from './presentationalComponents/specialUnits/SPS3.svelte'
  import UnitRegular from './presentationalComponents/UnitRegular/UnitRegular.svelte'
  import UnitSelection from './UnitSelection.svelte'
</script>

<div class="w-full max-w-screen-lg">
  {#if $reference === 'SPS1'}
    <Sps1 />
  {:else if $reference === 'SPS2'}
    <Sps2 />
  {:else if $reference === 'SPS3'}
    <SPS3 />
  {:else if isUnitReference($reference)}
    <UnitRegular unitReference={$reference} {goToView} />
  {:else}
    <UnitSelection />
  {/if}
</div>
