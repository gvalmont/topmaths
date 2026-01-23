<script lang="ts">
  import {
    curriculum,
    exerciseLinks,
    objectives,
    units,
    view,
  } from '../../services/store'
  import { TOPMATHS_BASE_URL, isTopmaths } from '../../services/environment'
  import GradeSelectionTabs from '../shared/GradeSelectionTabs.svelte'
  import {
    getCurrentTerm,
    getWeekIndexInCurrentTerm,
  } from '../../services/calendar'
  import { DEFAULT_GRADE, type StringGrade } from '../../types/grade'
  import ButtonImage from '../shared/ButtonImage.svelte'
  import { showDialogForLimitedTime } from '../../../lib/components/dialogs'
  import { shuffle } from '../../../lib/outils/arrayOutils'

  const currentTerm = getCurrentTerm()
  const weekIndexInCurrentTerm = getWeekIndexInCurrentTerm()
  let selectedGrade = DEFAULT_GRADE

  function launchRegularExercises(): void {
    const regularExercisesLinks = getRegularExercisesLinks()
    if (regularExercisesLinks.length === 0) {
      showDialogForLimitedTime(
        'topmaths-info-dialog',
        2000,
        "Tu n'as pas encore d'exercice à réviser, reviens plus tard !",
      )
    } else {
      launch(shuffle(regularExercisesLinks))
    }
  }

  function launchExamExercises(): void {
    const examExercisesLinks = getExamExercisesLinks()
    if (examExercisesLinks.length === 0) {
      showDialogForLimitedTime(
        'topmaths-info-dialog',
        2000,
        "Tu n'as pas encore d'exercice de brevet à réviser, reviens plus tard !",
      )
    } else {
      launch(shuffle(examExercisesLinks))
    }
  }

  function launch(links: string[]): void {
    exerciseLinks.set(links)
    view.set('exercise')
  }

  function getRegularExercisesLinks(): string[] {
    const regularExercisesReferences: string[] = $units
      .filter(
        (unit) =>
          unit.grade === selectedGrade || selectedGrade === DEFAULT_GRADE,
      )
      .filter((unit) => unit.number <= getLastUnitLearnedNumber(unit.grade))
      .map((unit) => unit.objectives.map((objective) => objective.reference))
      .flat()

    const regularExercisesLinks: string[] = regularExercisesReferences
      .map((reference) => {
        const objective = $objectives.find(
          (objectif) => objectif.reference === reference,
        )
        if (!objective) {
          console.error('Objective', reference, 'not found')
          return ['']
        }
        return objective.exercises
          .map((exercise) => exercise.link)
          .filter(isTopmaths)
      })
      .flat()
      .filter((link) => link !== '')
    return regularExercisesLinks
  }

  function getExamExercisesLinks(): string[] {
    const listeDesReferences: string[] = $units
      .filter(
        (unit) =>
          unit.grade === selectedGrade || selectedGrade === DEFAULT_GRADE,
      )
      .filter((unit) => unit.number <= getLastUnitLearnedNumber(unit.grade))
      .filter((unit) => unit.assessmentExamLink !== '')
      .map((unit) => {
        const entries = new URL(unit.assessmentExamLink).searchParams.entries()
        const references = []
        for (const entry of entries) {
          if (entry[0] === 'uuid') {
            references.push(
              TOPMATHS_BASE_URL + 'uuid=' + entry[1] + '&v=exercise',
            )
          }
        }
        return references
      })
      .flat()
    return listeDesReferences
  }

  function getLastUnitLearnedNumber(grade: StringGrade): number {
    const termStartUnitNumber =
      $curriculum[grade].cumulateUnitsPerTerm[currentTerm.termIndex - 1] ?? 0
    const currentWeekGuessUnitNumber =
      termStartUnitNumber + weekIndexInCurrentTerm - 1
    const termEndUnitNumber =
      $curriculum[grade].cumulateUnitsPerTerm[currentTerm.termIndex]
    if (currentTerm.type === 'break') {
      return termEndUnitNumber - 1
    } else {
      return Math.min(currentWeekGuessUnitNumber, termEndUnitNumber - 1)
    }
  }
</script>

<svelte:head>
  <title>Révisions - topmaths</title>
</svelte:head>

<div
  class="grade-container is-sponsor w-full max-w-screen-lg
  rounded-4xl md:rounded-5xl"
>
  <h1
    class="title
    text-2xl md:text-4xl
    rounded-t-4xl md:rounded-t-5xl"
  >
    Révisions
  </h1>
  <div class="flex flex-col justify-center p-6">
    <GradeSelectionTabs
      activeLevelTab={selectedGrade}
      onClick={(clickedLevel) => {
        selectedGrade = clickedLevel
      }}
    />
    <ButtonImage
      color="link"
      class="mx-auto p-5 my-2 border
      rounded md:rounded-lg
      px-3 md:px-4
      py-2 md:py-3"
      on:click={() => launchRegularExercises()}
    >
      Réviser les exercices
    </ButtonImage>
    <ButtonImage
      color="3e"
      class="mx-auto p-5 mb-4 mt-8 border
      rounded md:rounded-lg
      px-3 md:px-4
      py-2 md:py-3"
      on:click={() => launchExamExercises()}
    >
      Réviser les exercices de brevet (3e)
    </ButtonImage>
  </div>
</div>
