<script lang="ts">
  import GrosBouton from './shared/MainMenuItem.svelte'
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
  <div class="p-8 rounded-b-5xl" style="background-color: #faf5ff;">
    <GrosBouton
      view='lexique'
      color='blue'
      text='Lexique'
    />
    <GrosBouton
      view='tutos'
      ref='installation-anki'
      color='5e'
      text='Tutos'
    />
    <GrosBouton
      view='telechargements'
      color='green'
      text='Téléchargements'
    />
  </div>
</div>
