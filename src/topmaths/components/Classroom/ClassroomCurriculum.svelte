<script lang="ts">
  import { units } from '../../services/store'
  import ItemsSelection from '../shared/ItemsSelection/ItemsSelection.svelte'
</script>

<svelte:head>
  <title>Progressions - topmaths</title>
</svelte:head>

<ItemsSelection items={units} view="classroom" />
