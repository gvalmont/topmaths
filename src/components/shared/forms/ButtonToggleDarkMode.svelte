<script lang="ts">
  import { darkMode } from '../../../lib/stores/generalStore'
</script>

<button
  type="button"
  class="text-coopmaths-action dark:text-coopmathsdark-action
          hover:text-coopmaths-action-lightest dark:hover:text-coopmathsdark-action-lightest"
  on:click={() => ($darkMode.isActive = !$darkMode.isActive)}
>
  {#if $darkMode.isActive}
    <i class="bx bx-sm bx-sun"></i>
  {:else}
    <i class="bx bx-sm bx-moon"></i>
  {/if}
</button>
