<script lang="ts">
  import { outils } from '../services/outils'
</script>

<svelte:head>
  <title>Outils pour les élèves - topmaths</title>
</svelte:head>

<div class="container is-max-desktop centre">
  <h1
    style="border-radius: 50px 50px 0px 0px; padding: 5px 50px 5px 50px; margin-bottom: 0px; background-color: #9333ea; color: white; font-size: xx-large; font-weight: 600;"
  >
    Outils pour les élèves
  </h1>
  <div style="background-color: #faf5ff; border-radius: 0px 0px 50px 50px; ">
    <div>
      <br /><br />
      <button
        on:click={() => outils.goVue('lexique')}
        class="button is-large is-blue is-outlined p-6"
      >
        <p class="enorme">Lexique</p>
      </button>
    </div>
    <div>
      <br /><br />
      <a
        href="/?v=tutos&ref=installation-anki"
        on:click={(event) => outils.go(event, 'tutos', 'installation-anki')}
      >
        <button
          class="button is-large is-5e is-outlined p-6"
        >
          <p class="enorme">Tutos</p>
        </button>
      </a>
    </div>
    <div>
      <br /><br />
      <button
        on:click={() => outils.goVue('telechargements')}
        class="button is-large is-green is-outlined p-6"
      >
        <p class="enorme"><span style="text-align: center; white-space: nowrap;">Téléchargements</span></p>
      </button>
    </div>
    <br /><br />
  </div>
</div>
