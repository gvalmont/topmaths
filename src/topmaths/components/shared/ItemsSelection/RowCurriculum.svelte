<script lang="ts">
  import { buildThemeFromReference } from '../../../services/reference'
  import type { View } from '../../../types/navigation'
  import type { ObjectiveReference } from '../../../types/objective'
  import Tooltip from '../Tooltip.svelte'

  export let reference: ObjectiveReference
  export let isKey: boolean = false
  export let title: string
  export let goToView: (event: MouseEvent, view: View, reference: ObjectiveReference) => void
  export let isLastRow: boolean

</script>

<div class="flex flex-row grow w-full is-theme-{buildThemeFromReference(reference)}
  {isLastRow ? 'rounded-br-4xl md:rounded-br-5xl' : ''}"
>
  <div class="w-2/12 flex items-center justify-center">
    {#if isKey}
      <Tooltip
        dropdownText="Idée maîtresse"
        class="is-danger m-0.5 border border-is-danger rounded"
      >
        <a
          class="is-interactive p-1"
          href='?v=objective&ref={reference}'
          on:click={(event) => goToView(event, 'objective', reference)}
        >
          {reference}
        </a>
      </Tooltip>
    {:else}
      <a
        class="is-interactive p-1 m-0.5"
        href='?v=objective&ref={reference}'
        on:click={(event) => goToView(event, 'objective', reference)}
      >
        {reference}
      </a>
    {/if}
  </div>
  <div class="w-10/12 flex items-center justify-start text-left">
    {title}
  </div>
</div>

<style lang="scss">
  @use '../../../styles/tailwind-colors.scss';

  @mixin theme-style($class-name, $main-color, $light-color) {
    .#{$class-name} {
      background-color: #{$light-color};
        a {
          color: tailwind-colors.$topmaths-corpus-default;
          text-decoration: underline;
          :global(.dark) & {
            color: #{$main-color};
          }
        }
      :global(.dark) & {
        background-color: tailwind-colors.$topmathsdark-canvas-default;
        color: #{$main-color};
      }
    }
  }

  @include theme-style('is-theme-nombres', #e99384, #f8c8c0);
  @include theme-style('is-theme-gestion', #9f84e4, #c6b9e7);
  @include theme-style('is-theme-grandeurs', #deb273, #ffddaf);
  @include theme-style('is-theme-geo', #7bd9ec, #aff2ff);
</style>
