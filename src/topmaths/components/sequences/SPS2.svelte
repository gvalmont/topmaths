<script lang="ts">
  import { ouvrirModaleExercices } from '../../services/modale'

  interface seance {
    description: string;
    slug: string;
  }

  const seances = [
    {
      description: 'Juste des segments',
      slug: '58711'
    },
    {
      description: 'Seulement des segments',
      slug: '58713'
    },
    {
      description: 'Avec des droites et des demi-droites',
      slug: '58733'
    },
    {
      description: 'Juste des cercles et des arcs de cercles',
      slug: '58735'
    },
    {
      description: 'Des droites et des cercles pour des experts',
      slug: '58737'
    },
    {
      description: 'Avec des macros',
      slug: '58739'
    }
  ] as seance[]
</script>

<svelte:head>
  <title>SPS2 : Défis géométriques</title>
</svelte:head>

<h1 class="title is-2 is-tout mb-0">Défis géométriques</h1>
<div class="is-tout is-fin">
  <p class="is-size-5">
    <br />
    Des défis géométriques à relever.<br />
    Allez-vous réussir à reproduire ces figures ?
  </p>
  <br />
  <p class="is-size-6 is-italic">
    (Ce sont les mêmes défis que dans le porte-vues jaune)
  </p>
  {#each seances as seance, i}
    <div>
      <h2 class="mt-5 py-3 subtitle is-3 is-tout">
        Groupe {i + 1} : {seance.description}
      </h2>
      <button
        on:click={() =>
          ouvrirModaleExercices(
            'https://www.geogebra.org/m/Rn6QDFCN#chapter/' + seance.slug
          )}
      >
        <img
          src="topmaths/img/sps2/{seance.slug}.png"
          alt="Capture d'écran de travaux accessibles par ce lien"
        />
      </button>
    </div>
  {/each}
  <div><br /><br /></div>
</div>
