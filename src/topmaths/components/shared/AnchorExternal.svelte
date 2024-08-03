<script lang="ts">
  export let href: string

</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
>
  <slot />
  <i class='bx bx-link-external' />
</a>

<style lang="scss">
  a {
    color: #0284c7;
    :global(.dark) & {
      color: #0ea5e9;
      &:hover,
      &:focus {
        text-shadow: 0 0 0.7rem #0ea5e9;
      }
    }
  }
</style>
