<script lang="ts">
  import {
    isTeacherMode,
    isPersonalMode,
    objectives
  } from '../../../services/store'
  import { emptyObjective, type Objective } from '../../../types/objective'
  import { getTitle } from '../../../services/shared'
  import { goToView } from '../../../services/navigation'
  import { onMount } from 'svelte'
  import {
    mathaleaRenderDiv
  } from '../../../../lib/mathalea'
  import Cart from '../../../modules/Cart'
  import iepLoadPromise from 'instrumenpoche'
  import { isEmptyArrayRecord, deepCopy } from '../../../types/shared'
  import ObjectiveRegularLessonSummary from './presentationalComponents/ObjectiveRegularLessonSummary.svelte'
  import ObjectiveRegularVideos from './presentationalComponents/ObjectiveRegularVideos.svelte'
  import ObjectiveRegularExercises from './presentationalComponents/ObjectiveRegularExercises.svelte'
  import ObjectiveRegularExamExercises from './presentationalComponents/ObjectiveRegularExamExercises.svelte'
  import ObjectiveRegularDownloads from './presentationalComponents/ObjectiveRegularDownloads.svelte'
  import ObjectiveRegularUnits from './presentationalComponents/ObjectiveRegularUnits.svelte'

  export let objectiveReference: string

  let objective: Objective = deepCopy(emptyObjective)
  let isAllExercisesInCart = false
  let isExamExercisesInCart = false

  onMount(() => {
    objective = $objectives.find(objectif => objectif.reference === objectiveReference) || deepCopy(emptyObjective)
    updateExercisesInCart()
  })

  function updateExercisesInCart (): void {
    for (const exercise of objective.exercises) {
      exercise.isInCart = Cart.includes(exercise.id)
    }
    isAllExercisesInCart = objective.exercises.every(exercise => exercise.isInCart)
    for (const exercise of objective.examExercises) {
      exercise.isInCart = Cart.includes(exercise.id)
    }
    isExamExercisesInCart = objective.examExercises.every(exercise => exercise.isInCart)
  }

  function loadIep (): void {
    const url = `topmaths/data/instrumenpoche/${objective.lessonSummaryInstrumenpoche}.xml`
    fetch(url)
      .then(response => response.text())
      .then(xml => {
        const container = document.getElementById('divIEP')
        iepLoadPromise(container, xml).catch((error: Error) => {
          console.error(error)
        })
      })
      .catch(error => {
        console.error(error)
      })
  }
</script>

<svelte:head>
  <title>{objective.reference + ' : ' + getTitle(objective)}</title>
</svelte:head>

<div class="grade-container is-{objective.grade}
  rounded-4xl md:rounded-5xl">
  <h1 class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    {objective.reference + ' : ' + getTitle(objective)}
  </h1>
  {#if objective.lessonSummaryHTML || objective.lessonSummaryImage || objective.lessonSummaryInstrumenpoche}
    <ObjectiveRegularLessonSummary
      lessonSummaryHTML={objective.lessonSummaryHTML}
      lessonSummaryImage={objective.lessonSummaryImage}
      lessonSummaryImageAlt={objective.lessonSummaryImageAlt}
      lessonSummaryInstrumenpoche={objective.lessonSummaryInstrumenpoche}
      {mathaleaRenderDiv}
      {loadIep}
    />
  {/if}
  {#if objective.videos.length > 0}
    <ObjectiveRegularVideos
      videos={objective.videos}
    />
  {/if}
  {#if objective.exercises.length > 0}
    <ObjectiveRegularExercises
      reference={objective.reference}
      exercises={objective.exercises}
      videos={objective.videos}
      exercisesLink={objective.exercisesLink}
      {isAllExercisesInCart}
      objectiveTitle={getTitle(objective)}
    />
  {/if}
  {#if objective.examExercisesLink}
    <ObjectiveRegularExamExercises
      examExercises={objective.examExercises}
      examExercisesLink={objective.examExercisesLink}
      videos={objective.videos}
      {isExamExercisesInCart}
      objectiveReference={objective.reference}
    />
  {/if}
  {#if objective.downloadLinks.practiceSheetLink ||
    ($isTeacherMode && objective.downloadLinks.testSheetLink) ||
    ($isPersonalMode && !isEmptyArrayRecord(objective.downloadLinks.lessonPlanLinks))}
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
    <ObjectiveRegularUnits
      units={objective.units}
      {goToView}
    />
  {/if}
</div>
