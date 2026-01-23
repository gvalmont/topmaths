<script lang="ts">
  import { onMount, tick } from 'svelte'
  import type { GlossaryUniteItem } from '../../../../types/glossary'
  import Collapsible from '../../../shared/Collapsible.svelte'
  import StudentGlossaryItemRelatedItems from './StudentGlossaryItemRelatedItems.svelte'

  export let item: GlossaryUniteItem
  export let mathaleaRenderDiv: (element: HTMLElement, zoom: number) => void
  export let goHash: (event: MouseEvent, hash: string) => void
  let mainPanel: HTMLElement

  let currentWindowWidth: number = document.body.clientWidth
  onMount(async () => {
    await tick()
    mathaleaRenderDiv(mainPanel, -1)
  })
</script>

<svelte:window bind:innerWidth={currentWindowWidth} />

<li
  id={item.reference}
  class="m-6 p-6
    rounded-lg md:rounded-xl
    shadow-3 dark:border
    bg-topmaths-canvas"
>
  <a class="is-interactive" href="#{item.reference}">
    <h3 class="font-semibold">
      {item.title}
    </h3>
  </a>
  <div class="flex flex-row">
    <div bind:this={mainPanel} class="m-3">
      <div bind:innerHTML={item.content} contenteditable="false"></div>
      {#if item.examples.length > 0}
        <Collapsible>
          <h2 slot="header">
            Exemple{item.examples.length > 1 ? 's' : ''}
          </h2>
          <ul slot="content">
            {#each item.examples as exemple, i}
              <li
                bind:innerHTML={exemple}
                contenteditable="false"
                class="border-info-200
                  {i > 0 ? 'border-t-2' : ''}"
              ></li>
            {/each}
          </ul>
        </Collapsible>
      {/if}
      {#if item.comments.length > 0}
        <Collapsible>
          <h2 slot="header">
            Remarque{item.comments.length > 1 ? 's' : ''}
          </h2>
          <ul slot="content">
            {#each item.comments as comment, i}
              <li
                bind:innerHTML={comment}
                contenteditable="false"
                class="border-sky-200
                {i > 0 ? 'border-t-2' : ''}"
              ></li>
            {/each}
          </ul>
        </Collapsible>
      {/if}
      {#if currentWindowWidth >= 768}
        <StudentGlossaryItemRelatedItems {item} {goHash} />
      {/if}
    </div>
    <div class="m-3 w-[140px] md:w-[200px] shrink-0">
      {#if item.includesImage}
        <img
          src="topmaths/img/lexique/{item.reference}.png"
          alt="Représentation de : {item.title}"
          class="w-full"
        />
      {/if}
    </div>
  </div>
  {#if currentWindowWidth < 768}
    <StudentGlossaryItemRelatedItems {item} {goHash} />
  {/if}
</li>

<style>
  li {
    padding-top: 5px;
    padding-bottom: 5px;
    list-style: none;
  }
</style>
