<script lang="ts">
  import papiersCrayons from '../../../topmaths/json/papiers_crayons.json'

</script>

<svelte:head>
  <title>SPS2 : Défis géométriques</title>
</svelte:head>

<h1 class="title text-2xl md:text-4xl font-semibold p-4 is-tout">Défis géométriques</h1>
<div class="is-tout is-fin">
  <p class="noir">
    <br />
    Des défis géométriques à relever.<br />
    Allez-vous réussir à reproduire ces figures ?
  </p>
  <br />
  <p class="italic noir">
    (Ce sont les mêmes défis que dans le porte-vues jaune)
  </p>
  <br />
  <div class="flex flex-wrap margin-auto justify-center">
    {#each papiersCrayons as activite}
      <div class="p-4">
        <a href={activite.ggb}>
          <img src="https://www-irem.univ-paris13.fr/site_spip/{activite.src}" alt={activite.titre}/>
        </a>
      </div>
    {/each}
  </div>
  <p class="text-base md:text-xl noir p-8">Ces activités géniales ont été créées par <a href="https://www-irem.univ-paris13.fr/site_spip/spip.php?article263">l'IREM de Paris-Nord</a> qui propose aussi <a href="https://www-irem.univ-paris13.fr/site_spip/spip.php?article1263">une version papier</a> !</p>
</div>
