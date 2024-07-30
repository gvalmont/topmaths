<script lang="ts">
  import { launchExercise } from '../../services/navigation'
  import IconeTooltipSimple from './IconeTooltipSimple.svelte'
  import type { ObjectiveExercise, ObjectiveVideo } from '../../types/objective'
  import { isTeacherMode } from '../../services/store'
  import { copyLink, isCoopmaths } from '../../services/outils'
  import { toutAjouterAuPanier } from '../../services/panier'
  import { COOPMATHS_BASE_URL } from '../../services/environment'
  import { getParamsFromUrl, updateUrlFromParams } from '../../services/mathalea'

  export let lienExercices: string
  export let panierRempli = false
  export let titre: string
  export let indiceExercice = -1
  export let exercicesDeBrevet = false
  export let exercices: ObjectiveExercise[]
  export let videos: ObjectiveVideo[] = []
  export let reference: string = ''
  export let nomsPanier: string[]

  function presenceExercicesCoopmaths (exercices: ObjectiveExercise[]) {
    for (const exercice of exercices) {
      if (isCoopmaths(exercice.link)) return true
    }
    return false
  }

  function creerLienCapytale () {
    let lien = COOPMATHS_BASE_URL
    for (const exercice of exercices) {
      if (exercice.slug.includes('&i=0')) {
        lien += exercice.slug.replaceAll('&i=0', '&i=1') + '&'
      } else {
        lien += exercice.slug + '&i=1&'
      }
    }
    for (const video of videos) {
      lien += 'uuid=video&s=https://www.youtube.com/watch?v=' + video.videoLink.split('videoId=')[1].split('&')[0] + '&'
    }
    return lien + 'v=eleve&beta=1&es=011100'
  }

</script>

<div class="flex flex-row justify-center">
  {#if lienExercices !== ''}
    <button on:click={() => launchExercise(lienExercices)}>
      {titre} &nbsp;
      <IconeTooltipSimple
        urlBouton="/topmaths/img/cc0/fullscreen-svgrepo-com.svg"
        texteDropdown = {indiceExercice < 0 ? 'Lancer les exercices' : 'Lancer l\'exercice'}
        texteAlternatif = "Lancer en plein écran"
      />
    </button>
  {/if}
  {#if lienExercices === '' && titre !== undefined && titre !== ''}
    <button>{titre}</button>
  {/if}
  {#if $isTeacherMode && presenceExercicesCoopmaths(exercices)}
    <span>
      &nbsp;
      <button
        on:click={() => {
          const params = getParamsFromUrl(lienExercices)
          updateUrlFromParams('latex', params)
        }}
      >
        <IconeTooltipSimple
          urlBouton="/topmaths/img/cc0/printing-document-svgrepo-com.svg"
          texteAlternatif="Imprimante"
          texteDropdown="Exporter en PDF pour une impression"
        />
      </button>
    </span>
    &nbsp;
    <button on:click={() => copyLink(creerLienCapytale(), false, true, true)}>
      <IconeTooltipSimple
        urlBouton="/topmaths/img/gvalmont/capytale.svg"
        texteDropdown = {'Créer un lien pour une utilisation avec CAPYTALE'}
        texteAlternatif = {'"PY" dans un cercle'}
      />
    </button>
    &nbsp;
    {#if panierRempli}
      <button>
        <IconeTooltipSimple
          urlBouton="/topmaths/img/cc0/cart-check-svgrepo-com.svg"
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
          urlBouton="/topmaths/img/cc0/cart-plus-svgrepo-com.svg"
          texteDropdown={exercices.length > 1 ? 'Ajouter tous les exercices au panier' : 'Ajouter l\'exercice au panier'}
          texteAlternatif="Caddie avec un signe + à l'intérieur"
        />
      </button>
    {/if}
  {/if}
</div>
