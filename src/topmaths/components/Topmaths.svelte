<script lang="ts">
  import Accueil from './Accueil.svelte'
  import Sequences from './Sequences.svelte'
  import Sequence from './Sequence.svelte'
  import { goToView } from '../services/navigation'
  import Objectifs from './Objectifs.svelte'
  import Objectif from './Objectif.svelte'
  import Storage from '../modules/Storage'
  import OutilsPourLaClasse from './OutilsPourLaClasse.svelte'
  import Mathador from './outils-pour-la-classe/Mathador.svelte'
  import GenerateurDePortraits from './outils-pour-la-classe/GenerateurDePortraits.svelte'
  import Cgu from './Cgu.svelte'
  import MentionsLegales from './MentionsLegales.svelte'
  import PolitiqueDeConfidentialite from './PolitiqueDeConfidentialite.svelte'
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
  import Informations from './Informations.svelte'
  import ExercicesMathalea from './exercices/ExercicesMathalea.svelte'
  import HeadTabsMenu from './presentationalComponents/headTabsMenu/HeadTabsMenu.svelte'
  import { cacheData } from '../services/data'
  import { isTopmathsView } from '../types/navigation'
  import Cart from '../modules/Cart'
  import type { CartItem } from '../types/cart'

  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
  }

  const year = new Date().getFullYear()
  let isCartEmpty: boolean = true
  let intervalId: ReturnType<typeof setTimeout>
  let innerWidth: number
  let isMd: boolean
  $: isMd = innerWidth >= 768

  onMount(() => {
    Cart.subscribe(handleCartUpdate)
    addEventListener('popstate', updateParams)
    cacheData()
    updateParams()
    startTimeInterval()
  })

  onDestroy(() => {
    clearTimeInterval()
    Cart.unsubscribe(handleCartUpdate)
    removeEventListener('popstate', updateParams)
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

  function startTimeInterval (): void {
    updateTime()
    intervalId = setInterval(() => {
      updateTime()
    }, 1000)
  }

  function clearTimeInterval (): void {
    clearInterval(intervalId)
  }

  function toggleTimeOverlaySize (): void {
    const timeOverlayDiv = document.getElementById('timeOverlay')
    if (timeOverlayDiv !== null) {
      if (timeOverlayDiv.style.width === '240px') {
        timeOverlayDiv.style.width = '60px'
        timeOverlayDiv.style.height = '30px'
        timeOverlayDiv.style.fontSize = '18px'
      } else {
        timeOverlayDiv.style.width = '240px'
        timeOverlayDiv.style.height = '120px'
        timeOverlayDiv.style.fontSize = '72px'
      }
    }
  }

  function updateTime (): void {
    if ($isTeacherMode) {
      const timeOverlayDiv = document.getElementById('timeOverlay')
      if (timeOverlayDiv !== null) {
        const date = new Date()
        let hh = date.getHours().toString()
        let mm = date.getMinutes().toString()

        hh = hh.length === 1 ? '0' + hh : hh
        mm = mm.length === 1 ? '0' + mm : mm

        timeOverlayDiv.innerHTML = hh + ':' + mm
      }
    }
  }
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<svelte:window bind:innerWidth />
<div id="top" class="pb-6 md:pb-9 is-family-primary">
  <!-- Header -->
  <HeadTabsMenu
    {isMd}
    vue={$view}
    onHeadTabsMenuClicked={goToView}
    {isCartEmpty}
  />
</div>
<!-- Affichage principal -->
<div class="flex justify-center">
  <div class="text-center pb-8 mb:pb-20 text-base md:text-xl">
    {#if $view === 'exercices'}
      <ExercicesMathalea {isMd} />
    {:else if $view === 'sequence'}
      <Sequence />
    {:else if $view === 'sequences'}
      <Sequences />
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
    {:else if $view === 'generateur-de-portraits'}
      <GenerateurDePortraits />
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
    {:else if $view === 'informations'}
      <Informations />
    {:else if $view === 'panier'}
      <Panier />
    {:else if $view === 'mentions-legales'}
      <MentionsLegales />
    {:else if $view === 'politique-de-confidentialite'}
      <PolitiqueDeConfidentialite />
    {:else if $view === 'cgu'}
      <Cgu />
    {:else if $view === 'perso'}
      <div class="has-text-centered">
        <button class="button" class:is-success = {!$isPersonalMode} class:is-danger = {$isPersonalMode} on:click={() => {
          Storage.setPersonalMode(!$isPersonalMode)
        }}>
          {$isPersonalMode ? 'Désactiver le mode perso' : 'Activer le mode perso'}
        </button>
      </div>
    {:else}
      <Accueil />
    {/if}
  </div>
</div>
<!-- Footer -->
<footer class="p-6 md:p-12 pt-3 md:pt-6 pb-12 md:pb-24 text-center bg-zinc-50 text-xs md:text-base">
  <p>
    <strong>topmaths</strong> © {year} de
    <a href="https://forge.apps.education.fr/valmontguillaume" target="_blank" rel="noopener noreferrer">Guillaume Valmont</a> et des
    <a href="https://coopmaths.fr/a_propos/" target="_blank" rel="noopener noreferrer">contributeurs de MathALÉA</a>
  </p>
  <p>
    <button class="has-text-link" on:click={(event) => goToView(event, 'informations')}>Informations sur le site</button>
    -
    <button class="has-text-link" on:click={(event) => goToView(event, 'mentions-legales')}>Mentions légales</button>
    -
    <button class="has-text-link" on:click={(event) => goToView(event, 'politique-de-confidentialite')}>Politique de confidentialité</button>
    -
    <button class="has-text-link" on:click={(event) => goToView(event, 'cgu')}>CGU</button>
  </p>
</footer>
<div
  class="noprint"
  role="button"
  tabindex="-1"
  id="timeOverlay"
  on:click={toggleTimeOverlaySize}
  on:keydown={toggleTimeOverlaySize}
>
</div>
<dialog
  id="topmathsDialog"
  class="rounded-xl p-6 bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg"
>
</dialog>

<style>
  .is-family-primary {
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", "Helvetica", "Arial", sans-serif !important;
  }

  #timeOverlay {
    position: fixed;
    bottom: 30px;
    right: 30px;
    z-index: 200;
    width: 60px;
    height: 30px;
    font-size: 18px;
    transition: width 1s, height 1s, font-size 1s;
  }
</style>
