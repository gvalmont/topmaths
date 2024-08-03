<script lang="ts">
  import { goToView } from '../../services/navigation'
  import type { ReferenceInfo, View } from '../../types/navigation'

  export let view: View
  export let reference: ReferenceInfo

</script>

<button
  on:click={(event) => goToView(event, view, reference)}
>
  <slot />
</button>

<style lang="scss">
  button {
    color: #0284c7;
    :global(.dark) & {
      color: #0ea5e9;
      &:hover,
      &:focus {
        text-shadow: 0 0 0.7rem #0ea5e9;
      }
    }
  }
</style>
