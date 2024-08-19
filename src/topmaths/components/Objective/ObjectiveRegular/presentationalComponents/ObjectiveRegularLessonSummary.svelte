<script lang="ts">
  import { onMount } from 'svelte'

  export let lessonSummaryHTML: string
  export let lessonSummaryImage: string
  export let lessonSummaryImageAlt: string
  export let lessonSummaryInstrumenpoche: string
  export let mathaleaRenderDiv: (div: HTMLDivElement, zoom: number) => void
  export let loadIep: () => void

  let lessonSummaryDiv: HTMLDivElement
  $: if (lessonSummaryDiv) mathaleaRenderDiv(lessonSummaryDiv, -1)

  onMount(() => {
    if (lessonSummaryInstrumenpoche) loadIep()
    lessonSummaryDiv.innerHTML = lessonSummaryHTML
  })
</script>

<h2 class="subtitle
  text-xl md:text-3xl"
>
  Résumé du cours
</h2>
<div class="p-6">
  <div bind:this={lessonSummaryDiv} />
  {#if lessonSummaryImage}
    <img
      src={lessonSummaryImage}
      alt={lessonSummaryImageAlt}
    />
  {/if}
  {#if lessonSummaryInstrumenpoche}
    <div class="text-center">
      <div class="inline-block" id="divIEP"></div>
    </div>
  {/if}
</div>
