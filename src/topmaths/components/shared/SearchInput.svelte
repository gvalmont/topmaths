<script lang="ts">
  export let searchString: string
</script>

<input
  class="print-hidden p-1 text-center is-link is-interactive
    md:mb-4
    rounded-sm md-rounded
    text-sm md:text-2xl
    bg-topmaths-canvas"
  type="text"
  aria-describedby="Champ pour rechercher une séquence"
  autocomplete="off"
  placeholder="Recherche"
  bind:value={searchString}
/>
