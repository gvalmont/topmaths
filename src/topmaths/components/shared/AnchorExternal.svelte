<script lang="ts">
  export let href: string
</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="is-interactive is-topmaths"
>
  <slot />
  <i class="bx bx-link-external"></i>
</a>
