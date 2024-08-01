<script lang="ts">
  import type { ThemeColor } from 'src/topmaths/types/color'
  import { goToView } from '../../services/navigation'
  import type { Reference, View } from '../../types/navigation'

  export let view: View
  // eslint-disable-next-line no-undef-init
  export let ref: Reference
  export let couleur: ThemeColor
  export let texte: string
  export let lienImage: string = ''
  export let altImage: string = ''
</script>

<a
  class="block mb-5 md:mb-8"
  href='?v={view}{ref !== undefined ? '&ref=' + ref : ''}'
>
  <button
    on:click={(event) => goToView(event, view, ref)}
    class="w-[140px] md:w-[260px] button is-{couleur} is-outlined h-14 md:h-24 rounded md:rounded-lg"
  >
    <p class="text-sm md:text-2xl {lienImage !== '' ? 'w-2/3' : 'w-full'} shrink-0" bind:innerHTML={texte} contenteditable="false"></p>
    {#if lienImage !== ''}
      <i class="shrink-0 size-7 md:size-10">
        <img src={lienImage} alt={altImage} />
      </i>
    {/if}
  </button>
</a>

<style>
</style>
