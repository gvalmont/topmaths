<script lang="ts">
  import Home from './Home/Home.svelte'
  import Unit from './Unit/Unit.svelte'
  import { goToView } from '../services/navigation'
  import Objectifs from './Objectifs.svelte'
  import Objectif from './Objectif.svelte'
  import Storage from '../modules/Storage'
  import OutilsPourLaClasse from './OutilsPourLaClasse.svelte'
  import Mathador from './outils-pour-la-classe/Mathador.svelte'
  import Panier from './Panier.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { ElementInstrumenpoche } from '../../modules/ElementInstrumenpoche'
  import Progressions from './outils-pour-la-classe/Progressions.svelte'
  import OutilsPourLesEleves from './OutilsPourLesEleves.svelte'
  import Lexique from './outils-pour-les-eleves/Lexique.svelte'
  import Revisions from './Revisions.svelte'
  import Telechargements from './outils-pour-les-eleves/Telechargements.svelte'
  import Tutos from './outils-pour-les-eleves/Tutos.svelte'
  import { isTeacherMode, isPersonalMode, reference, view } from '../services/store'
  import ExercicesMathalea from './exercices/ExercicesMathalea.svelte'
  import HeaderMenu from './presentationalComponents/HeaderMenu/HeaderMenu.svelte'
  import { cacheData } from '../services/data'
  import { isTopmathsView } from '../types/navigation'
  import Cart from '../modules/Cart'
  import type { CartItem } from '../types/cart'
  import TimeOverlay from './presentationalComponents/TimeOverlay.svelte'
  import InfoDialog from './presentationalComponents/InfoDialog.svelte'
  import Footer from './presentationalComponents/Footer.svelte'
  import Perso from './presentationalComponents/Perso.svelte'
  import DarkModeToggle from './presentationalComponents/DarkModeToggle.svelte'
  import Info from './Info/Info.svelte'

  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
  }

  let isCartEmpty: boolean = true
  let innerWidth: number
  let isDevMode: boolean = false
  let isDarkMode: boolean = false
  let isMd: boolean
  $: isMd = innerWidth >= 768

  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  $: document.documentElement.classList.toggle('dark', isDarkMode)

  onMount(() => {
    isDevMode = window.location.href.startsWith('http://localhost')
    Cart.subscribe(handleCartUpdate)
    addEventListener('popstate', updateParams)
    addDarkModeListener()
    cacheData()
    updateParams()
  })

  onDestroy(() => {
    Cart.unsubscribe(handleCartUpdate)
    removeEventListener('popstate', updateParams)
    removeDarkModeListener()
  })

  function updateParams (): void {
    updateParamsFromUrl()
    Cart.updateFromStorage()
    isTeacherMode.set(Storage.getTeacherMode())
    isPersonalMode.set(Storage.getPersonalMode())
  }

  function handleCartUpdate (cartItems: CartItem[]): void {
    isCartEmpty = cartItems.length === 0
  }

  function updateParamsFromUrl (): void {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'v') {
        const viewCandidate = entry[1]
        if (isTopmathsView(viewCandidate)) {
          view.set(viewCandidate)
        }
      }
      if (entry[0] === 'ref') reference.set(entry[1])
    }
  }

  function addDarkModeListener (): void {
    isDarkMode = darkModeMediaQuery.matches
    darkModeMediaQuery.addEventListener('change', event => {
      isDarkMode = event.matches
    })
  }

  function removeDarkModeListener (): void {
    darkModeMediaQuery.removeEventListener('change', event => {
      isDarkMode = event.matches
    })
  }

  function setPersonalMode (isPersonalMode: boolean): void {
    Storage.setPersonalMode(isPersonalMode)
  }
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<svelte:window bind:innerWidth />
<div class="flex flex-col justify-center text-center
  text-base md:text-xl
  text-coopmaths-corpus dark:text-coopmathsdark-corpus
  bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
>
  <HeaderMenu
    view={$view}
    {goToView}
    {isCartEmpty}
  />
    <div class="flex flex-col m-auto max-w-screen-lg
      pb-8 mb:pb-20
      bg-coopmaths-canvas dark:bg-coopmathsdark-canvas"
    >
      {#if $view === 'exercices'}
        <ExercicesMathalea {isMd} />
      {:else if $view === 'unit'}
        <Unit />
      {:else if $view === 'objectifs'}
        <Objectifs />
      {:else if $view === 'objectif'}
        <Objectif />
      {:else if $view === 'revisions'}
        <Revisions />
      {:else if $view === 'outils'}
        <OutilsPourLaClasse />
      {:else if $view === 'mathador'}
        <Mathador />
      {:else if $view === 'eleves'}
        <OutilsPourLesEleves />
      {:else if $view === 'lexique'}
        <Lexique />
      {:else if $view === 'tutos'}
        <Tutos />
      {:else if $view === 'telechargements'}
        <Telechargements />
      {:else if $view === 'progressions'}
        <Progressions />
      {:else if $view === 'panier'}
        <Panier />
      {:else if $view === 'info'}
        <Info />
      {:else if $view === 'perso'}
        <Perso
          isPersonalMode={$isPersonalMode}
          {setPersonalMode}
        />
      {:else}
        <Home />
      {/if}
    </div>
  <Footer />

  {#if $isTeacherMode}
    <TimeOverlay />
  {/if}
  {#if isDevMode}
    <DarkModeToggle bind:isDarkMode={isDarkMode} />
  {/if}
  <InfoDialog />

</div>
