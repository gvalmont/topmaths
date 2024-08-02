<script lang="ts">
  import type { ThemeColor } from 'src/topmaths/types/color'
  import type { Reference, View } from '../../types/navigation'
  import { goToView } from '../../services/navigation'
  import ButtonImage from './ButtonImage.svelte'

  export let view: View
  export let ref: Reference = ''
  export let color: ThemeColor
  export let imageSrc: string = ''
  export let imageAlt: string = ''
</script>

<a
  class="block
    mb-5 md:mb-8"
  href='?v={view}{ref !== '' ? `&ref=${ref}` : ''}'
>
  <ButtonImage
    {color}
    {imageSrc}
    {imageAlt}
    class="w-[140px] inline-flex md:w-[260px] h-14 md:h-24 rounded md:rounded-lg border"
    on:click={(event) => goToView(event, view, ref)}
  >
    <slot />
  </ButtonImage>
</a>

<style>
</style>
