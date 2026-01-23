<script lang="ts">
  import Tooltip from './Tooltip.svelte'

  export let dropdownText: string
  export let imgSrc: string
  export let imgAlt: string
</script>

<Tooltip {dropdownText}>
  <img
    class="is-icon
      size-4 md:size-6"
    src={imgSrc}
    alt={imgAlt}
  />
</Tooltip>
