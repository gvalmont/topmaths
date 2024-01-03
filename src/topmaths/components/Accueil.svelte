<script lang="ts">
  import { outils } from '../services/outils'
  import { onMount } from 'svelte'

  onMount(() => {
    window.scrollTo({
      top: 0
    })
  })

  function go (vue: string) {
    outils.goVue(vue)
  }
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<div class="container is-max-desktop centre">
  <button on:click={() => go('sequences')} class="button is-large is-info-darker is-outlined p-6">
    <p class="enorme">Séquences</p>
    &nbsp;
    <i class="image is-48x48 is-inline-block">
      <img src="assets/topmaths/img/cc0/guest-book-svgrepo-com.svg" alt="Livre ouvert" />
    </i>
  </button>
  <br />
  <br />
  <button on:click={() => go('objectifs')} class="button is-large is-link is-outlined p-6">
    <p class="enorme">Objectifs</p>
    &nbsp;
    <i class="image is-48x48 is-inline-block">
      <img src="assets/topmaths/img/cc0/study-2-svgrepo-com.svg" alt="Personne lisant un livre" />
    </i>
  </button>
  <br />
  <br />
  <button on:click={() => go('revisions')} class="button is-large is-sponsor is-outlined p-6">
    <p class="enorme">Révisions</p>
    &nbsp;
    <i class="image is-48x48 is-inline-block">
      <img src="assets/topmaths/img/gvalmont/automatismes-regular.svg" alt="Tête avec un engrenage à l'intérieur" />
    </i>
  </button>
  <br />
  <br />
  <button on:click={() => go('eleves')} class="button is-large is-purple is-outlined p-6">
    <p class="enorme">Outils pour<br />les élèves</p>
    &nbsp;
    <i class="image is-48x48 is-inline-block">
      <img src="assets/topmaths/img/cc0/backpack-svgrepo-com.svg" alt="Sac à dos d'élève" />
    </i>
  </button>
  <br />
  <br />
  <button on:click={() => go('outils')} class="button is-large is-green is-outlined p-6">
    <p class="enorme">Outils pour<br />la classe</p>
    &nbsp;
    <i class="image is-48x48 is-inline-block">
      <img src="assets/topmaths/img/cc0/classroom-svgrepo-com.svg" alt="Enseignant montrant un tableau face à une classe" />
    </i>
  </button>
</div>
