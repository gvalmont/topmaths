<script lang="ts">
  export let href: string

</script>

<a
  {href}
  target="_blank"
  rel="noopener noreferrer"
  class="text-link dark:text-linkdark"
>
  <slot />
  <i class='bx bx-link-external' />
</a>
