<script lang="ts">
  import Tooltip from './Tooltip.svelte'
  import SvgIcon from './SvgIcon.svelte'

  export let dropdownText: string
  export let imgSrc: string
  export let imgAlt: string
</script>

<Tooltip {dropdownText}>
  <SvgIcon class="size-4 md:size-6" src={imgSrc} alt={imgAlt} />
</Tooltip>
