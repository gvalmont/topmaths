<script lang="ts">
  import MainMenuItem from './shared/MainMenuItem.svelte'
</script>

<svelte:head>
  <title>Outils pour les élèves - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1
    class="title text-2xl md:text-4xl font-semibold p-4 is-4e"
  >
    Outils pour les élèves
  </h1>
  <div class="p-8 is-end" style="background-color: #faf5ff;">
    <MainMenuItem
      view='lexique'
      color='blue'
    >
      Lexique
    </MainMenuItem>
    <MainMenuItem
      view='tutos'
      ref='installation-anki'
      color='5e'
    >
      Tutoriels
    </MainMenuItem>
    <MainMenuItem
      view='telechargements'
      color='green'
    >
      Téléchargements
    </MainMenuItem>
  </div>
</div>
