<script lang="ts">
  import { goToView } from '../../../../services/navigation'
  import { buildGradeFromObjectiveReference } from '../../../../services/reference'
  import type { GlossaryUniteItem } from '../../../../types/glossary'
  import SvgIcon from '../../../shared/SvgIcon.svelte'

  export let item: GlossaryUniteItem
  export let goHash: (event: MouseEvent, hash: string) => void
</script>

<ul
  class="flex flex-row flex-wrap justify-center m-3
  text-base md:text-xl"
>
  <li>
    <a href="#top" on:click={(event) => goHash(event, 'top')}>
      <button
        class="button is-link rounded border mt-2 py-1
        px-1 md:px-2"
      >
        ⇧
      </button>
    </a>
  </li>
  {#each item.relatedItems as notionLiee}
    <li>
      <a
        href="#{notionLiee.reference}"
        on:click={(event) => goHash(event, notionLiee.reference)}
      >
        <button
          class="button is-link rounded border mt-2 py-1
        ml-1 md:ml-2
        px-1 md:px-2"
        >
          {notionLiee.title}
        </button>
      </a>
    </li>
  {/each}
  {#each item.relatedObjectives as relatedObjective}
    <li>
      <a
        href="/?v=objective&ref={relatedObjective}"
        on:click={(event) => goToView(event, 'objective', relatedObjective)}
      >
        <button
          class="button flex flew-row is-{buildGradeFromObjectiveReference(
            relatedObjective,
          )} rounded border mt-2 pr-2 py-1
        ml-1 md:ml-2
        px-1 md:px-2"
        >
          {relatedObjective}&nbsp;
          <SvgIcon
            class="size-5"
            src="topmaths/img/cc0/exit-svgrepo-com.svg"
            alt="icône de sortie"
          />
        </button>
      </a>
    </li>
  {/each}
</ul>
