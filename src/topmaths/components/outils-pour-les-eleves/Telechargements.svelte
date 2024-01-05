<script lang="ts">
  const telechargements = [
    {
      titre: 'Tables de multiplication',
      slug: 'tables_de_multiplication_anki',
      description: 'Paquet Anki',
      extension: 'apkg'
    },
    {
      titre: 'Tables de multiplication',
      slug: 'tables_de_multiplication_A5',
      description: 'Grand format (A5)',
      extension: 'pdf'
    },
    {
      titre: 'Tables de multiplication',
      slug: 'tables_de_multiplication_A6',
      description: 'Petit format (A6)',
      extension: 'pdf'
    },
    {
      titre: 'Tableau de numération',
      slug: 'tableau_de_numeration_decimaux',
      description: 'Nombres décimaux',
      extension: 'pdf'
    },
    {
      titre: 'Tableau de numération',
      slug: 'tableau_de_numeration_entiers',
      description: 'Nombres entiers',
      extension: 'pdf'
    }
  ]
</script>

<svelte:head>
  <title>Téléchargements - topmaths</title>
</svelte:head>

<div class="flex flex-wrap">
  {#each telechargements as telechargement}
    <div class="card m-5" style="width: 256px;">
      <header class="card-header">
        <p class="card-header-title">
          {telechargement.titre}
          <br>
          <span style="font-weight: normal;"></span>
        </p>
        <button class="card-header-icon is-danger">
          <span class="icon">
            {#if telechargement.extension === 'pdf'}
              <i class="image is-24x24 is-inline-block">
                <img src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg" alt="Icone de PDF" />
              </i>
            {:else if telechargement.extension === 'apkg'}
              <div class="image is-32x32 is-inline-block">
                <img src="/topmaths/img/gnu/anki-icon.svg" alt="Icone de Anki" />
              </div>
            {/if}
          </span>
        </button>
      </header>
      <div class="card-image">
        <figure class="image is-4by3">
          <img src="/topmaths/telechargements/apercus/{telechargement.slug}.png" alt="Aperçu du {telechargement.extension}">
        </figure>
      </div>
      <div class="card-content p-4">
        <div class="content has-text-centered">
          {telechargement.description}
        </div>
      </div>
      <footer class="card-footer">
        <a href="/topmaths/telechargements/{telechargement.slug}.{telechargement.extension}" class="card-footer-item">
          <button class="button is-link is-outlined">Télécharger</button>
        </a>
      </footer>
    </div>
  {/each}
</div>
