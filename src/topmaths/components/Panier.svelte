<script lang="ts">
  import type { PanierItem } from '../services/types'
  import IconeTooltipSimple from './mini-components/IconeTooltipSimple.svelte'
  import { environment } from '../services/environment'
  import { ouvrirModaleExercices } from '../services/modale'
  import { storage } from '../services/storage'
  import { panierDispo } from '../services/store'
  import { copierLien, outils } from '../services/outils'

  let lien = ''
  let title = ''
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
    outils.goVue('accueil')
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

<div class="container is-max-desktop centre" id="'top'">
  <h1
    class="title is-2 p-5"
    style="color: white; background-color: #a930b8; border-radius: 50px 0px 50px 0px"
  >
    Panier
  </h1>
  <h3 class="title is-2 is-inline-block is-fuchsia">
    <button on:click={() => copierLien(lien, false)}>
      <IconeTooltipSimple
        size={5}
        urlBouton="/assets/topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg"
        texteAlternatif="Documents copiés"
      />
    </button>
    &nbsp;
    <button on:click={() => ouvrirModaleExercices(lien)}>
      <IconeTooltipSimple
        size={5}
        urlBouton="/assets/topmaths/img/cc0/fullscreen-svgrepo-com.svg"
        texteAlternatif="Lancer en plein écran"
      />
    </button>
    &nbsp;
    <button on:click={() => viderLePanier()}>
      <IconeTooltipSimple
        size={5}
        urlBouton="/assets/topmaths/img/cc0/cart-remove-svgrepo-com.svg"
        texteAlternatif="Caddie avec une crois à l'intérieur"
      />
    </button>
    &nbsp;
    <!-- <ButtonOverleaf {lien} size={5} style="Classique" {title} {references} /> -->
  </h3>
  <br />
  <input
    class="p-1"
    style="text-align:center;"
    type="text"
    aria-describedby="Titre du pdf"
    autocomplete="off"
    placeholder="Titre du pdf"
    bind:value={title}
    on:input
  />
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
              <IconeTooltipSimple
                urlBouton="/assets/topmaths/img/cc0/cart-minus-svgrepo-com.svg"
                texteAlternatif="Caddie avec un signe - à l'intérieur"
              />
            </button>
          </button>
        </div>
        {/if}
      </li>
    {/each}
  </ul>
</div>
