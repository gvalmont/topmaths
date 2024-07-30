<script lang="ts">
  import { isTeacherMode } from '../services/store'
  import Storage from '../modules/Storage'
  import GrosBouton from './shared/GrosBouton.svelte'

</script>

<svelte:head>
  <title>Outils pour la classe - topmaths</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1
    class="title text-2xl md:text-4xl font-semibold p-4 is-6e"
  >
    Outils pour la classe
  </h1>
  <div style="background-color: #ebfaf1; border-radius: 0px 0px 50px 50px; ">
    <br />
    <GrosBouton
    vue='mathador'
    couleur='violet'
    texte='Mathador'
    />
    {#if $isTeacherMode}
      <GrosBouton
      vue='progressions'
      couleur='sponsor'
      texte='Progressions'
      />
      <br /><br />
      <div>
        <button
        on:click={() => Storage.setTeacherMode(false)}
          class="button is-green rounded md:rounded-lg py-1 px-4 md:py-2 md:px-6"
        >
          <p>Désactiver le mode enseignant</p>
        </button>
      </div>
    {:else}
      <br /><br />
      <div>
        <button
          on:click={() => Storage.setTeacherMode(true)}
          class="button is-green rounded md:rounded-lg py-1 px-4 md:py-2 md:px-6 is-outlined"
        >
          <p>Activer le mode enseignant</p>
        </button>
      </div>
    {/if}
    <br /><br />
  </div>
</div>
