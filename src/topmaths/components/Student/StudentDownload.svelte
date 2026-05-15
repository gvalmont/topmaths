<script lang="ts">
  import SvgIcon from '../shared/SvgIcon.svelte'

  const downloads = [
    {
      title: 'Tables de multiplication',
      slug: 'tables_de_multiplication_anki',
      description: 'Paquet Anki',
      extension: 'apkg',
    },
    {
      title: 'Tables de multiplication',
      slug: 'tables_de_multiplication_A5',
      description: 'Grand format (A5)',
      extension: 'pdf',
    },
    {
      title: 'Tables de multiplication',
      slug: 'tables_de_multiplication_A6',
      description: 'Petit format (A6)',
      extension: 'pdf',
    },
    {
      title: 'Tableau de numération',
      slug: 'tableau_de_numeration_decimaux',
      description: 'Nombres décimaux',
      extension: 'pdf',
    },
    {
      title: 'Tableau de numération',
      slug: 'tableau_de_numeration_entiers',
      description: 'Nombres entiers',
      extension: 'pdf',
    },
  ]
</script>

<svelte:head>
  <title>Téléchargements - topmaths</title>
</svelte:head>

<div class="flex flex-wrap">
  {#each downloads as download}
    <div
      class="m-5 border-2 flex flex-col
      border-gray-300 dark:border-gray-500
      rounded-lg md:rounded-xl
      w-[180px] md:w-[240px]
      text-base md:text-lg"
    >
      <h3 class="flex flex-col">
        {download.title}
        <span class="mx-auto">
          {#if download.extension === 'pdf'}
            <SvgIcon
              class="size-6 md:size-8 text-is-danger"
              src="/topmaths/img/cc0/pdf-file-format-symbol-svgrepo-com.svg"
              alt="Icone de PDF"
            />
          {:else if download.extension === 'apkg'}
            <img
              class="w-6 md:w-8"
              src="/topmaths/img/gnu/anki-icon.svg"
              alt="Icone de Anki"
            />
          {/if}
        </span>
      </h3>
      <img
        src="/topmaths/telechargements/apercus/{download.slug}.png"
        alt="Aperçu du {download.extension}"
      />
      {download.description}
      <a
        class="mt-2 mb-4"
        href="/topmaths/telechargements/{download.slug}.{download.extension}"
      >
        <button
          class="button is-link border
          rounded md:rounded-lg
          py-1 md:py-2
          px-4 md:px-6"
        >
          Télécharger
        </button>
      </a>
    </div>
  {/each}
</div>
