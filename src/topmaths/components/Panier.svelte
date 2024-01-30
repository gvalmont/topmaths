<script lang="ts">
  import type { PanierItem } from '../services/types'
  import { environment } from '../services/environment'
  import { lancerExercices } from '../services/modale'
  import { storage } from '../services/storage'
  import { panierDispo, vue } from '../services/store'
  import { copierLien } from '../services/outils'
  import { getParamsFromUrl, updateUrlFromParams } from '../services/mathalea'

  let lien = ''
  let references = [] as string[]
  let panier = [] as PanierItem[]
  MAJLien()

  function retirerDuPanier (panierItem: PanierItem) {
    const panierTemp = storage.get('panier') as PanierItem[]
    const nouveauPanier = panierTemp.filter(
      (item) => item.id !== panierItem.id
    )
    storage.set('panier', nouveauPanier)
    MAJLien()
  }

  function viderLePanier () {
    storage.set('panier', [])
    panierDispo.set(false)
    vue.set('accueil')
  }

  function MAJLien () {
    lien = environment.baseUrl + environment.V3
    references = []
    panier = storage.get('panier') as PanierItem[]
    for (const panierItem of panier) {
      if (panierItem !== null && panierItem !== undefined) {
        if (panierItem.slug.slice(0, 4) !== 'http' && panierItem.slug !== '') {
          lien = lien.concat(panierItem.slug, '&i=0&')
          references.push(panierItem.reference)
        }
      }
    }
    lien = lien.concat('v=eleve')
  }
</script>

<svelte:head>
  <title>topmaths.fr - Panier</title>
</svelte:head>

<div class="w-screen max-w-screen-lg">
  <h1
    class="title text-2xl md:text-4xl font-semibold p-4 text-white"
    style="color: white; background-color: #a930b8; border-radius: 50px 0px 50px 0px"
  >
    Panier
  </h1>
  <h3 class="title is-2 is-inline-block is-fuchsia p-6 md:p-8">
    <button class="mx-2 md:mx-4" on:click={() => copierLien(lien, false)}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg" alt="Documents copiés" />
      </i>
    </button>
    <button class="mx-2 md:mx-4" on:click={() => lancerExercices(lien)}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/fullscreen-svgrepo-com.svg" alt="Lancer en plein écran" />
      </i>
    </button>
    <button class="mx-2 md:mx-4" on:click={() => viderLePanier()}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/cart-remove-svgrepo-com.svg" alt="Caddie avec une crois à l'intérieur" />
      </i>
    </button>
    <button
      class="mx-2 md:mx-4" on:click={() => {
        const params = getParamsFromUrl(lien)
        updateUrlFromParams('latex', params)
      }}
    >
    <i>
      <img class="size-12 md:size-16" src="/topmaths/img/cc0/printing-document-svgrepo-com.svg" alt="Imprimante" />
    </i>
    </button>
  </h3>
  <ul>
    {#each panier as panierItem}
      <li class="is-size-5">
        {#if panierItem !== null && panierItem !== undefined}
        <div class="is-{panierItem.objectif.slice(0, 1)}e">
          <button>
            <span>{panierItem.reference}</span>
            <span class="is-size-6">
              {panierItem.objectif}{panierItem.description ===
              "Lancer l'exercice"
                ? ''
                : ' - ' + panierItem.description}</span
            >
            &nbsp;
            <button on:click={() => retirerDuPanier(panierItem)}>
              <i>
                <img class="size-4 md:size-6" src="/topmaths/img/cc0/cart-minus-svgrepo-com.svg" alt="Caddie avec un signe - à l'intérieur" />
              </i>
            </button>
          </button>
        </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
