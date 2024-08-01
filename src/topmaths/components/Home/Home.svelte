<script lang="ts">
  import { onMount } from 'svelte'
  import MainMenuItem from '../shared/MainMenuItem.svelte'

  onMount(() => {
    window.scrollTo({ top: 0 })
  })
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<MainMenuItem
  view='unit'
  color='info-darker'
  text='Séquences'
  imageSrc='topmaths/img/cc0/guest-book-svgrepo-com.svg'
  imageAlt='Livre ouvert'
/>
<MainMenuItem
  view='objectifs'
  color='link'
  text='Objectifs'
  imageSrc='topmaths/img/cc0/study-2-svgrepo-com.svg'
  imageAlt='Personne lisant un livre'
/>
<MainMenuItem
  view='revisions'
  color='sponsor'
  text='Révisions'
  imageSrc='topmaths/img/gvalmont/automatismes-regular.svg'
  imageAlt="Tête avec un engrenage à l'intérieur"
/>
<MainMenuItem
  view='eleves'
  color='purple'
  text='Outils pour<br>les élèves'
  imageSrc='topmaths/img/cc0/backpack-svgrepo-com.svg'
  imageAlt="Sac à dos d'élève"
/>
<MainMenuItem
  view='outils'
  color='green'
  text='Outils pour<br>la classe'
  imageSrc='topmaths/img/cc0/classroom-svgrepo-com.svg'
  imageAlt="Enseignant montrant un tableau face à une classe"
/>
