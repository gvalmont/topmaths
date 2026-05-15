<script lang="ts">
  import type { ThemeColor } from '../../types/color'
  import SvgIcon from './SvgIcon.svelte'

  export let imageSrc: string = ''
  export let imageAlt: string = ''
  export let color: ThemeColor
  export let isActive: boolean = false
  export let imageClass: string = 'size-8 md:size-12'
  export let textClass: string = 'text-sm md:text-2xl'

  let isHovered = false
  let isFocused = false
  $: isSvg = imageSrc.toLowerCase().endsWith('.svg')
  $: normalizedImageSrc =
    imageSrc && !/^(?:[a-z][a-z\d+\-.]*:|\/|#)/i.test(imageSrc)
      ? `/${imageSrc}`
      : imageSrc
</script>

<button
  class="button is-{color} justify-evenly
    {isHovered || isFocused || isActive ? 'is-active' : ''}
    {$$props.class}"
  disabled={$$props.disabled}
  on:mouseenter={() => {
    isHovered = true
  }}
  on:mouseleave={() => {
    isHovered = false
  }}
  on:focus={() => {
    isFocused = true
  }}
  on:blur={() => {
    isFocused = false
  }}
  on:click
>
  <p
    class="shrink-0
      {textClass}"
  >
    <slot />
  </p>
  {#if imageSrc !== ''}
    {#if isSvg}
      <SvgIcon src={normalizedImageSrc} alt={imageAlt} class={imageClass} />
    {:else}
      <img class={imageClass} src={normalizedImageSrc} alt={imageAlt} />
    {/if}
  {/if}
</button>
