<script lang="ts">
  import { onMount } from 'svelte'
  import MainMenuItem from '../shared/MainMenuItem.svelte'

  onMount(() => {
    window.scrollTo({ top: 0 })
  })
</script>

<svelte:head>
  <title>Topmaths - Les maths au Top !</title>
</svelte:head>

<div class="w-full max-w-screen-lg">
  <MainMenuItem
    view='unit'
    color='info-darker'
    imageSrc='topmaths/img/cc0/guest-book-svgrepo-com.svg'
    imageAlt='Livre ouvert'
  >
    Séquences
  </MainMenuItem>
  <MainMenuItem
    view='objective'
    color='link'
    imageSrc='topmaths/img/cc0/study-2-svgrepo-com.svg'
    imageAlt='Personne lisant un livre'
  >
    Objectifs
  </MainMenuItem>
  <MainMenuItem
    view='practice'
    color='sponsor'
    imageSrc='topmaths/img/gvalmont/automatismes-regular.svg'
    imageAlt="Tête avec un engrenage à l'intérieur"
  >
    Révisions
  </MainMenuItem>
  <MainMenuItem
    view='student'
    color='purple'
    imageSrc='topmaths/img/cc0/backpack-svgrepo-com.svg'
    imageAlt="Sac à dos d'élève"
  >
    Outils pour<br>
    les élèves
  </MainMenuItem>
  <MainMenuItem
    view='classroom'
    color='green'
    imageSrc='topmaths/img/cc0/classroom-svgrepo-com.svg'
    imageAlt="Enseignant montrant un tableau face à une classe"
  >
    Outils pour<br>
    la classe
  </MainMenuItem>
</div>
