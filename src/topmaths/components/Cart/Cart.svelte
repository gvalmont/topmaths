<script lang="ts">
  import { isCartItem, type CartItem } from '../../types/cart'
  import { COOPMATHS_BASE_URL } from '../../services/environment'
  import { goToView, launchExercise } from '../../services/navigation'
  import Storage from '../../modules/Storage'
  import { copyLink } from '../../services/shared'
  import { getParamsFromUrl, updateUrlFromParams } from '../../services/mathalea'

  let cartLink = ''
  let cart: CartItem[] = []
  updateCart()

  function retirerDuPanier (panierItem: CartItem): void {
    const panierTemp = Storage.get('cart') as CartItem[]
    const nouveauPanier = panierTemp.filter(
      (item) => item.id !== panierItem.id
    )
    Storage.set('cart', nouveauPanier)
    updateCart()
  }

  function viderLePanier (mouseEvent: MouseEvent): void {
    Storage.set('cart', [])
    goToView(mouseEvent, 'home')
  }

  function updateCart (): void {
    cart = Storage.get('cart')
      .filter(isCartItem)
      .filter((cartItem: CartItem) => cartItem.slug.slice(0, 4) !== 'http' && cartItem.slug !== '')
    cartLink = COOPMATHS_BASE_URL + cart.join('&i=0&') + 'v=exercices'
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
    <button class="mx-2 md:mx-4" on:click={() => copyLink(cartLink, false)}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg" alt="Documents copiés" />
      </i>
    </button>
    <button class="mx-2 md:mx-4" on:click={() => launchExercise(cartLink)}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/fullscreen-svgrepo-com.svg" alt="Lancer en plein écran" />
      </i>
    </button>
    <button class="mx-2 md:mx-4" on:click={(mouseEvent) => viderLePanier(mouseEvent)}>
      <i>
        <img class="size-12 md:size-16" src="/topmaths/img/cc0/cart-remove-svgrepo-com.svg" alt="Caddie avec une crois à l'intérieur" />
      </i>
    </button>
    <button
      class="mx-2 md:mx-4" on:click={() => {
        const params = getParamsFromUrl(cartLink)
        updateUrlFromParams('latex', params)
      }}
    >
    <i>
      <img class="size-12 md:size-16" src="/topmaths/img/cc0/printing-document-svgrepo-com.svg" alt="Imprimante" />
    </i>
    </button>
  </h3>
  <ul>
    {#each cart as panierItem}
      <li class="is-size-5">
        {#if panierItem !== null && panierItem !== undefined}
        <div class="is-{panierItem.label.slice(0, 1)}e">
          <button>
            <span>{panierItem.objectiveReference}</span>
            <span class="is-size-6">
              {panierItem.label}</span
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
