<script lang="ts">
  import type { ThemeColor } from 'src/topmaths/types/color'
  import type { Reference, View } from '../../types/navigation'
  import ButtonImageHoverInvert from './ButtonImageHoverInvert.svelte'

  export let view: View
  export let ref: Reference = ''
  export let color: ThemeColor
  export let text: string
  export let imageSrc: string = ''
  export let imageAlt: string = ''
</script>

<a
  class="block
    mb-5 md:mb-8"
  href='?v={view}{ref !== '' ? `&ref=${ref}` : ''}'
>
  <ButtonImageHoverInvert
    {color}
    {text}
    {imageSrc}
    {imageAlt}
    class="w-[140px] md:w-[260px] button is-{color} is-outlined h-14 md:h-24 rounded md:rounded-lg"
  />
</a>

<style>
</style>
