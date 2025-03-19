<script lang="ts">
  import Topmaths from '../topmaths/components/Topmaths.svelte'
  import Diaporama from './setup/diaporama/Diaporama.svelte'
  import Eleve from './display/eleve/Eleve.svelte'
  import ConfigEleve from './setup/configEleve/ConfigEleve.svelte'
  import Latex from './setup/latex/Latex.svelte'
  import {
    darkMode,
    exercicesParams,
    freezeUrl,
    globalOptions,
    isInIframe,
  } from '../lib/stores/generalStore'
  import { context } from '../modules/context'
  import {
    ElementButtonInstrumenpoche,
    ElementInstrumenpoche
  } from '../modules/ElementInstrumenpoche'
  import Amc from './setup/amc/Amc.svelte'
  import Anki from './setup/anki/Anki.svelte'
  import Moodle from './setup/moodle/Moodle.svelte'
  import Start from './setup/start/Start.svelte'
  import { onMount } from 'svelte'
  import {
    mathaleaUpdateExercicesParamsFromUrl,
    mathaleaUpdateUrlFromExercicesParams
  } from '../lib/mathalea'
  import Can from './display/can/Can.svelte'
  import { canOptions } from '../lib/stores/canStore'
  import type { CanSolutionsMode } from '../lib/types/can'
  import { updateReferentielLocaleFromURL } from '../lib/stores/languagesStore'
  import Alacarte from './setup/alacarte/Alacarte.svelte'
  import { fetchServerVersion } from '../lib/components/version'
  import Popup from './shared/modal/Popup.svelte'
  import { checkBrowserVersion } from '../lib/components/browserVersion'
  import { vendor } from '../lib/stores/vendorStore'

  let isInitialUrlHandled = false

  let showPopup = false
  let popupMessage = ''

  function handlePopupClose() {
    // console.log('Popup has been closed');
    showPopup = false
  }

  onMount(() => {
    handleInitialUrl()

    const version = checkBrowserVersion()
    if (version.popupMessage.length > 0) {
      showPopup = true
      popupMessage = version.popupMessage
    }
  })

  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
    customElements.define('alea-buttoninstrumenpoche', ElementButtonInstrumenpoche)
  }

  // charge le numéro de version du serveur
  fetchServerVersion()

  

  // Gestion des recorders (Moodle, Capytale, etc. )
  // Lorsque la page d'accueil est dans un iFrame, l'URL est bloquée et les boutons d'exports cachés
  const url = new URL(window.location.href)
  const recorder = url.searchParams.get('recorder')
  if (recorder !== null) {
    isInIframe.set(true)
    freezeUrl.set(true)
  } else {
    isInIframe.set(false)
  }

  // Gestion des paramètres de la CAN
  const canDuration = url.searchParams.get('canD')
  if (canDuration !== null) {
    $canOptions.durationInMinutes = parseInt(canDuration)
  }
  const canSub = url.searchParams.get('canT')
  if (canSub !== null) {
    $canOptions.subTitle = canSub
  }
  const canSolAccess = url.searchParams.get('canSA')
  if (canSolAccess !== null) {
    $canOptions.solutionsAccess = canSolAccess === 'true'
  }
  const canSolMode = url.searchParams.get('canSM')
  if (canSolMode !== null) {
    $canOptions.solutionsMode = canSolMode as CanSolutionsMode
  }
  const canIsInteractive = url.searchParams.get('canI')
  if (canIsInteractive !== null) {
    $canOptions.isInteractive = canIsInteractive === 'true'
  }

  $: {
    // if (isInitialUrlHandled) mathaleaUpdateUrlFromExercicesParams($exercicesParams)
    context.isDiaporama = $globalOptions.v === 'diaporama'
    if ($globalOptions.v === 'latex') {
      context.isHtml = false
    } else {
      context.isHtml = true
    }
    if ($globalOptions.v === 'confeleve') {
      context.isHtml = false
    }
    if ($globalOptions.v === 'alacarte') {
      context.isHtml = false
    }
    if ($globalOptions.v === 'amc') {
      context.isAmc = true
      context.isHtml = false
    } else {
      context.isAmc = false
    }
    // initialisation du vendor pour l'intégration de la bannière dans la vue élève
    if ($globalOptions.v === 'myriade') {
      $vendor.product = {
        name: 'indices',
        logoPath: 'assets/images/vendors/bordas/myriade-bordas-logo.png'
      }
    }
    if ($globalOptions.v === 'indices') {
      $vendor.product = {
        name: 'indices',
        logoPath: 'assets/images/vendors/bordas/indices-bordas-logo.png'
      }
    }
    context.vue = ''
    if ($globalOptions.v === 'diaporama') context.vue = 'diap' // for compatibility
    if ($globalOptions.v === 'latex') context.vue = 'latex' // for compatibility
    if ($globalOptions.v === 'can') context.vue = 'can' // for compatibility
    // lorsque l'éditeur sera intégré à la v3, il faudra mettre à true cette propriété pour l'editeur
    context.isInEditor = false
  }

  function handleInitialUrl() {
    updateReferentielLocaleFromURL()
    const urlOptions = mathaleaUpdateExercicesParamsFromUrl()
    globalOptions.update(() => {
      return urlOptions
    })
    isInitialUrlHandled = true
  }

  function isDevMode() {
    return window.location.href.startsWith('http://localhost')
  }
</script>

<div id="appComponent" class="antialiased">
  {#if showPopup}
    <Popup message={popupMessage} visible={showPopup} onClose={handlePopupClose} />
  {:else if $globalOptions.v === 'diaporama' || $globalOptions.v === 'overview'}
    <Diaporama />
  {:else if $globalOptions.v === 'can'}
    <Can />
  {:else if $globalOptions.v === 'eleve' || $globalOptions.v === 'indices' || $globalOptions.v === 'myriade'}
    <Eleve />
  {:else if $globalOptions.v === 'latex'}
    <Latex />
  {:else if $globalOptions.v === 'alacarte'}
    <Alacarte />
  {:else if $globalOptions.v === 'confeleve'}
    <ConfigEleve />
  {:else if $globalOptions.v === 'amc'}
    <Amc />
  {:else if $globalOptions.v === 'moodle'}
    <Moodle />
  {:else if $globalOptions.v === 'anki'}
    <Anki />
  {:else if $globalOptions.v === 'start'}
    <Start />
  {:else}
    <Topmaths />
  {/if}
</div>

{#if isDevMode()}
  <dialog
    id="notifDialog"
    class="rounded-xl p-6 bg-coopmaths-canvas text-coopmaths-corpus dark:bg-coopmathsdark-canvas-dark dark:text-coopmathsdark-corpus-light shadow-lg"
  ></dialog>
{/if}
