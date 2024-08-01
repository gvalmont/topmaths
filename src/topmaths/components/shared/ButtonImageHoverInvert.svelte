<script lang="ts">
  import type { ThemeColor } from '../../types/color'
  import ImageFiltered from './ImageFiltered.svelte'

  export let color: ThemeColor
  export let isActive: boolean = false
  export let imageSrc: string
  export let imageAlt: string

  let isHovered = false
</script>

<button
  class="tabs-menu-link {isActive ? 'is-actif' : ''} is-{color} py-2 md:py-3 px-3 md:px-4"
  on:mouseenter={() => { isHovered = true }}
  on:mouseleave={() => { isHovered = false }}
  on:click
>
  <ImageFiltered
    color={isHovered || isActive ? 'white' : color}
    src={imageSrc}
    alt={imageAlt}
  />
</button>

<style>
  /* Met en couleur le fond lors du survol */
  button:hover.is-warning {
    background-color: #ffe08a;
  }

  button:hover.is-link {
    background-color: #485fc7;
  }

  button:hover.is-info {
    background-color: #3e8ed0;
  }

  button:hover.is-danger {
    background-color: #f14668;
  }

  button:hover.is-primary {
    background-color: #00d1b2;
  }

  button:hover.is-success {
    background-color: #48c78e;
  }

  button:hover.is-orange {
    background-color: #FCBA82;
  }

  button:hover.is-sponsor {
    background-color: #ea4aaa;
  }

  button:hover.is-fuchsia {
    background-color: #c75ad5;
  }

  button:hover.is-black-and-yellow {
    background-color: #f7df1c;
  }

  button:hover.is-green {
    background-color: #16A34A;
  }

  button:hover.is-coopmaths {
    background-color: #F15929;
  }

  button:hover.is-purple {
    background-color: #9333ea;
  }

  button:hover.is-info-darker {
    background-color: #4175d2;
  }

  /* Met en couleur le fond de l'onglet actif */
  button.is-actif.is-warning {
    background-color: #ffe08a;
  }

  button.is-actif.is-link {
    background-color: #485fc7;
  }

  button.is-actif.is-info {
    background-color: #3e8ed0;
  }

  button.is-actif.is-danger {
    background-color: #f14668;
  }

  button.is-actif.is-primary {
    background-color: #00d1b2;
  }

  button.is-actif.is-success {
    background-color: #48c78e;
  }

  button.is-actif.is-orange {
    background-color: #FCBA82;
  }

  button.is-actif.is-sponsor {
    background-color: #ea4aaa;
  }

  button.is-actif.is-fuchsia {
    background-color: #c75ad5;
  }

  button.is-actif.is-black-and-yellow {
    background-color: #f7df1c;
  }

  button.is-actif.is-green {
    background-color: #16A34A;
  }

  button.is-actif.is-coopmaths {
    background-color: #F15929;
  }

  button.is-actif.is-purple {
    background-color: #9333ea;
  }

  button.is-actif.is-info-darker {
    background-color: #4175d2;
  }
</style>
