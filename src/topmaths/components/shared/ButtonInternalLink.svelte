<script lang="ts">
  import { goToView } from '../../services/navigation'
  import type { ReferenceInfo, TopmathsView } from '../../types/navigation'

  export let view: TopmathsView
  export let reference: ReferenceInfo

</script>

<button
  class="text-link dark:text-linkdark"
  on:click={(event) => goToView(event, view, reference)}
>
  <slot />
</button>
