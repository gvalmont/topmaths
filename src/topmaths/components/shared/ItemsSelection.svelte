<script lang="ts">
  import { writable, derived, type Writable } from 'svelte/store'
  import { goToView } from '../../services/navigation'
  import { isStringGrade, stringGradeValidKeys, type StringGrade } from '../../types/grade'
  import type { Reference, View } from '../../types/navigation'
  import GradeSelectionTabs from './GradeSelectionTabs.svelte'
  import SearchInput from './SearchInput.svelte'
  import TermSelectionButtons from './TermSelectionButtons.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { normalize } from '../../services/shared'

  type Item = { grade: StringGrade, term: number, reference: Reference, title: string, number?: number }

  export let view: View
  export let items: Writable<Item[]>

  const emptyItem: Item = { grade: 'tout', term: 0, reference: '', title: '' }

  const filter = writable<Item>(emptyItem)
  const searchString = writable<string>('')
  const filteredItems = derived(
    [searchString, filter, items],
    ([$searchString, $filter, $items]) =>
      buildFilteredItems($searchString, $filter, $items)
  )

  onMount(() => {
    updateParamsFromUrl()
    addEventListener('popstate', updateParamsFromUrl)
  })

  onDestroy(() => {
    removeEventListener('popstate', updateParamsFromUrl)
  })

  function updateParamsFromUrl (): void {
    const url = new URL(window.location.href)
    const entries = url.searchParams.entries()
    let newGrade: StringGrade = 'tout'
    let newTerm: number = 0
    for (const entry of entries) {
      if (entry[0] === 'grade') newGrade = isStringGrade(entry[1]) ? entry[1] : 'tout'
      if (entry[0] === 'term') newTerm = Number(entry[1])
    }
    $filter.grade = newGrade
    $filter.term = newTerm
  }

  function buildFilteredItems (searchString: string, filter: Item, items: Item[]): Item[] {
    return items
      .filter((item) => {
        if (searchString === '') return true
        const words = normalize(searchString).split(' ')
        return words.some((word) => isWordFound(word, item))
      })
      .filter((item) => {
        return filter.grade === 'tout' || item.grade === filter.grade
      })
      .filter((item) => {
        return filter.term === 0 || item.term === filter.term
      })
  }

  function isWordFound (mot: string, item: Item): boolean {
    return normalize(item.grade).includes(mot) ||
    (item.number !== undefined && normalize(item.number.toString()).includes(mot)) ||
    normalize(item.reference).includes(mot) ||
    normalize(item.title).includes(mot)
  }

  function updateFilter (grade: StringGrade, term?: number): void {
    $filter.grade = grade
    if (term !== undefined) {
      $filter.term = term
    }
    window.history.pushState({}, '', `?v=${view}&grade=${$filter.grade}&term=${$filter.term}`)
  }

</script>

<div class="w-screen max-w-screen-lg">
  <GradeSelectionTabs
    activeLevelTab={$filter.grade}
    onClick={updateFilter}
  />
  <TermSelectionButtons
    selectedTerm={$filter.term}
    on:change={(e) => {
      const term = e.detail
      updateFilter($filter.grade, term)
    }}
  />
  <SearchInput
    bind:searchString={$searchString}
  />
  {#each stringGradeValidKeys as grade}
    {#if $filteredItems.filter(item => item.grade === grade).length > 0}
      <div class="is-{grade} grade-container my-8
          rounded-4xl md:rounded-5xl"
      >
        <h1 class="title font-semibold p-2
          text-2xl md:text-4xl
          rounded-t-4xl md:rounded-t-5xl"
        >
          {grade === 'tout' ? 'Séquences particulières' : grade}
        </h1>
        {#each $filteredItems.filter(item => item.grade === grade) as item}
          <a
            href="/?v={view}&ref={item.reference}"
            on:click={(event) => goToView(event, view, item.reference)}
          >
            <div class="p-1">
              {#if item.number !== undefined && item.number > 0}
                Séquence {item.number} : {item.title}
              {:else}
                {item.title}
              {/if}
            </div>
          </a>
        {/each}
      </div>
    {/if}
  {/each}
</div>
