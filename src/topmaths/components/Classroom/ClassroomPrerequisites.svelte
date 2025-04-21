<script lang="ts">
  import { onMount } from "svelte"
  import { objectives } from "../../services/store"
  import { appendPrerequisiteTree } from "../../services/prerequisite"
    import { isReferenceIgnored } from "../../services/reference";

  onMount(() => {
    renderTrees()
  })

  function renderTrees(): void {
    const container = document.getElementById(`trees-container`)
    if (!container) {
      throw new Error("Trees container not found")
    }
    container.innerHTML = ""
    $objectives
      .filter((objective) => {
        return !isReferenceIgnored(objective.reference)
      })
      .forEach((objective) => {
        appendPrerequisiteTree(container, objective)
      })
  }

</script>

<div>
  <a
    href="/topmaths/csv/prerequis.csv"
  >
    <button
      class="button border is-brown rounded-lg py-2 px-4"
    >
      Télécharger un récapitulatif
    </button>
  </a>
</div>
<div id="trees-container"></div>