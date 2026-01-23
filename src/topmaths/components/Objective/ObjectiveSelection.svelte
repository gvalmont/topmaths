<script lang="ts">
  import { objectives } from '../../services/store'
  import ItemsSelection from '../shared/ItemsSelection/ItemsSelection.svelte'
</script>

<svelte:head>
  <title>Liste des objectifs - topmaths</title>
</svelte:head>

<ItemsSelection items={objectives} view="objective" />
