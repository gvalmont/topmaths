<script lang="ts">
  import iepLoadPromise from 'instrumenpoche'
  import { onDestroy, onMount } from 'svelte'
  import type { Unsubscriber, Writable } from 'svelte/store'
  import { mathaleaRenderDiv } from '../../../../lib/mathalea'
  import { goToView } from '../../../services/navigation'
  import {
    isPersonalMode,
    isTeacherMode,
    objectives,
  } from '../../../services/store'
  import { getTitle } from '../../../services/string'
  import { emptyObjective, type Objective } from '../../../types/objective'
  import { deepCopy, isEmptyArrayRecord } from '../../../types/shared'
  import ObjectiveRegularDownloads from './presentationalComponents/ObjectiveRegularDownloads.svelte'
  import ObjectiveRegularExamExercises from './presentationalComponents/ObjectiveRegularExamExercises.svelte'
  import ObjectiveRegularExercises from './presentationalComponents/ObjectiveRegularExercises.svelte'
  import ObjectiveRegularLessonSummary from './presentationalComponents/ObjectiveRegularLessonSummary.svelte'
  import ObjectiveRegularPrerequisites from './presentationalComponents/ObjectiveRegularPrerequisites.svelte'
  import ObjectiveRegularUnits from './presentationalComponents/ObjectiveRegularUnits.svelte'
  import ObjectiveRegularVideos from './presentationalComponents/ObjectiveRegularVideos.svelte'

  export let objectiveReference: Writable<string>

  let objective: Objective = deepCopy(emptyObjective)
  let objectiveReferenceUnsubscriber: Unsubscriber

  onMount(() => {
    objectiveReferenceUnsubscriber =
      objectiveReference.subscribe(updateObjective)
  })

  onDestroy(() => {
    objectiveReferenceUnsubscriber()
  })

  function updateObjective(): void {
    objective =
      $objectives.find(
        (objective) => objective.reference === $objectiveReference,
      ) || deepCopy(emptyObjective)
  }

  function loadIep(): void {
    const url = `topmaths/data/instrumenpoche/${objective.lessonSummaryInstrumenpoche}.xml`
    fetch(url)
      .then((response) => response.text())
      .then((xml) => {
        const container = document.getElementById('divIEP')
        iepLoadPromise(container, xml).catch((error: Error) => {
          console.error(error)
        })
      })
      .catch((error) => {
        console.error(error)
      })
  }
</script>

<svelte:head>
  <title>{objective.reference + ' : ' + getTitle(objective)}</title>
</svelte:head>

<div
  class="grade-container is-{objective.grade}
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    {objective.reference + ' : ' + getTitle(objective)}
  </h1>
  {#if objective.prerequisites.length > 0 || $isTeacherMode}
    <ObjectiveRegularPrerequisites
      prerequisites={objective.prerequisites}
      {goToView}
      objectiveReference={objective.reference}
      isTeacherMode={$isTeacherMode}
    />
  {/if}
  {#if objective.lessonSummaryHTML || objective.lessonSummaryImage || objective.lessonSummaryInstrumenpoche || objective.lessonImages.length > 0}
    <ObjectiveRegularLessonSummary {objective} {mathaleaRenderDiv} {loadIep} />
  {/if}
  {#if objective.videos.length > 0 || objective.lessonVideos.length > 0}
    <ObjectiveRegularVideos
      videos={objective.videos}
      lessonVideos={objective.lessonVideos}
    />
  {/if}
  {#if objective.exercises.length > 0}
    <ObjectiveRegularExercises
      reference={objective.reference}
      exercises={objective.exercises}
      videos={objective.videos}
      exercisesLink={objective.exercisesLink}
      objectiveTitle={getTitle(objective)}
    />
  {/if}
  {#if objective.examExercisesLink}
    <ObjectiveRegularExamExercises
      examExercises={objective.examExercises}
      examExercisesLink={objective.examExercisesLink}
      videos={objective.videos}
      objectiveReference={objective.reference}
    />
  {/if}
  {#if objective.downloadLinks.practiceSheetLink || ($isTeacherMode && objective.downloadLinks.testSheetLink) || ($isPersonalMode && !isEmptyArrayRecord(objective.downloadLinks.lessonPlanLinks))}
    <ObjectiveRegularDownloads
      grade={objective.grade}
      practiceSheetLink={objective.downloadLinks.practiceSheetLink}
      testSheetLink={objective.downloadLinks.testSheetLink}
      lessonPlanLinks={objective.downloadLinks.lessonPlanLinks}
      isPersonalMode={$isPersonalMode}
      isTeacherMode={$isTeacherMode}
    />
  {/if}
  {#if objective.units.length > 0}
    <ObjectiveRegularUnits units={objective.units} {goToView} />
  {/if}
</div>
