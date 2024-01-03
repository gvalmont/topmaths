<script lang="ts">
  import { ouvrirModaleExercices } from '../../services/modale'
  import IconeTooltipSimple from './IconeTooltipSimple.svelte'
  import type { ObjectifExercice, ObjectifVideo } from '../../services/types'
  import { modeEnseignant } from '../../services/store'
  import { copierLien, outils } from '../../services/outils'
  import { toutAjouterAuPanier } from '../../services/panier'
  import { environment } from '../../services/environment'

  export let lienExercices: string
  export let panierRempli = false
  export let titre: string
  export let indiceExercice = -1
  export let exercicesDeBrevet = false
  export let exercices: ObjectifExercice[]
  export let videos: ObjectifVideo[] = []
  export let reference: string = ''
  export let nomsPanier: string[]

  function presenceExercicesCoopmaths (exercices: ObjectifExercice[]) {
    for (const exercice of exercices) {
      if (outils.estCoopmaths(exercice.lien)) return true
    }
    return false
  }

  function creerLienCapytale () {
    let lien = environment.baseUrl + environment.V3
    for (const exercice of exercices) {
      if (exercice.slug.includes('&i=0')) {
        lien += exercice.slug.replaceAll('&i=0', '&i=1') + '&'
      } else {
        lien += exercice.slug + '&i=1&'
      }
    }
    for (const video of videos) {
      lien += 'uuid=video&s=https://www.youtube.com/watch?v=' + video.slug.split('videoId=')[1].split('&')[0] + '&'
    }
    return lien + 'v=eleve'
  }

</script>

{#if lienExercices !== ''}
  <button on:click={() => ouvrirModaleExercices(lienExercices)}>
    {titre} &nbsp;
    <IconeTooltipSimple
      urlBouton="/assets/topmaths/img/cc0/fullscreen-svgrepo-com.svg"
      texteDropdown = {indiceExercice < 0 ? 'Lancer les exercices' : 'Lancer l\'exercice'}
      texteAlternatif = "Lancer en plein écran"
    />
  </button>
{/if}
{#if lienExercices === '' && titre !== undefined && titre !== ''}
  <button>{titre}</button>
{/if}
{#if $modeEnseignant && presenceExercicesCoopmaths(exercices)}
  <!-- <span>
    &nbsp;
    <ButtonOverleaf
      lien={lienExercices}
      title={'Entraînement'}
      reference={reference}
      nbExoFois={3}
    />
    {#if outils.isDevMode() && exercices.length > 0}
      &nbsp;
      <ButtonOverleaf
        lien={lienExercices}
        title={'Test'}
        reference={reference}
        nbVersions={30}
      />
    {/if}
  </span> -->
  &nbsp;
  <button on:click={() => copierLien(creerLienCapytale(), false, true, true)}>
    <IconeTooltipSimple
      urlBouton="/assets/topmaths/img/gvalmont/capytale.svg"
      texteDropdown = {'Créer un lien pour une utilisation avec CAPYTALE'}
      texteAlternatif = {'"PY" dans un cercle'}
    />
  </button>
  &nbsp;
  {#if panierRempli}
    <button>
      <IconeTooltipSimple
        urlBouton="/assets/topmaths/img/cc0/cart-check-svgrepo-com.svg"
        texteDropdown={exercices.length > 1 ? 'Les exercices sont déjà tous dans le panier' : 'L\'exercice est déjà présent dans le panier'}
        texteAlternatif="Caddie rempli"
      />
    </button>
  {:else}
    <button
      on:click={() => {
        toutAjouterAuPanier(exercices, reference, nomsPanier, indiceExercice, exercicesDeBrevet)
        panierRempli = true
      }}
    >
      <IconeTooltipSimple
        urlBouton="/assets/topmaths/img/cc0/cart-plus-svgrepo-com.svg"
        texteDropdown={exercices.length > 1 ? 'Ajouter tous les exercices au panier' : 'Ajouter l\'exercice au panier'}
        texteAlternatif="Caddie avec un signe + à l'intérieur"
      />
    </button>
  {/if}
{/if}
