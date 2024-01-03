<script lang="ts">
  import { modeEnseignant } from '../services/store'
  import { storage } from '../services/storage'
  import GrosBouton from './mini-components/GrosBouton.svelte'

  function activerModeEnseignant () {
    storage.activerModeEnseignant()
  }

  function desactiverModeEnseignant () {
    storage.desactiverModeEnseignant()
  }

</script>

<svelte:head>
  <title>Outils pour la classe - topmaths</title>
</svelte:head>

<div class="container is-max-desktop centre">
  <h1
    style="border-radius: 50px 50px 0px 0px; padding: 5px 50px 5px 50px; margin-bottom: 0px; background-color: #16A34A; color: white; font-size: xx-large; font-weight: 600;"
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
    {#if $modeEnseignant}
      <GrosBouton
      vue='progressions'
      couleur='sponsor'
      texte='Progressions'
      />
      <br /><br />
      <div>
        <button
          on:click={() => desactiverModeEnseignant()}
          class="button is-green"
        >
          <p>Désactiver le mode enseignant</p>
        </button>
      </div>
    {:else}
      <br /><br />
      <div>
        <button
          on:click={() => activerModeEnseignant()}
          class="button is-green is-outlined"
        >
          <p>Activer le mode enseignant</p>
        </button>
      </div>
    {/if}
    <br /><br />
  </div>
</div>
