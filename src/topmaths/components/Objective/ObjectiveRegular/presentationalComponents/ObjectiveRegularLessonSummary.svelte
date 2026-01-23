<script lang="ts">
  import { tick } from 'svelte'
  import type { Objective } from '../../../../types/objective'

  export let objective: Objective
  export let mathaleaRenderDiv: (div: HTMLDivElement, zoom: number) => void
  export let loadIep: () => void

  let lessonImages: string[] = []
  let lessonSummaryHTML: string = ''
  let lessonSummaryImage: string = ''
  let lessonSummaryImageAlt: string = ''
  let lessonSummaryInstrumenpoche: string = ''

  let lessonSummaryDiv: HTMLDivElement
  $: if (lessonSummaryDiv)
    tick().then(() => mathaleaRenderDiv(lessonSummaryDiv, -1))

  $: if (objective) {
    lessonImages = objective.lessonImages
    lessonSummaryHTML = objective.lessonSummaryHTML
    lessonSummaryImage = objective.lessonSummaryImage
    lessonSummaryImageAlt = objective.lessonSummaryImageAlt
    lessonSummaryInstrumenpoche = objective.lessonSummaryInstrumenpoche
    if (lessonSummaryInstrumenpoche) loadIep()
    if (lessonSummaryDiv) lessonSummaryDiv.innerHTML = lessonSummaryHTML
  }
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Cours écrit
</h2>

{#if lessonImages.length > 0}
  <div class="flex flex-col items-center py-6">
    {#each lessonImages as image, i}
      <img src={image} alt="Résumé de cours {i + 1}" class="w-full max-w-3xl" />
    {/each}
  </div>
  <p class="pb-6">
    <a
      href="https://www.canva.com/design/DAGsRWDsi8k/ow8Y3IaBgW60cCecoe8AjQ/view"
      target="_blank"
      rel="noopener noreferrer"
      class="is-interactive is-topmaths"
    >
      Cours
    </a>
    de
    <a
      href="https://x.com/ClaireBruneau1"
      target="_blank"
      rel="noopener noreferrer"
      class="is-interactive is-topmaths"
    >
      Claire Bruneau
    </a>
  </p>
{:else}
  <div class="p-6 flex flex-col items-center">
    <div bind:this={lessonSummaryDiv}></div>
    {#if lessonSummaryImage}
      <img src={lessonSummaryImage} alt={lessonSummaryImageAlt} />
    {/if}
    {#if lessonSummaryInstrumenpoche}
      <div class="text-center">
        <div class="inline-block" id="divIEP"></div>
      </div>
    {/if}
  </div>
{/if}
