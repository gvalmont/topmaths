<script lang="ts">
  import { buildThemeFromReference } from '../../../services/reference'
  import type { View } from '../../../types/navigation'
  import type { ObjectiveReference } from '../../../types/objective'

  export let reference: ObjectiveReference
  export let title: string
  export let goToView: (event: MouseEvent, view: View, reference: ObjectiveReference) => void

</script>

<div class="flex flex-row grow w-full is-theme-{buildThemeFromReference(reference)}">
  <div class="w-2/12 flex items-center justify-center">
    <a
      class="is-interactive"
      href='?v=objective&ref={reference}'
      on:click={(event) => goToView(event, 'objective', reference)}
    >
      {reference}
    </a>
  </div>
  <div class="w-10/12 flex items-center justify-start text-left">
    {title}
  </div>
</div>

<style lang="scss">
  @import '../../../styles/tailwind-colors.scss';

  @mixin theme-style($class-name, $main-color, $light-color) {
    .#{$class-name} {
      background-color: #{$light-color};
        a {
          color: $topmaths-corpus-default;
          text-decoration: underline;
          :global(.dark) & {
            color: #{$main-color};
          }
        }
      :global(.dark) & {
        background-color: $topmathsdark-canvas-default;
        color: #{$main-color};
      }
    }
  }

  @include theme-style('is-theme-nombres', #e99384, #f8c8c0);
  @include theme-style('is-theme-gestion', #9f84e4, #c6b9e7);
  @include theme-style('is-theme-grandeurs', #deb273, #ffddaf);
  @include theme-style('is-theme-geo', #7bd9ec, #aff2ff);
</style>
