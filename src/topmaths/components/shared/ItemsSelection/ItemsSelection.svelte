<script lang="ts">
  import { writable, derived, type Writable } from 'svelte/store'
  import { goToView } from '../../../services/navigation'
  import { isStringGrade, stringGradeValidKeys, type StringGrade } from '../../../types/grade'
  import type { View } from '../../../types/navigation'
  import GradeSelectionTabs from '../GradeSelectionTabs.svelte'
  import SearchInput from '../SearchInput.svelte'
  import TermSelectionButtons from '../TermSelectionButtons.svelte'
  import { onDestroy, onMount } from 'svelte'
  import { normalize } from '../../../services/shared'
  import { emptyItem, type Item } from './types'
  import Items from './Items.svelte'
  import { isTeacherMode, isTitleAcademicPreferred } from '../../../services/store'
  import InputCheckbox from '../InputCheckbox.svelte'

  export let view: View
  export let items: Writable<Item[]>

  const UNLISTED_THEMES = ['Extra']

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
  {#if view === 'objective' && $isTeacherMode}
  <span class="absolute">
    <InputCheckbox
      bind:isChecked={$isTitleAcademicPreferred}
    />
  </span>
  {/if}
  {#each stringGradeValidKeys as grade}
    {#if $filteredItems.filter(item => item.grade === grade).length > 0}
      <div class="is-{grade} grade-container my-8
          rounded-4xl md:rounded-5xl"
      >
        <h1 class="title p-2
          text-2xl md:text-4xl
          rounded-t-4xl md:rounded-t-5xl"
        >
          {grade === 'tout' ? 'Séquences particulières' : grade}
        </h1>
        {#if $filteredItems[0].theme === undefined} <!-- units -->
          <Items
            items={$filteredItems.filter(item => item.grade === grade)}
            view={view}
            {goToView}
          />
        {:else} <!-- objectives -->
          {#each [...new Set($filteredItems.filter(item => item.grade === grade).map(item => item.theme).filter(theme => !UNLISTED_THEMES.includes(theme ?? '')))] as theme}
            <h2 class="title p-2
              text-xl md:text-3xl"
            >
              {theme}
            </h2>
            {#each [...new Set($filteredItems.filter(item => item.grade === grade).filter(item => item.theme === theme).map(item => item.subTheme))] as subTheme}
              <h3 class="subtitle p-2
                text-l md:text-2xl"
              >
                {subTheme}
              </h3>
                <Items
                  items={$filteredItems.filter(item => item.grade === grade).filter(item => item.theme === theme).filter(item => item.subTheme === subTheme)}
                  view={view}
                  {goToView}
                  isTitleAcademicPreferred={$isTitleAcademicPreferred}
                />
            {/each}
          {/each}
        {/if}
      </div>
    {/if}
  {/each}
</div>
