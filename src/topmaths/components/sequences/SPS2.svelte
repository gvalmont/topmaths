<script lang="ts">
  import { ouvrirModaleExercices } from '../../services/modale'
  import papiersCrayons from '../../../topmaths/json/papiers_crayons.json'

</script>

<svelte:head>
  <title>SPS2 : Défis géométriques</title>
</svelte:head>

<h1 class="title is-2 is-tout mb-0">Défis géométriques</h1>
<div class="is-tout is-fin">
  <p class="is-size-5 noir">
    <br />
    Des défis géométriques à relever.<br />
    Allez-vous réussir à reproduire ces figures ?
  </p>
  <br />
  <p class="is-size-6 is-italic noir">
    (Ce sont les mêmes défis que dans le porte-vues jaune)
  </p>
  <br />
  <div class="flex flex-wrap margin-auto justify-center">
    {#each papiersCrayons as activite}
      <div class="p-4">
        <button on:click={() => ouvrirModaleExercices(activite.ggb)}>
          <img src="https://www-irem.univ-paris13.fr/site_spip/{activite.src}" alt={activite.titre}/>
        </button>
      </div>
    {/each}
  </div>
  <p class="text-xl noir pb-8">Ces activités géniales ont été créées par <a href="https://www-irem.univ-paris13.fr/site_spip/spip.php?article263">l'IREM de Paris-Nord</a> qui propose aussi <a href="https://www-irem.univ-paris13.fr/site_spip/spip.php?article1263">une version papier</a> !</p>
</div>
