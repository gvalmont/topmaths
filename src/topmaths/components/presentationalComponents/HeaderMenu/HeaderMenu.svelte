<script lang="ts">
  import type { View } from '../../../types/navigation'
  import HeaderMenuItem from './HeaderMenuItem.svelte'

  export let isCartEmpty: boolean
  export let view: View
  export let goToView: (event: MouseEvent, view: View) => void

</script>

<div class="flex overflow-hidden overflow-x-auto pb-6 md:pb-9">
  <ul class="flex flex-grow justify-center tabs-menu hover:text-white">
    <HeaderMenuItem
      destinationView={'home'}
      isActive={view === 'home'}
      color={'warning'}
      imageSrc={'topmaths/img/cc0/homepage-svgrepo-com.svg'}
      imageAlt={'Maison'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'sequences'}
      isActive={view === 'sequences' || view === 'sequence'}
      color={'info-darker'}
      imageSrc={'topmaths/img/cc0/guest-book-svgrepo-com.svg'}
      imageAlt={'Livre ouvert'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'objectifs'}
      isActive={view === 'objectifs' || view === 'objectif'}
      color={'link'}
      imageSrc={'topmaths/img/cc0/study-2-svgrepo-com.svg'}
      imageAlt={'Personne lisant un livre'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'revisions'}
      isActive={view === 'revisions'}
      color={'sponsor'}
      imageSrc={'topmaths/img/gvalmont/automatismes-regular.svg'}
      imageAlt={'Tête avec un engrenage à l\'intérieur'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'eleves'}
      isActive={view === 'eleves' || view === 'lexique' || view === 'tutos' || view === 'telechargements'}
      color={'purple'}
      imageSrc={'topmaths/img/cc0/backpack-svgrepo-com.svg'}
      imageAlt={'Sac à dos d\'élève'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'outils'}
      isActive={view === 'outils' || view === 'mathador' || view === 'progressions'}
      color={'green'}
      imageSrc={'topmaths/img/cc0/classroom-svgrepo-com.svg'}
      imageAlt={'Enseignant qui montre un tableau à une classe'}
      {goToView}
    />
    <HeaderMenuItem
      destinationView={'panier'}
      isDisplayed={!isCartEmpty}
      isActive={view === 'panier'}
      color={'fuchsia'}
      imageSrc={'topmaths/img/cc0/cart-content-svgrepo-com.svg'}
      imageAlt={'Caddie'}
      {goToView}
    />
  </ul>
</div>
