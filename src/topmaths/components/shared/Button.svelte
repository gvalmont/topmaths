<script lang="ts">

</script>

<button
  class="button {$$props.class}"
  disabled={$$props.disabled}
  on:mouseenter
  on:mouseleave
  on:focus
  on:blur
  on:click
>
  <slot />
</button>

<style lang="scss">
  @mixin button-style($class-name, $border-color, $light-color) {
    &.#{$class-name} {
      background-color: transparent;
      border-color: #{$border-color};
      color: #{$border-color};

      &:focus,
      &:hover,
      &.is-active {
        background-color: #{$border-color};
        color: #fff;
      }

      &[disabled] {
        background-color: transparent;
        border-color: #{$border-color};
        box-shadow: none;
        color: #{$border-color};

        &:focus,
        &:hover,
        &.is-active {
          color: #fff;
        }
      }

      &.is-light {
        background-color: #fdedf6;
        color: #{$light-color};

        &.is-hovered,
        &:hover {
          background-color: #fce1f1;
          border-color: transparent;
          color: #{$light-color};
        }

        &.is-active,
        &:active {
          background-color: #fad6ec;
          border-color: transparent;
          color: #{$light-color};
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

    @include button-style('is-sponsor', '#ea4aaa', '#c0167c');
    @include button-style('is-fuchsia', '#c75ad5', '#c75ad5');
    @include button-style('is-green', '#16A34A', '#16A34A');
    @include button-style('is-link', '#485fc7', '#eff1fa');
    @include button-style('is-info', '#3e8ed0', '#296fa8');
    @include button-style('is-warning', '#ffe08a', '#fff3d1');
    @include button-style('is-danger', '#f14668', '#fcd4dc');
    @include button-style('is-purple', '#9333ea', '#e93fa5');
    @include button-style('is-info-darker', '#4175d2', '#e93fa5');
    @include button-style('is-tout', '#feb60a', '#fffbeb');
  }

</style>
