<script lang="ts">
  import {
    isPersonalMode,
    isTeacherMode,
    units
  } from '../../../../services/store'
  import { emptyUnit, type Unit, type UnitLessonPlan } from '../../../../types/unit'
  import { onMount } from 'svelte'
  import UnitRegularObjectives from './UnitRegularObjectives.svelte'
  import type { Reference, View } from '../../../../types/navigation'
  import UnitRegularAssessment from './UnitRegularAssessment.svelte'
  import UnitRegularDownloads from './UnitRegularDownloads.svelte'
  import UnitRegularReviews from './UnitRegularReviews.svelte'
  import { isReferenceIgnored } from '../../../../services/reference'

  export let unitReference
  export let goToView: (event: MouseEvent, view: View, reference: Reference) => void
  let unit: Unit = emptyUnit
  let lessonPlansWithReviews: UnitLessonPlan[] = []

  onMount(() => {
    unit = $units.find((unitFound) => unitFound.reference === unitReference) || emptyUnit
    lessonPlansWithReviews = unit.objectives
      .filter(objective => !isReferenceIgnored(objective.reference))
      .map(objective => objective.lessonPlans)
      .flat()
      .filter(lessonPlan => lessonPlan.consolidationLink !== '' || lessonPlan.prerequisiteLink !== '')
  })

</script>

<svelte:head>
  <title>Séquence {unit.number} : {unit.title}</title>
</svelte:head>

<div class="grade-container is-{unit.grade}
  rounded-4xl md:rounded-5xl"
>
  <h1 class="title
    text-2xl md:text-5xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Séquence {unit.number} :<br />{unit.title}
  </h1>
  <UnitRegularObjectives
    {unit}
    {goToView}
  />
  {#if $isTeacherMode && lessonPlansWithReviews.length > 0}
    <UnitRegularReviews
      lessonPlans={lessonPlansWithReviews}
      {goToView}
    />
  {/if}
  <UnitRegularAssessment
    {unit}
  />
  {#if unit.downloadLinks.lessonLink || unit.downloadLinks.lessonSummaryLink || unit.downloadLinks.missionLink || ($isPersonalMode && unit.downloadLinks.lessonPlanLink) }
    <UnitRegularDownloads
      {unit}
      isPersonalMode={$isPersonalMode}
    />
  {/if}
</div>
