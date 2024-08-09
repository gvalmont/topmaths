<script lang="ts">
  import type { ThemeColor } from 'src/topmaths/types/color'
  import type { Reference, View } from '../../types/navigation'
  import { goToView } from '../../services/navigation'
  import ButtonImage from './ButtonImage.svelte'

  export let view: View
  export let ref: Reference = ''
  export let ref2: string = ''
  export let color: ThemeColor
  export let imageSrc: string = ''
  export let imageAlt: string = ''

  let href: string
  $: {
    let newHref = `?v=${view}`
    if (ref !== '') newHref += `&ref=${ref}`
    if (ref2 !== '') newHref += `&ref2=${ref2}`
    href = newHref
  }
</script>

<div class="mb-5 md:mb-8">
  <a {href}>
    <ButtonImage
      {color}
      {imageSrc}
      {imageAlt}
      class="inline-flex border
        px-3 md:px-4
        py-2 md:py-3
        w-[140px] md:w-[260px]
        h-14 md:h-24
        rounded md:rounded-lg"
      textClass="w-2/3 text-sm md:text-2xl"
      on:click={(event) => goToView(event, view, ref, ref2)}
    >
      <slot />
    </ButtonImage>
  </a>
</div>

<style>
</style>
