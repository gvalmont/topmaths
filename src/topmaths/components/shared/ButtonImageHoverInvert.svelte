<script lang="ts">
  import type { ThemeColor } from '../../types/color'
  import Button from './Button.svelte'
  import ImageFiltered from './ImageFiltered.svelte'

  export let color: ThemeColor
  export let text: string = ''
  export let isActive: boolean = false
  export let imageSrc: string
  export let imageAlt: string

  let isHovered = false
  let isFocused = false
</script>

<Button
  class="is-{color}
    {isHovered || isFocused || isActive ? 'is-active' : ''}
    px-3 md:px-4
    py-2 md:py-3
    {$$props.class}"
  disabled={$$props.disabled}
  on:mouseenter={() => { isHovered = true }}
  on:mouseleave={() => { isHovered = false }}
  on:focus={() => { isFocused = true }}
  on:blur={() => { isFocused = false }}
  on:click
>
  <p
    class="shrink-0
      text-sm md:text-2xl
      {imageSrc !== '' ? 'w-2/3' : 'w-full'}"
  >
    <!-- eslint-disable-next-line svelte/no-at-html-tags -->
    {@html text}
  </p>
  <ImageFiltered
    color={isHovered || isFocused || isActive ? 'white' : color}
    src={imageSrc}
    alt={imageAlt}
  />
</Button>
