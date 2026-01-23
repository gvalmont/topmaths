<script lang="ts">
  import { goToView } from '../../services/navigation'
  import type { ReferenceInfo, View } from '../../types/navigation'

  export let view: View
  export let reference: ReferenceInfo
</script>

<button
  on:click={(event) => goToView(event, view, reference)}
  class="is-interactive is-topmaths"
>
  <slot />
</button>
