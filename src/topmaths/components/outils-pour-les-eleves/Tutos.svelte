<script lang="ts">
  import { reference } from '../../services/store'
  import { goVue } from '../../services/outils'
  import InstallationAnki from './tutos/InstallationAnki.svelte'
</script>

<svelte:head>
  <title>Tutos - topmaths</title>
</svelte:head>

{#if $reference === ''}
  <div class="container is-max-desktop centre">
    <h1
      style="border-radius: 50px 50px 0px 0px; padding: 5px 50px 5px 50px; margin-bottom: 0px; background-color: #9333ea; color: white; font-size: xx-large; font-weight: 600;"
    >
      Tutos
    </h1>
    <div style="background-color: #faf5ff; border-radius: 0px 0px 50px 50px; ">
      <div>
        <br /><br />
        <a
          href="/?v=tutos&ref=installation-anki"
          on:click={(event) => goVue(event, 'tutos', 'installation-anki')}
        >
          <button class="button is-large is-5e is-outlined p-6">
            <p class="enorme">Comment installer Anki</p>
          </button>
        </a>
      </div>
    </div>
  </div>
{:else}
  {#if $reference === 'installation-anki'}
    <InstallationAnki />
  {/if}
{/if}
