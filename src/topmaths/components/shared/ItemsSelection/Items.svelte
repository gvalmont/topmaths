<script lang="ts">
  import type { Reference, View } from '../../../types/navigation'
  import type { Item } from './types'

  export let items: Item[]
  export let view: View
  export let goToView: (event: MouseEvent, view: View, reference: Reference) => void
  export let isTitleAcademicPreferred: boolean = false

</script>

{#each items as item}
  <a
    href="/?v={view}&ref={item.reference}"
    on:click={(event) => goToView(event, view, item.reference)}
  >
    <div class="p-1">
      {#if item.number !== undefined}
        {item.number > 0 ? `Séquence ${item.number} : ` : ''}{item.title}
      {:else}
        {item.reference} : {isTitleAcademicPreferred || !item.title ? item.titleAcademic : item.title}
      {/if}
    </div>
  </a>
{/each}
