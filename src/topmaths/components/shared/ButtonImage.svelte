<script lang="ts">
  import type { ThemeColor } from '../../types/color'

  export let imageSrc: string = ''
  export let imageAlt: string = ''
  export let color: ThemeColor
  export let isActive: boolean = false
  export let imageClass: string = 'size-8 md:size-12'
  export let textClass: string = 'text-sm md:text-2xl'

  let isHovered = false
  let isFocused = false
  $: isSvg = imageSrc.toLowerCase().endsWith('.svg')
  $: maskImage = `url("${imageSrc}")`
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
      <span
        class="svg-icon {imageClass}"
        style:--icon-url={maskImage}
        role={imageAlt ? 'img' : undefined}
        aria-label={imageAlt || undefined}
        aria-hidden={imageAlt ? undefined : 'true'}
      ></span>
    {:else}
      <img class={imageClass} src={imageSrc} alt={imageAlt} />
    {/if}
  {/if}
</button>

<style>
  .svg-icon {
    display: inline-block;
    flex-shrink: 0;
    background-color: currentColor;
    -webkit-mask: var(--icon-url) center / contain no-repeat;
    mask: var(--icon-url) center / contain no-repeat;
  }
</style>
