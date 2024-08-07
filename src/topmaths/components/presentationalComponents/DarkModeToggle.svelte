<script lang="ts">
  export let isDarkMode: boolean | undefined
</script>

<label
  class="swap swap-rotate fixed right-4 top-4 z-50
    text-warning hover:text-warning-500
    dark:text-warning-500 dark:hover:text-warning-400"
>
  <!-- this hidden checkbox controls the state -->
  <input
    id="hidden-checkbox-for-darkmode"
    type="checkbox"
    class="invisible"
    bind:checked={isDarkMode}
  />
  <div class="swap-on"><i class="bx bx-sm bx-sun" /></div>
  <div class="swap-off"><i class="bx bx-sm bx-moon" /></div>
</label>
