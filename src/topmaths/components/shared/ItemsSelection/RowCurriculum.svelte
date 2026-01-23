<script lang="ts">
  import { isKey } from '../../../services/prerequisite'
  import { buildThemeFromReference } from '../../../services/reference'
  import { getTitle } from '../../../services/string'
  import type { StringGrade } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import type { ObjectiveReference } from '../../../types/objective'
  import type { UnitObjective } from '../../../types/unit'
  import ButtonPrerequisitesVisualization from '../ButtonPrerequisitesVisualization.svelte'
  import Tooltip from '../Tooltip.svelte'

  export let objective: UnitObjective
  export let gradeTeached: StringGrade
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: ObjectiveReference,
  ) => void
  export let isLastRow: boolean
</script>

<div
  class="flex flex-row grow w-full is-theme-{buildThemeFromReference(
    objective.reference,
  )}
  {isLastRow ? 'rounded-br-4xl md:rounded-br-5xl' : ''}"
>
  <div class="w-2/12 flex items-center justify-center">
    {#if isKey(objective)}
      <Tooltip
        dropdownText="Fondamental"
        class="is-danger m-0.5 border border-is-danger rounded"
      >
        <a
          class="is-interactive p-1"
          href="?v=objective&ref={objective.reference}"
          on:click={(event) =>
            goToView(event, 'objective', objective.reference)}
        >
          {objective.reference}
        </a>
      </Tooltip>
    {:else}
      <a
        class="is-interactive p-1 m-0.5"
        href="?v=objective&ref={objective.reference}"
        on:click={(event) => goToView(event, 'objective', objective.reference)}
      >
        {objective.reference}
      </a>
    {/if}
    <span class="is-black">
      <ButtonPrerequisitesVisualization
        objectiveReference={objective.reference}
        {gradeTeached}
      />
    </span>
  </div>
  <div class="w-10/12 flex items-center justify-start text-left">
    {getTitle(objective)}
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
      }
    }
  }

  @include theme-style('is-theme-nombres', #e99384, #f8c8c0);
  @include theme-style('is-theme-gestion', #9f84e4, #c6b9e7);
  @include theme-style('is-theme-grandeurs', #deb273, #ffddaf);
  @include theme-style('is-theme-geo', #7bd9ec, #aff2ff);
  @include theme-style('is-theme-algo', #ded273, #fffbbb);
</style>
