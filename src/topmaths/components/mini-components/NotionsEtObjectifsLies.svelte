<script lang="ts">
  import type { LexiqueItem } from '../../services/types'
  import { tick } from 'svelte'
  import { outils } from '../../services/outils'
  import { texteRecherche } from '../../services/store'

  export let ligne: LexiqueItem

  async function goHash (event: any, hashLocation: string) {
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

<div class="m-3">
  <a href="#top" on:click={event => goHash(event, 'top')}>
    <button class="button is-link is-outlined mt-2 p-2" style="font-size: 0.85rem; margin-right: -0.25rem;">⇧</button>
  </a>
  {#each ligne.notionsLiees as notionLiee}
  <a href="#{notionLiee.slug}" on:click={event => goHash(event, notionLiee.slug)}>
    <button class="button is-link is-outlined mt-2 ml-2" style="font-size: 0.85rem;">{notionLiee.titre}</button>
  </a>
  {/each}
  {#each ligne.objectifsLies as objectifLie}
  <a href="/?v=objectif&ref={objectifLie}" on:click={(event) => outils.go(event, 'objectif', objectifLie)}>
    <button class="button is-{objectifLie.slice(0, 1)}e is-outlined mt-2 ml-1 pr-2" style="font-size: 0.85rem;">
      {objectifLie}&nbsp;<i><img src="assets/topmaths/img/cc0/exit-svgrepo-com.svg" width="14px" alt="icône de sortie" /></i>
    </button>
  </a>
  {/each}
</div>
