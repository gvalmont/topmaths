<script lang="ts">
  export let isPersonalMode: boolean
  export let setPersonalMode: (isPersonalMode: boolean) => void
</script>

<div class="has-text-centered">
  <button
    class="button"
    class:is-success={!isPersonalMode}
    class:is-danger={isPersonalMode}
    on:click={() => setPersonalMode(!isPersonalMode)}
  >
    {isPersonalMode ? 'Désactiver le mode perso' : 'Activer le mode perso'}
  </button>
</div>
