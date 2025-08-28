<script lang="ts">
  import { reference2 } from '../../services/store'
  import MainMenuItem from '../shared/MainMenuItem.svelte'
  import InstallationAnki from './tutos/InstallationAnki.svelte'
</script>

<svelte:head>
  <title>Tutos - topmaths</title>
</svelte:head>

<div
  class="grade-container is-5e
  rounded-4xl md:rounded-5xl"
>
  {#if $reference2 === ''}
    <h1
      class="title mb-8
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
    >
      Tutos
    </h1>
    <div class="pb-1">
      <MainMenuItem
        view="student"
        ref="tuto"
        ref2="installation-anki"
        color="5e"
      >
        Comment installer Anki
      </MainMenuItem>
    </div>
  {:else if $reference2 === 'installation-anki'}
    <InstallationAnki />
  {/if}
</div>
