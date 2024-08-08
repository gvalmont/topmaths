<script lang="ts">
  import { curriculum, units } from '../../services/store'
  import ItemsSelection from '../shared/ItemsSelection/ItemsSelection.svelte'

</script>

<svelte:head>
  <title>Progressions - topmaths</title>
</svelte:head>

<ItemsSelection
  items={units}
  curriculum={$curriculum}
  view='classroom'
/>
