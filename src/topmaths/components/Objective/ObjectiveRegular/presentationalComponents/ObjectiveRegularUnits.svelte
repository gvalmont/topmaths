<script lang="ts">
  import type { Reference, View } from '../../../../types/navigation'
  import type { ObjectiveUnit } from '../../../../types/objective'

  export let units: ObjectiveUnit[]
  export let goToView: (
    event: MouseEvent,
    view: View,
    reference: Reference,
  ) => void
</script>

<h2
  class="subtitle
  text-xl md:text-3xl"
>
  Séquence{units.length > 1 ? 's' : ''}
</h2>
<p class="pt-8">Cet objectif fait partie de :</p>
<ul class="pt-2 pb-6">
  {#each units as unit}
    <li class="p-2 is-{unit.grade}">
      <a
        class="is-interactive"
        href="/?v=unit&ref={unit.reference}"
        on:click={(event) => goToView(event, 'unit', unit.reference)}
      >
        {'Séquence ' + unit.reference.slice(3) + ' : ' + unit.title}
      </a>
    </li>
  {/each}
</ul>
