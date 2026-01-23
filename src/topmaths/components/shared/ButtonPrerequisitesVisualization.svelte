<script lang="ts">
  import BasicClassicModal from '../../../components/shared/modal/BasicClassicModal.svelte'
  import { appendPrerequisiteTree } from '../../services/prerequisite'
  import { objectives } from '../../services/store'
  import type { StringGrade } from '../../types/grade'
  import type { ObjectiveReference } from '../../types/objective'
  import TooltipIcon from '../shared/TooltipIcon.svelte'

  export let objectiveReference: ObjectiveReference
  export let gradeTeached: StringGrade
  export let text: string = ''

  let isPrerequisiteModalDisplayed = false

  function displayPrerequisitesModal(
    objectiveReference: ObjectiveReference,
  ): void {
    const container = document.getElementById(
      `prerequisites-container-${gradeTeached}-${objectiveReference}`,
    )
    if (!container) {
      throw new Error('Prerequisites container not found')
    }
    container.innerHTML = ''
    const objective = $objectives.find(
      (objective) => objective.reference === objectiveReference,
    )
    if (!objective) {
      throw new Error(
        `Objective with reference ${objectiveReference} not found`,
      )
    }
    isPrerequisiteModalDisplayed = true
    setTimeout(() => {
      appendPrerequisiteTree(container, objective)
    }, 0)
  }
</script>

<button
  class="ml-2 is-interactive flex items-center"
  on:click={() => displayPrerequisitesModal(objectiveReference)}
>
  {text}
  <TooltipIcon
    dropdownText="Visualiser les prérequis"
    imgSrc="/topmaths/img/gvalmont/two-sided-tree.svg"
    imgAlt="arbre à deux côtés"
  />
</button>

<BasicClassicModal bind:isDisplayed={isPrerequisiteModalDisplayed}>
  <div slot="content">
    <div id="prerequisites-container-{gradeTeached}-{objectiveReference}"></div>
  </div>
</BasicClassicModal>
