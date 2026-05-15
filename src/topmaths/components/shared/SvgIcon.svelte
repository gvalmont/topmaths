<script lang="ts">
  export let src: string = ''
  export let alt: string = ''

  let className = ''
  export { className as class }

  $: normalizedSrc =
    src && !/^(?:[a-z][a-z\d+\-.]*:|\/|#)/i.test(src) ? `/${src}` : src
  $: maskImage = `url("${normalizedSrc}")`
</script>

<span
  class="inline-block shrink-0 bg-current {className}"
  style:--icon-url={maskImage}
  role={alt ? 'img' : undefined}
  aria-label={alt || undefined}
  aria-hidden={alt ? undefined : 'true'}
></span>

<style>
  span {
    -webkit-mask: var(--icon-url) center / contain no-repeat;
    mask: var(--icon-url) center / contain no-repeat;
  }
</style>
