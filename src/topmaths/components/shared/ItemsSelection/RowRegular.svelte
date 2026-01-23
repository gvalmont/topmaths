<script lang="ts">
  import type { Item } from './types'
  import type { Reference, View } from '../../../types/navigation'
  import { isUnit } from '../../../types/unit'
  import { getTitle } from '../../../services/string'
  import { isSpecialUnit } from '../../../types/specialUnit'

  export let item: Item
  export let view: View
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: Reference,
  ) => void
</script>

<a
  class="is-interactive"
  href="/?v={view}&ref={item.reference}"
  on:click={(event) => goToView(event, view, item.reference)}
>
  <div class="p-1">
    {#if isUnit(item) || isSpecialUnit(item)}
      {item.number > 0 ? `Séquence ${item.number} : ` : ''}{item.title}
    {:else}
      {item.reference} : {getTitle(item)}
    {/if}
  </div>
</a>
