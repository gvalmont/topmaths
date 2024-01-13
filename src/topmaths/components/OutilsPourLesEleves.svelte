<script lang="ts">
  import GrosBouton from './shared/GrosBouton.svelte'
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
  <div class="p-8 is-fin" style="background-color: #faf5ff;">
    <GrosBouton
      vue='lexique'
      couleur='blue'
      texte='Lexique'
    />
    <GrosBouton
      vue='tutos'
      ref='installation-anki'
      couleur='5e'
      texte='Tutos'
    />
    <GrosBouton
      vue='telechargements'
      couleur='green'
      texte='Téléchargements'
    />
  </div>
</div>
