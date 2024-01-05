<script lang="ts">
  import { onMount } from 'svelte'
  import GrosBouton from './mini-components/GrosBouton.svelte'

  onMount(() => {
    window.scrollTo({
      top: 0
    })
  })
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<div class="pt-7">
  <GrosBouton
    vue='sequences'
    couleur='info-darker'
    texte='Séquences'
    lienImage='topmaths/img/cc0/guest-book-svgrepo-com.svg'
    altImage='Livre ouvert'
  />
  <GrosBouton
    vue='objectifs'
    couleur='link'
    texte='Objectifs'
    lienImage='topmaths/img/cc0/study-2-svgrepo-com.svg'
    altImage='Personne lisant un livre'
  />
  <GrosBouton
    vue='revisions'
    couleur='sponsor'
    texte='Révisions'
    lienImage='topmaths/img/gvalmont/automatismes-regular.svg'
    altImage="Tête avec un engrenage à l'intérieur"
  />
  <GrosBouton
    vue='eleves'
    couleur='purple'
    texte='Outils pour<br>les élèves'
    lienImage='topmaths/img/cc0/backpack-svgrepo-com.svg'
    altImage="Sac à dos d'élève"
  />
  <GrosBouton
    vue='outils'
    couleur='green'
    texte='Outils pour<br>la classe'
    lienImage='topmaths/img/cc0/classroom-svgrepo-com.svg'
    altImage="Enseignant montrant un tableau face à une classe"
  />
</div>
