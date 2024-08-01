<script lang="ts">
  import type { ThemeColor } from '../../types/color'

  export let color: ThemeColor
  export let src: string
  export let alt: string

</script>

<img
  {src}
  {alt}
  class="image is-{color} size-8 md:size-12"
/>

<style>
  img.is-white {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(93deg) brightness(103%) contrast(103%);
  }

  img.is-warning {
    filter: invert(73%) sepia(96%) saturate(209%) hue-rotate(346deg) brightness(104%) contrast(103%);
  }

  img.is-link {
    filter: invert(29%) sepia(98%) saturate(796%) hue-rotate(203deg) brightness(101%) contrast(88%);
  }

  img.is-info {
    filter: invert(49%) sepia(45%) saturate(746%) hue-rotate(165deg) brightness(94%) contrast(83%);
  }

  img.is-danger {
    filter: invert(44%) sepia(73%) saturate(4057%) hue-rotate(324deg) brightness(98%) contrast(92%);
  }

  img.is-primary {
    filter: invert(56%) sepia(99%) saturate(1427%) hue-rotate(128deg) brightness(97%) contrast(103%);
  }

  img.is-success {
    filter: invert(67%) sepia(17%) saturate(1218%) hue-rotate(101deg) brightness(96%) contrast(92%);
  }

  img.is-sponsor {
    filter: invert(41%) sepia(47%) saturate(2515%) hue-rotate(298deg) brightness(97%) contrast(88%);
  }

  img.is-orange {
    filter: invert(80%) sepia(16%) saturate(1434%) hue-rotate(326deg) brightness(103%) contrast(98%);
  }

  img.is-fuchsia {
    filter: invert(66%) sepia(95%) saturate(7499%) hue-rotate(280deg) brightness(89%) contrast(100%);
  }

  img.is-black-and-yellow {
    filter: invert(0%) sepia(7%) saturate(7470%) hue-rotate(19deg) brightness(101%) contrast(108%);
  }

  img.is-green {
    filter: invert(43%) sepia(81%) saturate(478%) hue-rotate(89deg) brightness(98%) contrast(91%);
  }

  img.is-coopmaths {
    filter: invert(47%) sepia(27%) saturate(6447%) hue-rotate(345deg) brightness(97%) contrast(95%);
  }

  img.is-purple {
    filter: invert(22%) sepia(70%) saturate(3716%) hue-rotate(264deg) brightness(94%) contrast(95%);
  }

  img.is-info-darker {
    filter: invert(42%) sepia(53%) saturate(1203%) hue-rotate(190deg) brightness(88%) contrast(84%);
  }
</style>
