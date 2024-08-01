<script lang="ts">
  import type { TopmathsView } from '../../../types/navigation'
  import ButtonImageHoverInvert from '../../shared/ButtonImageHoverInvert.svelte'

  export let isDisplayed: boolean = true
  export let isActive: boolean
  export let destinationVue: TopmathsView
  export let color: string
  export let imageSrc: string
  export let imageAlt: string
  export let goToView: (event: MouseEvent, vue: TopmathsView) => void

</script>

{#if isDisplayed}
  <li>
    <a href='?v={destinationVue}'>
      <ButtonImageHoverInvert
        {color}
        {isActive}
        {imageSrc}
        {imageAlt}
        on:click={(event) => goToView(event, destinationVue)}
      />
    </a>
  </li>
{/if}
