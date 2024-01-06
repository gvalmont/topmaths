<script lang="ts">
  import GrosBouton from './mini-components/GrosBouton.svelte'
</script>

<svelte:head>
  <title>Outils pour les élèves - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1
    style="border-radius: 50px 50px 0px 0px; padding: 5px 50px 5px 50px; margin-bottom: 0px; background-color: #9333ea; color: white; font-size: xx-large; font-weight: 600;"
  >
    Outils pour les élèves
  </h1>
  <div style="background-color: #faf5ff; border-radius: 0px 0px 50px 50px; ">
    <br />
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
    <br />
  </div>
</div>
