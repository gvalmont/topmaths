<script lang="ts">
  import ListItemPdfDownload from '../../shared/ListItemPdfDownload.svelte'
</script>

<div
  class="grade-container is-5e
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title mb-8
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Comment installer Anki
  </h1>
  <div class="p-8">
    Dans ce tuto nous allons voir comment installer Anki sur Android et sur iOS.
  </div>
  <h2
    class="title
    text-xl md:text-3xl"
  >
    Android
  </h2>
  <div class="p-8">
    <ul class="inline-block list-decimal text-left">
      <li>
        Installer
        <a
          href="https://play.google.com/store/apps/details?id=com.ichi2.anki&pli=1"
          target="_blank"
          rel="noopener noreferrer"
        >
          AnkiDroid
        </a>
      </li>
      <li>
        Télécharger le paquet de
        <a
          href="https://topmaths.fr/topmaths/telechargements/tables_de_multiplication_anki.apkg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tables de multiplication
        </a>
        ainsi que le paquet de
        <a
          href="https://topmaths.fr/topmaths/telechargements/Topmaths.apkg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Topmaths
        </a>
      </li>
      <li>Les ouvrir avec AnkiDroid</li>
    </ul>
  </div>
  <h2
    class="title
    text-xl md:text-3xl"
  >
    iOS
  </h2>
  <h3
    class="subtitle
    text-lg md:text-2xl"
  >
    Version payante
  </h3>
  <div class="p-8">
    <ul class="inline-block list-decimal text-left">
      <li>
        Acheter
        <a
          href="https://apps.apple.com/us/app/ankimobile-flashcards/id373493387"
          target="_blank"
          rel="noopener noreferrer"
        >
          AnkiMobile à 29,99 €
        </a>
        <span class="text-sm md:text-base">
          (ce n'est pas un abonnement, on le paye une fois et on l'a pour toute
          la vie et jusqu'à 6 personnes de la famille peuvent en profiter)
        </span>
      </li>
      <li>
        Télécharger le paquet de
        <a
          href="https://topmaths.fr/topmaths/telechargements/tables_de_multiplication_anki.apkg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tables de multiplication
        </a>
        ainsi que le paquet de
        <a
          href="https://topmaths.fr/topmaths/telechargements/Topmaths.apkg"
          target="_blank"
          rel="noopener noreferrer"
        >
          Topmaths
        </a>
      </li>
      <li>Les ouvrir avec AnkiMobile</li>
    </ul>
  </div>
  <h3
    class="subtitle
    text-lg md:text-2xl"
  >
    Version gratuite
  </h3>
  <div class="p-8">
    L'installation de la version gratuite est un peu plus compliquée, elle est
    détaillée dans
    <a
      href="topmaths/tutos/tutos/installation-anki.pdf"
      target="_blank"
      rel="noopener noreferrer"
    >
      le pdf qui accompagne ce tuto
    </a>
    et dans la vidéo ci-dessous.
  </div>
  <div class="is-16by9">
    <iframe
      src="https://tube-numerique-educatif.apps.education.fr/videos/embed/0c96a8a2-9cff-4862-8439-68557179e9cc"
      title="Installation et utilisation Anki sur iOS (sans avoir à payer l'application)"
      allowfullscreen
    ></iframe>
  </div>
  <div class="p-8">
    <ListItemPdfDownload
      displayCondition={true}
      href="topmaths/tutos/tutos/installation-anki.pdf"
      label="Télécharger la version pdf"
      grade="5e"
    />
  </div>
</div>
