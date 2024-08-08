<script lang="ts">
  import type { ThemeColor } from '../../types/color'

  export let imageSrc: string = ''
  export let imageAlt: string = ''
  export let color: ThemeColor
  export let isActive: boolean = false
  export let imageClass: string = 'size-8 md:size-12'

  let isHovered = false
  let isFocused = false
</script>

<button
  class="button is-{color}
    {isHovered || isFocused || isActive ? 'is-active' : ''}
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
    <slot />
  </p>
  {#if imageSrc !== ''}
    <img
      class="{imageClass}"
      src={imageSrc}
      alt={imageAlt}
    />
  {/if}
</button>
