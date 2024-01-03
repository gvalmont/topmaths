<script lang="ts">
  import type { Couleur } from 'src/topmaths/services/types'
  import { goVue } from '../../services/outils'

  export let vue: string
  // eslint-disable-next-line no-undef-init
  export let ref: string | undefined = undefined
  export let couleur: Couleur
  export let texte: string
  export let lienImage: string = ''
  export let altImage: string = ''
</script>

<a class="block py-1" href='?v={vue}{ref !== undefined ? '&ref=' + ref : ''}'>
  <button on:click={(event) => goVue(event, vue, ref)} class="button is-large is-{couleur} is-outlined p-6">
    <p class="enorme" bind:innerHTML={texte} contenteditable="false"></p>
    {#if lienImage !== ''}
      &nbsp;
      <i class="image is-48x48 is-inline-block">
        <img src={lienImage} alt={altImage} />
      </i>
    {/if}
  </button>
</a>
