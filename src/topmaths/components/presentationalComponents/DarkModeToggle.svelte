<script lang="ts">
  export let isDarkMode: boolean
  export let setDarkMode: (value: boolean) => void
</script>

<label
  class="print-hidden swap swap-rotate fixed right-4 z-50
    top-12 md:top-4
    text-amber-500 hover:text-amber-400
    dark:text-amber-400 dark:hover:text-amber-300"
>
  <!-- this hidden checkbox controls the state -->
  <input
    id="hidden-checkbox-for-darkmode"
    type="checkbox"
    class="invisible"
    on:change="{() => setDarkMode(!isDarkMode)}"
  />
  <div class="swap-on"><i class="bx bx-sm bx-sun"></i></div>
  <div class="swap-off"><i class="bx bx-sm bx-moon"></i></div>
</label>
