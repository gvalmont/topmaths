<script lang="ts">
  import { onDestroy, onMount } from 'svelte'
  import Cart from '../../modules/Cart'
  import {
    REGULAR_VIEW_ADDENDUM,
    TOPMATHS_BASE_URL,
  } from '../../services/environment'
  import { goToCoopmathsView, launchExercise } from '../../services/navigation'
  import { buildGradeFromObjectiveReference } from '../../services/reference'
  import { isTeacherMode } from '../../services/store'
  import { copyLink, normalizeExerciseInteractivity } from '../../services/url'

  let cartLink = ''
  let items = Cart.items
  let rawCartLink = TOPMATHS_BASE_URL + REGULAR_VIEW_ADDENDUM

  $: cartLink = normalizeExerciseInteractivity(
    rawCartLink,
    $isTeacherMode ? '0' : '1',
  )

  onMount(() => {
    updateItems()
    Cart.subscribe(updateItems)
  })

  onDestroy(() => {
    Cart.unsubscribe(updateItems)
  })

  function updateItems(): void {
    items = Cart.items
    let link = TOPMATHS_BASE_URL
    link += items
      .map((item) => {
        let slug = item.exercise.slug
        if (item.objectiveReference !== '') {
          slug += `&o=${item.objectiveReference}`
        }
        if (item.unitReference !== '') {
          slug += `&u=${item.unitReference}`
        }
        return slug
      })
      .join('&')
    link += REGULAR_VIEW_ADDENDUM
    rawCartLink = link
  }
</script>

<svelte:head>
  <title>Topmaths - Panier</title>
</svelte:head>

<div class="w-full max-w-screen-lg">
  <h1
    class="title rounded-tl-3xl rounded-br-3xl p-4 font-semibold
      text-white dark:text-fuchsia-700
      bg-fuchsia-700 dark:bg-inherit dark:border-fuchsia-700 dark:border-4
      text-3xl md:text-4xl"
  >
    Panier
  </h1>
  <h3 class="p-6 md:p-8">
    <button
      class="is-fuchsia is-interactive
        mx-2 md:mx-4"
      on:click={() =>
        copyLink(cartLink, { includeSeed: false, forceInteractive: true })}
    >
      <img
        class="is-icon
          size-12 md:size-16"
        src="/topmaths/img/cc0/copy-interface-symbol-svgrepo-com.svg"
        alt="Documents copiés"
      />
    </button>
    <button
      class="is-fuchsia is-interactive
        mx-2 md:mx-4"
      on:click={(mouseEvent) => launchExercise(mouseEvent, cartLink)}
    >
      <img
        class="is-icon
          size-12 md:size-16"
        src="/topmaths/img/cc0/fullscreen-svgrepo-com.svg"
        alt="Lancer en plein écran"
      />
    </button>
    <button
      class="is-fuchsia is-interactive
        mx-2 md:mx-4"
      on:click={(mouseEvent) => launchExercise(mouseEvent, cartLink, true)}
    >
      <img
        class="is-icon
          size-12 md:size-16"
        src="/topmaths/img/cc0/fullscreen-double-svgrepo-com.svg"
        alt="Lancer l'exercice en double-vue"
      />
    </button>
    <button
      class="is-fuchsia is-interactive
        mx-2 md:mx-4"
      on:click={() => Cart.clear()}
    >
      <img
        class="is-icon
          size-12 md:size-16"
        src="/topmaths/img/cc0/cart-remove-svgrepo-com.svg"
        alt="Caddie avec une crois à l'intérieur"
      />
    </button>
    <button
      class="is-fuchsia is-interactive
        mx-2 md:mx-4"
      on:click={(mouseEvent) =>
        goToCoopmathsView(mouseEvent, cartLink, 'latex')}
    >
      <img
        class="is-icon
        size-12 md:size-16"
        src="/topmaths/img/cc0/printing-document-svgrepo-com.svg"
        alt="Imprimante"
      />
    </button>
  </h3>
  <ul>
    {#each items as item}
      <li>
        <div>
          {item.objectiveReference}
          {item.label}&nbsp;
          <button
            class="is-{buildGradeFromObjectiveReference(
              item.objectiveReference,
            )} is-interactive"
            on:click={() => Cart.remove(item.exercise.id)}
          >
            <img
              class="is-icon
                size-4 md:size-6"
              src="/topmaths/img/cc0/cart-minus-svgrepo-com.svg"
              alt="Caddie avec un signe - à l'intérieur"
            />
          </button>
        </div>
      </li>
    {/each}
  </ul>
</div>
