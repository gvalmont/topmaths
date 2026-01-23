<script lang="ts">
  import { curriculum } from '../../services/store'
  import { createEventDispatcher } from 'svelte'

  export let selectedTerm: number

  const dispatch = createEventDispatcher()
  const terms = Object.keys($curriculum.tout.unitsPerTerm)
    .map(Number)
    .map((termIndex) => termIndex + 1)

  const classList = `button is-link is-light my-4 mx-1 rounded-3xl
    py-1 md:py-2
    text-base md:text-2xl
    px-4 md:px-6`
</script>

<div
  class="print-hidden is-flex is-justify-content-center overflow-auto mb-3 md:mb-8"
>
  <button
    class={classList}
    class:is-active={selectedTerm === 0}
    on:click={() => dispatch('change', 0)}
  >
    Période
  </button>
  {#each terms as term}
    <button
      class={classList}
      class:is-active={selectedTerm === term}
      on:click={() => dispatch('change', term)}
    >
      {term}
    </button>
  {/each}
</div>
