<script lang="ts">
  import { isTeacherMode } from '../../services/store'
  import Storage from '../../modules/Storage'
  import MainMenuItem from '../shared/MainMenuItem.svelte'
</script>

<svelte:head>
  <title>Outils pour la classe - topmaths</title>
</svelte:head>

<div
  class="grade-container is-6e
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Outils pour la classe
  </h1>
  <div class="p-6">
    <MainMenuItem view="classroom" ref="mathador" color="purple">
      Mathador
    </MainMenuItem>
    {#if $isTeacherMode}
      <MainMenuItem view="classroom" ref="curriculum" color="sponsor">
        Progressions
      </MainMenuItem>
      <MainMenuItem view="classroom" ref="prerequisites" color="brown">
        Visualisation des prérequis
      </MainMenuItem>
    {/if}
    <div>
      <button
        on:click={() => Storage.setTeacherMode(!$isTeacherMode)}
        class="button is-green border
          rounded md:rounded-lg
          py-1 md:py-2
          px-4 md:px-6"
      >
        {$isTeacherMode ? 'Désactiver' : 'Activer'} le mode enseignant
      </button>
    </div>
  </div>
</div>
