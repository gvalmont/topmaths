<script lang="ts">
  import Accueil from './Accueil.svelte'
  import * as data from '../services/data' // La liste des objectifs et des séquences cesse de fonctionner si on l'enlève
  import { environment } from '../services/environment'
  import Sequences from './Sequences.svelte'
  import Sequence from './Sequence.svelte'
  import { goVue } from '../services/outils'
  import Objectifs from './Objectifs.svelte'
  import Objectif from './Objectif.svelte'
  import { storage } from '../services/storage'
  import OutilsPourLaClasse from './OutilsPourLaClasse.svelte'
  import Mathador from './outils-pour-la-classe/Mathador.svelte'
  import GenerateurDePortraits from './outils-pour-la-classe/GenerateurDePortraits.svelte'
  import Cgu from './Cgu.svelte'
  import MentionsLegales from './MentionsLegales.svelte'
  import PolitiqueDeConfidentialite from './PolitiqueDeConfidentialite.svelte'
  import Panier from './Panier.svelte'
  import { onMount } from 'svelte'
  import { ElementInstrumenpoche } from '../../modules/ElementInstrumenpoche'
  import Progressions from './outils-pour-la-classe/Progressions.svelte'
  import OutilsPourLesEleves from './OutilsPourLesEleves.svelte'
  import Lexique from './outils-pour-les-eleves/Lexique.svelte'
  import Revisions from './Revisions.svelte'
  import Telechargements from './outils-pour-les-eleves/Telechargements.svelte'
  import Tutos from './outils-pour-les-eleves/Tutos.svelte'
  import { modeEnseignant, modePerso, panierDispo, reference, vue } from '../services/store'
  import Informations from './Informations.svelte'
  import ExercicesMathalea from './exercices/ExercicesMathalea.svelte'

  if (customElements.get('alea-instrumenpoche') === undefined) {
    customElements.define('alea-instrumenpoche', ElementInstrumenpoche)
  }

  const annee = environment.annee

  function updateParams () {
    updateParamsFromUrl()
    updateBasket()
    lancerHeureInterval()
    storage.recupererEtatModeEnseignant()
    storage.recupererEtatModePerso()
  }

  function updateParamsFromUrl () {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    for (const entry of entries) {
      if (entry[0] === 'v') vue.set(entry[1])
      if (entry[0] === 'ref') reference.set(entry[1])
    }
  }

  function updateBasket () {
    const panier = storage.get('panier')
    if (panier !== undefined && panier[0] !== undefined) panierDispo.set(true)
  }

  // À la construction du component ou à la navigation dans l'historique du navigateur
  // on met à jour l'url headerStart
  onMount(() => {
    updateParams()
  })
  addEventListener('popstate', updateParams)

  function lancerHeureInterval () {
    MAJHeure()
    setInterval(() => {
      MAJHeure()
    }, 1000)
  }

  function alternerTailleOverlayHeure () {
    const overlayHeureDiv = document.getElementById('overlayHeure')
    if (overlayHeureDiv !== null) {
      if (overlayHeureDiv.style.width === '240px') {
        overlayHeureDiv.style.width = '60px'
        overlayHeureDiv.style.height = '30px'
        overlayHeureDiv.style.fontSize = '18px'
      } else {
        overlayHeureDiv.style.width = '240px'
        overlayHeureDiv.style.height = '120px'
        overlayHeureDiv.style.fontSize = '72px'
      }
    }
  }

  function MAJHeure () {
    if ($modeEnseignant) {
      const divOverlayHeure = document.getElementById('overlayHeure')
      if (divOverlayHeure !== null) {
        const date = new Date()
        let hh = date.getHours().toString()
        let mm = date.getMinutes().toString()

        hh = hh.length === 1 ? '0' + hh : hh
        mm = mm.length === 1 ? '0' + mm : mm

        divOverlayHeure.innerHTML = hh + ':' + mm
      }
    }
  }
</script>

<svelte:head>
  <title>topmaths.fr - Les maths au TOP !</title>
</svelte:head>

