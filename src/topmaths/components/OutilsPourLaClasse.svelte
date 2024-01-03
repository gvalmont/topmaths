<script lang="ts">
  import { modeEnseignant } from '../services/store'
  import { outils } from '../services/outils'
  import { storage } from '../services/storage'

  function activerModeEnseignant () {
    storage.activerModeEnseignant()
  }

  function desactiverModeEnseignant () {
    storage.desactiverModeEnseignant()
  }

  function go (outil: string) {
    outils.goVue(outil)
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
    <div>
      <br /><br />
      <button
        on:click={() => go('mathador')}
        class="button is-large is-violet is-outlined p-6"
      >
        <p class="enorme">Mathador</p>
      </button>
    </div>
    {#if $modeEnseignant}
      <!-- <div>
        <br /><br />
        <button
          on:click={() => go('generateur-de-portraits')}
          class="button is-large is-link is-outlined p-4"
        >
          <span>Générateur de portraits de monstres</span>
        </button>
      </div> -->
      <div>
        <br /><br />
        <button
          on:click={() => go('progressions')}
          class="button is-large is-sponsor is-outlined p-6"
        >
        <p class="enorme">Progressions</p>
        </button>
      </div>
      <br /><br /><br /><br />
      <div>
        <button
          on:click={() => desactiverModeEnseignant()}
          class="button is-green"
        >
          <p>Désactiver le mode enseignant</p>
        </button>
      </div>
    {:else}
      <br /><br /><br /><br />
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
