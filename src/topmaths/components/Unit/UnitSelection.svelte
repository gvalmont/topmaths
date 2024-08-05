<script lang="ts">
  import { writable } from 'svelte/store'
  import { specialUnits, units } from '../../services/store'
  import ItemsSelection from '../shared/ItemsSelection.svelte'
  import { deepCopy } from '../../types/shared'
  import { emptyUnit } from '../../types/unit'

  const items = writable($units.concat($specialUnits.map((unit) => Object.assign({}, deepCopy(emptyUnit), unit, { grade: 'tout' }))))

</script>

<svelte:head>
  <title>Liste des séquences - topmaths</title>
</svelte:head>

<ItemsSelection
  {items}
  view='unit'
/>