<div id="top" class="is-family-primary">
  <!-- Header -->
  {#if $vue !== 'eleve' && $vue !== 'diaporama'}
    <div class="tabs is-large is-centered">
      <ul class="tabs-menu">
        <a href='?v=accueil' class="p-0">
          <li class:is-actif={$vue === 'accueil' || $vue === ''}>
            <button class="tabs-menu-link is-warning py-4 px-5" on:click={(event) => goVue(event, 'accueil')}>
              <i class="image is-48x48">
                <img src="topmaths/img/cc0/homepage-svgrepo-com.svg" alt="Maison"/>
              </i>
            </button>
          </li>
        </a>
        <a href='?v=sequences' class="p-0">
          <li class={($vue === 'sequences' || $vue === 'sequence') ? 'is-actif' : ''}>
            <button on:click={(event) => goVue(event, 'sequences')} class="tabs-menu-link is-info-darker py-4 px-5">
              <i class="image is-48x48">
                <img src="topmaths/img/cc0/guest-book-svgrepo-com.svg" alt="Livre ouvert" />
              </i>
            </button>
          </li>
        </a>
        <a href='?v=objectifs' class="p-0">
          <li class={($vue === 'objectifs' || $vue === 'objectif') ? 'is-actif' : ''}>
            <button on:click={(event) => goVue(event, 'objectifs')} class="tabs-menu-link is-link py-4 px-5">
              <i class="image is-48x48">
                <img src="topmaths/img/cc0/study-2-svgrepo-com.svg" alt="Personne lisant un livre" />
              </i>
            </button>
          </li>
        </a>
        <a href='?v=revisions' class="p-0">
          <li class={$vue === 'revisions' ? 'is-actif' : ''}>
            <button on:click={(event) => goVue(event, 'revisions')} class="tabs-menu-link is-sponsor py-4 px-5">
              <i class="image is-48x48">
                <img src="topmaths/img/gvalmont/automatismes-regular.svg" alt="Tête avec un engrenage à l'intérieur" />
              </i>
            </button>
          </li>
        </a>
        <a href='?v=eleves' class="p-0">
          <li class={($vue === 'eleves' || $vue === 'lexique' || $vue === 'tutos' || $vue === 'telechargements') ? 'is-actif' : ''}>
            <button on:click={(event) => goVue(event, 'eleves')} class="tabs-menu-link is-purple py-4 px-5">
              <i class="image is-48x48">
                <img src="topmaths/img/cc0/backpack-svgrepo-com.svg" alt="Sac à dos d'élève" />
              </i>
            </button>
          </li>
        </a>
        <a href='?v=outils' class="p-0">
          <li class={($vue === 'outils' || $vue === 'mathador' || $vue === 'progressions') ? 'is-actif' : ''}>
            <button on:click={(event) => goVue(event, 'outils')} class="tabs-menu-link is-green py-4 px-5">
              <i class="image is-48x48">
                <img src="topmaths/img/cc0/classroom-svgrepo-com.svg" alt="Enseignant qui montre un tableau à une classe" />
              </i>
            </button>
          </li>
        </a>
        {#if $panierDispo}
          <a href='?v=panier' class="p-0">
            <li class={$vue === 'panier' ? 'is-actif' : ''}>
              <button on:click={(event) => goVue(event, 'panier')} class="tabs-menu-link is-fuchsia py-4 px-5">
                <i class="image is-48x48">
                  <img src="topmaths/img/cc0/cart-content-svgrepo-com.svg" alt="Caddie" />
                </i>
              </button>
            </li>
          </a>
        {/if}
      </ul>
    </div>
  {/if}
</div>
<!-- Affichage principal -->
<div class="flex items-center">
  <div class="md:max-w-screen-lg flex-1 flex-col mx-auto text-center pb-20">
    {#if $vue === 'exercices'}
      <ExercicesMathalea />
    {:else if $vue === 'sequence'}
      <Sequence />
    {:else if $vue === 'sequences'}
      <Sequences />
    {:else if $vue === 'objectifs'}
      <Objectifs />
    {:else if $vue === 'objectif'}
      <Objectif />
    {:else if $vue === 'revisions'}
      <Revisions />
    {:else if $vue === 'outils'}
      <OutilsPourLaClasse />
    {:else if $vue === 'mathador'}
      <Mathador />
    {:else if $vue === 'generateur-de-portraits'}
      <GenerateurDePortraits />
    {:else if $vue === 'eleves'}
      <OutilsPourLesEleves />
    {:else if $vue === 'lexique'}
      <Lexique />
    {:else if $vue === 'tutos'}
      <Tutos />
    {:else if $vue === 'telechargements'}
      <Telechargements />
    {:else if $vue === 'progressions'}
      <Progressions />
    {:else if $vue === 'informations'}
      <Informations />
    {:else if $vue === 'panier'}
      <Panier />
    {:else if $vue === 'mentions-legales'}
      <MentionsLegales />
    {:else if $vue === 'politique-de-confidentialite'}
      <PolitiqueDeConfidentialite />
    {:else if $vue === 'cgu'}
      <Cgu />
    {:else if $vue === 'perso'}
      <div class="has-text-centered">
        <button class="button" class:is-success = {!$modePerso} class:is-danger = {$modePerso} on:click={() => {
          $modePerso ? storage.desactiverModePerso() : storage.activerModePerso()
        }}>
          {$modePerso ? 'Désactiver le mode perso' : 'Activer le mode perso'}
        </button>
      </div>
    {:else}
      <Accueil />
    {/if}
  </div>
</div>
<!-- Footer -->
<footer class="b-footer text-center">
  <p>
    <strong>topmaths</strong> © {annee} de
    <a href="https://forge.aeif.fr/gvalmont" target="_blank" rel="noopener noreferrer">Guillaume Valmont</a> et des
    <a href="https://coopmaths.fr/a_propos/" target="_blank" rel="noopener noreferrer">contributeurs de MathALÉA</a>
  </p>
  <p>
    <button class="has-text-link" on:click={(event) => goVue(event, 'informations')}>Informations sur le site</button>
    -
    <button class="has-text-link" on:click={(event) => goVue(event, 'mentions-legales')}>Mentions légales</button>
    -
    <button class="has-text-link" on:click={(event) => goVue(event, 'politique-de-confidentialite')}>Politique de confidentialité</button>
    -
    <button class="has-text-link" on:click={(event) => goVue(event, 'cgu')}>CGU</button>
  </p>
</footer>
<div
  class="noprint"
  role="button"
  tabindex="-1"
  id="overlayHeure"
  on:click={alternerTailleOverlayHeure}
  on:keydown={alternerTailleOverlayHeure}
>
</div>
