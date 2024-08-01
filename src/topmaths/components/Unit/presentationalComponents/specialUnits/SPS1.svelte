<script lang="ts">
  const seances = [
    "Séquences d'instructions",
    'Boucles simples',
    'Boucles à motif',
    'Boucles imbriquées',
    'Conditions',
    'Variables',
    'Boucles conditionnelles',
    'Procédures'
  ]
</script>

<svelte:head>
  <title>SPS1 : Programmation</title>
</svelte:head>

<h1 class="title text-2xl md:text-4xl font-semibold p-4 is-tout">Programmation</h1>
<div class="is-tout is-fin">
  <h2 class="subtitle text-xl md:text-3xl p-3 is-tout">Initiation : Lightbot Hour</h2>
  <div class="mb-8">
    <div class="flex flex-col justify-center mb-6">
      <img class="mx-auto m-8 w-[140px] md:w-[200px]" src="/topmaths/img/sps1/lightbot.png" alt="Logo de l'application Lightbot Hour"/><br /><br />
      <div class="flex flex-row align-middle mx-auto">
        <a
          href="https://play.google.com/store/apps/details?id=com.lightbot.lightbothoc&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
        >
          <img
            class="h-16 md:h-20"
            src="https://play.google.com/intl/en_us/badges/static/images/badges/fr_badge_web_generic.png"
            alt="Disponible sur Google Play"
          />
        </a>
        <a
          class="flex align-middle"
          href="https://apps.apple.com/us/app/lightbot-code-hour/id873943739?itsct=apps_box_badge&amp;itscg=30200"
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
  <a href="https://concours.castor-informatique.fr/?">
    <h2 class="subtitle text-xl md:text-3xl p-3 is-tout">
      Continuer une séance Algorea
    </h2>
  </a>
  <p class="p-8 text-zinc-600 text-sm md:text-base">
    Il y a eu un bug ? Tu as eu un problème de connexion ?<br />
    Ou tu veux juste continuer à la maison la séance que tu as commencée en classe
    ?<br />
    Si tu as bien noté ton code, tu peux reprendre là où tu en étais grâce à
    ce bouton :<br /><br />
    <a href="https://concours.castor-informatique.fr/?"
      ><button class="button is-link rounded p-2 px-4 "
        >Continuer une séance Algorea</button
      ></a
    >
  </p>
  <ul>
    {#each seances as seance, i}
      <li>
        <a href="https://concours.castor-informatique.fr/?team=seriousg{i + 1}">
          <h2 class="subtitle text-xl md:text-3xl p-3 is-tout">
            Séance {i + 1} : Algorea - {seance}
          </h2>
          <img class="mx-auto p-6 md:p-8 w-[300px] md:w-[400px]"
            src="topmaths/img/sps1/seance_seriousgame_0{i + 1}.png"
            alt="Capture d'écran de la séance {i + 1} d'Algoréa"
          />
        </a>
      </li>
    {/each}
  </ul>
</div>
