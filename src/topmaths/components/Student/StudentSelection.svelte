<script lang="ts">
  import MainMenuItem from '../shared/MainMenuItem.svelte'
</script>

<svelte:head>
  <title>Outils pour les élèves - topmaths</title>
</svelte:head>

<div
  class="grade-container is-purple
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Outils pour les élèves
  </h1>
  <div class="p-6">
    <MainMenuItem view="student" ref="glossary" color="info">
      Lexique
    </MainMenuItem>
    <MainMenuItem view="student" ref="tuto" color="5e">Tutoriels</MainMenuItem>
    <MainMenuItem view="student" ref="download" color="green">
      Téléchargements
    </MainMenuItem>
  </div>
</div>
