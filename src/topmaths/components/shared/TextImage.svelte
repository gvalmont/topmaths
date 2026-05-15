<script lang="ts">
  import type { ThemeColor } from '../../types/color'
  import SvgIcon from './SvgIcon.svelte'

  export let imageSrc: string
  export let imageAlt: string
  export let color: ThemeColor

  let isHovered = false
  let isFocused = false

  $: isSvg = imageSrc.toLowerCase().endsWith('.svg')
</script>

<button
  class="{$$props.class} flex flex-row button is-{color}
    {isHovered || isFocused ? 'is-active' : ''}"
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
  <slot />
  {#if isSvg}
    <SvgIcon class="ml-2 size-4 md:size-6" src={imageSrc} alt={imageAlt} />
  {:else}
    <img class="ml-2 size-4 md:size-6" src={imageSrc} alt={imageAlt} />
  {/if}
</button>
