<script lang="ts">
  import type { ThemeColor } from '../../../types/color'
  import type { View } from '../../../types/navigation'
  import ButtonImage from '../../shared/ButtonImage.svelte'

  export let isDisplayed: boolean = true
  export let isActive: boolean
  export let destinationView: View
  export let color: ThemeColor
  export let imageSrc: string
  export let imageAlt: string
  export let goToView: (event: MouseEvent, view: View) => void

</script>

{#if isDisplayed}
  <li>
    <a href='?v={destinationView}'>
      <ButtonImage
        {color}
        {isActive}
        {imageSrc}
        {imageAlt}
        on:click={(event) => goToView(event, destinationView)}
      />
    </a>
  </li>
{/if}
