<script lang="ts">
  import { onMount } from "svelte"
  import { objectives } from "../../services/store"
  import { appendPrerequisiteTree } from "../../services/prerequisite"

  onMount(() => {
    renderTrees()
  })

  function renderTrees(): void {
    const container = document.getElementById(`trees-container`)
    if (!container) {
      throw new Error("Trees container not found")
    }
    container.innerHTML = ""

    $objectives.forEach((objective) => {
      appendPrerequisiteTree(container, objective)
    })
  }

</script>

<div id="trees-container"></div>