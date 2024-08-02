<script lang="ts">
  import type { ThemeColor } from '../../types/color'

  export let imageSrc: string = ''
  export let imageAlt: string = ''
  export let color: ThemeColor
  export let isActive: boolean = false

  let isHovered = false
  let isFocused = false
</script>

<button
  class="button is-{color}
    {isHovered || isFocused || isActive ? 'is-active' : ''}
    px-3 md:px-4
    py-2 md:py-3
    {$$props.class}"
  disabled={$$props.disabled}
  on:mouseenter={() => { isHovered = true }}
  on:mouseleave={() => { isHovered = false }}
  on:focus={() => { isFocused = true }}
  on:blur={() => { isFocused = false }}
  on:click
>
  <p
    class="shrink-0
      text-sm md:text-2xl
      {imageSrc !== '' ? 'w-2/3' : 'w-full'}"
  >
    <slot />
  </p>
  <img
    class="size-8 md:size-12"
    src={imageSrc}
    alt={imageAlt}
  />
</button>

<style lang="scss">
  $darkmode-bg-color: #282a36;
  $white-filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
  @mixin button-style($class-name, $main-color, $light-color, $filter) {
    &.#{$class-name} {
      background-color: transparent;
      border-color: #{$main-color};
      color: #{$main-color};
      &:focus,
      &:hover,
      &.is-active {
        background-color: #{$main-color};
        color: #fff;
        :global(.dark) & {
          background-color: $darkmode-bg-color;
          color: $main-color;
          text-shadow: 0 0 0.7rem $main-color;
          filter: drop-shadow(0 0 0.3em $main-color);
        }
      }
      &[disabled] {
        background-color: transparent;
        border-color: #{$main-color};
        box-shadow: none;
        color: #{$main-color};

        &:hover,
        &.is-active,
        &:active,
        &:focus {
          color: #fff;
        }
      }
      &.is-light {
        background-color: #fdedf6;
        color: #{$light-color};
        &:hover,
        &.is-active,
        &:active,
        &:focus {
          background-color: #fce1f1;
          border-color: transparent;
          color: #{$light-color};
        }
      }
      img {
        filter: $filter;
      }
      &.is-active img {
          filter: $white-filter;
          :global(.dark) & {
            color: #{$main-color};
            filter: $filter drop-shadow(0 0 0.4em $main-color);
          }
        }
    }
  }

  .button {
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    align-items: center;
    box-shadow: none;

    &:focus {
      outline: none;
    }

    &[disabled] {
      cursor: not-allowed;
    }

    @include button-style('is-sponsor', #ea4aaa, #c0167c, invert(41%) sepia(47%) saturate(2515%) hue-rotate(298deg) brightness(97%) contrast(88%));
    @include button-style('is-fuchsia', #c75ad5, #c75ad5, invert(66%) sepia(95%) saturate(7499%) hue-rotate(280deg) brightness(89%) contrast(100%));
    @include button-style('is-green', #16A34A, #16A34A, invert(43%) sepia(81%) saturate(478%) hue-rotate(89deg) brightness(98%) contrast(91%));
    @include button-style('is-link', #485fc7, #eff1fa, invert(29%) sepia(98%) saturate(796%) hue-rotate(203deg) brightness(101%) contrast(88%));
    @include button-style('is-info', #3e8ed0, #296fa8, invert(49%) sepia(45%) saturate(746%) hue-rotate(165deg) brightness(94%) contrast(83%));
    @include button-style('is-warning', #ffe08a, #fff3d1, invert(73%) sepia(96%) saturate(209%) hue-rotate(346deg) brightness(104%) contrast(103%));
    @include button-style('is-danger', #f14668, #fcd4dc, invert(44%) sepia(73%) saturate(4057%) hue-rotate(324deg) brightness(98%) contrast(92%));
    @include button-style('is-purple', #9333ea, #e93fa5, invert(22%) sepia(70%) saturate(3716%) hue-rotate(264deg) brightness(94%) contrast(95%));
    @include button-style('is-info-darker', #4175d2, #e93fa5, invert(42%) sepia(53%) saturate(1203%) hue-rotate(190deg) brightness(88%) contrast(84%));
    @include button-style('is-tout', #feb60a, #fffbeb, invert(82%) sepia(18%) saturate(7498%) hue-rotate(354deg) brightness(103%) contrast(99%));
  }

</style>
