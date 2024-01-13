<script lang="ts">
  import type { LexiqueItem } from '../../services/types'
  import { tick } from 'svelte'
  import { goVue } from '../../services/outils'
  import { texteRecherche } from '../../services/store'

  export let ligne: LexiqueItem

  async function goHash (event: MouseEvent, hashLocation: string) {
    event.preventDefault()
    texteRecherche.set('')
    await tick()
    const destinationDiv = document.getElementById(hashLocation)
    if (destinationDiv !== null) {
      destinationDiv.scrollIntoView({
        behavior: 'smooth'
      })
    }
  }
</script>

<ul class="m-3 flex flex-row justify-center flex-wrap">
  <li>
    <a href="#top" on:click={event => goHash(event, 'top')}>
      <button class="button is-link is-outlined mt-2 py-0 md:py-1 px-1 md:px-2 rounded">⇧</button>
    </a>
  </li>
  {#each ligne.notionsLiees as notionLiee}
  <li>
    <a href="#{notionLiee.slug}" on:click={event => goHash(event, notionLiee.slug)}>
      <button class="button is-link is-outlined mt-2 ml-2 py-0 md:py-1 px-1 md:px-2 rounded">{notionLiee.titre}</button>
    </a>
  </li>
  {/each}
  {#each ligne.objectifsLies as objectifLie}
  <li>
    <a href="/?v=objectif&ref={objectifLie}" on:click={(event) => goVue(event, 'objectif', objectifLie)}>
      <button class="button is-{objectifLie.slice(0, 1)}e is-outlined mt-2 ml-1 pr-2 py-0 md:py-1 px-1 md:px-2 rounded">
        {objectifLie}&nbsp;<i><img src="topmaths/img/cc0/exit-svgrepo-com.svg" width="14px" alt="icône de sortie" /></i>
      </button>
    </a>
  </li>
  {/each}
</ul>
