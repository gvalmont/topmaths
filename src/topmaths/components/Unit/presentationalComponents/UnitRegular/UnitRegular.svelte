<script lang="ts">
  import {
    isPersonalMode,
    isTeacherMode,
    units,
  } from '../../../../services/store'
  import {
    emptyUnit,
    type Unit,
    type UnitLessonPlan,
  } from '../../../../types/unit'
  import { onMount } from 'svelte'
  import UnitRegularObjectives from './UnitRegularObjectives.svelte'
  import type { Reference, View } from '../../../../types/navigation'
  import UnitRegularAssessment from './UnitRegularAssessment.svelte'
  import UnitRegularDownloads from './UnitRegularDownloads.svelte'

  export let unitReference
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: Reference,
  ) => void
  let unit: Unit = emptyUnit

  onMount(() => {
    unit =
      $units.find((unitFound) => unitFound.reference === unitReference) ||
      emptyUnit
  })
</script>

<svelte:head>
  <title>Séquence {unit.number} : {unit.title}</title>
</svelte:head>

<div
  class="grade-container is-{unit.grade}
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-5xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Séquence {unit.number} :<br />{unit.title}
  </h1>
  <UnitRegularObjectives {unit} {goToView} isTeacherMode={$isTeacherMode} />
  <UnitRegularAssessment {unit} />
  {#if unit.downloadLinks.lessonLink || unit.downloadLinks.lessonSummaryLink || unit.downloadLinks.missionLink || ($isPersonalMode && unit.downloadLinks.lessonPlanLink)}
    <UnitRegularDownloads {unit} isPersonalMode={$isPersonalMode} />
  {/if}
</div>
