<script lang="ts">
  import TabsMenuLink from './TabsMenuLink.svelte'

  export let isMd: boolean
  export let isBasketAvailable: boolean
  export let vue: string
  export let onHeadTabsMenuClicked: (event: MouseEvent, vue: string) => void

</script>

<div class="overflow-scrolling-touch flex overflow-hidden overflow-x-auto">
  <ul class="flex flex-grow justify-center tabs-menu hover:text-white">
    <TabsMenuLink
      destinationVue={'accueil'}
      activeCondition={vue === 'accueil' || vue === ''}
      color={'warning'}
      imgSrc={'topmaths/img/cc0/homepage-svgrepo-com.svg'}
      imgAlt={'Maison'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'sequences'}
      activeCondition={vue === 'sequences' || vue === 'sequence'}
      color={'info-darker'}
      imgSrc={'topmaths/img/cc0/guest-book-svgrepo-com.svg'}
      imgAlt={'Livre ouvert'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'objectifs'}
      activeCondition={vue === 'objectifs' || vue === 'objectif'}
      color={'link'}
      imgSrc={'topmaths/img/cc0/study-2-svgrepo-com.svg'}
      imgAlt={'Personne lisant un livre'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'revisions'}
      activeCondition={vue === 'revisions'}
      color={'sponsor'}
      imgSrc={'topmaths/img/gvalmont/automatismes-regular.svg'}
      imgAlt={'Tête avec un engrenage à l\'intérieur'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'eleves'}
      activeCondition={vue === 'eleves' || vue === 'lexique' || vue === 'tutos' || vue === 'telechargements'}
      color={'purple'}
      imgSrc={'topmaths/img/cc0/backpack-svgrepo-com.svg'}
      imgAlt={'Sac à dos d\'élève'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'outils'}
      activeCondition={vue === 'outils' || vue === 'mathador' || vue === 'progressions'}
      color={'green'}
      imgSrc={'topmaths/img/cc0/classroom-svgrepo-com.svg'}
      imgAlt={'Enseignant qui montre un tableau à une classe'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
    <TabsMenuLink
      destinationVue={'panier'}
      displayCondition={isBasketAvailable}
      activeCondition={vue === 'panier'}
      color={'fuchsia'}
      imgSrc={'topmaths/img/cc0/cart-content-svgrepo-com.svg'}
      imgAlt={'Caddie'}
      {isMd}
      {onHeadTabsMenuClicked}
    />
  </ul>
</div>
