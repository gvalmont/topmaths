<script lang="ts">
  const seances = [
    "Séquences d'instructions",
    'Boucles simples',
    'Boucles à motif',
    'Boucles imbriquées',
    'Conditions',
    'Variables',
    'Boucles conditionnelles',
    'Procédures',
  ]
</script>

<svelte:head>
  <title>SPS1 : Programmation</title>
</svelte:head>

<div
  class="grade-container is-tout
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Programmation
  </h1>
  <h2
    class="subtitle
    text-xl md:text-3xl"
  >
    Initiation : Lightbot Hour
  </h2>
  <div class="mb-8">
    <div class="flex flex-col justify-center mb-6">
      <img
        class="mx-auto m-8 w-[140px] md:w-[200px]"
        src="/topmaths/img/sps1/lightbot.png"
        alt="Logo de l'application Lightbot Hour"
      />
      <div class="flex flex-row align-middle mx-auto">
        <a
          href="https://play.google.com/store/apps/details?id=com.lightbot.lightbothoc&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="h-12 md:h-16"
            src="/topmaths/img/sps1/GetItOnGooglePlay_Badge_Web_color_French.png"
            alt="Disponible sur Google Play"
          />
        </a>
        <a
          class="flex align-middle"
          href="https://apps.apple.com/us/app/lightbot-code-hour/id873943739?itsct=apps_box_badge&amp;itscg=30200"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            class="h-12 md:h-16 m-auto"
            src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/fr-fr?size=250x83&amp;releaseDate=1399507200&h=3048f79da1f98cd11c6a5412485c29d2"
            alt="Download on the App Store"
          />
        </a>
      </div>
    </div>
    <p class="text-xs md:text-sm">
      Google Play and the Google Play logo are trademarks of Google LLC. &nbsp;
      App Store and the App Store logo are trademarks of Apple Inc.
    </p>
  </div>
  <a
    class="is-interactive"
    href="https://concours.castor-informatique.fr/?"
    target="_blank"
    rel="noopener noreferrer"
  >
    <h2 class="subtitle text-xl md:text-3xl p-3">
      Continuer une séance Algorea
    </h2>
  </a>
  <p class="p-8">
    Il y a eu un bug ? Tu as eu un problème de connexion ?<br />
    Ou tu veux juste continuer à la maison la séance que tu as commencée en classe
    ?<br />
    Si tu as bien noté ton code, tu peux reprendre là où tu en étais grâce à ce bouton
    :
  </p>
  <a
    href="https://concours.castor-informatique.fr/?"
    target="_blank"
    rel="noopener noreferrer"
  >
    <button class="button is-link border rounded p-2 mb-8">
      Continuer une séance Algorea
    </button>
  </a>
  <ul>
    {#each seances as seance, i}
      <li>
        <a
          class="is-interactive"
          href="https://concours.castor-informatique.fr/?team=seriousg{i + 1}"
        >
          <h2 class="subtitle text-xl md:text-3xl p-3">
            Séance {i + 1} : Algorea - {seance}
          </h2>
          <img
            class="mx-auto
              p-6 md:p-8
              w-[300px] md:w-[400px]"
            src="topmaths/img/sps1/seance_seriousgame_0{i + 1}.png"
            alt="Capture d'écran de la séance {i + 1} d'Algoréa"
          />
        </a>
      </li>
    {/each}
  </ul>
</div>
