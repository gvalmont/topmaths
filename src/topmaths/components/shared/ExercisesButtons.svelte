<script lang="ts">
  import { onDestroy, onMount, tick } from 'svelte'
  import Cart from '../../modules/Cart'
  import { COOPMATHS_BASE_URL, isTopmaths } from '../../services/environment'
  import { goToCoopmathsView, launchExercise } from '../../services/navigation'
  import { isTeacherMode } from '../../services/store'
  import { copyLink } from '../../services/url'
  import type { CartItem } from '../../types/cart'
  import type { ObjectiveVideo } from '../../types/objective'
  import TooltipIcon from './TooltipIcon.svelte'

  export let itemsToAddToCart: CartItem[] = []
  export let exercisesLink: string
  export let exerciseIndex = -1
  export let videos: ObjectiveVideo[] = []

  let capytaleLink: string = ''
  let isCartEmpty: boolean = true

  onMount(async () => {
    await tick()
    await tick() // two ticks are necessary to update itemsToAddToCart
    updateCartEmpty()
    Cart.subscribe(updateCartEmpty)
  })

  onDestroy(() => {
    Cart.unsubscribe(updateCartEmpty)
  })

  function updateCartEmpty(): void {
    isCartEmpty = itemsToAddToCart
      .map((item) => item.exercise)
      .some((exercise) => !Cart.includes(exercise.id))
  }

  function includesTopmathsExercises(itemsToAddToCart: CartItem[]): boolean {
    return itemsToAddToCart
      .map((exerciseLabel) => exerciseLabel.exercise)
      .map((exercice) => exercice.link)
      .some(isTopmaths)
  }

  function updateCapytaleLink(): void {
    let link = COOPMATHS_BASE_URL
    for (const exercise of itemsToAddToCart.map((item) => item.exercise)) {
      if (exercise.slug.includes('&i=0')) {
        link += exercise.slug.replaceAll('&i=0', '&i=1') + '&'
      } else {
        link += exercise.slug + '&i=1&'
      }
    }
    for (const video of videos) {
      link += buildMathaleaVideoFromDigiview(video.videoLink) + '&'
    }
    capytaleLink = link + 'v=eleve&beta=1&es=011100'
  }

  function buildMathaleaVideoFromDigiview(videoLink: string): string {
    return (
      'uuid=video&s=https://www.youtube.com/watch?v=' +
      videoLink.split('videoId=')[1].split('&')[0]
    )
  }

  function addExercisesToCart(): void {
    itemsToAddToCart.forEach((item) => {
      if (!isTopmaths(item.exercise.link)) {
        console.warn(
          `L'exercice ${item.objectiveReference} ${item.label} n'a pas été ajouté au panier car il n'est pas un exercice MathALÉA`,
        )
        return
      }
      Cart.add(item)
    })
  }

  function copyCapytaleLink(mouseEvent: MouseEvent): void {
    const copyLinkOptions = {
      includeSeed: false,
      forceInteractive: true,
      mouseEvent,
      baseUrl: COOPMATHS_BASE_URL,
    }
    updateCapytaleLink()
    copyLink(capytaleLink, copyLinkOptions)
  }
</script>

<div class="flex flex-row justify-center items-center {$$props.class}">
  {#if exercisesLink === ''}
    <button><slot /></button>
  {:else}
    <a href={exercisesLink} class="is-interactive">
      <button
        class="flex items-center"
        on:click={(mouseEvent) => launchExercise(mouseEvent, exercisesLink)}
      >
        <slot /> &nbsp;
        <TooltipIcon
          dropdownText={exerciseIndex < 0
            ? 'Lancer les exercices'
            : "Lancer l'exercice"}
          imgSrc="/topmaths/img/cc0/fullscreen-svgrepo-com.svg"
          imgAlt="Lancer l'exercice"
        />
      </button>
    </a>
    {#if $isTeacherMode && isTopmaths(exercisesLink) && !exercisesLink.includes('&v=diaporama')}
      <a href={exercisesLink} class="ml-2 is-interactive">
        <button
          class="flex items-center"
          on:click={(mouseEvent) =>
            launchExercise(mouseEvent, exercisesLink, true)}
        >
          <TooltipIcon
            dropdownText={exerciseIndex < 0
              ? 'Lancer les exercices en double-vue'
              : "Lancer l'exercice en double-vue"}
            imgSrc="/topmaths/img/cc0/fullscreen-double-svgrepo-com.svg"
            imgAlt="Lancer l'exercice en double-vue"
          />
        </button>
      </a>
    {/if}
    {#if $isTeacherMode && isTopmaths(exercisesLink)}
      <a
        href={exercisesLink.replace('v=exercise', 'v=latex')}
        class="ml-2 is-interactive"
      >
        <button
          class="flex items-center"
          on:click={(mouseEvent) =>
            goToCoopmathsView(mouseEvent, exercisesLink, 'latex')}
        >
          <TooltipIcon
            imgSrc="/topmaths/img/cc0/printing-document-svgrepo-com.svg"
            imgAlt="Imprimante"
            dropdownText="Exporter en PDF pour une impression"
          />
        </button>
      </a>
      {#if includesTopmathsExercises(itemsToAddToCart)}
        <a href={capytaleLink} class="ml-2 is-interactive">
          <button
            class="flex items-center"
            on:click={(mouseEvent) => copyCapytaleLink(mouseEvent)}
          >
            <TooltipIcon
              imgSrc="/topmaths/img/gvalmont/capytale.svg"
              dropdownText={'Créer un lien pour une utilisation avec CAPYTALE'}
              imgAlt={'"PY" dans un cercle'}
            />
          </button>
        </a>
        {#if isCartEmpty}
          <button
            on:click={() => {
              addExercisesToCart()
              isCartEmpty = false
            }}
            class="is-interactive flex items-center ml-1"
          >
            <TooltipIcon
              imgSrc="/topmaths/img/cc0/cart-plus-svgrepo-com.svg"
              dropdownText={itemsToAddToCart.length > 1
                ? 'Ajouter tous les exercices au panier'
                : "Ajouter l'exercice au panier"}
              imgAlt="Caddie avec un signe + à l'intérieur"
            />
          </button>
        {:else}
          <button class="is-interactive flex items-center ml-1">
            <TooltipIcon
              imgSrc="/topmaths/img/cc0/cart-check-svgrepo-com.svg"
              dropdownText={itemsToAddToCart.length > 1
                ? 'Les exercices sont déjà tous dans le panier'
                : "L'exercice est déjà présent dans le panier"}
              imgAlt="Caddie rempli"
            />
          </button>
        {/if}
      {/if}
    {/if}
  {/if}
</div>
