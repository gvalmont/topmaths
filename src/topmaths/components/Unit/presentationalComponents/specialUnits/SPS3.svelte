<script lang="ts">
  import Exercise from '../../../Exercise/Exercise.svelte'

  const seances = [
    "Séquences d'instructions",
    'Boucles simples',
    'Boucles à motif',
    'Boucles imbriquées',
    'Conditions',
    'Variables',
    'Boucles conditionnelles',
    'Procédures',
  ]
</script>

<svelte:head>
  <title>SPS3 : Jeux</title>
</svelte:head>

<div
  class="grade-container is-tout
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Jeux
  </h1>
  <h2 class="subtitle text-xl md:text-3xl p-3">SquarO</h2>
  <Exercise isMd={false} url="https://topmaths.fr/?uuid=e2024&id=EN-SquarO&i=1"
  ></Exercise>
  <h2 class="subtitle text-xl md:text-3xl p-3">Shikaku</h2>
  <Exercise isMd={false} url="https://topmaths.fr/?uuid=ccf19&id=EN-Shikaku&i=1"
  ></Exercise>
</div>
