<script lang="ts">
  import { reference } from '../../services/store'
  import StudentDownload from './StudentDownload.svelte'
  import StudentGlossary from './Glossary/StudentGlossary.svelte'
  import StudentSelection from './StudentSelection.svelte'
  import StudentTuto from './StudentTuto.svelte'
</script>

<div class="w-full max-w-screen-lg">
  {#if $reference === 'glossary'}
    <StudentGlossary />
  {:else if $reference === 'download'}
    <StudentDownload />
  {:else if $reference === 'tuto'}
    <StudentTuto />
  {:else}
    <StudentSelection />
  {/if}
</div>
