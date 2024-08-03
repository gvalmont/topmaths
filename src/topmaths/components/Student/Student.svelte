<script lang="ts">
  import { reference } from '../../services/store'
  import StudentDownload from './StudentDownload.svelte'
  import StudentGlossary from './StudentGlossary.svelte'
  import StudentSelection from './StudentSelection.svelte'
  import StudentTuto from './StudentTuto.svelte'

</script>

{#if $reference === 'glossary'}
  <StudentGlossary />
{:else if $reference === 'download'}
  <StudentDownload />
{:else if $reference === 'tuto'}
  <StudentTuto />
{:else}
  <StudentSelection />
{/if}
